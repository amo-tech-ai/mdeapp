import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { enrichedGroundedPlaceFieldsSchema } from "../lib/adk-grounding-types";
import { invokeAdkGrounding } from "../lib/adk-grounding-client";
import {
  mapAdkGroundingPins,
  type GroundedPlaceResult,
} from "../lib/map-adk-grounding-pins";
import { incrementAndCheckGroundingQuota } from "../lib/grounding-quota";
import { resolveGroundingLocationBias } from "../lib/grounding-location-bias";
import { searchRestaurants, type Restaurant } from "./search-restaurants";
import {
  isCoffeeVenueQuery,
  isNightlifeVenueQuery,
  searchCafeVenueAnchors,
  searchNightclubVenueAnchors,
  venueAnchorMapsUrl,
  venueAnchorSummary,
  venueAnchorToCoordinates,
  type VenueAnchorRow,
} from "./search-venue-anchors";

const groundedPlaceResultSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    placeId: z.string().optional(),
    mapsUrl: z.string().url().optional(),
    directionsUrl: z.string().url().optional(),
    reviewsUrl: z.string().url().optional(),
  })
  .merge(enrichedGroundedPlaceFieldsSchema);

const CAFE_QUERY =
  /\b(caf[eé]s?|coffee shops?|quiet caf[eé]s?|top cafes?|list cafes?|coworking|wifi|wi-fi|laptop[- ]friendly)\b/i;

const NIGHTLIFE_QUERY =
  /\b(nightlife|salsa bars?|hidden bars?|rooftop cocktails?|rooftop bars?|live music bars?|locals go to)\b/i;

export function isCafeGroundingQuery(query: string): boolean {
  return CAFE_QUERY.test(query);
}

export function isNightlifeGroundingQuery(query: string): boolean {
  return NIGHTLIFE_QUERY.test(query);
}

export function normalizeVenueGroundingQuery(query: string): string {
  const q = query.trim();
  if (isCafeGroundingQuery(q)) {
    if (/\b(wifi|wi-fi|laptop|cowork|remote work)\b/i.test(q)) {
      return `${q}. Prefer cafés with reliable Wi-Fi, power outlets, and laptop-friendly seating in Medellín. Exclude bars and nightclubs.`;
    }
    return `${q}. Prefer specialty coffee roasters and brunch cafés. Exclude bar lounges and nightlife venues.`;
  }
  if (isNightlifeGroundingQuery(q)) {
    if (/\bsalsa\b/i.test(q)) {
      return `${q}. Prefer authentic salsa bars and live salsa venues locals visit in Medellín. Exclude generic tourist clubs.`;
    }
    if (/\brooftop\b/i.test(q)) {
      return `${q}. Prefer rooftop bars and cocktail terraces with views in Medellín.`;
    }
    return `${q}. Prefer nightlife venues and bars locals recommend in Medellín.`;
  }
  return q;
}

export function isCafeGroundingIntent(
  query: string,
  intent?: string,
): boolean {
  if (intent === "cafe") return true;
  if (intent === "nightlife") return false;
  return isCafeGroundingQuery(query);
}

export function isNightlifeGroundingIntent(
  query: string,
  intent?: string,
): boolean {
  if (intent === "nightlife") return true;
  return isNightlifeGroundingQuery(query);
}

export const venueGroundingIntentSchema = z.enum([
  "cafe",
  "general",
  "nightlife",
]);

export type VenueGroundingIntent = z.infer<typeof venueGroundingIntentSchema>;
export type VenueGroundingKind = VenueGroundingIntent;

export function resolveVenueGroundingKind(
  query: string,
  intent?: VenueGroundingIntent,
): VenueGroundingKind {
  if (intent === "nightlife" || intent === "cafe" || intent === "general") {
    return intent;
  }
  if (isNightlifeGroundingQuery(query)) return "nightlife";
  if (isCafeGroundingQuery(query)) return "cafe";
  return "general";
}

function isNightlifeCandidateTitle(title: string): boolean {
  return /\b(bar|club|salsa|rooftop|nightlife|discotec|lounge|cocktail|night)\b/i.test(
    title,
  );
}

export function filterNightlifeGroundingRows(
  rows: GroundedPlaceResult[],
  query: string,
  intent?: string,
): GroundedPlaceResult[] {
  if (!isNightlifeGroundingIntent(query, intent)) return rows;
  const nightlife = rows.filter(
    (row) =>
      isNightlifeCandidateTitle(row.title) && !isBarLoungeDistractor(row.title),
  );
  return nightlife.length > 0 ? nightlife : rows;
}

export function normalizeCafeGroundingQuery(query: string): string {
  return normalizeVenueGroundingQuery(query);
}

