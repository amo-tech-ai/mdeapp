import { z } from "zod";
import {
  hostEventSummarySchema,
  salesSummarySchema,
} from "@/lib/events/hostops-read-core";
import {
  salesInsightsSchema,
  recommendedActionSchema,
} from "@/lib/events/sales-insights-core";

/**
 * SAN-760 · AIE-005 — hostOpsAgent + HostDashboardState.
 *
 * `HostDashboardState` is the **shared-state contract for the AI-native host
 * dashboard** (SAN-729 · AIE-008 — Host Analytics Page + HostOpsCopilotBridge):
 * the `useCoAgent<HostDashboardState>` type whose KPI cards re-render live as the
 * agent answers. It is NOT lightweight agent memory — it is render-ready data.
 *
 * GUARDRAIL (preserves SAN-759 · AIE-007 — salesInsightWorkflow's "AI explains,
 * never calculates"): the numeric fields (`insights`, `kpiCards`, `salesSummaries`)
 * are written ONLY by lifting the deterministic `get_sales_insights` tool RESULT
 * into state in the AIE-008 bridge — never re-typed by the LLM. The agent's own
 * thread working memory is the lean `hostOpsMemorySchema` subset below
 * (`focusedEventId` + narration), so Gemini never maintains numbers in memory.
 * Full plan: docs/events/tasks/AI-native-system/Core/AIE-008-host-analytics-dashboard-plan.md
 */

/** Render-ready KPI tile (money/percent formatted once, in code — not by the LLM). */
export const kpiCardSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
  unit: z.string().optional(),
  intent: z.enum(["neutral", "good", "warn", "urgent"]).default("neutral"),
  hint: z.string().optional(),
});
export type KpiCard = z.infer<typeof kpiCardSchema>;

export const hostDashboardStateSchema = z.object({
  /** Which event is drilled into; undefined = all-events overview. */
  focusedEventId: z.string().uuid().optional(),
  /** The host's own events (from list_host_events). */
  events: z.array(hostEventSummarySchema).default([]),
  /** Per-event raw summaries backing the cards (deterministic, from the DB). */
  salesSummaries: z.array(salesSummarySchema).default([]),
  /** Computed insights (deterministic; from salesInsightWorkflow). */
  insights: salesInsightsSchema.optional(),
  /** Render-ready KPI tiles, derived in code from `insights` (AIE-008). */
  kpiCards: z.array(kpiCardSchema).default([]),
  /** Severity-ranked recommended actions (from `insights.recommendedActions`). */
  recommendations: z.array(recommendedActionSchema).default([]),
  /** Drives skeletons / error states on the dashboard. */
  workflowStatus: z.enum(["idle", "loading", "ready", "error"]).default("idle"),
  /** The plain-language narration from the last insight run. */
  lastNarrative: z.string().optional(),
  /** ISO timestamp of the last insight refresh ("updated 2m ago"). */
  lastUpdatedIso: z.string().optional(),
});
export type HostDashboardState = z.infer<typeof hostDashboardStateSchema>;

export const EMPTY_HOST_DASHBOARD: HostDashboardState =
  hostDashboardStateSchema.parse({});

/**
 * Lean thread working-memory schema for `hostOpsAgent` — a `.pick()` of the
 * contract so the two can never drift. Only the continuity bits the LLM may
 * legitimately set; numeric fields stay OUT of working memory (guardrail).
 */
export const hostOpsMemorySchema = hostDashboardStateSchema.pick({
  focusedEventId: true,
  lastNarrative: true,
  lastUpdatedIso: true,
});
export type HostOpsMemory = z.infer<typeof hostOpsMemorySchema>;
