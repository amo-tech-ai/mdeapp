import { z } from "zod";

/** Optional enrichment fields from MAP-018B sidecar Place Details. */
export const enrichedGroundedPlaceFieldsSchema = z.object({
  rating: z.number().optional(),
  userRatingCount: z.number().int().nonnegative().optional(),
  priceLevel: z.string().optional(),
  openNow: z.boolean().nullable().optional(),
  formattedAddress: z.string().optional(),
  primaryType: z.string().optional(),
  summary: z.string().optional(),
  photoName: z.string().optional(),
  photoAuthorAttributions: z
    .array(
      z.object({
        displayName: z.string().optional(),
        uri: z.string().url().optional(),
      }),
    )
    .optional(),
  fieldMaskVersion: z.string().optional(),
  directionsUrl: z.string().url().optional(),
  reviewsUrl: z.string().url().optional(),
});

export type EnrichedGroundedPlaceFields = z.infer<
  typeof enrichedGroundedPlaceFieldsSchema
>;

export const adkGroundingInvokeRequestSchema = z.object({
  tool: z
    .enum([
      "search_grounded_places",
      "search_grounded_events",
      "compute_routes",
    ])
    .default("search_grounded_places"),
  query: z.string().min(1),
  locationBias: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  pageSize: z.number().int().min(1).max(10).default(5),
  requestId: z.string().optional(),
});

export const adkGroundingPinSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    placeId: z.string().optional(),
    mapsUrl: z.string().url().optional(),
  })
  .merge(enrichedGroundedPlaceFieldsSchema.partial())
  .passthrough();

export const adkGroundingInvokeResponseSchema = z.object({
  places: z.array(z.record(z.unknown())).default([]),
  pins: z.array(z.record(z.unknown())).default([]),
  attribution: z
    .array(
      z.object({
        source: z.string(),
        placeUri: z.string().url(),
        title: z.string().optional(),
      }),
    )
    .default([]),
  citations: z.array(z.record(z.unknown())).default([]),
  confidence: z.number().default(0),
  metadata: z.record(z.unknown()).default({}),
});

export type AdkGroundingInvokeResponse = z.infer<
  typeof adkGroundingInvokeResponseSchema
>;
