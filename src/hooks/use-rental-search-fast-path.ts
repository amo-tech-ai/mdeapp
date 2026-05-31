"use client";

import { useCallback, useRef } from "react";
import { useCoAgent } from "@copilotkit/react-core";
import type { Rental } from "@/mastra/tools/search-rentals";
import { useEventLocalChat } from "@/components/chat/event-local-chat-context";
import { useRentalFastPath } from "@/components/chat/rental-fast-path-context";
import { RENTAL_CLARIFY_MESSAGE } from "@/lib/rental-clarify-copy";
import {
  buildRentalSearchParams,
  canFastPathRentalSearch,
  fastPathRentalSummary,
  rentalsToPanelRows,
  rentalsToToolEnvelope,
  shouldInstantRentalClarify,
  type RentalSearchApiParams,
} from "@/lib/rental-search-fast-path";
import type { ConciergeWorkingMemory } from "@/lib/types";
import { useMapContext } from "@/platform/maps/map-context";
import { normalizeToolOutput } from "@/platform/maps/normalize-tool-output";

async function fetchRentalSearch(
  params: RentalSearchApiParams,
): Promise<Rental[]> {
  const res = await fetch("/api/rentals/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`rental search failed: ${res.status}`);
  }
  const data = (await res.json()) as { results: Rental[] };
  return data.results ?? [];
}

export function useRentalSearchFastPath() {
  const { state, setState } = useCoAgent<ConciergeWorkingMemory>({
    name: "conciergeAgent",
  });
  const { clarifyPending, clarifyKind, showClarify, showExchange, clearLocalMessages } =
    useEventLocalChat();
  const { setToolResult, setSearchMeta } = useRentalFastPath();
  const { mergePinsByCategory, requestFitBounds } = useMapContext();
  const busyRef = useRef(false);

  const applySearchResults = useCallback(
    (
      cards: Rental[],
      query: ConciergeWorkingMemory["lastRentalQuery"],
      memory: ConciergeWorkingMemory,
    ) => {
      const envelope = rentalsToToolEnvelope(cards);
      setToolResult(envelope);
      const { pins } = normalizeToolOutput("rental", envelope);
      mergePinsByCategory("rental", pins);
      if (pins.length >= 2) requestFitBounds();
      setState({
        ...memory,
        lastIntent: "rental_search",
        lastRentalQuery: { ...query, genericAskPending: false },
        lastRentalResults: rentalsToPanelRows(cards),
      });
    },
    [mergePinsByCategory, requestFitBounds, setState, setToolResult],
  );

  const runSearch = useCallback(
    async (
      userText: string,
      params: RentalSearchApiParams,
      memory: ConciergeWorkingMemory,
    ): Promise<boolean> => {
      if (busyRef.current) return true;
      busyRef.current = true;
      try {
        const cards = await fetchRentalSearch(params);
        const query: ConciergeWorkingMemory["lastRentalQuery"] = {
          neighborhood: params.neighborhood,
          minBedrooms: params.minBedrooms,
          maxPricePerNight: params.maxPricePerNight,
          genericAskPending: false,
        };
        setSearchMeta({ userText, params });
        applySearchResults(cards, query, memory);
        showExchange(userText, fastPathRentalSummary(cards.length));
        return true;
      } catch (err) {
        console.error("[rental-fast-path]", err);
        setToolResult(null);
        return false;
      } finally {
        busyRef.current = false;
      }
    },
    [applySearchResults, showExchange, setSearchMeta, setToolResult],
  );

  const handleUserMessage = useCallback(
    async (text: string): Promise<boolean> => {
      const trimmed = text.trim();
      if (!trimmed) return false;

      if (clarifyPending && clarifyKind === "event") return false;

      const memory: ConciergeWorkingMemory = {
        ...(state ?? {}),
        lastRentalQuery:
          clarifyPending && clarifyKind === "rental"
            ? {
                ...(state?.lastRentalQuery ?? {}),
                genericAskPending: true,
              }
            : state?.lastRentalQuery,
      };

      if (shouldInstantRentalClarify(trimmed, memory)) {
        if (busyRef.current) return true;
        busyRef.current = true;
        try {
          setToolResult(null);
          setSearchMeta(null);
          showClarify(trimmed, RENTAL_CLARIFY_MESSAGE, "rental");
          setState({
            ...memory,
            lastIntent: "rental_search",
            lastRentalQuery: { genericAskPending: true },
          });
          return true;
        } finally {
          busyRef.current = false;
        }
      }

      if (!canFastPathRentalSearch(trimmed, memory)) return false;

      const params = buildRentalSearchParams(trimmed, memory);
      if (!params) return false;

      clearLocalMessages();
      return runSearch(trimmed, params, memory);
    },
    [
      clarifyKind,
      clarifyPending,
      clearLocalMessages,
      runSearch,
      showClarify,
      setState,
      setSearchMeta,
      setToolResult,
      state,
    ],
  );

  return { handleUserMessage };
}
