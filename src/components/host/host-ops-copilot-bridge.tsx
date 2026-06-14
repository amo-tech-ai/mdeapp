"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
import {
  parseInsightResult,
  parseEventsResult,
  applyAgentState,
  toolRenderSignature,
} from "@/lib/events/host-dashboard-result";
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
 * LLM-generated text. Parsing + state-safety live in pure, unit-tested helpers
 * (`host-dashboard-result.ts`); the agent path can ONLY set `focusedEventId`.
 *
 * RENDER-LOOP NOTE: CopilotKit re-invokes a `render` (and REMOUNTS its component)
 * on every parent render, handing a NEW `result` object ref each time. So dedup
 * must live in the PARENT (a ref that survives child remounts) — a child-local ref
 * resets on remount and the apply→setState→re-render→apply loop returns
 * ("Maximum update depth exceeded"). We apply once per distinct (status, result).
 */

type ToolRenderProps = { status: string; result: unknown };
type SyncFn = (status: string, result: unknown) => void;

function isLoading(status: string): boolean {
  return status === "inProgress" || status === "executing";
}

/** Thin child: fires the parent's stable sync callback once per render. Holds NO state. */
function ToolResultSync({
  status,
  result,
  onSync,
  ack,
}: ToolRenderProps & { onSync: SyncFn; ack?: boolean }) {
  useEffect(() => {
    onSync(status, result);
  }, [status, result, onSync]);
  if (!ack) return null;
  return (
    <span data-testid="host-insight-tool-ack" className="text-xs text-muted-foreground">
      {status === "complete" ? "Sales loaded ✓" : "Loading your sales…"}
    </span>
  );
}

type HostOpsCopilotBridgeProps = {
  children: (args: { state: HostDashboardState }) => ReactNode;
};

export function HostOpsCopilotBridge({ children }: HostOpsCopilotBridgeProps) {
  const [state, setState] = useState<HostDashboardState>(EMPTY_HOST_DASHBOARD);

  // Parent-level dedup refs — survive the child remount CopilotKit triggers each render.
  const insightSig = useRef<string>("");
  const eventsSig = useRef<string>("");

  const apply = useCallback((patch: Partial<HostDashboardState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const syncInsight = useCallback<SyncFn>(
    (status, result) => {
      const sig = toolRenderSignature(status, result);
      if (sig === insightSig.current) return; // already applied this exact result
      insightSig.current = sig;
      if (isLoading(status)) {
        apply({ workflowStatus: "loading" });
        return;
      }
      if (status !== "complete") return;
      const parsed = parseInsightResult(result);
      if (!parsed.ok) {
        apply({ workflowStatus: "error" });
        return;
      }
      apply({ ...parsed.patch, lastUpdatedIso: new Date().toISOString() });
    },
    [apply],
  );

  const syncEvents = useCallback<SyncFn>(
    (status, result) => {
      const sig = toolRenderSignature(status, result);
      if (sig === eventsSig.current) return;
      eventsSig.current = sig;
      if (status !== "complete") return;
      const parsed = parseEventsResult(result);
      if (parsed.ok) apply({ events: parsed.events });
    },
    [apply],
  );

  // Shared state with hostOpsAgent. The agent path is CLOBBER-PROOF: applyAgentState
  // only lets the LLM change `focusedEventId` — never the numeric/render fields.
  useCoAgent<HostDashboardState>({
    name: "hostOpsAgent",
    state,
    setState: (next) =>
      setState((prev) =>
        applyAgentState(prev, typeof next === "function" ? (next(prev) ?? {}) : (next ?? {})),
      ),
  });

  // Generative-UI mirrors of the backend tools. name must match the Mastra
  // `tools: {}` KEY (getSalesInsightsTool), with the createTool id as a fallback.
  const insightRender = useCallback(
    (props: ToolRenderProps) => <ToolResultSync {...props} onSync={syncInsight} ack />,
    [syncInsight],
  );
  const eventsRender = useCallback(
    (props: ToolRenderProps) => <ToolResultSync {...props} onSync={syncEvents} />,
    [syncEvents],
  );

  useCopilotAction({ name: "getSalesInsightsTool", available: "disabled", render: insightRender }, [insightRender]);
  useCopilotAction({ name: "get-sales-insights", available: "disabled", render: insightRender }, [insightRender]);
  useCopilotAction({ name: "listHostEventsTool", available: "disabled", render: eventsRender }, [eventsRender]);
  useCopilotAction({ name: "list-host-events", available: "disabled", render: eventsRender }, [eventsRender]);

  return <>{children({ state })}</>;
}
