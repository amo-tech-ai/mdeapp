"use client";

import { useCallback, useRef } from "react";
import { useConciergeCoAgent } from "@/components/chat/concierge-coagent-context";
import type { Rental } from "@/mastra/tools/search-rentals";
import { useEventLocalChat } from "@/components/chat/event-local-chat-context";
import { useRentalFastPath } from "@/components/chat/rental-fast-path-context";
import { useEventFastPath } from "@/components/chat/event-fast-path-context";
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
import { logRoutingDecision } from "@/lib/intelligence-telemetry";
import { scoreRentalQuery } from "@/lib/rental-query-parser";
import type { ConciergeWorkingMemory } from "@/lib/types";
import { useMapContext } from "@/platform/maps/map-context";
import { normalizeToolOutput } from "@/platform/maps/normalize-tool-output";

import type { RentalQuerySignals } from "@/lib/rental-query-parser";

function buildRentalSlots(
  s: RentalQuerySignals,
): Record<string, string | number | boolean> {
  const slots: Record<string, string | number | boolean> = {};
  if (s.neighborhood) slots.neighborhood = s.neighborhood;
  if (s.maxPricePerNight != null) slots.maxPricePerNight = s.maxPricePerNight;
  if (s.minBedrooms != null) slots.bedrooms = s.minBedrooms;
  if (s.budgetType) slots.budgetType = s.budgetType;
  if (s.cityWide) slots.cityWide = true;
  if (s.dateRangeLabel) slots.dateRange = s.dateRangeLabel;
  if (s.hasBudget) slots.hasBudget = true;
  if (s.hasBedrooms) slots.hasBedrooms = true;
  return slots;
}

type RentalSearchResponse = {
  results: Rental[];
  hybridUsed?: boolean;
  rankExplanation?: Array<{ factor: string; score: number; note: string }>;
};

async function fetchRentalSearch(
  params: RentalSearchApiParams,
): Promise<RentalSearchResponse> {
  const res = await fetch("/api/rentals/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`rental search failed: ${res.status}`);
  }
  return (await res.json()) as RentalSearchResponse;
}

export function useRentalSearchFastPath() {
  const { state, setState } = useConciergeCoAgent();
  const { clarifyPending, clarifyKind, showClarify, showExchange, clearLocalMessages } =
    useEventLocalChat();
  const { setToolResult, setSearchMeta } = useRentalFastPath();
  const { setToolResult: setEventToolResult } = useEventFastPath();
  const { mergePinsByCategory, requestFitBounds } = useMapContext();
  const busyRef = useRef(false);

  const applySearchResults = useCallback(
    (
      cards: Rental[],
      query: ConciergeWorkingMemory["lastRentalQuery"],
      memory: ConciergeWorkingMemory,
      meta?: { hybridUsed?: boolean; rankExplanation?: Array<{ factor: string; score: number; note: string }> },
    ) => {
      setEventToolResult(null);
      mergePinsByCategory("event", []);
      const envelope = rentalsToToolEnvelope(cards, meta);
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
    [mergePinsByCategory, requestFitBounds, setState, setToolResult, setEventToolResult],
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
        const { results: cards, hybridUsed, rankExplanation } = await fetchRentalSearch(params);
        const query: ConciergeWorkingMemory["lastRentalQuery"] = {
          neighborhood: params.neighborhood,
          minBedrooms: params.minBedrooms,
          maxPricePerNight: params.maxPricePerNight,
          genericAskPending: false,
          checkIn: params.checkIn,
          checkOut: params.checkOut,
        };
        const sig = scoreRentalQuery(userText);
        logRoutingDecision({
          intent: "rental_search",
          slots: buildRentalSlots(sig),
          confidence: sig.confidence,
          action: "search_now",
          source: "fast-path",
          resultCount: cards.length,
          ts: new Date().toISOString(),
        });
        setSearchMeta({ userText, params });
        applySearchResults(cards, query, memory, { hybridUsed, rankExplanation });
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
          const sig = scoreRentalQuery(trimmed);
          logRoutingDecision({
            intent: "rental_search",
            slots: buildRentalSlots(sig),
            confidence: sig.confidence,
            action: "clarify",
            source: "clarify-branch",
            ts: new Date().toISOString(),
          });
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
