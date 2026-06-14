import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getHostContext } from "./hostops-read-tools";
import {
  gatherSalesSummaries,
  computeSalesInsights,
  salesInsightsSchema,
} from "@/lib/events/sales-insights-core";

/**
 * SAN-760 · AIE-005 — get_sales_insights tool.
 *
 * Gathers the signed-in host's sales summaries (RLS-scoped, via SAN-762 · AIE-006
 * reads) and runs SAN-759 · AIE-007 — salesInsightWorkflow to produce deterministic
 * insights + a Gemini narration. The numbers are computed in code; the LLM only
 * relays them. The workflow is reached via `context.mastra.getWorkflow(...)` —
 * the injected runtime instance — so there is NO import of the mastra singleton
 * (which would be a circular import: mastra/index → agents → tool → mastra/index).
 */

const outputSchema = salesInsightsSchema.extend({ narrative: z.string() });

/** Minimal shape of the injected runtime we use — avoids the singleton import. */
type ToolMastra = {
  getWorkflow: (id: string) => {
    createRun: () => Promise<{
      start: (args: { inputData: unknown }) => Promise<{
        status: string;
        result?: z.infer<typeof outputSchema>;
      }>;
    }>;
  };
};

export const getSalesInsightsTool = createTool({
  id: "get-sales-insights",
  description:
    "Compute the signed-in host's sales insights (revenue, tickets sold, sell-through, best/weakest event, recommended actions) plus a plain-language summary. All numbers are computed from the database — never estimate. Omit eventId for an all-events overview; pass it to focus one of the host's own events.",
  inputSchema: z.object({
    eventId: z
      .string()
      .uuid()
      .optional()
      .describe("Focus one of the host's own events; omit for all events."),
  }),
  outputSchema,
  execute: async (input: { eventId?: string }, context?: unknown) => {
    const { supabase, userId } = getHostContext(context);
    const summaries = await gatherSalesSummaries(
      supabase,
      userId,
      input.eventId ? { eventId: input.eventId } : undefined,
    );

    // No sales yet — return the empty insight WITHOUT calling the workflow.
    if (summaries.length === 0) {
      return {
        ...computeSalesInsights([]),
        narrative:
          "You don't have any ticketed sales yet. As soon as an event sells tickets, I'll summarize how it's doing.",
      };
    }

    const mastra = (context as { mastra?: ToolMastra } | undefined)?.mastra;
    const workflow = mastra?.getWorkflow("salesInsightWorkflow");
    if (!workflow) {
      throw new Error("Sales insight workflow is unavailable in this runtime.");
    }
    const run = await workflow.createRun();
    const result = await run.start({ inputData: { summaries } });
    if (result.status !== "success" || !result.result) {
      throw new Error(
        `Sales insight workflow did not complete (status: ${result.status}).`,
      );
    }
    return result.result;
  },
});
