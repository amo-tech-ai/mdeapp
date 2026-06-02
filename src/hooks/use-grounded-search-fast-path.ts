"use client";

import { useCallback, useRef } from "react";
import { useConciergeCoAgent } from "@/components/chat/concierge-coagent-context";
import { useEventLocalChat } from "@/components/chat/event-local-chat-context";
import { useEventFastPath } from "@/components/chat/event-fast-path-context";
import { useRentalFastPath } from "@/components/chat/rental-fast-path-context";
import { useRestaurantFastPath } from "@/components/chat/restaurant-fast-path-context";
import { useGroundedFastPath } from "@/components/chat/grounded-fast-path-context";
import {
  buildCafeSearchParams,
  canFastPathCafeSearch,
  fastPathCafeSummary,
  type CafeSearchApiParams,
} from "@/lib/cafe-search-fast-path";
import { useMapContext } from "@/platform/maps/map-context";
import { normalizeToolOutput } from "@/platform/maps/normalize-tool-output";

async function fetchGroundedSearch(
  params: CafeSearchApiParams,
): Promise<unknown> {
  const res = await fetch("/api/grounded/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`grounded search failed: ${res.status}`);
  }
  return res.json();
}

export function useGroundedSearchFastPath() {
  const { state, setState } = useConciergeCoAgent();
  const { showExchange, clearLocalMessages } = useEventLocalChat();
  const { setToolResult: setEventToolResult } = useEventFastPath();
  const { setToolResult: setRentalToolResult, setSearchMeta } = useRentalFastPath();
  const { setToolResult: setRestaurantToolResult } = useRestaurantFastPath();
  const { setToolResult } = useGroundedFastPath();
  const { mergePinsByCategory, requestFitBounds } = useMapContext();
  const busyRef = useRef(false);

  const applySearchResults = useCallback(
    (envelope: unknown) => {
      setToolResult(envelope);
      const { pins } = normalizeToolOutput("grounded", envelope);
      if (pins.length > 0) {
        mergePinsByCategory("grounded", pins);
        if (pins.length >= 2) requestFitBounds();
      }
      const count =
        envelope &&
        typeof envelope === "object" &&
        Array.isArray((envelope as { results?: unknown[] }).results)
          ? (envelope as { results: unknown[] }).results.length
          : 0;
      setState({
        ...(state ?? {}),
        lastIntent: "cafe_search",
      });
      return count;
    },
    [mergePinsByCategory, requestFitBounds, setState, setToolResult, state],
  );

  const runSearch = useCallback(
    async (
      userText: string,
      params: CafeSearchApiParams,
    ): Promise<boolean> => {
      if (busyRef.current) return true;
      busyRef.current = true;
      try {
        setEventToolResult(null);
        setRentalToolResult(null);
        setSearchMeta(null);
        setRestaurantToolResult(null);
        const envelope = await fetchGroundedSearch(params);
        const count = applySearchResults(envelope);
        showExchange(
          userText,
          fastPathCafeSummary(count, params.neighborhood, userText),
        );
        return true;
      } catch (err) {
        console.error("[grounded-fast-path]", err);
        setToolResult(null);
        return false;
      } finally {
        busyRef.current = false;
      }
    },
    [
      applySearchResults,
      setEventToolResult,
      setRentalToolResult,
      setRestaurantToolResult,
      setSearchMeta,
      setToolResult,
      showExchange,
    ],
  );

  const handleUserMessage = useCallback(
    async (text: string): Promise<boolean> => {
      const trimmed = text.trim();
      if (!trimmed) return false;
      if (!canFastPathCafeSearch(trimmed)) return false;

      const params = buildCafeSearchParams(trimmed);
      if (!params) return false;

      clearLocalMessages();
      return runSearch(trimmed, params);
    },
    [clearLocalMessages, runSearch],
  );

  return { handleUserMessage };
}
