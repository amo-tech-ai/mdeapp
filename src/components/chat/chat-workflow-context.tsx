"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { WorkflowKind, WorkflowPhase } from "@/platform/copilot/workflow-steps";

type WorkflowSnapshot = {
  kind: WorkflowKind | null;
  phase: WorkflowPhase;
  startedAt: number | null;
};

type ChatWorkflowContextValue = {
  snapshot: WorkflowSnapshot;
  now: number;
  reportToolStatus: (kind: WorkflowKind, status: string) => void;
};

const ChatWorkflowContext = createContext<ChatWorkflowContextValue | null>(null);

const IDLE: WorkflowSnapshot = { kind: null, phase: "idle", startedAt: null };

export function ChatWorkflowProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<WorkflowSnapshot>(IDLE);
  const [now, setNow] = useState(() => Date.now());

  const reportToolStatus = useCallback((kind: WorkflowKind, status: string) => {
    if (status === "failed" || status === "error") {
      setSnapshot({ kind, phase: "error", startedAt: Date.now() });
      window.setTimeout(() => setSnapshot(IDLE), 4000);
      return;
    }
    if (status === "complete") {
      setSnapshot((prev) =>
        prev.kind === kind
          ? { kind, phase: "complete", startedAt: prev.startedAt }
          : prev,
      );
      window.setTimeout(() => setSnapshot(IDLE), 2800);
      return;
    }
    setSnapshot({ kind, phase: "running", startedAt: Date.now() });
  }, []);

  useEffect(() => {
    if (snapshot.phase !== "running") return;
    const id = window.setInterval(() => setNow(Date.now()), 400);
    return () => window.clearInterval(id);
  }, [snapshot.phase, snapshot.kind]);

  const value = useMemo(
    () => ({ snapshot, now, reportToolStatus }),
    [snapshot, now, reportToolStatus],
  );

  return (
    <ChatWorkflowContext.Provider value={value}>
      {children}
    </ChatWorkflowContext.Provider>
  );
}

export function useChatWorkflow() {
  const ctx = useContext(ChatWorkflowContext);
  if (!ctx) {
    throw new Error("useChatWorkflow must be used within ChatWorkflowProvider");
  }
  return ctx;
}
