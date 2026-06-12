"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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

/**
 * SAN-888 · CK-V2-002 — v2 bridge for /host/analytics (flag on).
 * Copy of host-ops-copilot-bridge.tsx with useRenderTool + useAgent.
 * v1 original is untouched for flag-off rollback.
 */

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

type HostOpsCopilotBridgeV2Props = {
  children: (args: { state: HostDashboardState }) => ReactNode;
};

export function HostOpsCopilotBridgeV2({ children }: HostOpsCopilotBridgeV2Props) {
  const [state, setState] = useState<HostDashboardState>(EMPTY_HOST_DASHBOARD);
  const insightSig = useRef<string>("");
  const eventsSig = useRef<string>("");

  const { agent } = useAgent({
    agentId: "hostOpsAgent",
    updates: [UseAgentUpdate.OnStateChanged],
  });

  const apply = useCallback((patch: Partial<HostDashboardState>) => {
    setState((prev) => ({ ...prev, ...patch }));
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

  // Contract 3 — agent may only clobber focusedEventId (same guard as v1 useCoAgent).
  useEffect(() => {
    const agentState = agent.state;
    if (!agentState || typeof agentState !== "object") return;
    setState((prev) =>
      applyAgentState(prev, agentState as Partial<HostDashboardState>),
    );
  }, [agent.state, agent]);

  // Push dashboard context to the agent without echoing every KPI patch back from
  // OnStateChanged (v1 used useCoAgent's built-in guard; v2 sync is read-biased).
  const lastPushedStateRef = useRef<string>("");
  useEffect(() => {
    const sig = JSON.stringify(state);
    if (sig === lastPushedStateRef.current) return;
    lastPushedStateRef.current = sig;
    agent.setState(state);
  }, [agent, state]);

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

  const salesInsightsParams = z.object({
    eventId: z.string().uuid().optional(),
  });
  const listHostEventsParams = z.object({
    status: z.string().optional(),
    limit: z.number().int().min(1).max(100).optional(),
  });

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
