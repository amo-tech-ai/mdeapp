import type { EnrichedGroundedPlaceFields } from "./adk-grounding-types";
import type { AdkGroundingInvokeResponse } from "./adk-grounding-types";

export type GroundedPlaceResult = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  mapsUrl?: string;
  directionsUrl?: string;
  reviewsUrl?: string;
} & EnrichedGroundedPlaceFields;

const GENERIC_TITLE = /^place$/i;

function cleanAttributionTitle(title: string): string {
  return title.replace(/\s*[-–]\s*Google Maps\s*$/i, "").trim();
}

function resolvePinTitle(
  row: Record<string, unknown>,
  index: number,
  attribution: AdkGroundingInvokeResponse["attribution"],
): string {
  const raw = String(row.title ?? row.name ?? "").trim();
  if (raw && !GENERIC_TITLE.test(raw)) return raw;

  const mapsUrl = row.mapsUrl ? String(row.mapsUrl) : undefined;
  if (mapsUrl) {
    const match = attribution.find((a) => a.placeUri === mapsUrl);
    const attTitle = (match as { title?: string } | undefined)?.title;
    if (typeof attTitle === "string" && attTitle.trim()) {
      return cleanAttributionTitle(attTitle);
    }
  }

  const byIndex = attribution[index] as { title?: string } | undefined;
  if (byIndex?.title?.trim()) {
    return cleanAttributionTitle(byIndex.title);
  }

  return raw || "Place";
}

function pickPrimaryType(row: Record<string, unknown>): string | undefined {
  if (typeof row.primaryType === "string" && row.primaryType.trim()) {
    return row.primaryType.trim();
  }
  const types = row.types;
  if (!Array.isArray(types)) return undefined;
  const preferred = ["cafe", "coffee_shop", "restaurant", "bakery", "bar"];
  for (const key of preferred) {
    if (types.includes(key)) return key;
  }
  const first = types.find((t) => typeof t === "string");
  return typeof first === "string" ? first : undefined;
}

function mapEnrichedFields(row: Record<string, unknown>): EnrichedGroundedPlaceFields {
  const rating =
    typeof row.rating === "number" && !Number.isNaN(row.rating)
      ? row.rating
      : undefined;
  const userRatingCount =
    typeof row.userRatingCount === "number" && row.userRatingCount >= 0
      ? row.userRatingCount
      : undefined;
  const openNow =
    row.openNow === null
      ? null
      : typeof row.openNow === "boolean"
        ? row.openNow
        : undefined;
  const editorial =
    typeof row.editorialSummary === "string"
      ? row.editorialSummary
      : undefined;
  const summary =
    typeof row.summary === "string"
      ? row.summary
      : editorial;

  return {
    rating,
    userRatingCount,
    priceLevel:
      typeof row.priceLevel === "string" ? row.priceLevel : undefined,
    openNow,
    formattedAddress:
      typeof row.formattedAddress === "string"
        ? row.formattedAddress
        : undefined,
    primaryType: pickPrimaryType(row),
    summary,
    photoName:
      typeof row.photoName === "string" ? row.photoName : undefined,
    photoAuthorAttributions: Array.isArray(row.photoAuthorAttributions)
      ? (row.photoAuthorAttributions as EnrichedGroundedPlaceFields["photoAuthorAttributions"])
      : undefined,
    fieldMaskVersion:
      typeof row.fieldMaskVersion === "string"
        ? row.fieldMaskVersion
        : undefined,
    directionsUrl:
      typeof row.directionsUrl === "string" ? row.directionsUrl : undefined,
    reviewsUrl: typeof row.reviewsUrl === "string" ? row.reviewsUrl : undefined,
  };
}

/** Map ADK invoke pins/places → Mastra tool results (fail-open on partial rows). */
export function mapAdkGroundingPins(
  adk: AdkGroundingInvokeResponse,
): GroundedPlaceResult[] {
  const pinRows =
    adk.pins.length > 0 ? adk.pins : (adk.places as typeof adk.pins);
  const attribution = adk.attribution ?? [];

  return pinRows
    .map((row, index): GroundedPlaceResult | null => {
      const r = row as Record<string, unknown>;
      const latitude = Number(r.latitude);
      const longitude = Number(r.longitude);
      if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;

      const mapsUrl = r.mapsUrl ? String(r.mapsUrl) : undefined;
      const enriched = mapEnrichedFields(r);
      return {
        id: String(r.id ?? r.placeId ?? `grounded-${index}`),
        title: resolvePinTitle(r, index, attribution),
        latitude,
        longitude,
        placeId: r.placeId ? String(r.placeId) : undefined,
        mapsUrl,
        directionsUrl: enriched.directionsUrl,
        reviewsUrl: enriched.reviewsUrl,
        ...enriched,
      };
    })
    .filter((row): row is GroundedPlaceResult => row !== null);
}
