import { createClient } from "@supabase/supabase-js";
import { getPlace } from "@/mastra/lib/google-places-client";
import { normalizePlaceDetails } from "@/lib/place-details";
import { placesPhotoProxyUrl } from "@/lib/places-photo-proxy";
import type { Restaurant } from "@/mastra/tools/search-restaurants";

const PLACE_PHOTO_FIELD_MASK = ["id", "photos"] as const;

function hasDisplayableImage(url?: string | null): boolean {
  if (!url?.trim()) return false;
  return url.startsWith("http") || url.startsWith("/api/places/photo");
}

function supabaseAnon() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Fill missing `placeId` from `restaurants.google_place_id` (hybrid RPC rows omit it). */
export async function attachRestaurantPlaceIds<
  T extends { id: string; placeId?: string | null },
>(restaurants: T[]): Promise<T[]> {
  const missing = restaurants.filter((r) => !r.placeId?.trim());
  if (!missing.length) return restaurants;

  const client = supabaseAnon();
  if (!client) return restaurants;

  const ids = missing.map((r) => r.id);
  const { data } = await client
    .from("restaurants")
    .select("id, google_place_id")
    .in("id", ids);

  const byId = new Map(
    (data ?? []).map((row) => [row.id, row.google_place_id as string | null]),
  );

  return restaurants.map((r) => {
    if (r.placeId?.trim()) return r;
    const pid = byId.get(r.id);
    return pid?.trim() ? { ...r, placeId: pid.trim() } : r;
  });
}

/** Resolve first Places photo to `/api/places/photo` proxy URL when DB hero is empty. */
export async function enrichRestaurantsWithPlacePhotos<
  T extends { placeId?: string | null; imageUrl?: string },
>(restaurants: T[], opts?: { maxFetches?: number }): Promise<T[]> {
  const maxFetches = opts?.maxFetches ?? 5;
  let remaining = maxFetches;
  const enriched: T[] = [];

  for (const row of restaurants) {
    if (hasDisplayableImage(row.imageUrl)) {
      enriched.push(row);
      continue;
    }

    const placeId = row.placeId?.trim();
    if (!placeId || remaining <= 0) {
      enriched.push(row);
      continue;
    }

    remaining -= 1;
    try {
      const raw = await getPlace({
        placeId,
        fieldMask: PLACE_PHOTO_FIELD_MASK,
      });
      const first = normalizePlaceDetails(raw)?.photoNames[0];
      if (first) {
        enriched.push({
          ...row,
          imageUrl: placesPhotoProxyUrl(first),
        });
        continue;
      }
    } catch {
      // Places lookup is best-effort — keep card without photo.
    }
    enriched.push(row);
  }

  return enriched;
}

/** API fast-path: attach place IDs then proxy photos (UX-028 / SAN-440). */
export async function prepareRestaurantSearchResults(
  results: Restaurant[],
): Promise<Restaurant[]> {
  const withIds = await attachRestaurantPlaceIds(results);
  return enrichRestaurantsWithPlacePhotos(withIds);
}
