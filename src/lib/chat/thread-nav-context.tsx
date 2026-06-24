"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type ThreadNavContextValue = {
  activeThreadId: string | undefined;
  setActiveThreadId: Dispatch<SetStateAction<string | undefined>>;
  clearActiveThread: () => void;
};

const ThreadNavContext = createContext<ThreadNavContextValue | null>(null);

export function ThreadNavProvider({ children }: { children: ReactNode }) {
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>();

  const clearActiveThread = useCallback(() => {
    setActiveThreadId();
  }, []);

  return (
    <ThreadNavContext.Provider value={{ activeThreadId, setActiveThreadId, clearActiveThread }}>
      {children}
    </ThreadNavContext.Provider>
  );
}

export function useThreadNav() {
  const ctx = useContext(ThreadNavContext);
  if (!ctx) throw new Error("useThreadNav must be used within ThreadNavProvider");
  return ctx;
}
