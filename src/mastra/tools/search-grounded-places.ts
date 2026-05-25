import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { invokeAdkGrounding } from "../lib/adk-grounding-client";
import { mapAdkGroundingPins } from "../lib/map-adk-grounding-pins";
import { incrementAndCheckGroundingQuota } from "../lib/grounding-quota";

export const searchGroundedPlacesTool = createTool({
  id: "search-grounded-places",
  description:
    "Search real places near Medellín using Google Maps Grounding Lite (cafés, venues, POIs). Returns map pins with Google Maps links — never invent coordinates.",
  inputSchema: z.object({
    query: z.string().min(1).describe("Natural language place search"),
    pageSize: z.number().int().min(1).max(10).default(5).optional(),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        placeId: z.string().optional(),
        mapsUrl: z.string().url().optional(),
      }),
    ),
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
  execute: async (inputData: { query: string; pageSize?: number }) => {
    const { query, pageSize } = inputData;
    const quota = await incrementAndCheckGroundingQuota();
    if (!quota.allowed) {
      return {
        results: [],
        attribution: [],
        source: "grounding" as const,
        metadata: { reason: quota.reason },
      };
    }
    const adk = await invokeAdkGrounding({ query, pageSize });
    const reason = adk.metadata?.reason;
    if (reason && adk.pins.length === 0) {
      return {
        results: [],
        attribution: [],
        source: "grounding" as const,
        metadata: adk.metadata,
      };
    }
    const results = mapAdkGroundingPins(adk).map((row) => ({
      ...row,
      mapsUrl: row.mapsUrl as string | undefined,
    }));
    const attribution = adk.attribution.map((row, index) => ({
      ...row,
      title: results[index]?.title,
    }));
    return {
      results,
      attribution,
      source: "grounding" as const,
      metadata: adk.metadata,
    };
  },
});
