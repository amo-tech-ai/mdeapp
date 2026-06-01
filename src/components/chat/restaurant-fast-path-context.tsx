"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type RestaurantFastPathContextValue = {
  toolResult: unknown | null;
  setToolResult: (result: unknown | null) => void;
};

const RestaurantFastPathContext =
  createContext<RestaurantFastPathContextValue | null>(null);

export function RestaurantFastPathProvider({ children }: { children: ReactNode }) {
  const [toolResult, setToolResultState] = useState<unknown | null>(null);

  const setToolResult = useCallback((result: unknown | null) => {
    setToolResultState(result);
  }, []);

  const value = useMemo(
    () => ({ toolResult, setToolResult }),
    [toolResult, setToolResult],
  );

  return (
    <RestaurantFastPathContext.Provider value={value}>
      {children}
    </RestaurantFastPathContext.Provider>
  );
}

export function useRestaurantFastPath() {
  const ctx = useContext(RestaurantFastPathContext);
  if (!ctx) {
    throw new Error(
      "useRestaurantFastPath must be used within RestaurantFastPathProvider",
    );
  }
  return ctx;
}