function isBarLoungeDistractor(title: string): boolean {
  if (/\bskybar\b/i.test(title)) return true;
  if (/\bbar\s*&\s*lounge\b/i.test(title)) return true;
  if (/general cafe bar/i.test(title)) return true;
  if (/\bcaf[eé]\s+noir\s+bar/i.test(title)) return true;
  return false;
}

function isCafeCandidateTitle(title: string): boolean {
  return /\bcaf[eé]|coffee|brunch/i.test(title);
}

export function filterCafeGroundingRows(
  rows: GroundedPlaceResult[],
  query: string,
  intent?: string,
): GroundedPlaceResult[] {
  if (!isCafeGroundingIntent(query, intent)) return rows;
  return rows.filter((row) => {
    if (isBarLoungeDistractor(row.title)) return false;
    return isCafeCandidateTitle(row.title);
  });
}

type GroundedAttributionSource = {
  source: string;
  placeUri: string;
  title?: string;
};

// Medellín city center — used when a restaurant has no stored coordinates.
const MDE_LAT = 6.2442;
const MDE_LNG = -75.5812;

/** Extract a neighborhood hint from a free-text grounding query. */
function neighborhoodFromGroundingQuery(query: string): string | undefined {
  const m = query.match(
    /\b(laureles|poblado|el\s+poblado|envigado|bel[eé]n|estadio|provenza|el\s+centro)\b/i,
  );
  return m?.[0];
}

/**
 * Map a curated Restaurant row to the GroundedPlaceResult shape expected by
 * parseGroundedToolResult / GroundedCafeResults. Used when ADK is unavailable.
 */
function restaurantToGroundedRow(r: Restaurant): GroundedPlaceResult {
  return {
    id: r.id,
    title: r.name,
    latitude: r.latitude ?? MDE_LAT,
    longitude: r.longitude ?? MDE_LNG,
    placeId: r.placeId ?? undefined,
    mapsUrl: (r.mapsUrl ?? undefined) as string | undefined,
    rating: r.rating > 0 ? r.rating : undefined,
    summary: (r.aiSummary ?? r.vibe.slice(0, 3).join(" · ")) || undefined,
    formattedAddress: r.neighborhood,
    primaryType: r.cuisine === "cafe" ? "coffee_shop" : "restaurant",
  };
}

function anchorToGroundedRow(
  row: VenueAnchorRow,
  primaryType: string,
): GroundedPlaceResult {
  const { latitude, longitude } = venueAnchorToCoordinates(row);
  return {
    id: row.id,
    title: row.name,
    latitude,
    longitude,
    placeId: row.google_place_id,
    mapsUrl: venueAnchorMapsUrl(row.google_place_id),
    summary: venueAnchorSummary(row),
    formattedAddress: row.neighborhood ?? undefined,
    primaryType,
  };
}

/**
 * Fallback when ADK grounding is unavailable — café queries use venue_anchors
 * (DATA-035); other queries use curated restaurants.
 */
function withVenueKindMetadata<T extends Record<string, unknown>>(
  payload: T,
  rawQuery: string,
  intent?: VenueGroundingIntent,
): T & { metadata: Record<string, unknown> } {
  const venueKind = resolveVenueGroundingKind(rawQuery, intent);
  const existing =
    payload.metadata && typeof payload.metadata === "object"
      ? (payload.metadata as Record<string, unknown>)
      : {};
  return {
    ...payload,
    metadata: { ...existing, venueKind },
  };
}

async function curatedFallback(
  rawQuery: string,
  pageSize: number,
  intent?: VenueGroundingIntent,
): Promise<GroundedPlaceResult[]> {
  const neighborhood = neighborhoodFromGroundingQuery(rawQuery);
  const isNightlife =
    intent === "nightlife" ||
    (intent !== "cafe" && isNightlifeVenueQuery(rawQuery));
  const isCoffee =
    intent === "cafe" ||
    (intent !== "nightlife" && isCoffeeVenueQuery(rawQuery));

  if (isNightlife) {
    const anchors = await searchNightclubVenueAnchors({
      neighborhood,
      limit: pageSize,
    });
    if (anchors.length > 0) {
      return anchors.map((row) => anchorToGroundedRow(row, "night_club"));
    }
    return [];
  }

  if (isCoffee) {
    const anchors = await searchCafeVenueAnchors({
      neighborhood,
      limit: pageSize,
    });
    if (anchors.length > 0) {
      return anchors.map((row) => anchorToGroundedRow(row, "coffee_shop"));
    }
  }

  const { results } = await searchRestaurants({
    neighborhood,
    cuisine: isCoffee ? ("cafe" as const) : undefined,
    limit: pageSize,
  });
  if (results.length > 0) return results.map(restaurantToGroundedRow);
  if (isCoffee) {
    const { results: broader } = await searchRestaurants({
      neighborhood,
      limit: pageSize,
    });
    return broader.map(restaurantToGroundedRow);
  }
  return [];
}

