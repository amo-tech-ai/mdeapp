import { normalizeToolEnvelope } from "@/lib/normalize-tool-envelope";
import { readGroundedVenueKind } from "@/lib/grounded-venue-kind";
import {
  parseGroundedToolResult,
  resolveGroundedTitle,
} from "@/lib/parse-grounded-tool-result";
import {
  mapPinSchema,
  type MapPin,
  type MapPinCategory,
} from "@/platform/contracts";

type LatLngItem = {
  id: string;
  title?: string;
  name?: string;
  neighborhood?: string;
  latitude?: number | null;
  longitude?: number | null;
  placeId?: string | null;
  mapsUrl?: string | null;
  formattedAddress?: string | null;
  rating?: number | null;
  userRatingCount?: number | null;
  priceLevel?: string | null;
  openNow?: boolean | null;
  primaryType?: string | null;
  summary?: string | null;
  photoName?: string | null;
  photoAuthorAttributions?: unknown;
  directionsUrl?: string | null;
  reviewsUrl?: string | null;
  fieldMaskVersion?: string | null;
};

function itemToPin(
  item: LatLngItem,
  category: MapPinCategory,
  source: MapPin["source"],
  index: number,
  attribution: Array<{ placeUri?: string; title?: string }>,
  venueKind?: string,
): MapPin | null {
  const lat = item.latitude;
  const lng = item.longitude;
  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  const mapsUrl = item.mapsUrl ?? undefined;
  const title =
    category === "grounded"
      ? resolveGroundedTitle(item, index, attribution, mapsUrl)
      : (item.title ?? item.name ?? "").trim() || "Place";

  const pin = {
    id: `${category}-${item.id}`,
    category,
    lat,
    lng,
    title,
    subtitle:
      category === "grounded"
        ? (item.formattedAddress ?? item.neighborhood ?? undefined)
        : item.neighborhood,
    placeId: item.placeId ?? undefined,
    placeUri: mapsUrl,
    source,
    meta: {
      rawId: item.id,
      ...(category === "grounded" && item.rating != null
        ? { rating: item.rating }
        : {}),
      ...(category === "grounded" && item.userRatingCount != null
        ? { userRatingCount: item.userRatingCount }
        : {}),
      ...(category === "grounded" && item.photoName
        ? { photoName: item.photoName }
        : {}),
      ...(category === "grounded" &&
      item.photoAuthorAttributions != null &&
      Array.isArray(item.photoAuthorAttributions)
        ? { photoAuthorAttributions: item.photoAuthorAttributions }
        : {}),
      ...(category === "grounded" && item.openNow != null
        ? { openNow: item.openNow }
        : {}),
      ...(category === "grounded" && item.priceLevel
        ? { priceLevel: item.priceLevel }
        : {}),
      ...(category === "grounded" && item.primaryType
        ? { primaryType: item.primaryType }
        : {}),
      ...(category === "grounded" && item.summary
        ? { summary: item.summary }
        : {}),
      ...(category === "grounded" && item.directionsUrl
        ? { directionsUrl: item.directionsUrl }
        : {}),
      ...(category === "grounded" && item.reviewsUrl
        ? { reviewsUrl: item.reviewsUrl }
        : {}),
      ...(category === "grounded" && venueKind
        ? { venueKind }
        : {}),
    },
  };

  const parsed = mapPinSchema.safeParse(pin);
  return parsed.success ? parsed.data : null;
}

export type NormalizedToolOutput = {
  pins: MapPin[];
  resultCount: number;
};

export function normalizeToolOutput(
  category: MapPinCategory,
  result: unknown,
): NormalizedToolOutput {
  if (category === "grounded") {
    const parsed = parseGroundedToolResult(result);
    const venueKind =
      parsed.venueKind ?? readGroundedVenueKind(result);
    const pins: MapPin[] = [];
    for (const row of parsed.results) {
      if (row.latitude == null || row.longitude == null) continue;
      const pin = itemToPin(
        {
          id: row.id,
          title: row.title,
          latitude: row.latitude,
          longitude: row.longitude,
          placeId: row.placeId,
          mapsUrl: row.mapsUrl,
          formattedAddress: row.formattedAddress,
          rating: row.rating,
          userRatingCount: row.userRatingCount,
          priceLevel: row.priceLevel,
          openNow: row.openNow,
          primaryType: row.primaryType,
          summary: row.summary,
          photoName: row.photoName,
          photoAuthorAttributions: row.photoAuthorAttributions,
          directionsUrl: row.directionsUrl,
          reviewsUrl: row.reviewsUrl,
          fieldMaskVersion: row.fieldMaskVersion,
        },
        category,
        "grounding",
        pins.length,
        parsed.attribution,
        venueKind,
      );
      if (pin) pins.push(pin);
    }
    return { pins, resultCount: parsed.results.length };
  }

  const envelope = normalizeToolEnvelope(result);
  const rows = (envelope.results ?? []) as LatLngItem[];
  const root = result && typeof result === "object" ? result : {};
  const sourceField =
    (root as { source?: string }).source ?? envelope.source;

  const source =
    sourceField === "supabase" ||
    sourceField === "sql" ||
    sourceField === "places"
      ? "sql"
      : sourceField === "grounding"
        ? "grounding"
        : "tool";

  const pins: MapPin[] = [];
  for (const [index, row] of rows.entries()) {
    const pin = itemToPin(row, category, source, index, []);
    if (pin) pins.push(pin);
  }

  return { pins, resultCount: rows.length };
}
