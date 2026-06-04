import { createClient } from "@supabase/supabase-js";

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

/** Read curated café rows from public.venue_anchors (DATA-035). RLS: public select. */
export async function searchCafeVenueAnchors(params: {
  neighborhood?: string;
  limit: number;
}): Promise<VenueAnchorRow[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  let query = client
    .from("venue_anchors")
    .select(
      "id, kind, name, google_place_id, neighborhood, latitude, longitude, tags, metadata",
    )
    .eq("kind", "cafe")
    .eq("is_active", true)
    .limit(params.limit);

  if (params.neighborhood) {
    query = query.ilike("neighborhood", `%${params.neighborhood}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.warn("[search-venue-anchors]", error.message);
    return [];
  }

  const rows = (data ?? []) as VenueAnchorRow[];
  return rows.filter(
    (row) => Boolean(row.google_place_id) && typeof row.name === "string",
  );
}

/** Read curated nightclub rows from public.venue_anchors (DATA-035). */
export async function searchNightclubVenueAnchors(params: {
  neighborhood?: string;
  limit: number;
}): Promise<VenueAnchorRow[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  let query = client
    .from("venue_anchors")
    .select(
      "id, kind, name, google_place_id, neighborhood, latitude, longitude, tags, metadata",
    )
    .eq("kind", "nightclub")
    .eq("is_active", true)
    .limit(params.limit);

  if (params.neighborhood) {
    query = query.ilike("neighborhood", `%${params.neighborhood}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.warn("[search-venue-anchors] nightclub", error.message);
    return [];
  }

  const rows = (data ?? []) as VenueAnchorRow[];
  return rows.filter(
    (row) => Boolean(row.google_place_id) && typeof row.name === "string",
  );
}

/** Browse `/nightlife` — surfaces Supabase/config failures instead of empty grid. */
export async function searchNightclubVenueAnchorsForBrowse(params: {
  neighborhood?: string;
  limit: number;
}): Promise<{ rows: VenueAnchorRow[]; error: string | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      rows: [],
      error: "Could not load nightlife venues. Try again in a moment.",
    };
  }

  let query = client
    .from("venue_anchors")
    .select(
      "id, kind, name, google_place_id, neighborhood, latitude, longitude, tags, metadata",
    )
    .eq("kind", "nightclub")
    .eq("is_active", true)
    .limit(params.limit);

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

  const rows = (data ?? []) as VenueAnchorRow[];
  return {
    rows: rows.filter(
      (row) => Boolean(row.google_place_id) && typeof row.name === "string",
    ),
    error: null,
  };
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
