"use client";

import { useCallback, useRef } from "react";
import { useConciergeCoAgent } from "@/components/chat/concierge-coagent-context";
import type { Restaurant } from "@/mastra/tools/search-restaurants";
import { useEventLocalChat } from "@/components/chat/event-local-chat-context";
import { useEventFastPath } from "@/components/chat/event-fast-path-context";
import { useRentalFastPath } from "@/components/chat/rental-fast-path-context";
import { useRestaurantFastPath } from "@/components/chat/restaurant-fast-path-context";
import { RESTAURANT_CLARIFY_MESSAGE } from "@/lib/restaurant-clarify-copy";
import {
  type RestaurantFilterChip,
  restaurantChipSearchPrompt,
  restaurantSearchParamsFromChip,
} from "@/lib/restaurant-filter-chips";
import {
  buildRestaurantSearchParams,
  canFastPathRestaurantSearch,
  fastPathRestaurantSummary,
  restaurantsToToolEnvelope,
  shouldInstantRestaurantClarify,
  type RestaurantSearchApiParams,
} from "@/lib/restaurant-search-fast-path";
import { logRoutingDecision } from "@/lib/intelligence-telemetry";
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

function buildRestaurantMemoryPatch(
  params: RestaurantSearchApiParams,
  chip?: RestaurantFilterChip,
): ConciergeWorkingMemory["lastRestaurantQuery"] {
  return {
    neighborhood: params.neighborhood,
    cuisine: params.cuisine,
    vibe: chip?.vibe,
    priceTier: params.priceTier,
    genericAskPending: false,
  };
}

export function useRestaurantSearchFastPath() {
  const { state, setState } = useConciergeCoAgent();
  const {
    clarifyPending,
    clarifyKind,
    showClarify,
    showExchange,
    clearLocalMessages,
  } = useEventLocalChat();
  const { setToolResult: setEventToolResult } = useEventFastPath();
  const { setToolResult: setRentalToolResult, setSearchMeta } = useRentalFastPath();
  const { setToolResult } = useRestaurantFastPath();
  const { mergePinsByCategory, requestFitBounds } = useMapContext();
  const busyRef = useRef(false);

  const applySearchResults = useCallback(
    (
      cards: Restaurant[],
      params: RestaurantSearchApiParams,
      chip?: RestaurantFilterChip,
    ) => {
      const envelope = restaurantsToToolEnvelope(cards);
      setToolResult(envelope);
      const { pins } = normalizeToolOutput("restaurant", envelope);
      if (pins.length > 0) {
        mergePinsByCategory("restaurant", pins);
        if (pins.length >= 2) requestFitBounds();
      }
      setState({
        ...(state ?? {}),
        lastIntent: "restaurant_discovery",
        lastRestaurantQuery: buildRestaurantMemoryPatch(params, chip),
      });
    },
    [mergePinsByCategory, requestFitBounds, setState, setToolResult, state],
  );

  const runSearch = useCallback(
    async (
      userText: string,
      params: RestaurantSearchApiParams,
      chip?: RestaurantFilterChip,
    ): Promise<boolean> => {
      if (busyRef.current) return true;
      busyRef.current = true;
      try {
        setEventToolResult(null);
        setRentalToolResult(null);
        setSearchMeta(null);
        const cards = await fetchRestaurantSearch(params);
        const slots: Record<string, string | number | boolean> = {};
        if (params.neighborhood) slots.neighborhood = params.neighborhood;
        if (params.cuisine) slots.cuisine = params.cuisine;
        if (params.priceTier) slots.priceTier = params.priceTier;
        if (chip) slots.chipId = chip.id;
        logRoutingDecision({
          intent: "restaurant_search",
          slots,
          confidence: 0.85,
          action: "search_now",
          source: "fast-path",
          resultCount: cards.length,
          ts: new Date().toISOString(),
        });
        applySearchResults(cards, params, chip);
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

      if (clarifyPending && clarifyKind === "event") return false;
      if (clarifyPending && clarifyKind === "rental") return false;

      const memory: ConciergeWorkingMemory = {
        ...(state ?? {}),
        lastRestaurantQuery:
          clarifyPending && clarifyKind === "restaurant"
            ? {
                ...(state?.lastRestaurantQuery ?? {}),
                genericAskPending: true,
              }
            : state?.lastRestaurantQuery,
      };

      if (shouldInstantRestaurantClarify(trimmed, memory)) {
        if (busyRef.current) return true;
        busyRef.current = true;
        try {
          logRoutingDecision({
            intent: "restaurant_search",
            slots: {},
            confidence: 0.4,
            action: "clarify",
            source: "clarify-branch",
            ts: new Date().toISOString(),
          });
          setToolResult(null);
          showClarify(trimmed, RESTAURANT_CLARIFY_MESSAGE, "restaurant");
          setState({
            ...memory,
            lastIntent: "restaurant_discovery",
            lastRestaurantQuery: { genericAskPending: true },
          });
          return true;
        } finally {
          busyRef.current = false;
        }
      }

      if (!canFastPathRestaurantSearch(trimmed, memory)) return false;

      const params = buildRestaurantSearchParams(trimmed, memory);
      if (!params) return false;

      clearLocalMessages();
      return runSearch(trimmed, params);
    },
    [
      clarifyKind,
      clarifyPending,
      clearLocalMessages,
      runSearch,
      setState,
      setToolResult,
      showClarify,
      state,
    ],
  );

  const requestNearMeGeo = useCallback((): Promise<GeolocationPosition | null> => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos),
        () => resolve(null),
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
      );
    });
  }, []);

  const handleRestaurantChip = useCallback(
    async (
      chip: RestaurantFilterChip,
    ): Promise<{ handled: boolean; geoDenied?: boolean }> => {
      if (busyRef.current) return { handled: true };

      let geo: { latitude: number; longitude: number } | undefined;
      if (chip.nearMe) {
        const pos = await requestNearMeGeo();
        if (!pos) {
          return { handled: false, geoDenied: true };
        }
        geo = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
      }

      const prompt = restaurantChipSearchPrompt(chip);
      const params = restaurantSearchParamsFromChip(chip, geo);
      clearLocalMessages();
      const handled = await runSearch(prompt, params, chip);
      return { handled };
    },
    [clearLocalMessages, requestNearMeGeo, runSearch],
  );

  return { handleUserMessage, handleRestaurantChip, requestNearMeGeo };
}
