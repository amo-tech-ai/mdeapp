import { createClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/service";
import {
  rankVenueAnchorRows,
  type AnchorEvidence,
  type AnchorSignalRow,
} from "../lib/intelligence-anchor-search";

export type VenueAnchorRow = {
  id: string;
  kind: string;
  name: string;
  google_place_id: string;
  neighborhood: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  tags: string[] | null;
  metadata: Record<string, unknown> | null;
};

export type RankedVenueAnchorRow = VenueAnchorRow & {
  rankScore?: number;
  signalSource?: string;
  evidence?: AnchorEvidence[];
};

const ANCHOR_SIGNAL_SELECT =
  "venue_anchor_id, quiet_score, date_night_score, rooftop_score, digital_nomad_score, wifi_score, cocktail_score, brunch_score, hidden_gem_score, nightlife_score, local_authenticity_score, touristy_score, service_score, value_score, confidence, source";

let _client: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _client;
}

async function fetchAnchorSignals(
  anchorIds: string[],
): Promise<Map<string, AnchorSignalRow>> {
  const map = new Map<string, AnchorSignalRow>();
  if (!anchorIds.length) return map;
  const client = getSupabaseClient();
  if (!client) return map;

  const { data, error } = await client
    .from("venue_signals")
    .select(ANCHOR_SIGNAL_SELECT)
    .in("venue_anchor_id", anchorIds);
  if (error) {
    console.warn("[search-venue-anchors] venue_signals", error.message);
    return map;
  }
  for (const row of (data ?? []) as AnchorSignalRow[]) {
    map.set(row.venue_anchor_id, row);
  }
  return map;
}

async function fetchAnchorEvidence(
  anchorIds: string[],
): Promise<Map<string, AnchorEvidence[]>> {
  const map = new Map<string, AnchorEvidence[]>();
  if (!anchorIds.length) return map;

  const service = createServiceRoleClient();
  const client = service ?? getSupabaseClient();
  if (!client) return map;

  const { data, error } = await client
    .from("venue_source_evidence")
    .select("venue_anchor_id, source_type, source_url, extracted_text")
    .in("venue_anchor_id", anchorIds);
  if (error) {
    console.warn("[search-venue-anchors] venue_source_evidence", error.message);
    return map;
  }
  for (const row of (data ?? []) as Array<{
    venue_anchor_id: string;
    source_type: string;
    source_url: string | null;
    extracted_text: string | null;
  }>) {
    const list = map.get(row.venue_anchor_id) ?? [];
    list.push({
      sourceType: row.source_type,
      sourceUrl: row.source_url,
      extractedText: row.extracted_text,
    });
    map.set(row.venue_anchor_id, list);
  }
  return map;
}

async function rankAnchors(
  rows: VenueAnchorRow[],
  params: {
    queryText?: string;
    neighborhood?: string;
    venueKind: "cafe" | "nightclub";
  },
): Promise<RankedVenueAnchorRow[]> {
  if (!rows.length) return [];

  const ids = rows.map((r) => r.id);
  const [signalMap, evidenceMap] = await Promise.all([
    fetchAnchorSignals(ids),
    fetchAnchorEvidence(ids),
  ]);

  const ranked = rankVenueAnchorRows(rows, {
    queryText: params.queryText,
    neighborhood: params.neighborhood,
    venueKind: params.venueKind,
    signalMap,
  });

  return ranked.map(({ row, rankScore, signal }) => ({
    ...row,
    rankScore,
    signalSource: signal?.source ?? undefined,
    evidence: evidenceMap.get(row.id),
  }));
}

/** True when the query is café/coffee discovery (not generic restaurant). */
export function isCoffeeVenueQuery(query: string): boolean {
  return /\b(coffee|caf[eé]|espresso|specialty coffee)\b/i.test(query);
}

/** True when the query targets bars, clubs, or nightlife venues. */
export function isNightlifeVenueQuery(query: string): boolean {
  return /\b(nightlife|salsa bar|hidden bar|rooftop|cocktails?|nightclub|discotec|locals go to)\b/i.test(
    query,
  );
}

function num(v: number | string | null | undefined): number | undefined {
  if (v === null || v === undefined) return undefined;
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : undefined;
}

function filterValidAnchors(rows: VenueAnchorRow[]): VenueAnchorRow[] {
  return rows.filter(
    (row) => Boolean(row.google_place_id) && typeof row.name === "string",
  );
}

