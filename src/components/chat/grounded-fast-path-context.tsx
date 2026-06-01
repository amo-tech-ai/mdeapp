"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type GroundedFastPathContextValue = {
  toolResult: unknown | null;
  setToolResult: (result: unknown | null) => void;
};

const GroundedFastPathContext =
  createContext<GroundedFastPathContextValue | null>(null);

export function GroundedFastPathProvider({ children }: { children: ReactNode }) {
  const [toolResult, setToolResultState] = useState<unknown | null>(null);

  const setToolResult = useCallback((result: unknown | null) => {
    setToolResultState(result);
  }, []);

  const value = useMemo(
    () => ({ toolResult, setToolResult }),
    [toolResult, setToolResult],
  );

  return (
    <GroundedFastPathContext.Provider value={value}>
      {children}
    </GroundedFastPathContext.Provider>
  );
}

export function useGroundedFastPath() {
  const ctx = useContext(GroundedFastPathContext);
  if (!ctx) {
    throw new Error(
      "useGroundedFastPath must be used within GroundedFastPathProvider",
    );
  }
  return ctx;
}
