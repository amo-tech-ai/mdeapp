import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { invokeAdkGrounding } from "../lib/adk-grounding-client";
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
    const results = adk.pins.map((row) => {
      const r = row as Record<string, unknown>;
      return {
        id: String(r.id ?? ""),
        title: String(r.title ?? "Place"),
        latitude: Number(r.latitude),
        longitude: Number(r.longitude),
        placeId: r.placeId ? String(r.placeId) : undefined,
        mapsUrl: r.mapsUrl ? String(r.mapsUrl) : undefined,
      };
    });
    return {
      results,
      attribution: adk.attribution,
      source: "grounding" as const,
      metadata: adk.metadata,
    };
  },
});