/** Read curated café rows from public.venue_anchors (DATA-035). RLS: public select. */
export async function searchCafeVenueAnchors(params: {
  neighborhood?: string;
  limit: number;
  queryText?: string;
}): Promise<RankedVenueAnchorRow[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  const fetchLimit = Math.max(params.limit * 3, params.limit);
  let query = client
    .from("venue_anchors")
    .select(
      "id, kind, name, google_place_id, neighborhood, latitude, longitude, tags, metadata",
    )
    .eq("kind", "cafe")
    .eq("is_active", true)
    .limit(fetchLimit);

  if (params.neighborhood) {
    query = query.ilike("neighborhood", `%${params.neighborhood}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.warn("[search-venue-anchors]", error.message);
    return [];
  }

  const rows = filterValidAnchors((data ?? []) as VenueAnchorRow[]);
  const ranked = await rankAnchors(rows, {
    queryText: params.queryText,
    neighborhood: params.neighborhood,
    venueKind: "cafe",
  });
  return ranked.slice(0, params.limit);
}

/** Browse `/cafes` — surfaces Supabase/config failures instead of empty grid. */
export async function searchCafeVenueAnchorsForBrowse(params: {
  neighborhood?: string;
  limit: number;
  queryText?: string;
}): Promise<{ rows: RankedVenueAnchorRow[]; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      rows: [],
      error: "Could not load cafés. Try again in a moment.",
    };
  }

  const fetchLimit = Math.max(params.limit * 3, params.limit);
  let query = client
    .from("venue_anchors")
    .select(
      "id, kind, name, google_place_id, neighborhood, latitude, longitude, tags, metadata",
    )
    .eq("kind", "cafe")
    .eq("is_active", true)
    .limit(fetchLimit);

  if (params.neighborhood) {
    query = query.ilike("neighborhood", `%${params.neighborhood}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.warn("[search-venue-anchors] cafe browse", error.message);
    return {
      rows: [],
      error: "Could not load cafés. Try again in a moment.",
    };
  }

  const rows = filterValidAnchors((data ?? []) as VenueAnchorRow[]);
  const ranked = await rankAnchors(rows, {
    queryText: params.queryText,
    neighborhood: params.neighborhood,
    venueKind: "cafe",
  });
  return { rows: ranked.slice(0, params.limit), error: null };
}

/** Read curated nightclub rows from public.venue_anchors (DATA-035). */
export async function searchNightclubVenueAnchors(params: {
  neighborhood?: string;
  limit: number;
  queryText?: string;
}): Promise<RankedVenueAnchorRow[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  const fetchLimit = Math.max(params.limit * 3, params.limit);
  let query = client
    .from("venue_anchors")
    .select(
      "id, kind, name, google_place_id, neighborhood, latitude, longitude, tags, metadata",
    )
    .eq("kind", "nightclub")
    .eq("is_active", true)
    .limit(fetchLimit);

  if (params.neighborhood) {
    query = query.ilike("neighborhood", `%${params.neighborhood}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.warn("[search-venue-anchors] nightclub", error.message);
    return [];
  }

  const rows = filterValidAnchors((data ?? []) as VenueAnchorRow[]);
  const ranked = await rankAnchors(rows, {
    queryText: params.queryText,
    neighborhood: params.neighborhood,
    venueKind: "nightclub",
  });
  return ranked.slice(0, params.limit);
}

/** Browse `/nightlife` — surfaces Supabase/config failures instead of empty grid. */
export async function searchNightclubVenueAnchorsForBrowse(params: {
  neighborhood?: string;
  limit: number;
  queryText?: string;
}): Promise<{ rows: RankedVenueAnchorRow[]; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      rows: [],
      error: "Could not load nightlife venues. Try again in a moment.",
    };
  }

  const fetchLimit = Math.max(params.limit * 3, params.limit);
  let query = client
    .from("venue_anchors")
    .select(
      "id, kind, name, google_place_id, neighborhood, latitude, longitude, tags, metadata",
    )
    .eq("kind", "nightclub")
    .eq("is_active", true)
    .limit(fetchLimit);

  if (params.neighborhood) {
    query = query.ilike("neighborhood", `%${params.neighborhood}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.warn("[search-venue-anchors] nightclub browse", error.message);
    return {
      rows: [],
      error: "Could not load nightlife venues. Try again in a moment.",
    };
  }

  const rows = filterValidAnchors((data ?? []) as VenueAnchorRow[]);
  const ranked = await rankAnchors(rows, {
    queryText: params.queryText,
    neighborhood: params.neighborhood,
    venueKind: "nightclub",
  });
  return { rows: ranked.slice(0, params.limit), error: null };
}

export function venueAnchorSummary(row: VenueAnchorRow): string | undefined {
  const meta = row.metadata;
  if (meta && typeof meta.ai_vibe_summary === "string") {
    return meta.ai_vibe_summary;
  }
  if (row.tags?.length) return row.tags.slice(0, 3).join(" · ");
  return undefined;
}

export function venueAnchorMapsUrl(placeId: string): string {
  return `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(placeId)}`;
}

export function venueAnchorToCoordinates(row: VenueAnchorRow): {
  latitude: number;
  longitude: number;
} {
  const latitude = num(row.latitude) ?? 6.2442;
  const longitude = num(row.longitude) ?? -75.5812;
  return { latitude, longitude };
}
