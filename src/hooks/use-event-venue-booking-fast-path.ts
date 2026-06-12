"use client";

import { useCallback, useRef } from "react";
import { useConciergeCoAgent } from "@/components/chat/concierge-coagent-context";
import type { Restaurant } from "@/mastra/tools/search-restaurants";
import { useEventLocalChat } from "@/components/chat/event-local-chat-context";
import { useEventFastPath } from "@/components/chat/event-fast-path-context";
import { useGroundedFastPath } from "@/components/chat/grounded-fast-path-context";
import { useRentalFastPath } from "@/components/chat/rental-fast-path-context";
import { useRestaurantFastPath } from "@/components/chat/restaurant-fast-path-context";
import {
  buildEventVenueBookingSearchParams,
  canFastPathEventVenueBooking,
  eventVenueBookingAssistantSummary,
} from "@/lib/event-venue-booking-fast-path";
import { parseEventVenueBookingIntent } from "@/lib/event-venue-booking-intent";
import { logRoutingDecision } from "@/lib/intelligence-telemetry";
import {
  restaurantsToToolEnvelope,
  type RestaurantSearchApiParams,
} from "@/lib/restaurant-search-fast-path";
import { useEventSearchResults } from "@/components/chat/event-search-results-context";
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

export function useEventVenueBookingFastPath() {
  const { state, setState } = useConciergeCoAgent();
  const { showExchange, clearLocalMessages } = useEventLocalChat();
  const { setToolResult: setEventToolResult } = useEventFastPath();
  const { setToolResult: setGroundedToolResult } = useGroundedFastPath();
  const { setToolResult: setRentalToolResult, setSearchMeta } = useRentalFastPath();
  const { setToolResult: setRestaurantToolResult } = useRestaurantFastPath();
  const { setRows, setWebCitations } = useEventSearchResults();
  const { mergePinsByCategory, requestFitBounds } = useMapContext();
  const busyRef = useRef(false);

  const applySearchResults = useCallback(
    (cards: Restaurant[], params: RestaurantSearchApiParams) => {
      const envelope = restaurantsToToolEnvelope(cards);
      setRestaurantToolResult(envelope);
      mergePinsByCategory("event", []);
      mergePinsByCategory("grounded", []);
      mergePinsByCategory("rental", []);
      const { pins } = normalizeToolOutput("restaurant", envelope);
      if (pins.length > 0) {
        mergePinsByCategory("restaurant", pins);
        if (pins.length >= 2) requestFitBounds();
      }
      setState({
        ...(state ?? {}),
        lastIntent: "venue_booking",
        lastRestaurantQuery: {
          neighborhood: params.neighborhood,
          genericAskPending: false,
        },
      });
    },
    [
      mergePinsByCategory,
      requestFitBounds,
      setRestaurantToolResult,
      setState,
      state,
    ],
  );

  const handleUserMessage = useCallback(
    async (text: string): Promise<boolean> => {
      const trimmed = text.trim();
      if (!trimmed || !canFastPathEventVenueBooking(trimmed)) return false;

      const params = buildEventVenueBookingSearchParams(trimmed);
      if (!params) return false;

      if (busyRef.current) return true;
      busyRef.current = true;
      try {
        setEventToolResult(null);
        setGroundedToolResult(null);
        setRentalToolResult(null);
        setSearchMeta(null);
        setRows([]);
        setWebCitations([]);
        clearLocalMessages();

        const intent = parseEventVenueBookingIntent(trimmed);
        const cards = await fetchRestaurantSearch(params);

        logRoutingDecision({
          intent: "venue_booking",
          slots: {
            eventVenueBooking: true,
            ...(intent.neighborhood ? { neighborhood: intent.neighborhood } : {}),
            ...(intent.partySize ? { partySize: intent.partySize } : {}),
            ...(intent.eventType ? { eventType: intent.eventType } : {}),
          },
          confidence: 0.9,
          action: "search_now",
          source: "fast-path",
          resultCount: cards.length,
          ts: new Date().toISOString(),
        });

        applySearchResults(cards, params);
        showExchange(
          trimmed,
          eventVenueBookingAssistantSummary(cards.length, intent.partySize),
        );
        return true;
      } catch (err) {
        console.error("[event-venue-booking-fast-path]", err);
        setRestaurantToolResult(null);
        showExchange(
          trimmed,
          "Could not load venues right now — try again in a moment or pick a restaurant from Food & cafés.",
        );
        return true;
      } finally {
        busyRef.current = false;
      }
    },
    [
      applySearchResults,
      clearLocalMessages,
      setEventToolResult,
      setGroundedToolResult,
      setRentalToolResult,
      setRestaurantToolResult,
      setRows,
      setSearchMeta,
      setWebCitations,
      showExchange,
    ],
  );

  return { handleUserMessage };
}
