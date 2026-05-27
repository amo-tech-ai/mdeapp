import type { ConciergeWorkingMemory } from "@/lib/types";
import type { EventCard, EventCategory } from "@/mastra/tools/search-events";
import {
  hasEventFastPathSignals,
  isGenericEventQuery,
  looksLikeNonEventSearch,
  scoreEventQuery,
  type EventDateWindow,
} from "@/lib/event-query-classifier";

export type EventSearchApiParams = {
  category?: EventCategory;
  neighborhood?: string;
  dateWindow?: EventDateWindow;
  limit?: number;
};

const FAST_PATH_LIMIT = 10;

/** Show canned clarify without calling conciergeAgent. */
export function shouldInstantEventClarify(
  text: string,
  memory: ConciergeWorkingMemory,
): boolean {
  return (
    isGenericEventQuery(text) && memory.lastEventQuery?.genericAskPending !== true
  );
}

/** Run Supabase search via /api/events/search (skip LLM). */
export function buildEventSearchParams(
  text: string,
  memory: ConciergeWorkingMemory,
): EventSearchApiParams | null {
  if (looksLikeNonEventSearch(text)) return null;

  const s = scoreEventQuery(text);
  const q = memory.lastEventQuery;

  if (s.hasShowAll) {
    return { dateWindow: "any", limit: FAST_PATH_LIMIT };
  }

  if (
    (s.hasCategory || s.hasDateWindow || s.hasNeighborhood) &&
    hasEventFastPathSignals(text, s)
  ) {
    const answeringClarifyCategoryOnly =
      q?.genericAskPending === true &&
      s.hasCategory &&
      !s.hasDateWindow &&
      !s.hasNeighborhood;

    return {
      category: s.category ?? q?.category,
      neighborhood: answeringClarifyCategoryOnly
        ? undefined
        : s.neighborhood ?? q?.neighborhood,
      dateWindow: (answeringClarifyCategoryOnly
        ? "any"
        : (s.dateWindow ?? q?.dateWindow ?? "any")) as EventDateWindow,
      limit: FAST_PATH_LIMIT,
    };
  }

  if (q?.genericAskPending) {
    const merged: EventSearchApiParams = {
      category: q.category,
      neighborhood: q.neighborhood,
      dateWindow: (q.dateWindow ?? "any") as EventDateWindow,
      limit: FAST_PATH_LIMIT,
    };
    if (merged.category || merged.neighborhood || merged.dateWindow !== "any") {
      return merged;
    }
    if (text.trim().length > 0) {
      return { dateWindow: "any", limit: FAST_PATH_LIMIT };
    }
  }

  if (q?.category || q?.neighborhood || (q?.dateWindow && q.dateWindow !== "any")) {
    return {
      category: q.category,
      neighborhood: q.neighborhood,
      dateWindow: (q.dateWindow ?? "any") as EventDateWindow,
      limit: FAST_PATH_LIMIT,
    };
  }

  return null;
}

export function canFastPathEventSearch(
  text: string,
  memory: ConciergeWorkingMemory,
): boolean {
  if (looksLikeNonEventSearch(text)) return false;
  if (shouldInstantEventClarify(text, memory)) return false;
  return buildEventSearchParams(text, memory) != null;
}

export function eventSearchParamsFromChip(chip: {
  eventCategory?: EventCategory;
  eventDateWindow?: EventDateWindow;
  eventShowAll?: boolean;
}): EventSearchApiParams {
  if (chip.eventShowAll) {
    return { dateWindow: "any", limit: FAST_PATH_LIMIT };
  }
  return {
    category: chip.eventCategory,
    dateWindow: chip.eventDateWindow ?? "any",
    limit: FAST_PATH_LIMIT,
  };
}

export function eventCardsToPanelRows(
  cards: EventCard[],
): ConciergeWorkingMemory["lastEventResults"] {
  return cards.map((e) => ({
    id: e.id,
    title: e.title,
    venue: e.venue,
    date: e.startsAt,
  }));
}

export function eventCardsToToolEnvelope(cards: EventCard[]) {
  return {
    results: cards.map((e) => ({
      id: e.id,
      title: e.title,
      category: e.category,
      venue: e.venue,
      neighborhood: e.neighborhood,
      startsAt: e.startsAt,
      pricePerTicket: e.pricePerTicket,
      currency: e.currency,
      imageUrl: e.imageUrl,
      sourceUrl: e.sourceUrl ?? e.mapsUrl ?? undefined,
      latitude: e.latitude ?? null,
      longitude: e.longitude ?? null,
      mapsUrl: e.mapsUrl ?? null,
    })),
    total: cards.length,
    source: "supabase" as const,
  };
}

export function fastPathAssistantSummary(count: number): string {
  if (count === 0) {
    return "No events matched — try another category, neighborhood, or date.";
  }
  return `Found ${count} event${count === 1 ? "" : "s"} — see cards below and pins on the map.`;
}
