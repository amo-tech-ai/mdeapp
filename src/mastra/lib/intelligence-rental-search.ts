import { createClient } from "@supabase/supabase-js";
import {
  embedQueryTextDetailed,
  vectorLiteral,
  type EmbedFailureReason,
} from "./query-embedding";
import type { EmbedStatus, RankExplanationEntry } from "./search-logs";
import {
  type Rental,
  type RentalQuery,
  rowToRental,
  sortForMonthlyStay,
} from "../tools/search-rentals";

export type RentalIntelligenceSlots = {
  neighborhood?: string;
  wantsNomad?: boolean;
  wantsQuiet?: boolean;
  wantsGym?: boolean;
  wantsCafe?: boolean;
  wantsMonthly?: boolean;
};

type HybridListingRow = {
  id: string;
  title: string;
  description: string | null;
  neighborhood: string | null;
  city: string | null;
  price_monthly: number | string | null;
  bedrooms: number | null;
  bathrooms: number | string | null;
  rating: number | string | null;
  images: string[] | null;
  amenities: string[] | null;
  pet_friendly: boolean | null;
  furnished: boolean | null;
  status: string | null;
  similarity: number | null;
};

type RentalSignalRow = {
  apartment_id: string;
  digital_nomad_score: number | null;
  walkability: number | null;
  nightlife_access: number | null;
  quiet_score: number | null;
  workspace_score: number | null;
  value_score: number | null;
  confidence: number | null;
  source: string | null;
};

type NeighborhoodProfileRow = {
  neighborhood_id: string;
  digital_nomad_friendliness: number | null;
  gym_coworking_proximity: number | null;
  noise_level: number | null;
  summary: string | null;
};

