import { normalizePlaceId } from "@/mastra/lib/google-places-client";

/** Skip Google getPlace for this long after a failed detail fetch (VEN-014 guard). */
export const PLACE_DETAILS_NEGATIVE_CACHE_TTL_MS = 10 * 60 * 1000;

const negativeUntilByPlaceId = new Map<string, number>();

export function getPlacesNegativeCacheUntil(placeId: string): number | null {
  const id = normalizePlaceId(placeId);
  const until = negativeUntilByPlaceId.get(id);
  if (until == null) return null;
  if (Date.now() >= until) {
    negativeUntilByPlaceId.delete(id);
    return null;
  }
  return until;
}

export function recordPlacesNegativeCache(placeId: string): void {
  negativeUntilByPlaceId.set(
    normalizePlaceId(placeId),
    Date.now() + PLACE_DETAILS_NEGATIVE_CACHE_TTL_MS,
  );
}

/** Vitest only — reset module negative cache between cases. */
export function resetPlacesNegativeCacheForTests(): void {
  negativeUntilByPlaceId.clear();
}
