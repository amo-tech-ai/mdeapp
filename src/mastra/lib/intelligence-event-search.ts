import { createClient } from "@supabase/supabase-js";
import { embedQueryText, vectorLiteral } from "./query-embedding";
import type { RankExplanationEntry } from "./search-logs";
import {
  type EventCard,
  type EventQuery,
  mapCategory,
  extractNeighborhood,
  dateWindow,
  type DateWindow,
} from "../tools/search-events";

export type EventIntelligenceSlots = {
  neighborhood?: string;
  wantsSalsa?: boolean;
  wantsLiveMusic?: boolean;
  wantsFashion?: boolean;
  wantsNetworking?: boolean;
  dateWindow?: DateWindow;
};

type HybridEventRow = {
  id: string;
  name: string;
  description: string | null;
  event_type: string | null;
  address: string | null;
  city: string | null;
  event_start_time: string | null;
  ticket_price_min: number | string | null;
  primary_image_url: string | null;
  similarity: number | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  maps_url?: string | null;
};

type EventSignalRow = {
  event_id: string;
  hype_score: number | null;
  music_energy: number | null;
  fashion_score: number | null;
  networking_quality: number | null;
  nightlife_score: number | null;
  local_vs_tourist: number | null;
  confidence: number | null;
  source: string | null;
  evidence: Record<string, unknown> | null;
};

