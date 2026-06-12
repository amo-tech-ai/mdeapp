"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAgent, useAgentContext, UseAgentUpdate } from "@copilotkit/react-core/v2";
import {
  EMPTY_EVENT_DRAFT,
  mergeEventDraft,
  type EventDraftState,
} from "@/lib/types";

type HostEventCopilotBridgeV2Props = {
  children: (ctx: {
    draft: EventDraftState;
    setDraft: (patch: Partial<EventDraftState>) => void;
  }) => React.ReactNode;
};

/**
 * SAN-889 · CK-V2-003 — v2 bridge scaffold for hostEventAgent (flag on).
 * B1–B2: useAgent state + useAgentContext. B3–B4 (tools + HITL) follow in same PR.
 */
export function HostEventCopilotBridgeV2({ children }: HostEventCopilotBridgeV2Props) {
  const [draft, setDraftState] = useState<EventDraftState>(EMPTY_EVENT_DRAFT);

  const setDraft = useCallback((patch: Partial<EventDraftState>) => {
    setDraftState((prev) => mergeEventDraft(prev, patch));
  }, []);

  const { agent } = useAgent({
    agentId: "hostEventAgent",
    updates: [UseAgentUpdate.OnStateChanged],
  });

  const agentDraft = agent.state;
  const mergedDraft = useMemo(() => {
    if (!agentDraft || typeof agentDraft !== "object") return draft;
    return mergeEventDraft(draft, agentDraft as Partial<EventDraftState>);
  }, [draft, agentDraft]);

  useAgentContext({
    description: "Roberto's in-progress event draft for the host wizard",
    value: mergedDraft,
  });

  const lastPushedRef = useRef("");
  useEffect(() => {
    const sig = JSON.stringify(draft);
    if (sig === lastPushedRef.current) return;
    lastPushedRef.current = sig;
    agent.setState(draft);
  }, [agent, draft]);

  return <>{children({ draft: mergedDraft, setDraft })}</>;
}