export type IntelligenceRentalResult = Rental & {
  rankScore?: number;
  signalSource?: string;
  evidenceText?: string | null;
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

export function parseRentalIntelligenceSlots(queryText: string): RentalIntelligenceSlots {
  const q = queryText.toLowerCase();
  const slots: RentalIntelligenceSlots = {};
  if (/laureles/.test(q)) slots.neighborhood = "Laureles";
  else if (/poblado|provenza/.test(q)) slots.neighborhood = "El Poblado";
  else if (/envigado/.test(q)) slots.neighborhood = "Envigado";
  if (/nomad|remote work|cowork|wifi|workspace/.test(q)) slots.wantsNomad = true;
  if (/quiet/.test(q)) slots.wantsQuiet = true;
  if (/gym/.test(q)) slots.wantsGym = true;
  if (/caf[eé]|coffee/.test(q)) slots.wantsCafe = true;
  if (/month|monthly/.test(q)) slots.wantsMonthly = true;
  return slots;
}

function rentalSignalBoost(slots: RentalIntelligenceSlots, s: RentalSignalRow): number {
  if ((s.confidence ?? 0) < 0.6) return 0;
  let boost = 0;
  if (slots.wantsNomad) boost += (s.digital_nomad_score ?? 0) * 0.35 + (s.workspace_score ?? 0) * 0.15;
  if (slots.wantsQuiet) boost += (s.quiet_score ?? 0) * 0.25;
  if (slots.wantsGym || slots.wantsCafe) boost += (s.walkability ?? 0) * 0.15;
  return boost;
}

export async function searchRentalsIntelligent(
  query: RentalQuery & { queryText?: string },
): Promise<{
  results: IntelligenceRentalResult[];
  total: number;
  source: "supabase" | "mock";
  hybridUsed: boolean;
  embedStatus: EmbedStatus;
  embedFailureReason?: EmbedFailureReason;
  embedHttpStatus?: number;
  rankExplanation: RankExplanationEntry[];
  slots: RentalIntelligenceSlots;
}> {
  const limit = query.limit ?? 8;
  const queryText = query.queryText?.trim() ?? "";
  const slots = queryText ? parseRentalIntelligenceSlots(queryText) : {};
  const neighborhood = query.neighborhood ?? slots.neighborhood;
  const rankExplanation: RankExplanationEntry[] = [];
  const client = getAnonClient();

  if (!client) {
    return {
      results: [],
      total: 0,
      source: "mock",
      hybridUsed: false,
      embedStatus: "skipped",
      rankExplanation,
      slots,
    };
  }

  let hybridRows: HybridListingRow[] = [];
  let hybridUsed = false;
  let embedStatus: EmbedStatus = queryText ? "failed" : "skipped";
  let embedFailureReason: EmbedFailureReason | undefined;
  let embedHttpStatus: number | undefined;

  if (queryText) {
    const embedResult = await embedQueryTextDetailed(queryText);
    if (embedResult.ok) {
      embedStatus = "ok";
      const { data, error } = await client.rpc("hybrid_search_listings", {
        query_text: queryText,
        query_embedding: vectorLiteral(embedResult.values),
        match_count: Math.max(limit * 4, 20),
      });
      if (!error && data?.length) {
        hybridRows = data as HybridListingRow[];
        hybridUsed = true;
        rankExplanation.push({
          factor: "hybrid_semantic",
          score: hybridRows[0]?.similarity ?? 0,
          note: "hybrid_search_listings RPC",
        });
      } else if (error) {
        // Embed succeeded — failure is Supabase RPC, not embed API.
        console.warn("[intelligence-rental-search] hybrid RPC:", error.message);
        rankExplanation.push({
          factor: "hybrid_rpc_error",
          score: 0,
          note: "hybrid_search_listings unavailable",
        });
      }
    } else {
      embedStatus = "failed";
      embedFailureReason = embedResult.reason;
      embedHttpStatus = embedResult.status;
      rankExplanation.push({
        factor: "embed_failed",
        score: 0,
        note: embedResult.status
          ? `${embedResult.reason}:${embedResult.status}`
          : embedResult.reason,
      });
      console.warn(
        `[intelligence-rental-search] semantic embed failed (${embedResult.reason}${embedResult.status ? ` HTTP ${embedResult.status}` : ""}) — keyword fallback`,
      );
    }
  }

  if (!hybridUsed) {
    let q = client
      .from("apartments")
      .select(
        "id, title, neighborhood, bedrooms, price_daily, wifi_speed, amenities, images, host_name, source_url, available_from, available_to, pet_friendly, parking_included, minimum_stay_days, slug, latitude, longitude",
      )
      .eq("status", "active")
      .not("price_daily", "is", null)
      .order("price_daily", { ascending: true })
      .limit(48);
    if (neighborhood) q = q.ilike("neighborhood", `%${neighborhood}%`);
    if (typeof query.minBedrooms === "number") q = q.gte("bedrooms", query.minBedrooms);
    if (typeof query.maxPricePerNight === "number") {
      q = q.lte("price_daily", query.maxPricePerNight);
    }
    if (query.checkIn) q = q.or(`available_to.is.null,available_to.gte.${query.checkIn}`);
    if (query.checkOut) q = q.or(`available_from.is.null,available_from.lte.${query.checkOut}`);
    const { data } = await q;
    const apartments = data ?? [];
    hybridRows = apartments.map((r: Record<string, unknown>) => ({
      id: String(r.id),
      title: String(r.title),
      description: null,
      neighborhood: r.neighborhood as string | null,
      city: null,
      price_monthly: null,
      bedrooms: r.bedrooms as number | null,
      bathrooms: null,
      rating: null,
      images: r.images as string[] | null,
      amenities: r.amenities as string[] | null,
      pet_friendly: null,
      furnished: null,
      status: "active",
      similarity: 0,
    }));
  }

  const ids = hybridRows.map((r) => r.id);
  const aptMap = new Map<string, Record<string, unknown>>();

  if (ids.length) {
    let aptQ = client
      .from("apartments")
      .select(
        "id, title, neighborhood, bedrooms, price_daily, wifi_speed, amenities, images, host_name, source_url, available_from, available_to, pet_friendly, parking_included, minimum_stay_days, slug, latitude, longitude",
      )
      .in("id", ids);
    if (query.checkIn) aptQ = aptQ.or(`available_to.is.null,available_to.gte.${query.checkIn}`);
    if (query.checkOut) aptQ = aptQ.or(`available_from.is.null,available_from.lte.${query.checkOut}`);
    const { data: aptRows } = await aptQ;
    for (const row of aptRows ?? []) {
      aptMap.set(row.id as string, row as Record<string, unknown>);
    }
    // Remove hybridRows that didn't survive the availability filter
    if (query.checkIn || query.checkOut) {
      const availableIds = new Set(aptMap.keys());
      hybridRows = hybridRows.filter((r) => availableIds.has(r.id));
    }
  }

  const signalMap = new Map<string, RentalSignalRow>();
  if (ids.length) {
    const { data: signals } = await client
      .from("rental_signals")
      .select(
        "apartment_id, digital_nomad_score, walkability, nightlife_access, quiet_score, workspace_score, value_score, confidence, source, evidence",
      )
      .in("apartment_id", ids);
    for (const s of (signals ?? []) as RentalSignalRow[]) {
      signalMap.set(s.apartment_id, s);
    }
  }

  let profileBoost = 0;
  if (neighborhood) {
    const { data: hoodRow } = await client
      .from("neighborhoods")
      .select("id, name")
      .ilike("name", `%${neighborhood.split(" ")[0]}%`)
      .limit(1)
      .maybeSingle();
    if (hoodRow?.id) {
      const { data: profile } = await client
        .from("neighborhood_profiles")
        .select(
          "neighborhood_id, digital_nomad_friendliness, gym_coworking_proximity, noise_level, summary",
        )
        .eq("neighborhood_id", hoodRow.id)
        .maybeSingle();
      if (profile) {
        const p = profile as NeighborhoodProfileRow;
        if (slots.wantsNomad) profileBoost += num(p.digital_nomad_friendliness) ?? 0;
        if (slots.wantsGym || slots.wantsCafe) {
          profileBoost += (num(p.gym_coworking_proximity) ?? 0) * 0.5;
        }
        rankExplanation.push({
          factor: "neighborhood_profile",
          score: profileBoost,
          note: hoodRow.name as string,
        });
      }
    }
    rankExplanation.push({
      factor: "neighborhood",
      score: 1,
      note: `${neighborhood} filter`,
    });
  }

  const scored = hybridRows.map((row, idx) => {
    const sig = signalMap.get(row.id);
    const semantic = row.similarity ?? Math.max(0, 1 - idx * 0.02);
    const boost = sig ? rentalSignalBoost(slots, sig) : 0;
    const hood = row.neighborhood ?? neighborhood ?? "";
    const hoodMatch =
      neighborhood && hood
        ? hood.toLowerCase().includes(neighborhood.toLowerCase())
          ? 1
          : 0
        : 0.5;
    const rankScore = semantic * 0.4 + boost * 0.35 + hoodMatch * 0.15 + profileBoost * 0.01;
    return { row, rankScore, sig, hood };
  });

  if (neighborhood) {
    const filtered = scored.filter(({ hood, row }) => {
      const n = hood || row.neighborhood || "";
      return n.toLowerCase().includes(neighborhood.toLowerCase());
    });
    if (filtered.length) scored.splice(0, scored.length, ...filtered);
  }

  scored.sort((a, b) => b.rankScore - a.rankScore);

  const topSig = scored[0]?.sig;
  if (topSig?.digital_nomad_score && slots.wantsNomad) {
    rankExplanation.push({
      factor: "digital_nomad_score",
      score: topSig.digital_nomad_score,
      note: "rental_signals join",
    });
  }

  let results: IntelligenceRentalResult[] = scored.slice(0, limit).map(({ row, rankScore, sig }) => {
    const apt = aptMap.get(row.id);
    if (apt) {
      const rental = rowToRental(apt as unknown as import("../tools/search-rentals").ApartmentRow);
      return {
        ...rental,
        rankScore,
        signalSource: sig?.source ?? undefined,
        evidenceText: sig?.source ? `Signal source: ${sig.source}` : null,
      };
    }
    const monthlyNum = num(row.price_monthly);
    return {
      id: row.id,
      title: row.title,
      neighborhood: row.neighborhood ?? neighborhood ?? "Medellín",
      nightly_price: monthlyNum ? Math.round(monthlyNum / 30) : 0,
      currency: "USD" as const,
      bedrooms: row.bedrooms ?? 0,
      wifi: true,
      amenities: row.amenities ?? [],
      image: (row.images ?? [])[0] ?? "",
      source_url: `https://mdeai.co/rentals/${row.id}`,
      schedule_viewing_url: `https://mdeai.co/rentals/${row.id}/schedule-viewing`,
      host_name: "Host",
      availability: "Available now",
      tags: [],
      rankScore,
      signalSource: sig?.source ?? undefined,
    };
  });

  if (query.stayType === "monthly") {
    results = sortForMonthlyStay(results);
  }

  return {
    results,
    total: scored.length,
    source: "supabase",
    hybridUsed,
    embedStatus,
    embedFailureReason,
    embedHttpStatus,
    rankExplanation,
    slots,
  };
}
