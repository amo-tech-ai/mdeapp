import {
  PLACE_DETAILS_FIELD_MASK_VERSION,
  extractDisplayName,
  extractPlaceUri,
  normalizePlaceId,
} from "@/mastra/lib/google-places-client";

/** Client-safe Place Details DTO — only fields returned by Places API. */
export type PlaceDetailsDto = {
  placeId: string;
  displayName: string | null;
  formattedAddress: string | null;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  openNow?: boolean | null;
  weekdayDescriptions: string[];
  photoNames: string[];
  websiteUri?: string;
  nationalPhoneNumber?: string;
  mapsUrl?: string;
  directionsUrl?: string;
  reviewsUrl?: string;
  primaryType?: string;
  fieldMaskVersion: string;
  checkedAt: string;
};

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && !Number.isNaN(value) ? value : undefined;
}

function readMapsLinks(place: Record<string, unknown>) {
  const links = place.googleMapsLinks;
  if (!links || typeof links !== "object") {
    return { mapsUrl: extractPlaceUri(place) ?? undefined };
  }
  const rec = links as Record<string, unknown>;
  return {
    mapsUrl:
      readString(rec.placeUri) ?? extractPlaceUri(place) ?? undefined,
    directionsUrl: readString(rec.directionsUri),
    reviewsUrl: readString(rec.reviewsUri),
  };
}

function readOpeningHours(place: Record<string, unknown>): {
  openNow?: boolean | null;
  weekdayDescriptions: string[];
} {
  const hours = place.currentOpeningHours;
  if (!hours || typeof hours !== "object") {
    return { weekdayDescriptions: [] };
  }
  const rec = hours as Record<string, unknown>;
  const weekdayDescriptions = Array.isArray(rec.weekdayDescriptions)
    ? rec.weekdayDescriptions.filter(
        (line): line is string => typeof line === "string" && line.trim().length > 0,
      )
    : [];
  const openNow =
    typeof rec.openNow === "boolean" ? rec.openNow : null;
  return { openNow, weekdayDescriptions };
}

function readPhotoNames(place: Record<string, unknown>): string[] {
  const photos = place.photos;
  if (!Array.isArray(photos)) return [];
  const names: string[] = [];
  for (const photo of photos) {
    if (!photo || typeof photo !== "object") continue;
    const name = readString((photo as Record<string, unknown>).name);
    if (name) names.push(name);
  }
  return names;
}

function readPrimaryType(types: unknown): string | undefined {
  if (!Array.isArray(types)) return undefined;
  const first = types.find((t) => typeof t === "string" && t.trim());
  return typeof first === "string" ? first : undefined;
}

/** Normalize Places API (New) getPlace response for café detail panel. */
export function normalizePlaceDetails(raw: unknown): PlaceDetailsDto | null {
  if (!raw || typeof raw !== "object") return null;
  const place = raw as Record<string, unknown>;
  const id = readString(place.id) ?? readString(place.name);
  if (!id) return null;

  const { openNow, weekdayDescriptions } = readOpeningHours(place);
  const links = readMapsLinks(place);

  return {
    placeId: normalizePlaceId(id),
    displayName: extractDisplayName(place) ?? null,
    formattedAddress: readString(place.formattedAddress) ?? null,
    rating: readNumber(place.rating),
    userRatingCount: readNumber(place.userRatingCount),
    priceLevel: readString(place.priceLevel),
    openNow,
    weekdayDescriptions,
    photoNames: readPhotoNames(place),
    websiteUri: readString(place.websiteUri),
    nationalPhoneNumber: readString(place.nationalPhoneNumber),
    mapsUrl: links.mapsUrl,
    directionsUrl: links.directionsUrl,
    reviewsUrl: links.reviewsUrl,
    primaryType: readPrimaryType(place.types),
    fieldMaskVersion: PLACE_DETAILS_FIELD_MASK_VERSION,
    checkedAt: new Date().toISOString().slice(0, 10),
  };
}
