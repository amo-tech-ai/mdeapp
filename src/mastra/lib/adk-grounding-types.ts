import { z } from "zod";

export const adkGroundingInvokeRequestSchema = z.object({
  tool: z.enum(["search_grounded_places", "compute_routes"]).default(
    "search_grounded_places",
  ),
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
