"use client";

import { useCallback, useRef } from "react";
import { useConciergeCoAgent } from "@/components/chat/concierge-coagent-context";
import type { EventCard } from "@/mastra/tools/search-events";
import { useEventLocalChat } from "@/components/chat/event-local-chat-context";
import { useEventFastPath } from "@/components/chat/event-fast-path-context";
import { useRestaurantFastPath } from "@/components/chat/restaurant-fast-path-context";
import { useRentalFastPath } from "@/components/chat/rental-fast-path-context";
import { EVENT_CLARIFY_MESSAGE } from "@/lib/event-clarify-copy";
import {
  buildEventSearchParams,
  canFastPathEventSearch,
  eventCardsToPanelRows,
  eventCardsToToolEnvelope,
  eventSearchParamsFromChip,
  fastPathAssistantSummary,
  shouldInstantEventClarify,
  type EventSearchApiParams,
} from "@/lib/event-search-fast-path";
import type { ConciergeWorkingMemory } from "@/lib/types";
import { useEventSearchResults } from "@/components/chat/event-search-results-context";
import { useMapContext } from "@/platform/maps/map-context";
import { normalizeToolOutput } from "@/platform/maps/normalize-tool-output";
import type { FilterChipDef } from "@/platform/copilot/chat-filter-chips";

type EventSearchResponse = {
  results: EventCard[];
  hybridUsed?: boolean;
  rankExplanation?: Array<{ factor: string; score: number; note: string }>;
};

async function fetchEventSearch(
  params: EventSearchApiParams,
): Promise<EventSearchResponse> {
  const res = await fetch("/api/events/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`event search failed: ${res.status}`);
  }
  const data = (await res.json()) as EventSearchResponse;
  return { ...data, results: data.results ?? [] };
}

export function useEventSearchFastPath() {
  const { state, setState } = useConciergeCoAgent();
  const { clarifyPending, showClarify, showExchange, clearLocalMessages } =
    useEventLocalChat();
  const { setToolResult } = useEventFastPath();
  const { setToolResult: setRestaurantToolResult } = useRestaurantFastPath();
  const { setToolResult: setRentalToolResult, setSearchMeta: setRentalSearchMeta } =
    useRentalFastPath();
  const { setRows, setWebCitations } = useEventSearchResults();
  const { mergePinsByCategory, requestFitBounds } = useMapContext();
  const busyRef = useRef(false);

  const applySearchResults = useCallback(
    (
      cards: EventCard[],
      query: ConciergeWorkingMemory["lastEventQuery"],
      memory: ConciergeWorkingMemory,
      meta?: {
        hybridUsed?: boolean;
        rankExplanation?: Array<{ factor: string; score: number; note: string }>;
      },
    ) => {
      setRentalToolResult(null);
      setRentalSearchMeta(null);
      mergePinsByCategory("rental", []);
      const envelope = eventCardsToToolEnvelope(cards, meta);
      setToolResult(envelope);
      setWebCitations([]);
      setRows(
        cards.map((e) => ({
          id: e.id,
          title: e.title,
          venue: e.venue,
          neighborhood: e.neighborhood,
          startsAt: e.startsAt,
          pricePerTicket: e.pricePerTicket,
          imageUrl: e.imageUrl,
          sourceUrl: e.sourceUrl ?? e.mapsUrl ?? undefined,
        })),
      );
      const { pins } = normalizeToolOutput("event", envelope);
      if (pins.length > 0) {
        mergePinsByCategory("event", pins);
        if (pins.length >= 2) requestFitBounds();
      }
      setState({
        ...memory,
        lastIntent: "event_discovery",
        lastEventQuery: query,
        lastEventResults: eventCardsToPanelRows(cards),
      });
    },
    [mergePinsByCategory, requestFitBounds, setRows, setToolResult, setWebCitations, setState, setRentalToolResult, setRentalSearchMeta],
  );

  const runSearch = useCallback(
    async (
      userText: string,
      params: EventSearchApiParams,
      memory: ConciergeWorkingMemory,
    ): Promise<boolean> => {
      if (busyRef.current) return true;
      busyRef.current = true;
      try {
        setRestaurantToolResult(null);
        let { results: cards, hybridUsed, rankExplanation } =
          await fetchEventSearch(params);
        let usedFallback = false;
        if (
          cards.length === 0 &&
          params.dateWindow &&
          params.dateWindow !== "any"
        ) {
          const fallback = await fetchEventSearch({ ...params, dateWindow: "any" });
          cards = fallback.results;
          hybridUsed = fallback.hybridUsed;
          rankExplanation = fallback.rankExplanation;
          usedFallback = cards.length > 0;
        }
        const query: ConciergeWorkingMemory["lastEventQuery"] = {
          category: params.category,
          neighborhood: params.neighborhood,
          dateWindow: usedFallback ? "any" : (params.dateWindow ?? "any"),
          genericAskPending: false,
        };
        applySearchResults(cards, query, memory, { hybridUsed, rankExplanation });
        const summary = usedFallback
          ? `Nothing for ${params.dateWindow?.replace("_", " ")} — showing ${cards.length} upcoming event${cards.length === 1 ? "" : "s"} instead.`
          : fastPathAssistantSummary(cards.length);
        showExchange(userText, summary);
        return true;
      } catch (err) {
        console.error("[event-fast-path]", err);
        setToolResult(null);
        return false;
      } finally {
        busyRef.current = false;
      }
    },
    [applySearchResults, showExchange, setToolResult, setRestaurantToolResult],
  );

  const handleUserMessage = useCallback(
    async (text: string): Promise<boolean> => {
      const trimmed = text.trim();
      if (!trimmed) return false;

      const memory: ConciergeWorkingMemory = {
        ...(state ?? {}),
        lastEventQuery: clarifyPending
          ? {
              ...(state?.lastEventQuery ?? {}),
              genericAskPending: true,
            }
          : state?.lastEventQuery,
      };

      if (shouldInstantEventClarify(trimmed, memory)) {
        if (busyRef.current) return true;
        busyRef.current = true;
        try {
          setToolResult(null);
        setRestaurantToolResult(null);
        showClarify(trimmed, EVENT_CLARIFY_MESSAGE, "event");
          return true;
        } finally {
          busyRef.current = false;
        }
      }

      if (!canFastPathEventSearch(trimmed, memory)) return false;

      const params = buildEventSearchParams(trimmed, memory);
      if (!params) return false;

      clearLocalMessages();
      return runSearch(trimmed, params, memory);
    },
    [clarifyPending, clearLocalMessages, runSearch, setToolResult, setRestaurantToolResult, showClarify, state],
  );

  const handleEventChip = useCallback(
    async (
      chip: FilterChipDef,
      prompt: string,
      memoryOverride?: ConciergeWorkingMemory,
    ): Promise<boolean> => {
      const params = eventSearchParamsFromChip(chip);
      const memory = memoryOverride ?? { ...(state ?? {}) };
      return runSearch(prompt, params, memory);
    },
    [runSearch, state],
  );

  return { handleUserMessage, handleEventChip };
}
