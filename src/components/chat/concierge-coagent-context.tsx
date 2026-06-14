"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useAgent, UseAgentUpdate } from "@copilotkit/react-core/v2";
import type { ConciergeWorkingMemory } from "@/lib/types";

type ConciergeCoAgentValue = {
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
    updates: [UseAgentUpdate.OnStateChanged],
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
      const next =
        typeof patch === "function" ? patch(state) : { ...state, ...patch };
      agent.setState(next);
    },
    [agent, state],
  );

  return (
    <ConciergeCoAgentContext.Provider value={{ state, setState }}>
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
