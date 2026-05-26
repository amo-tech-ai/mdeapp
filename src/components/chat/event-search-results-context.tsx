"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** Fields needed for EventCard — synced from search-events tool render. */
export type EventSearchResultRow = {
  id: string;
  title: string;
  venue: string;
  neighborhood: string;
  startsAt: string;
  pricePerTicket: number;
  imageUrl?: string;
  sourceUrl?: string;
};

type EventSearchResultsContextValue = {
  rows: EventSearchResultRow[];
  setRows: (rows: EventSearchResultRow[]) => void;
  clearRows: () => void;
};

const EventSearchResultsContext =
  createContext<EventSearchResultsContextValue | null>(null);

export function EventSearchResultsProvider({ children }: { children: ReactNode }) {
  const [rows, setRowsState] = useState<EventSearchResultRow[]>([]);
  const setRows = useCallback((next: EventSearchResultRow[]) => {
    setRowsState(next);
  }, []);
  const clearRows = useCallback(() => setRowsState([]), []);
  const value = useMemo(
    () => ({ rows, setRows, clearRows }),
    [rows, setRows, clearRows],
  );
  return (
    <EventSearchResultsContext.Provider value={value}>
      {children}
    </EventSearchResultsContext.Provider>
  );
}

export function useEventSearchResults() {
  const ctx = useContext(EventSearchResultsContext);
  if (!ctx) {
    throw new Error("useEventSearchResults must be used within EventSearchResultsProvider");
  }
  return ctx;
}
