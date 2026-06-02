import {
  PLACE_DETAILS_FIELD_MASK_VERSION,
  extractDisplayName,
  extractPlaceUri,
  getPlaceDetails,
  normalizePlaceId,
  PlacesRequestError,
} from "@/mastra/lib/google-places-client";
import type { Json } from "@/lib/supabase/database.types";
import {
  getPlacesNegativeCacheUntil,
  recordPlacesNegativeCache,
} from "@/lib/place-details-negative-cache";
import { createServiceRoleClient } from "@/lib/supabase/service";

const PLACE_DETAILS_CACHE_TTL_DAYS = 7;

export type PlaceDetailsCacheRead =
  | { hit: true; payload: unknown }
  | { hit: false; reason: "miss" | "no_db" };

export type PlaceDetailsFetchResult = {
  raw: unknown;
  cacheHit: boolean;
};

function readPhotoPrimary(place: Record<string, unknown>): string | null {
  const photos = place.photos;
  if (!Array.isArray(photos) || photos.length === 0) return null;
  const first = photos[0];
  if (!first || typeof first !== "object") return null;
  const name = (first as Record<string, unknown>).name;
  return typeof name === "string" && name.trim() ? name.trim() : null;
}

function readLatLng(place: Record<string, unknown>): {
  latitude: number | null;
  longitude: number | null;
} {
  const loc = place.location;
  if (!loc || typeof loc !== "object") {
    return { latitude: null, longitude: null };
  }
  const rec = loc as Record<string, unknown>;
  const latitude =
    typeof rec.latitude === "number" && !Number.isNaN(rec.latitude)
      ? rec.latitude
      : null;
  const longitude =
    typeof rec.longitude === "number" && !Number.isNaN(rec.longitude)
      ? rec.longitude
      : null;
  return { latitude, longitude };
}

function cacheExpiresAt(): string {
  const d = new Date();
  d.setDate(d.getDate() + PLACE_DETAILS_CACHE_TTL_DAYS);
  return d.toISOString();
}

/** Read fresh row for current field-mask version (server-only, service role). */
export async function readPlaceDetailsFromCache(
  placeId: string,
): Promise<PlaceDetailsCacheRead> {
  const client = createServiceRoleClient();
  if (!client) return { hit: false, reason: "no_db" };

  const id = normalizePlaceId(placeId);
  const { data, error } = await client
    .from("place_details_cache")
    .select("payload")
    .eq("place_id", id)
    .eq("field_mask_version", PLACE_DETAILS_FIELD_MASK_VERSION)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error || !data?.payload) {
    return { hit: false, reason: "miss" };
  }

  return { hit: true, payload: data.payload };
}

/** Upsert masked getPlace payload after a cache miss (VEN-014 / MAP-005). */
export async function writePlaceDetailsToCache(
  placeId: string,
  raw: unknown,
): Promise<void> {
  const client = createServiceRoleClient();
  if (!client || !raw || typeof raw !== "object") return;

  const place = raw as Record<string, unknown>;
  const id = normalizePlaceId(placeId);
  const { latitude, longitude } = readLatLng(place);

  await client.from("place_details_cache").upsert(
    {
      place_id: id,
      field_mask_version: PLACE_DETAILS_FIELD_MASK_VERSION,
      display_name: extractDisplayName(place),
      google_maps_uri: extractPlaceUri(place),
      latitude,
      longitude,
      payload: place as Json,
      photo_name_primary: readPhotoPrimary(place),
      expires_at: cacheExpiresAt(),
    },
    { onConflict: "place_id,field_mask_version" },
  );
}

/** Cache read-through for `/api/places/detail` — Places only on miss. */
export async function fetchPlaceDetailsWithCache(
  placeId: string,
): Promise<PlaceDetailsFetchResult> {
  const id = normalizePlaceId(placeId);
  if (getPlacesNegativeCacheUntil(id)) {
    throw new PlacesRequestError(
      "Places detail temporarily unavailable (negative cache)",
    );
  }

  const cached = await readPlaceDetailsFromCache(placeId);
  if (cached.hit) {
    return { raw: cached.payload, cacheHit: true };
  }

  try {
    const raw = await getPlaceDetails({ placeId: id });
    await writePlaceDetailsToCache(placeId, raw);
    return { raw, cacheHit: false };
  } catch (err) {
    if (err instanceof PlacesRequestError) {
      recordPlacesNegativeCache(id);
    }
    throw err;
  }
}