/** Join ADK attribution to filtered rows by mapsUrl — never index-zip (audit B1). */
export function alignGroundedAttribution(
  results: Array<{ title: string; mapsUrl?: string }>,
  adkAttribution: GroundedAttributionSource[],
): GroundedAttributionSource[] {
  return results.flatMap((row) => {
    const source = adkAttribution.find((a) => a.placeUri === row.mapsUrl);
    return source ? [{ ...source, title: row.title }] : [];
  });
}

export const searchGroundedPlacesInputSchema = z.object({
  query: z.string().min(1).describe("Natural language place search"),
  intent: venueGroundingIntentSchema
    .optional()
    .describe(
      "Optional venue kind: cafe, nightlife (clubs/bars), or general POI search",
    ),
  pageSize: z.number().int().min(1).max(10).default(5).optional(),
  locationBias: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional()
    .describe(
      "Optional map center — pass mapUi.viewport { lat→latitude, lng→longitude } when search should follow the visible map",
    ),
});

export const searchGroundedPlacesTool = createTool({
  id: "search-grounded-places",
  description:
    "Search real places near Medellín using Google Maps Grounding Lite (cafés, venues, POIs). Returns map pins with Google Maps links — never invent coordinates.",
  inputSchema: searchGroundedPlacesInputSchema,
  outputSchema: z.object({
    results: z.array(groundedPlaceResultSchema),
    attribution: z.array(
      z.object({
        source: z.string(),
        placeUri: z.string().url(),
        title: z.string().optional(),
      }),
    ),
    source: z.literal("grounding"),
    metadata: z.record(z.unknown()).optional(),
  }),
  execute: async (inputData: {
    query: string;
    intent?: VenueGroundingIntent;
    pageSize?: number;
    locationBias?: { latitude: number; longitude: number };
  }) => {
    const { query: rawQuery, intent, pageSize, locationBias: inputBias } =
      inputData;
    const query = normalizeVenueGroundingQuery(rawQuery);
    const quota = await incrementAndCheckGroundingQuota();
    if (!quota.allowed) {
      // Quota exceeded — degrade to curated restaurant results
      try {
        const fallbackResults = await curatedFallback(
          rawQuery,
          pageSize ?? 5,
          intent,
        );
        if (fallbackResults.length > 0) {
          return withVenueKindMetadata(
            {
              results: fallbackResults,
              attribution: [],
              source: "grounding" as const,
              metadata: { reason: quota.reason, fallback: "curated" },
            },
            rawQuery,
            intent,
          );
        }
      } catch (err) {
        console.warn("[search-grounded-places] quota fallback failed:", err);
      }
      return withVenueKindMetadata(
        {
          results: [],
          attribution: [],
          source: "grounding" as const,
          metadata: { reason: quota.reason },
        },
        rawQuery,
        intent,
      );
    }
    const locationBias = resolveGroundingLocationBias({
      locationBias: inputBias,
    });
    const adk = await invokeAdkGrounding({
      query,
      pageSize,
      locationBias,
    });
    const reason = adk.metadata?.reason;
    if (reason && adk.pins.length === 0) {
      // ADK unavailable (permission / network) — degrade to curated restaurant results
      try {
        const fallbackResults = await curatedFallback(
          rawQuery,
          pageSize ?? 5,
          intent,
        );
        if (fallbackResults.length > 0) {
          return withVenueKindMetadata(
            {
              results: fallbackResults,
              attribution: [],
              source: "grounding" as const,
              metadata: { ...adk.metadata, fallback: "curated" },
            },
            rawQuery,
            intent,
          );
        }
      } catch (err) {
        console.warn("[search-grounded-places] adk fallback failed:", err);
      }
      return withVenueKindMetadata(
        {
          results: [],
          attribution: [],
          source: "grounding" as const,
          metadata: adk.metadata,
        },
        rawQuery,
        intent,
      );
    }
    const mapped = mapAdkGroundingPins(adk);
    const cafeFiltered = filterCafeGroundingRows(mapped, rawQuery, intent);
    const filtered = filterNightlifeGroundingRows(cafeFiltered, rawQuery, intent);
    const results = filtered.map((row) => ({
      ...row,
      mapsUrl: row.mapsUrl as string | undefined,
    }));
    const attribution = alignGroundedAttribution(results, adk.attribution);
    return withVenueKindMetadata(
      {
        results,
        attribution,
        source: "grounding" as const,
        metadata: adk.metadata,
      },
      rawQuery,
      intent,
    );
  },
});
