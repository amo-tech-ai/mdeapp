import { createClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { embedQueryText, vectorLiteral } from "./query-embedding";
import type { RankExplanationEntry } from "./search-logs";
import {
  type Restaurant,
  type RestaurantQuery,
  type RestaurantSource,
  mapCuisineFromTypes,
  priceLevelToTier,
  estimateAvgPriceFromLevel,
} from "../tools/search-restaurants";
import { extractNeighborhood } from "../tools/search-events";

export type IntelligenceSlots = {
  neighborhood?: string;
  wantsRooftop?: boolean;
  wantsQuiet?: boolean;
  wantsNomad?: boolean;
  wantsSalsa?: boolean;
  wantsBrunch?: boolean;
  wantsCocktails?: boolean;
  wantsHiddenGem?: boolean;
};

export type RestaurantEvidence = {
  sourceType: string;
  sourceUrl: string | null;
  extractedText: string | null;
};

export type IntelligenceRestaurantResult = Restaurant & {
  rankScore?: number;
  evidence?: RestaurantEvidence[];
  signalSource?: string;
};

type HybridRow = {
  id: string;
  name: string;
  description: string | null;
  cuisine_types: string[] | null;
  address: string | null;
  city: string | null;
  price_level: number | null;
  rating: number | string | null;
  primary_image_url: string | null;
  dietary_options: string[] | null;
  ambiance: string[] | null;
  similarity: number | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
};

type SignalRow = {
  restaurant_id: string;
  quiet_score: number | null;
  rooftop_score: number | null;
  digital_nomad_score: number | null;
  wifi_score: number | null;
  cocktail_score: number | null;
  brunch_score: number | null;
  hidden_gem_score: number | null;
  nightlife_score: number | null;
  local_authenticity_score: number | null;
  confidence: number | null;
  source: string | null;
  evidence: Record<string, unknown> | null;
};

function getAnonClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function num(v: number | string | null | undefined): number | undefined {
  if (v === null || v === undefined) return undefined;
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : undefined;
}

export function parseIntelligenceSlots(queryText: string): IntelligenceSlots {
  const q = queryText.toLowerCase();
  const slots: IntelligenceSlots = {};
  if (/provenza/.test(q)) slots.neighborhood = "Provenza";
  else if (/poblado/.test(q)) slots.neighborhood = "El Poblado";
  else if (/laureles/.test(q)) slots.neighborhood = "Laureles";
  else if (/envigado/.test(q)) slots.neighborhood = "Envigado";
  else if (/manila/.test(q)) slots.neighborhood = "Manila";
  if (/rooftop/.test(q)) slots.wantsRooftop = true;
  if (/quiet/.test(q)) slots.wantsQuiet = true;
  if (/cowork|nomad|wifi|work from/.test(q)) slots.wantsNomad = true;
  if (/salsa/.test(q)) slots.wantsSalsa = true;
  if (/brunch/.test(q)) slots.wantsBrunch = true;
  if (/cocktail|romantic/.test(q)) slots.wantsCocktails = true;
  if (/hidden|local|locals/.test(q)) slots.wantsHiddenGem = true;
  return slots;
}

function signalBoost(slots: IntelligenceSlots, s: SignalRow): number {
  if ((s.confidence ?? 0) < 0.6) return 0;
  let boost = 0;
  if (slots.wantsRooftop) boost += (s.rooftop_score ?? 0) * 0.35;
  if (slots.wantsQuiet) boost += (s.quiet_score ?? 0) * 0.25;
  if (slots.wantsNomad) boost += ((s.digital_nomad_score ?? 0) + (s.wifi_score ?? 0)) * 0.15;
  if (slots.wantsBrunch) boost += (s.brunch_score ?? 0) * 0.2;
  if (slots.wantsCocktails) boost += (s.cocktail_score ?? 0) * 0.25;
  if (slots.wantsHiddenGem) boost += (s.hidden_gem_score ?? 0) * 0.3;
  if (slots.wantsSalsa) boost += (s.nightlife_score ?? 0) * 0.2 + (s.local_authenticity_score ?? 0) * 0.15;
  return boost;
}

function hybridToRestaurant(
  row: HybridRow,
  neighborhoodCol: string | null,
  rankScore?: number,
  signalSource?: string,
  evidence?: RestaurantEvidence[],
): IntelligenceRestaurantResult {
  const pl = row.price_level ?? 2;
  const rating = num(row.rating) ?? 0;
  const lat = num(row.latitude);
  const lng = num(row.longitude);
  return {
    id: row.id,
    name: row.name,
    cuisine: mapCuisineFromTypes(row.cuisine_types),
    neighborhood:
      neighborhoodCol ??
      extractNeighborhood(row.address, row.city),
    priceTier: priceLevelToTier(pl),
    avgPricePerPerson: estimateAvgPriceFromLevel(pl),
    currency: "USD",
    rating,
    vibe: row.ambiance?.length ? row.ambiance : row.cuisine_types ?? [],
    imageUrl: row.primary_image_url ?? "",
    sourceUrl: `https://mdeai.co/restaurants/${row.id}`,
    latitude: lat,
    longitude: lng,
    rankScore,
    signalSource,
    evidence,
  };
}

export async function searchRestaurantsIntelligent(
  query: RestaurantQuery & { queryText?: string },
): Promise<{
  results: IntelligenceRestaurantResult[];
  total: number;
  source: RestaurantSource;
  hybridUsed: boolean;
  rankExplanation: RankExplanationEntry[];
  slots: IntelligenceSlots;
}> {
  const limit = query.limit ?? 5;
  const queryText = query.queryText?.trim() ?? "";
  const slots = queryText ? parseIntelligenceSlots(queryText) : {};
  const neighborhood = query.neighborhood ?? slots.neighborhood;
  const rankExplanation: RankExplanationEntry[] = [];
  const client = getAnonClient();
  const service = createServiceRoleClient();

  if (!client) {
    return { results: [], total: 0, source: "fallback", hybridUsed: false, rankExplanation, slots };
  }

  let hybridRows: HybridRow[] = [];
  let hybridUsed = false;

  if (queryText) {
    const embedding = await embedQueryText(queryText);
    if (embedding) {
      const { data, error } = await client.rpc("hybrid_search_restaurants", {
        query_text: queryText,
        query_embedding: vectorLiteral(embedding),
        match_count: Math.max(limit * 4, 20),
      });
      if (!error && data?.length) {
        hybridRows = data as HybridRow[];
        hybridUsed = true;
        rankExplanation.push({
          factor: "hybrid_semantic",
          score: hybridRows[0]?.similarity ?? 0,
          note: "hybrid_search_restaurants RPC",
        });
      } else if (error) {
        console.warn("[intelligence-restaurant-search] hybrid RPC:", error.message);
      }
    }
  }

  if (!hybridUsed) {
    let q = client
      .from("restaurants")
      .select(
        "id, name, description, cuisine_types, price_level, address, city, neighborhood, latitude, longitude, primary_image_url, rating, tags, ambiance, google_place_id, maps_url, ai_summary",
      )
      .eq("is_active", true)
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(48);
    if (neighborhood) {
      q = q.or(`neighborhood.ilike.%${neighborhood}%,address.ilike.%${neighborhood}%`);
    }
    const { data } = await q;
    hybridRows = (data ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      cuisine_types: r.cuisine_types,
      address: r.address,
      city: r.city,
      price_level: r.price_level,
      rating: r.rating,
      primary_image_url: r.primary_image_url,
      dietary_options: null,
      ambiance: r.ambiance,
      similarity: 0,
      latitude: r.latitude,
      longitude: r.longitude,
    }));
  }

  const ids = hybridRows.map((r) => r.id);
  const signalMap = new Map<string, SignalRow>();
  if (ids.length) {
    const { data: signals } = await client
      .from("venue_signals")
      .select(
        "restaurant_id, quiet_score, rooftop_score, digital_nomad_score, wifi_score, cocktail_score, brunch_score, hidden_gem_score, nightlife_score, local_authenticity_score, confidence, source, evidence",
      )
      .in("restaurant_id", ids);
    for (const s of (signals ?? []) as SignalRow[]) {
      signalMap.set(s.restaurant_id, s);
    }
  }

  const evidenceMap = new Map<string, RestaurantEvidence[]>();
  if (service && ids.length) {
    const { data: evRows } = await service
      .from("venue_source_evidence")
      .select("restaurant_id, source_type, source_url, extracted_text")
      .in("restaurant_id", ids);
    for (const ev of (evRows ?? []) as Array<{
      restaurant_id: string;
      source_type: string;
      source_url: string | null;
      extracted_text: string | null;
    }>) {
      const list = evidenceMap.get(ev.restaurant_id) ?? [];
      list.push({
        sourceType: ev.source_type,
        sourceUrl: ev.source_url,
        extractedText: ev.extracted_text,
      });
      evidenceMap.set(ev.restaurant_id, list);
    }
  }

  const neighborhoodRows = await client
    .from("restaurants")
    .select("id, neighborhood, latitude, longitude")
    .in("id", ids);
  const hoodMap = new Map(
    (neighborhoodRows.data ?? []).map(
      (r: { id: string; neighborhood: string | null; latitude: number | null; longitude: number | null }) => [
        r.id,
        r,
      ],
    ),
  );

  const scored = hybridRows.map((row, idx) => {
    const sig = signalMap.get(row.id);
    const semantic = row.similarity ?? Math.max(0, 1 - idx * 0.02);
    const boost = sig ? signalBoost(slots, sig) : 0;
    const hoodRow = hoodMap.get(row.id);
    const hood = hoodRow?.neighborhood ?? null;
    if (hoodRow?.latitude != null && row.latitude == null) {
      row.latitude = hoodRow.latitude;
    }
    if (hoodRow?.longitude != null && row.longitude == null) {
      row.longitude = hoodRow.longitude;
    }
    const hoodMatch =
      neighborhood && hood
        ? hood.toLowerCase().includes(neighborhood.toLowerCase())
          ? 1
          : 0
        : 0.5;
    const rankScore = semantic * 0.45 + boost * 0.35 + hoodMatch * 0.2;
    return { row, rankScore, sig, hood };
  });

  if (neighborhood) {
    const filtered = scored.filter(({ hood, row }) => {
      const n = hood ?? extractNeighborhood(row.address, row.city);
      return n.toLowerCase().includes(neighborhood.toLowerCase());
    });
    if (filtered.length) scored.splice(0, scored.length, ...filtered);
    rankExplanation.push({
      factor: "neighborhood",
      score: 1,
      note: `${neighborhood} filter`,
    });
  }

  scored.sort((a, b) => b.rankScore - a.rankScore);

  const topSig = scored[0]?.sig;
  if (topSig?.rooftop_score && slots.wantsRooftop) {
    rankExplanation.push({
      factor: "rooftop_score",
      score: topSig.rooftop_score,
      note: "venue_signals join",
    });
  }

  const results = scored.slice(0, limit).map(({ row, rankScore, sig, hood }) =>
    hybridToRestaurant(
      row,
      hood,
      rankScore,
      sig?.source ?? undefined,
      evidenceMap.get(row.id),
    ),
  );

  return {
    results,
    total: scored.length,
    source: "supabase",
    hybridUsed,
    rankExplanation,
    slots,
  };
}
