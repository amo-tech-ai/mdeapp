import type { ConciergeWorkingMemory } from "@/lib/types";
import type { EventCard, EventCategory } from "@/mastra/tools/search-events";
import {
  hasEventFastPathSignals,
  isGenericEventQuery,
  looksLikeNonEventSearch,
  scoreEventQuery,
  type EventDateWindow,
  type EventQuerySignals,
} from "@/lib/event-query-classifier";

export type EventSearchApiParams = {
  category?: EventCategory;
  neighborhood?: string;
  dateWindow?: EventDateWindow;
  limit?: number;
  /** Natural-language query for hybrid_search_events + event_signals (high-intent only). */
  queryText?: string;
};

const FAST_PATH_LIMIT = 10;

/**
 * High-intent event vocabulary the server intelligence layer can actually rank on
 * (mirrors parseEventIntelligenceSlots in intelligence-event-search.ts). Only these
 * queries carry queryText so the hybrid RPC + event_signals boosts fire — broad
 * browses ("show all", bare category) stay structured to avoid noisy semantic ranking.
 */
const HIGH_INTENT_EVENT_RE =
  /\b(salsa|live music|concert|concerts|band|dj|nightlife|club|clubs|party|parties|fashion|runway|networking|meetup|professional|this weekend|weekend|tonight)\b/i;

/** Attach queryText only for high-intent event queries (mirrors rentals' attachQueryText). */
function attachEventQueryText(
  params: EventSearchApiParams,
  text: string,
  s: EventQuerySignals,
): EventSearchApiParams {
  const highIntentDate = s.dateWindow === "this_weekend" || s.dateWindow === "tonight";
  if (highIntentDate || HIGH_INTENT_EVENT_RE.test(text)) {
    return { ...params, queryText: text.trim() };
  }
  return params;
}

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

    return attachEventQueryText(
      {
        // UX-019 Option B L55: never inherit stale category when current message has none.
        category: s.hasCategory ? s.category : undefined,
        neighborhood: answeringClarifyCategoryOnly
          ? undefined
          : s.neighborhood ?? q?.neighborhood,
        dateWindow: (answeringClarifyCategoryOnly
          ? "any"
          : (s.dateWindow ?? q?.dateWindow ?? "any")) as EventDateWindow,
        limit: FAST_PATH_LIMIT,
      },
      text,
      s,
    );
  }

  if (q?.genericAskPending) {
    const merged: EventSearchApiParams = {
      category: q.category,
      neighborhood: q.neighborhood,
      dateWindow: (q.dateWindow ?? "any") as EventDateWindow,
      limit: FAST_PATH_LIMIT,
    };
    if (merged.category || merged.neighborhood || merged.dateWindow !== "any") {
      return attachEventQueryText(merged, text, s);
    }
    if (text.trim().length > 0) {
      return { dateWindow: "any", limit: FAST_PATH_LIMIT };
    }
  }

  // UX-019 Option B L81: bare follow-ups ("ok", "and there?") must not replay memory alone.

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

export function eventCardsToToolEnvelope(
  cards: EventCard[],
  meta?: {
    hybridUsed?: boolean;
    rankExplanation?: Array<{ factor: string; score: number; note: string }>;
  },
) {
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
    hybridUsed: meta?.hybridUsed,
    rankExplanation: meta?.rankExplanation,
  };
}

export function fastPathAssistantSummary(count: number): string {
  if (count === 0) {
    return "No events matched — try another category, neighborhood, or date.";
  }
  return `Found ${count} event${count === 1 ? "" : "s"} — see cards below and pins on the map.`;
}
