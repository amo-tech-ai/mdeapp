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
  /\b(nightlife|salsa bar|hidden bar|rooftop cocktails?|rooftop bar|live music bar|locals go to)\b/i;

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
  return isCafeGroundingQuery(query);
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

export const searchGroundedPlacesTool = createTool({
  id: "search-grounded-places",
  description:
    "Search real places near Medellín using Google Maps Grounding Lite (cafés, venues, POIs). Returns map pins with Google Maps links — never invent coordinates.",
  inputSchema: z.object({
    query: z.string().min(1).describe("Natural language place search"),
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
  }),
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
    pageSize?: number;
    locationBias?: { latitude: number; longitude: number };
  }) => {
    const { query: rawQuery, pageSize, locationBias: inputBias } = inputData;
    const query = normalizeVenueGroundingQuery(rawQuery);
    const quota = await incrementAndCheckGroundingQuota();
    if (!quota.allowed) {
      return {
        results: [],
        attribution: [],
        source: "grounding" as const,
        metadata: { reason: quota.reason },
      };
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
      return {
        results: [],
        attribution: [],
        source: "grounding" as const,
        metadata: adk.metadata,
      };
    }
    const mapped = mapAdkGroundingPins(adk);
    const filtered = filterCafeGroundingRows(mapped, rawQuery);
    const results = filtered.map((row) => ({
      ...row,
      mapsUrl: row.mapsUrl as string | undefined,
    }));
    const attribution = alignGroundedAttribution(results, adk.attribution);
    return {
      results,
      attribution,
      source: "grounding" as const,
      metadata: adk.metadata,
    };
  },
});