export type IntelligenceEventResult = EventCard & {
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

export function parseEventIntelligenceSlots(queryText: string): EventIntelligenceSlots {
  const q = queryText.toLowerCase();
  const slots: EventIntelligenceSlots = {};
  if (/laureles/.test(q)) slots.neighborhood = "Laureles";
  else if (/poblado|provenza/.test(q)) slots.neighborhood = "El Poblado";
  if (/salsa/.test(q)) slots.wantsSalsa = true;
  if (/live music|concert|band/.test(q)) slots.wantsLiveMusic = true;
  if (/fashion|runway/.test(q)) slots.wantsFashion = true;
  if (/networking|meetup|professional/.test(q)) slots.wantsNetworking = true;
  if (/this weekend|weekend/.test(q)) slots.dateWindow = "this_weekend";
  else if (/tonight|today/.test(q)) slots.dateWindow = "tonight";
  return slots;
}

function eventSignalBoost(slots: EventIntelligenceSlots, s: EventSignalRow): number {
  if ((s.confidence ?? 0) < 0.6) return 0;
  let boost = 0;
  if (slots.wantsSalsa) boost += (s.music_energy ?? 0) * 0.35 + (s.nightlife_score ?? 0) * 0.2;
  if (slots.wantsLiveMusic) boost += (s.music_energy ?? 0) * 0.3;
  if (slots.wantsFashion) boost += (s.fashion_score ?? 0) * 0.35;
  if (slots.wantsNetworking) boost += (s.networking_quality ?? 0) * 0.35;
  boost += (s.hype_score ?? 0) * 0.1;
  return boost;
}

function hybridToEventCard(row: HybridEventRow, rankScore?: number, signalSource?: string): IntelligenceEventResult {
  return {
    id: row.id,
    title: row.name,
    category: mapCategory(row.event_type),
    venue: extractNeighborhood(row.address, row.city),
    neighborhood: extractNeighborhood(row.address, row.city),
    startsAt: row.event_start_time ?? new Date().toISOString(),
    pricePerTicket: num(row.ticket_price_min) ?? 0,
    currency: "USD",
    imageUrl: row.primary_image_url ?? "",
    latitude: num(row.latitude),
    longitude: num(row.longitude),
    mapsUrl: row.maps_url ?? null,
    sourceUrl: row.maps_url ?? undefined,
    rankScore,
    signalSource,
    evidenceText: signalSource ? `Signal source: ${signalSource}` : null,
  };
}

export async function searchEventsIntelligent(
  query: EventQuery & { queryText?: string },
): Promise<{
  results: IntelligenceEventResult[];
  total: number;
  source: "supabase" | "fallback";
  hybridUsed: boolean;
  rankExplanation: RankExplanationEntry[];
  slots: EventIntelligenceSlots;
}> {
  const limit = query.limit ?? 5;
  const queryText = query.queryText?.trim() ?? "";
  const slots = queryText ? parseEventIntelligenceSlots(queryText) : {};
  const neighborhood = query.neighborhood ?? slots.neighborhood;
  const dw = query.dateWindow ?? slots.dateWindow ?? "any";
  const rankExplanation: RankExplanationEntry[] = [];
  const client = getAnonClient();

  if (!client) {
    return { results: [], total: 0, source: "fallback", hybridUsed: false, rankExplanation, slots };
  }

  let hybridRows: HybridEventRow[] = [];
  let hybridUsed = false;

  if (queryText) {
    const embedding = await embedQueryText(queryText);
    if (embedding) {
      const { data, error } = await client.rpc("hybrid_search_events", {
        query_text: queryText,
        query_embedding: vectorLiteral(embedding),
        match_count: Math.max(limit * 4, 20),
      });
      if (!error && data?.length) {
        hybridRows = data as HybridEventRow[];
        hybridUsed = true;
        rankExplanation.push({
          factor: "hybrid_semantic",
          score: hybridRows[0]?.similarity ?? 0,
          note: "hybrid_search_events RPC",
        });
      } else if (error) {
        console.warn("[intelligence-event-search] hybrid RPC:", error.message);
      }
    }
  }

  if (!hybridUsed) {
    let q = client
      .from("events")
      .select(
        "id, name, event_type, address, city, event_start_time, ticket_price_min, primary_image_url, latitude, longitude, maps_url",
      )
      .eq("is_active", true)
      .eq("status", "published")
      .order("event_start_time", { ascending: true })
      .limit(48);
    if (neighborhood) q = q.ilike("address", `%${neighborhood}%`);
    const window = dateWindow(dw);
    if (window.gte) q = q.gte("event_start_time", window.gte);
    if (window.lte) q = q.lte("event_start_time", window.lte);
    const { data } = await q;
    hybridRows = (data ?? []).map((r: Record<string, unknown>) => ({
      id: String(r.id),
      name: String(r.name),
      description: null,
      event_type: r.event_type as string | null,
      address: r.address as string | null,
      city: r.city as string | null,
      event_start_time: r.event_start_time as string | null,
      ticket_price_min: r.ticket_price_min as number | null,
      primary_image_url: r.primary_image_url as string | null,
      similarity: 0,
      latitude: r.latitude as number | null,
      longitude: r.longitude as number | null,
      maps_url: r.maps_url as string | null,
    }));
  }

  const ids = hybridRows.map((r) => r.id);
  const signalMap = new Map<string, EventSignalRow>();
  if (ids.length) {
    const { data: signals } = await client
      .from("event_signals")
      .select(
        "event_id, hype_score, music_energy, fashion_score, networking_quality, nightlife_score, local_vs_tourist, confidence, source, evidence",
      )
      .in("event_id", ids);
    for (const s of (signals ?? []) as EventSignalRow[]) {
      signalMap.set(s.event_id, s);
    }
  }

  const window = dateWindow(dw);
  let scored = hybridRows
    .filter((row) => {
      if (!window.gte && !window.lte) return true;
      const t = row.event_start_time;
      if (!t) return false;
      if (window.gte && t < window.gte) return false;
      if (window.lte && t > window.lte) return false;
      return true;
    })
    .map((row, idx) => {
      const sig = signalMap.get(row.id);
      const semantic = row.similarity ?? Math.max(0, 1 - idx * 0.02);
      const boost = sig ? eventSignalBoost(slots, sig) : 0;
      const hood = extractNeighborhood(row.address, row.city);
      const hoodMatch =
        neighborhood && hood
          ? hood.toLowerCase().includes(neighborhood.toLowerCase())
            ? 1
            : 0
          : 0.5;
      const rankScore = semantic * 0.45 + boost * 0.35 + hoodMatch * 0.2;
      return { row, rankScore, sig, hood };
    });

  if (!scored.length && hybridRows.length && (window.gte || window.lte)) {
    rankExplanation.push({
      factor: "date_window_relaxed",
      score: 0,
      note: `no ${dw} matches — showing nearest ranked events`,
    });
    scored = hybridRows.map((row, idx) => {
      const sig = signalMap.get(row.id);
      const semantic = row.similarity ?? Math.max(0, 1 - idx * 0.02);
      const boost = sig ? eventSignalBoost(slots, sig) : 0;
      const hood = extractNeighborhood(row.address, row.city);
      const hoodMatch =
        neighborhood && hood
          ? hood.toLowerCase().includes(neighborhood.toLowerCase())
            ? 1
            : 0
          : 0.5;
      const rankScore = semantic * 0.45 + boost * 0.35 + hoodMatch * 0.2;
      return { row, rankScore, sig, hood };
    });
  }

  if (dw !== "any") {
    rankExplanation.push({ factor: "date_window", score: 1, note: dw });
  }
  if (slots.wantsSalsa) {
    rankExplanation.push({ factor: "salsa_intent", score: 1, note: "music_energy + nightlife signals" });
  }

  scored.sort((a, b) => b.rankScore - a.rankScore);

  const results = scored.slice(0, limit).map(({ row, rankScore, sig }) =>
    hybridToEventCard(row, rankScore, sig?.source ?? undefined),
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
