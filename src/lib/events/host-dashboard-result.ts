import { z } from "zod";
import {
  salesInsightsSchema,
  type SalesInsights,
} from "@/lib/events/sales-insights-core";
import { hostEventSummarySchema } from "@/lib/events/hostops-read-core";
import { toKpiCards } from "@/lib/events/host-dashboard-kpis";
import type { HostDashboardState } from "@/lib/types/host-dashboard";

/**
 * SAN-729 · AIE-008 — pure, testable tool-result parsing + state-safety for the
 * Host Analytics dashboard. Extracted from HostOpsCopilotBridge so every payload
 * shape (object, JSON string, malformed, missing narrative, empty) can be unit-
 * tested without React.
 *
 * GUARDRAIL: the numeric dashboard fields are produced HERE from the deterministic
 * `get_sales_insights` result — never from LLM text. `applyAgentState` makes it
 * IMPOSSIBLE for the agent (LLM) to overwrite them.
 */

// narrative OPTIONAL — if the numbers parse but the Gemini narration is missing,
// still show the KPIs; never discard real numbers over a missing sentence.
const insightWithNarrativeSchema = salesInsightsSchema.extend({
  narrative: z.string().optional(),
});
const listHostEventsResultSchema = z.object({
  events: z.array(hostEventSummarySchema),
});

/** AG-UI tool results can arrive as an object OR a JSON string — coerce to object. */
function coerceObject(result: unknown): unknown {
  if (typeof result === "string") {
    try {
      return JSON.parse(result);
    } catch {
      return undefined; // malformed string → fails the schema below (handled, not thrown)
    }
  }
  return result;
}

/**
 * Stable value-signature for a (status, result) pair. CopilotKit hands the render a
 * NEW `result` object reference every parent render; the bridge effect dedupes on
 * this signature so a re-render with the SAME data is a no-op — preventing the
 * "Maximum update depth exceeded" loop. Same data → same string, regardless of ref.
 */
export function toolRenderSignature(status: string, result: unknown): string {
  let body: string;
  if (typeof result === "string") {
    body = result;
  } else {
    try {
      body = JSON.stringify(result ?? null);
    } catch {
      body = "[unserializable]";
    }
  }
  return `${status}|${body}`;
}

/** The deterministic patch the insight tool produces (no timestamp — the caller stamps it). */
export type InsightPatch = {
  insights: SalesInsights; // always present on ok
  kpiCards: HostDashboardState["kpiCards"];
  recommendations: HostDashboardState["recommendations"];
  lastNarrative: string | undefined;
  workflowStatus: HostDashboardState["workflowStatus"];
};

export type InsightParse = { ok: true; patch: InsightPatch } | { ok: false };

/**
 * Parse a get_sales_insights result into a dashboard patch. Accepts object or JSON
 * string; returns `{ ok: false }` for anything malformed (never throws, never a
 * blank-but-"ready" state). Numbers come straight from the deterministic result.
 */
export function parseInsightResult(result: unknown): InsightParse {
  const parsed = insightWithNarrativeSchema.safeParse(coerceObject(result));
  if (!parsed.success) return { ok: false };
  const { narrative, ...insights } = parsed.data;
  const typed = insights as SalesInsights;
  return {
    ok: true,
    patch: {
      insights: typed,
      kpiCards: toKpiCards(typed),
      recommendations: typed.recommendedActions,
      lastNarrative: narrative,
      workflowStatus: "ready",
    },
  };
}

export type EventsParse =
  | { ok: true; events: HostDashboardState["events"] }
  | { ok: false };

/** Parse a list_host_events result (object or JSON string) into the events list. */
export function parseEventsResult(result: unknown): EventsParse {
  const parsed = listHostEventsResultSchema.safeParse(coerceObject(result));
  return parsed.success ? { ok: true, events: parsed.data.events } : { ok: false };
}

/**
 * Merge an agent-driven state update SAFELY. The agent (LLM) may change ONLY which
 * event is focused — it can NEVER write the numeric/render fields (insights,
 * kpiCards, salesSummaries, recommendations), which come exclusively from
 * deterministic tool results. This makes LLM state-clobber impossible by construction.
 */
export function applyAgentState(
  prev: HostDashboardState,
  next: Partial<HostDashboardState>,
): HostDashboardState {
  if (!next || typeof next !== "object") return prev;
  // whitelist — the ONLY field the agent may set
  if ("focusedEventId" in next) {
    return { ...prev, focusedEventId: next.focusedEventId };
  }
  return prev;
}
