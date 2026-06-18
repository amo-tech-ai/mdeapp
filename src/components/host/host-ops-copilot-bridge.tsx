"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useAgent, useRenderTool, UseAgentUpdate } from "@copilotkit/react-core/v2";
import { z } from "zod";
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

type ToolRenderProps = { status: string; result: unknown };
type SyncFn = (status: string, result: unknown) => void;

function isLoading(status: string): boolean {
  return status === "inProgress" || status === "executing";
}

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
  /** Server-loaded KPIs (deterministic); agent chat still refreshes narration. */
  initialState?: HostDashboardState;
};

const salesInsightsParams = z.object({
  eventId: z.string().uuid().optional(),
});
const listHostEventsParams = z.object({
  status: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// skipcq: JS-0067 - ES module export; not browser global scope
export function HostOpsCopilotBridge({ // skipcq: JS-0067
  children,
  initialState,
}: HostOpsCopilotBridgeProps) {
  const [dashboardState, setDashboardState] = useState<HostDashboardState>(
    initialState ?? EMPTY_HOST_DASHBOARD,
  );
  const insightSig = useRef<string>("");
  const eventsSig = useRef<string>("");

  const { agent } = useAgent({
    agentId: "hostOpsAgent",
    updates: [UseAgentUpdate.OnStateChanged],
  });

  // Contract 3 — merge agent focusedEventId at render time (no setState-in-effect).
  const agentState = agent.state;
  const state = useMemo(() => {
    if (!agentState || typeof agentState !== "object") return dashboardState;
    return applyAgentState(
      dashboardState,
      agentState as Partial<HostDashboardState>,
    );
  }, [dashboardState, agentState]);

  const apply = useCallback((patch: Partial<HostDashboardState>) => {
    setDashboardState((prev) => ({ ...prev, ...patch }));
  }, []);

  const syncInsight = useCallback<SyncFn>(
    (status, result) => {
      const sig = toolRenderSignature(status, result);
      if (sig === insightSig.current) return;
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

  // Push dashboard context to the agent without echoing focusedEventId merges back.
  const lastPushedStateRef = useRef<string>("");
  const lastAgentRef = useRef(agent);
  useEffect(() => {
    const agentChanged = lastAgentRef.current !== agent;
    if (agentChanged) {
      lastAgentRef.current = agent;
      lastPushedStateRef.current = "";
    }
    const sig = JSON.stringify(dashboardState);
    if (sig === lastPushedStateRef.current) return;
    lastPushedStateRef.current = sig;
    agent.setState(dashboardState);
  }, [agent, dashboardState]);

  const insightRender = useCallback(
    (props: { status: string; result?: string }) => (
      <ToolResultSync
        status={props.status}
        result={props.result}
        onSync={syncInsight}
        ack
      />
    ),
    [syncInsight],
  );

  const eventsRender = useCallback(
    (props: { status: string; result?: string }) => (
      <ToolResultSync status={props.status} result={props.result} onSync={syncEvents} />
    ),
    [syncEvents],
  );

  useRenderTool(
    { name: "getSalesInsightsTool", parameters: salesInsightsParams, render: insightRender },
    [insightRender],
  );
  useRenderTool(
    { name: "get-sales-insights", parameters: salesInsightsParams, render: insightRender },
    [insightRender],
  );
  useRenderTool(
    { name: "listHostEventsTool", parameters: listHostEventsParams, render: eventsRender },
    [eventsRender],
  );
  useRenderTool(
    { name: "list-host-events", parameters: listHostEventsParams, render: eventsRender },
    [eventsRender],
  );

  return <>{children({ state })}</>;
}
