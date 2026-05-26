import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { invokeAdkSearchGrounding } from "../lib/adk-grounding-client";
import { incrementAndCheckSearchGroundingQuota } from "../lib/search-grounding-quota";
import { needsSearchGrounding } from "../lib/search-intent-router";
import { parseSearchGroundedSidecarPayload } from "../lib/search-grounding-types";

const webCitationSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  snippet: z.string().nullable().optional(),
});

export const searchWebGroundedEventsTool = createTool({
  id: "search-web-grounded-events",
  description:
    "Fresh web search for time-sensitive events or facts (this weekend, tonight, verify ticket links). Use ONLY when Supabase events are empty or user needs live web verification — NOT for cafés/map pins (use search-grounded-places).",
  inputSchema: z.object({
    query: z.string().min(1),
    sqlEventCount: z
      .number()
      .int()
      .nonnegative()
      .optional()
      .describe("How many events search-events returned this turn"),
  }),
  outputSchema: z.object({
    answer: z.string(),
    citations: z.array(webCitationSchema),
    source: z.literal("web"),
    confidence: z.number(),
    metadata: z.record(z.unknown()).optional(),
  }),
  execute: async (inputData: {
    query: string;
    sqlEventCount?: number;
  }) => {
    const { query, sqlEventCount = 0 } = inputData;

    if (!needsSearchGrounding(query, { sqlEventCount })) {
      return {
        answer: "",
        citations: [],
        source: "web" as const,
        confidence: 0,
        metadata: { reason: "router_skip", route: "maps_or_supabase" },
      };
    }

    const quota = await incrementAndCheckSearchGroundingQuota();
    if (!quota.allowed) {
      return {
        answer: "",
        citations: [],
        source: "web" as const,
        confidence: 0,
        metadata: { reason: quota.reason },
      };
    }

    const raw = await invokeAdkSearchGrounding({ query });
    const parsed = parseSearchGroundedSidecarPayload(raw);

    return {
      answer: parsed.answer ?? "",
      citations: parsed.citations,
      source: "web" as const,
      confidence: parsed.confidence,
      metadata: {
        ...parsed.metadata,
        webSearchQueries: parsed.webSearchQueries,
      },
    };
  },
});
