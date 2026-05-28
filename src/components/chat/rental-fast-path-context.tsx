"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { RentalSearchApiParams } from "@/lib/rental-query-parser";

export type RentalSearchMeta = {
  userText: string;
  params: RentalSearchApiParams;
};

type RentalFastPathContextValue = {
  toolResult: unknown | null;
  setToolResult: (result: unknown | null) => void;
  searchMeta: RentalSearchMeta | null;
  setSearchMeta: (meta: RentalSearchMeta | null) => void;
};

const RentalFastPathContext = createContext<RentalFastPathContextValue | null>(
  null,
);

export function RentalFastPathProvider({ children }: { children: ReactNode }) {
  const [toolResult, setToolResultState] = useState<unknown | null>(null);
  const [searchMeta, setSearchMetaState] = useState<RentalSearchMeta | null>(
    null,
  );

  const setToolResult = useCallback((result: unknown | null) => {
    setToolResultState(result);
    if (result == null) setSearchMetaState(null);
  }, []);

  const setSearchMeta = useCallback((meta: RentalSearchMeta | null) => {
    setSearchMetaState(meta);
  }, []);

  const value = useMemo(
    () => ({ toolResult, setToolResult, searchMeta, setSearchMeta }),
    [toolResult, setToolResult, searchMeta, setSearchMeta],
  );

  return (
    <RentalFastPathContext.Provider value={value}>
      {children}
    </RentalFastPathContext.Provider>
  );
}

export function useRentalFastPath() {
  const ctx = useContext(RentalFastPathContext);
  if (!ctx) {
    throw new Error("useRentalFastPath must be used within RentalFastPathProvider");
  }
  return ctx;
}
