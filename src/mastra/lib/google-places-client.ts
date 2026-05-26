/**
 * Server-only Google Places API (New) client — MAP-004 / MAP-018A.
 *
 * Enforces:
 *   - server key only (never NEXT_PUBLIC_*)
 *   - explicit X-Goog-FieldMask on every request
 *   - pageSize cap (default 5, max 10)
 *
 * Field paths verified against:
 *   - https://developers.google.com/maps/documentation/places/web-service/op-overview
 *   - https://developers.google.com/maps/documentation/javascript/place-class-data-fields
 *   - https://developers.google.com/maps/documentation/places/web-service/choose-fields
 *
 * Maps URLs: always use googleMapsLinks.placeUri — never construct from lat/lng.
 */

import { PlacesClient } from "@googlemaps/places";
import { withPlacesRetry } from "./places-retry";

export class PlacesConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlacesConfigError";
  }
}

export class PlacesRequestError extends Error {
  readonly cause?: unknown;
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "PlacesRequestError";
    this.cause = cause;
  }
}

export const PLACES_LIMITS = {
  PAGE_SIZE_DEFAULT: 5,
  PAGE_SIZE_MAX: 10,
  REQUEST_TIMEOUT_MS: 10_000,
} as const;

/** Bump when DEFAULT_PLACE_DETAILS_MASK changes — MAP-018E cache invalidation. */
export const PLACE_DETAILS_FIELD_MASK_VERSION = "details-v3-links-2026-05-26";

/** Place Details MVP — Enterprise tier max; excludes Enterprise+Atmosphere fields. */
export const PLACE_DETAILS_MVP_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "location",
  "googleMapsLinks",
  "rating",
  "userRatingCount",
  "priceLevel",
  "currentOpeningHours",
  "photos",
  "types",
] as const;

/** Enterprise + Atmosphere — opt-in only (PLACES_ENABLE_EDITORIAL_SUMMARY=true). */
export const PLACE_DETAILS_OPTIONAL_MASK = ["editorialSummary"] as const;

/** Alias for MVP mask — use buildPlaceDetailsMask() at call sites. */
export const DEFAULT_PLACE_DETAILS_MASK = PLACE_DETAILS_MVP_MASK;

export function isEditorialSummaryEnabled(): boolean {
  return process.env.PLACES_ENABLE_EDITORIAL_SUMMARY === "true";
}

export function buildPlaceDetailsMask(): readonly string[] {
  if (!isEditorialSummaryEnabled()) {
    return PLACE_DETAILS_MVP_MASK;
  }
  return [...PLACE_DETAILS_MVP_MASK, ...PLACE_DETAILS_OPTIONAL_MASK];
}

/** Text Search (New) — places.* prefix. See tasks/maps/places-mask-checklist.md */
export const DEFAULT_TEXT_SEARCH_MASK = [
  "places.id",
  "places.displayName",
  "places.googleMapsLinks",
  "places.location",
] as const;

/** Nearby Search (New) — adds primaryType per Place Types (New). */
export const DEFAULT_NEARBY_SEARCH_MASK = [
  "places.id",
  "places.displayName",
  "places.googleMapsLinks",
  "places.location",
  "places.primaryType",
] as const;

export function requirePlacesApiKey(): string {
  const key =
    process.env.GOOGLE_PLACES_API_KEY ??
    process.env.GOOGLE_MAPS_SERVER_API_KEY ??
    process.env.GOOGLE_MAPS_API_KEY;
  if (!key || key.length < 8) {
    throw new PlacesConfigError(
      "Missing GOOGLE_PLACES_API_KEY (or GOOGLE_MAPS_SERVER_API_KEY / GOOGLE_MAPS_API_KEY) for Places API (New)",
    );
  }
  return key;
}

let _client: PlacesClient | null = null;

function getClient(): PlacesClient {
  if (_client) return _client;
  _client = new PlacesClient({ apiKey: requirePlacesApiKey() });
  return _client;
}

/** Vitest only — reset singleton between mocked calls. */
export function resetPlacesClientForTests(): void {
  _client = null;
}

export function validatePlacesFieldMask(mask: readonly string[]): string {
  if (!mask || mask.length === 0) {
    throw new PlacesConfigError(
      "Places field mask is required and must not be empty",
    );
  }
  if (mask.some((field) => field.includes("*"))) {
    throw new PlacesConfigError("Places field mask must not use wildcard *");
  }
  return mask.join(",");
}

function cappedPageSize(requested?: number): number {
  const n =
    typeof requested === "number"
      ? requested
      : PLACES_LIMITS.PAGE_SIZE_DEFAULT;
  if (n < 1) return 1;
  if (n > PLACES_LIMITS.PAGE_SIZE_MAX) return PLACES_LIMITS.PAGE_SIZE_MAX;
  return n;
}

