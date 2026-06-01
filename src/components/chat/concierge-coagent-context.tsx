"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { useCoAgent } from "@copilotkit/react-core";
import type { ConciergeWorkingMemory } from "@/lib/types";

type ConciergeCoAgentValue = ReturnType<
  typeof useCoAgent<ConciergeWorkingMemory>
>;

const ConciergeCoAgentContext = createContext<ConciergeCoAgentValue | null>(
  null,
);

/** Single useCoAgent mount for / — avoids N duplicate CopilotKit sync POSTs. */
export function ConciergeCoAgentProvider({ children }: { children: ReactNode }) {
  const value = useCoAgent<ConciergeWorkingMemory>({ name: "conciergeAgent" });
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
