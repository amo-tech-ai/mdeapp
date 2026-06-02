"use client";

import type { PlaceDetailsDto } from "@/lib/place-details";

/** Client-side backoff after /api/places/detail hard failures (403/502/503). */
export const PLACE_DETAILS_CLIENT_FAILURE_TTL_MS = 10 * 60 * 1000;

const NO_RETRY_STATUSES = new Set([403, 502, 503]);

type ClientCacheEntry =
  | { kind: "ok"; data: PlaceDetailsDto; expiresAt: number }
  | { kind: "err"; expiresAt: number };

const resultByPlaceId = new Map<string, ClientCacheEntry>();
const inFlightByPlaceId = new Map<string, Promise<PlaceDetailsDto | "error">>();

function cacheKey(placeId: string): string {
  return placeId.trim();
}

function readCache(placeId: string): ClientCacheEntry | null {
  const key = cacheKey(placeId);
  const entry = resultByPlaceId.get(key);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) {
    resultByPlaceId.delete(key);
    return null;
  }
  return entry;
}

function writeFailure(placeId: string): void {
  resultByPlaceId.set(cacheKey(placeId), {
    kind: "err",
    expiresAt: Date.now() + PLACE_DETAILS_CLIENT_FAILURE_TTL_MS,
  });
}

function writeSuccess(placeId: string, data: PlaceDetailsDto): void {
  resultByPlaceId.set(cacheKey(placeId), {
    kind: "ok",
    data,
    expiresAt: Date.now() + PLACE_DETAILS_CLIENT_FAILURE_TTL_MS,
  });
}

async function fetchOnce(
  placeId: string,
  signal: AbortSignal,
): Promise<PlaceDetailsDto | "error"> {
  const res = await fetch(
    `/api/places/detail?placeId=${encodeURIComponent(placeId)}`,
    { signal, cache: "no-store" },
  );
  if (!res.ok) {
    if (NO_RETRY_STATUSES.has(res.status)) {
      writeFailure(placeId);
    }
    return "error";
  }
  const data = (await res.json()) as PlaceDetailsDto;
  writeSuccess(placeId, data);
  return data;
}

/**
 * Deduped Places detail fetch for detail panels — one in-flight request per placeId,
 * no repeat calls while failure TTL is active.
 */
export async function fetchPlaceDetailsDto(
  placeId: string,
  signal: AbortSignal,
): Promise<PlaceDetailsDto | "error"> {
  const key = cacheKey(placeId);
  if (!key || key.length < 8) return "error";

  const cached = readCache(key);
  if (cached?.kind === "err") return "error";
  if (cached?.kind === "ok") return cached.data;

  const pending = inFlightByPlaceId.get(key);
  if (pending) return pending;

  const promise = fetchOnce(key, signal).finally(() => {
    inFlightByPlaceId.delete(key);
  });
  inFlightByPlaceId.set(key, promise);
  return promise;
}

/** Vitest only — reset client dedupe / failure cache. */
export function resetPlaceDetailsClientFetchForTests(): void {
  resultByPlaceId.clear();
  inFlightByPlaceId.clear();
}