export interface TextSearchParams {
  textQuery: string;
  pageSize?: number;
  languageCode?: string;
  regionCode?: string;
  locationBias?: unknown;
  fieldMask?: readonly string[];
}

export interface NearbySearchParams {
  locationRestriction: unknown;
  includedTypes?: string[];
  pageSize?: number;
  rankPreference?: "POPULARITY" | "DISTANCE";
  fieldMask?: readonly string[];
}

export interface PlaceDetailsParams {
  placeId: string;
  fieldMask?: readonly string[];
  languageCode?: string;
  regionCode?: string;
}

async function withTimeout<T>(
  p: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new PlacesRequestError(
              `Places "${label}" timed out after ${ms}ms`,
            ),
          ),
        ms,
      ),
    ),
  ]);
}

export async function searchText(params: TextSearchParams): Promise<unknown> {
  const client = getClient();
  const fieldMask = validatePlacesFieldMask(
    params.fieldMask ?? DEFAULT_TEXT_SEARCH_MASK,
  );
  const pageSize = cappedPageSize(params.pageSize);
  try {
    const [response] = await withTimeout(
      withPlacesRetry(() =>
        client.searchText(
          {
            textQuery: params.textQuery,
            maxResultCount: pageSize,
            languageCode: params.languageCode,
            regionCode: params.regionCode,
            locationBias: params.locationBias as never,
          },
          { otherArgs: { headers: { "X-Goog-FieldMask": fieldMask } } },
        ),
      ),
      PLACES_LIMITS.REQUEST_TIMEOUT_MS,
      "searchText",
    );
    return response;
  } catch (err) {
    if (err instanceof PlacesRequestError) throw err;
    throw new PlacesRequestError("Places searchText failed", err);
  }
}

export async function searchNearby(
  params: NearbySearchParams,
): Promise<unknown> {
  const client = getClient();
  const fieldMask = validatePlacesFieldMask(
    params.fieldMask ?? DEFAULT_NEARBY_SEARCH_MASK,
  );
  const pageSize = cappedPageSize(params.pageSize);
  try {
    const [response] = await withTimeout(
      withPlacesRetry(() =>
        client.searchNearby(
          {
            locationRestriction: params.locationRestriction as never,
            includedTypes: params.includedTypes,
            maxResultCount: pageSize,
            rankPreference: params.rankPreference as never,
          },
          { otherArgs: { headers: { "X-Goog-FieldMask": fieldMask } } },
        ),
      ),
      PLACES_LIMITS.REQUEST_TIMEOUT_MS,
      "searchNearby",
    );
    return response;
  } catch (err) {
    if (err instanceof PlacesRequestError) throw err;
    throw new PlacesRequestError("Places searchNearby failed", err);
  }
}

export async function getPlace(params: PlaceDetailsParams): Promise<unknown> {
  const client = getClient();
  const fieldMask = validatePlacesFieldMask(
    params.fieldMask ?? buildPlaceDetailsMask(),
  );
  const placeId = params.placeId.replace(/^places\//, "");
  try {
    const [response] = await withTimeout(
      withPlacesRetry(() =>
        client.getPlace(
          {
            name: `places/${placeId}`,
            languageCode: params.languageCode,
            regionCode: params.regionCode,
          },
          { otherArgs: { headers: { "X-Goog-FieldMask": fieldMask } } },
        ),
      ),
      PLACES_LIMITS.REQUEST_TIMEOUT_MS,
      "getPlace",
    );
    return response;
  } catch (err) {
    if (err instanceof PlacesRequestError) throw err;
    throw new PlacesRequestError("Places getPlace failed", err);
  }
}

/** MAP-018 alias — enrich grounded cards after Grounding Lite discovery. */
export async function getPlaceDetails(
  params: PlaceDetailsParams,
): Promise<unknown> {
  return getPlace(params);
}

/**
 * Canonical Google Maps place URL from Places API (New) response.
 * Source: https://developers.google.com/maps/documentation/places/web-service/maps-links
 */
export function extractPlaceUri(place: unknown): string | null {
  if (!place || typeof place !== "object") return null;
  const p = place as Record<string, unknown>;
  const links = p.googleMapsLinks;
  if (!links || typeof links !== "object") return null;
  const uri = (links as Record<string, unknown>).placeUri;
  if (typeof uri !== "string" || !uri.startsWith("http")) return null;
  return uri;
}

export function extractDisplayName(place: unknown): string | null {
  if (!place || typeof place !== "object") return null;
  const name = (place as Record<string, unknown>).displayName;
  if (!name || typeof name !== "object") return null;
  const text = (name as Record<string, unknown>).text;
  return typeof text === "string" && text.trim() ? text.trim() : null;
}

export function normalizePlaceId(raw: string): string {
  return raw.replace(/^places\//, "");
}
