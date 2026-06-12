"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
import { z } from "zod";
import {
  salesInsightsSchema,
  type SalesInsights,
} from "@/lib/events/sales-insights-core";
import { hostEventSummarySchema } from "@/lib/events/hostops-read-core";
import { toKpiCards } from "@/lib/events/host-dashboard-kpis";
import {
  EMPTY_HOST_DASHBOARD,
  type HostDashboardState,
} from "@/lib/types/host-dashboard";

/**
 * SAN-729 · AIE-008 — HostOpsCopilotBridge.
 *
 * Owns `HostDashboardState` and keeps it in sync with `hostOpsAgent` via
 * `useCoAgent`. The KPI canvas re-renders live as the agent answers — the
 * AI-native dashboard mechanic.
 *
 * GUARDRAIL: numeric fields are lifted from the DETERMINISTIC tool `result`
 * (`get_sales_insights` → SAN-759 · AIE-007 — salesInsightWorkflow), never from
 * LLM-generated text. The agent (LLM) only sets `focusedEventId` / narration.
 */

const insightWithNarrativeSchema = salesInsightsSchema.extend({
  narrative: z.string(),
});
const listHostEventsResultSchema = z.object({
  events: z.array(hostEventSummarySchema),
});

type ToolRenderProps = { status: string; result: unknown };

function isLoading(status: string): boolean {
  return status === "inProgress" || status === "executing";
}

/** Lifts a completed get_sales_insights result into dashboard state (via effect — never setState in render). */
function InsightResultSync({
  status,
  result,
  apply,
}: ToolRenderProps & { apply: (patch: Partial<HostDashboardState>) => void }) {
  useEffect(() => {
    if (isLoading(status)) {
      apply({ workflowStatus: "loading" });
      return;
    }
    if (status !== "complete") return;
    const parsed = insightWithNarrativeSchema.safeParse(result);
    if (!parsed.success) {
      apply({ workflowStatus: "error" });
      return;
    }
    const { narrative, ...insights } = parsed.data;
    apply({
      insights: insights as SalesInsights,
      kpiCards: toKpiCards(insights as SalesInsights),
      recommendations: insights.recommendedActions,
      lastNarrative: narrative,
      workflowStatus: "ready",
      lastUpdatedIso: new Date().toISOString(),
    });
  }, [status, result, apply]);
  return (
    <span data-testid="host-insight-tool-ack" className="text-xs text-muted-foreground">
      {status === "complete" ? "Sales loaded ✓" : "Loading your sales…"}
    </span>
  );
}

/** Lifts the host's event list into state (for context / the event count). */
function EventsResultSync({
  status,
  result,
  apply,
}: ToolRenderProps & { apply: (patch: Partial<HostDashboardState>) => void }) {
  useEffect(() => {
    if (status !== "complete") return;
    const parsed = listHostEventsResultSchema.safeParse(result);
    if (parsed.success) apply({ events: parsed.data.events });
  }, [status, result, apply]);
  return null;
}

type HostOpsCopilotBridgeProps = {
  children: (args: { state: HostDashboardState }) => ReactNode;
};

export function HostOpsCopilotBridge({ children }: HostOpsCopilotBridgeProps) {
  const [state, setState] = useState<HostDashboardState>(EMPTY_HOST_DASHBOARD);

  const apply = useCallback((patch: Partial<HostDashboardState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  // Shared state with hostOpsAgent — the agent may set lean fields (focus/narration).
  useCoAgent<HostDashboardState>({
    name: "hostOpsAgent",
    state,
    setState: (next) =>
      setState((prev) =>
        typeof next === "function" ? { ...prev, ...(next(prev) ?? {}) } : { ...prev, ...next },
      ),
  });

  // Generative-UI mirrors of the backend tools. name must match the Mastra
  // `tools: {}` KEY (getSalesInsightsTool), with the createTool id as a fallback.
  const insightRender = useCallback(
    (props: ToolRenderProps) => <InsightResultSync {...props} apply={apply} />,
    [apply],
  );
  const eventsRender = useCallback(
    (props: ToolRenderProps) => <EventsResultSync {...props} apply={apply} />,
    [apply],
  );

  useCopilotAction({ name: "getSalesInsightsTool", available: "disabled", render: insightRender }, [insightRender]);
  useCopilotAction({ name: "get-sales-insights", available: "disabled", render: insightRender }, [insightRender]);
  useCopilotAction({ name: "listHostEventsTool", available: "disabled", render: eventsRender }, [eventsRender]);
  useCopilotAction({ name: "list-host-events", available: "disabled", render: eventsRender }, [eventsRender]);

  return <>{children({ state })}</>;
}
