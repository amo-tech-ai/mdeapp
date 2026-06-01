"use client";

import { useCallback, useRef } from "react";
import { useCoAgent } from "@copilotkit/react-core";
import type { Restaurant } from "@/mastra/tools/search-restaurants";
import { useEventLocalChat } from "@/components/chat/event-local-chat-context";
import { useEventFastPath } from "@/components/chat/event-fast-path-context";
import { useRentalFastPath } from "@/components/chat/rental-fast-path-context";
import { useRestaurantFastPath } from "@/components/chat/restaurant-fast-path-context";
import {
  buildRestaurantSearchParams,
  canFastPathRestaurantSearch,
  fastPathRestaurantSummary,
  restaurantsToToolEnvelope,
  type RestaurantSearchApiParams,
} from "@/lib/restaurant-search-fast-path";
import type { ConciergeWorkingMemory } from "@/lib/types";
import { useMapContext } from "@/platform/maps/map-context";
import { normalizeToolOutput } from "@/platform/maps/normalize-tool-output";

async function fetchRestaurantSearch(
  params: RestaurantSearchApiParams,
): Promise<Restaurant[]> {
  const res = await fetch("/api/restaurants/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error(`restaurant search failed: ${res.status}`);
  }
  const data = (await res.json()) as { results: Restaurant[] };
  return data.results ?? [];
}

export function useRestaurantSearchFastPath() {
  const { state, setState } = useCoAgent<ConciergeWorkingMemory>({
    name: "conciergeAgent",
  });
  const { showExchange, clearLocalMessages } = useEventLocalChat();
  const { setToolResult: setEventToolResult } = useEventFastPath();
  const { setToolResult: setRentalToolResult, setSearchMeta } = useRentalFastPath();
  const { setToolResult } = useRestaurantFastPath();
  const { mergePinsByCategory, requestFitBounds } = useMapContext();
  const busyRef = useRef(false);

  const applySearchResults = useCallback(
    (cards: Restaurant[]) => {
      const envelope = restaurantsToToolEnvelope(cards);
      setToolResult(envelope);
      const { pins } = normalizeToolOutput("restaurant", envelope);
      if (pins.length > 0) {
        mergePinsByCategory("restaurant", pins);
        if (pins.length >= 2) requestFitBounds();
      }
      setState({
        ...(state ?? {}),
        lastIntent: "restaurant_search",
      });
    },
    [mergePinsByCategory, requestFitBounds, setState, setToolResult, state],
  );

  const runSearch = useCallback(
    async (
      userText: string,
      params: RestaurantSearchApiParams,
    ): Promise<boolean> => {
      if (busyRef.current) return true;
      busyRef.current = true;
      try {
        setEventToolResult(null);
        setRentalToolResult(null);
        setSearchMeta(null);
        const cards = await fetchRestaurantSearch(params);
        applySearchResults(cards);
        showExchange(
          userText,
          fastPathRestaurantSummary(cards.length, params.neighborhood),
        );
        return true;
      } catch (err) {
        console.error("[restaurant-fast-path]", err);
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
      setSearchMeta,
      setToolResult,
      showExchange,
    ],
  );

  const handleUserMessage = useCallback(
    async (text: string): Promise<boolean> => {
      const trimmed = text.trim();
      if (!trimmed) return false;
      if (!canFastPathRestaurantSearch(trimmed)) return false;

      const params = buildRestaurantSearchParams(trimmed);
      if (!params) return false;

      clearLocalMessages();
      return runSearch(trimmed, params);
    },
    [clearLocalMessages, runSearch],
  );

  return { handleUserMessage };
}
