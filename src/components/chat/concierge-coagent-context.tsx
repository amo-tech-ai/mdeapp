"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  useAgent,
  UseAgentUpdate,
  type AbstractAgent,
} from "@copilotkit/react-core/v2";
import type { ConciergeWorkingMemory } from "@/lib/types";

type ConciergeCoAgentValue = {
  agent: AbstractAgent | undefined;
  state: ConciergeWorkingMemory;
  setState: (
    patch:
      | Partial<ConciergeWorkingMemory>
      | ((prev: ConciergeWorkingMemory) => ConciergeWorkingMemory),
  ) => void;
};

const ConciergeCoAgentContext = createContext<ConciergeCoAgentValue | null>(
  null,
);

/** Single useAgent mount for concierge — avoids duplicate CopilotKit sync POSTs. */
export function ConciergeCoAgentProvider({ children }: { children: ReactNode }) {
  const { agent } = useAgent({
    agentId: "conciergeAgent",
    updates: [
      UseAgentUpdate.OnStateChanged,
      UseAgentUpdate.OnRunStatusChanged,
      UseAgentUpdate.OnMessagesChanged,
    ],
  });

  const state = useMemo(
    () => (agent.state ?? {}) as ConciergeWorkingMemory,
    [agent.state],
  );

  const setState = useCallback(
    (
      patch:
        | Partial<ConciergeWorkingMemory>
        | ((prev: ConciergeWorkingMemory) => ConciergeWorkingMemory),
    ) => {
      const current = (agent.state ?? {}) as ConciergeWorkingMemory;
      const next =
        typeof patch === "function" ? patch(current) : { ...current, ...patch };
      agent.setState(next);
    },
    [agent],
  );

  const value = useMemo(
    () => ({ agent, state, setState }),
    [agent, state, setState],
  );

  return (
    <ConciergeCoAgentContext.Provider value={value}>
      {children}
    </ConciergeCoAgentContext.Provider>
  );
}

export function useConciergeCoAgent(): ConciergeCoAgentValue {
  const ctx = useContext(ConciergeCoAgentContext);
  if (!ctx) {
    throw new Error(
      "useConciergeCoAgent must be used within ConciergeCoAgentProvider",
    );
  }
  return ctx;
}
