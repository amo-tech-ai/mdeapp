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

export type EventWebCitationRow = {
  title: string;
  url: string;
  snippet?: string | null;
};

type EventSearchResultsContextValue = {
  rows: EventSearchResultRow[];
  setRows: (rows: EventSearchResultRow[]) => void;
  clearRows: () => void;
  webCitations: EventWebCitationRow[];
  setWebCitations: (citations: EventWebCitationRow[]) => void;
  clearWebCitations: () => void;
};

const EventSearchResultsContext =
  createContext<EventSearchResultsContextValue | null>(null);

function filterHttpCitations(
  citations: Array<{ title?: string; url?: string; snippet?: string | null }>,
): EventWebCitationRow[] {
  return citations.filter(
    (c): c is EventWebCitationRow =>
      typeof c.url === "string" &&
      c.url.startsWith("http") &&
      typeof c.title === "string",
  );
}

export function EventSearchResultsProvider({ children }: { children: ReactNode }) {
  const [rows, setRowsState] = useState<EventSearchResultRow[]>([]);
  const [webCitations, setWebCitationsState] = useState<EventWebCitationRow[]>([]);

  const setRows = useCallback((next: EventSearchResultRow[]) => {
    setRowsState(next);
  }, []);

  const setWebCitations = useCallback((next: EventWebCitationRow[]) => {
    setWebCitationsState(filterHttpCitations(next));
  }, []);

  const clearRows = useCallback(() => setRowsState([]), []);
  const clearWebCitations = useCallback(() => setWebCitationsState([]), []);

  const value = useMemo(
    () => ({
      rows,
      setRows,
      clearRows,
      webCitations,
      setWebCitations,
      clearWebCitations,
    }),
    [rows, setRows, clearRows, webCitations, setWebCitations, clearWebCitations],
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
    throw new Error(
      "useEventSearchResults must be used within EventSearchResultsProvider",
    );
  }
  return ctx;
}
