"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useEffect } from "react";
import type { MapPinCategory } from "@/platform/contracts";
import {
  shouldSuppressGenericMapResults,
  type RichCardCounts,
} from "@/platform/copilot/rich-card-results";

type RichCardResultsContextValue = {
  counts: RichCardCounts;
  setRichCardCount: (category: MapPinCategory, count: number) => void;
  hasRichCards: (category: MapPinCategory | null) => boolean;
  shouldSuppressGenericMapResults: (activeMapCategory: MapPinCategory | null) => boolean;
};

const RichCardResultsContext = createContext<RichCardResultsContextValue | null>(
  null,
);

export function RichCardResultsProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<RichCardCounts>({});

  const setRichCardCount = useCallback(
    (category: MapPinCategory, count: number) => {
      setCounts((prev) => {
        if (count <= 0) {
          if (prev[category] == null) return prev;
          const next = { ...prev };
          delete next[category];
          return next;
        }
        if (prev[category] === count) return prev;
        return { ...prev, [category]: count };
      });
    },
    [],
  );

  const hasRichCards = useCallback(
    (category: MapPinCategory | null) => {
      if (!category) return false;
      return (counts[category] ?? 0) > 0;
    },
    [counts],
  );

  const suppressGenericMapResults = useCallback(
    (activeMapCategory: MapPinCategory | null) =>
      shouldSuppressGenericMapResults(counts, activeMapCategory),
    [counts],
  );

  const value = useMemo(
    () => ({
      counts,
      setRichCardCount,
      hasRichCards,
      shouldSuppressGenericMapResults: suppressGenericMapResults,
    }),
    [counts, setRichCardCount, hasRichCards, suppressGenericMapResults],
  );

  return (
    <RichCardResultsContext.Provider value={value}>
      {children}
    </RichCardResultsContext.Provider>
  );
}

export function useRichCardResults() {
  const ctx = useContext(RichCardResultsContext);
  if (!ctx) {
    throw new Error(
      "useRichCardResults must be used within RichCardResultsProvider",
    );
  }
  return ctx;
}

/** Tool render components register card counts so generic lists stay suppressed. */
export function useRegisterRichCardResults(
  category: MapPinCategory,
  count: number,
) {
  const { setRichCardCount } = useRichCardResults();
  useEffect(() => {
    setRichCardCount(category, count);
    return () => setRichCardCount(category, 0);
  }, [category, count, setRichCardCount]);
}

export function RichCardResultsRegistrar({
  category,
  count,
}: {
  category: MapPinCategory;
  count: number;
}) {
  useRegisterRichCardResults(category, count);
  return null;
}
