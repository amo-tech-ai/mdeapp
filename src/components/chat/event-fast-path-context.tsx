"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type EventFastPathContextValue = {
  toolResult: unknown | null;
  setToolResult: (result: unknown | null) => void;
};

const EventFastPathContext = createContext<EventFastPathContextValue | null>(
  null,
);

export function EventFastPathProvider({ children }: { children: ReactNode }) {
  const [toolResult, setToolResultState] = useState<unknown | null>(null);

  const setToolResult = useCallback((result: unknown | null) => {
    setToolResultState(result);
  }, []);

  const value = useMemo(
    () => ({ toolResult, setToolResult }),
    [toolResult, setToolResult],
  );

  return (
    <EventFastPathContext.Provider value={value}>
      {children}
    </EventFastPathContext.Provider>
  );
}

export function useEventFastPath() {
  const ctx = useContext(EventFastPathContext);
  if (!ctx) {
    throw new Error(
      "useEventFastPath must be used within EventFastPathProvider",
    );
  }
  return ctx;
}
