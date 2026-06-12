import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { generateText } from "ai";
import { FLASH_MODEL } from "../lib/models";
import { salesSummarySchema } from "@/lib/events/hostops-read-core";
import {
  computeSalesInsights,
  buildNarrationPrompt,
  salesInsightsSchema,
} from "@/lib/events/sales-insights-core";

/**
 * SAN-759 · AIE-007 — salesInsightWorkflow.
 * Input: the host's per-event sales summaries (gathered by SAN-760 · AIE-005 via
 * gatherSalesSummaries → the AIE-006 read tools). Steps:
 *   1. compute  — deterministic insights (PURE, all numbers from SQL summaries)
 *   2. narrate  — Gemini restates the numbers (never calculates; numbers injected)
 *
 * Registered in src/mastra/index.ts so it's callable from Studio + (later) the
 * hostOpsAgent's get_sales_insights tool.
 */

const inputSchema = z.object({ summaries: z.array(salesSummarySchema) });
const outputSchema = salesInsightsSchema.extend({ narrative: z.string() });

const computeStep = createStep({
  id: "compute-sales-insights",
  description: "Deterministic sales insights from the host's summaries — numbers only, no LLM.",
  inputSchema,
  outputSchema: salesInsightsSchema,
  execute: async ({ inputData }) => computeSalesInsights(inputData.summaries),
});

const narrateStep = createStep({
  id: "narrate-sales-insights",
  description: "Gemini restates the computed numbers in plain language — it does not calculate.",
  inputSchema: salesInsightsSchema,
  outputSchema,
  execute: async ({ inputData }) => {
    const { text } = await generateText({
      model: FLASH_MODEL,
      prompt: buildNarrationPrompt(inputData),
    });
    return { ...inputData, narrative: text };
  },
});

const salesInsightWorkflow = createWorkflow({
  id: "sales-insight-workflow",
  description: "Turn a host's sales summaries into deterministic insights + a plain-language narration.",
  inputSchema,
  outputSchema,
})
  .then(computeStep)
  .then(narrateStep);

salesInsightWorkflow.commit();

export { salesInsightWorkflow };
