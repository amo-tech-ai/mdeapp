/**
 * Pure classifier for event discovery queries — used by Vitest and docs;
 * concierge agent applies the same rules via prompt (F39).
 */
import type { EventCategory } from "@/mastra/tools/search-events";

export type EventDateWindow =
  | "tonight"
  | "this_weekend"
  | "this_week"
  | "next_week"
  | "any";

export type EventQuerySignals = {
  hasCategory: boolean;
  hasDateWindow: boolean;
  hasNeighborhood: boolean;
  hasShowAll: boolean;
  category?: EventCategory;
  dateWindow?: EventDateWindow;
  neighborhood?: string;
};

const CATEGORY_PATTERNS: Array<{ category: EventCategory; re: RegExp }> = [
  { category: "nightlife", re: /\b(nightlife|club|clubs|party|parties|bar|bars|disco)\b/i },
  { category: "music", re: /\b(music|concert|concerts|salsa|live music|dj|gig|gigs)\b/i },
  { category: "sport", re: /\b(sport|sports|football|f[uú]tbol|soccer|match|matches|game)\b/i },
  { category: "food", re: /\b(food|restaurant|restaurants|dining|brunch)\b/i },
  { category: "culture", re: /\b(culture|cultural|art|arts|museum|museums|festival|festivals|comedy|theater|theatre)\b/i },
];

const DATE_PATTERNS: Array<{ dateWindow: EventDateWindow; re: RegExp }> = [
  { dateWindow: "tonight", re: /\b(tonight|this evening|today evening)\b/i },
  { dateWindow: "this_weekend", re: /\b(this weekend|weekend)\b/i },
  { dateWindow: "this_week", re: /\b(this week)\b/i },
  { dateWindow: "next_week", re: /\b(next week)\b/i },
];

const NEIGHBORHOOD_PATTERNS: Array<{ neighborhood: string; re: RegExp }> = [
  { neighborhood: "El Poblado", re: /\b(el poblad[oa]|poblado|provenza)\b/i },
  { neighborhood: "Laureles", re: /\blaureles\b/i },
  { neighborhood: "Envigado", re: /\benvigado\b/i },
  { neighborhood: "Belén", re: /\bbel[eé]n\b/i },
  { neighborhood: "Estadio", re: /\bestadio\b/i },
];

const SHOW_ALL_RE =
  /\b(show all|all events|popular events|top events|everything happening|what'?s on)\b/i;

/** Rental / venue-seeking queries — must not hijack event fast-path. */
const NON_EVENT_RENTAL_RE =
  /\b(1\s?br|2\s?br|3\s?br|bedroom|bedrooms|apartment|apartments|rental|rentals|airbnb|under\s+\$?\d+|\/night|per night|monthly|for rent)\b/i;

/** Restaurant / café discovery — not event discovery unless "events" is present. */
const NON_EVENT_FOOD_VENUE_RE =
  /\b(caf[eé]s?|coffee|espresso|barista|coffee shops?|specialty coffee|restaurants?|brunch spots?|best cafes?|quiet caf[eé]s?|juice bar|smoothie)\b/i;

/** True when the message is clearly rental or food-venue search, not events. */
export function looksLikeNonEventSearch(text: string): boolean {
  const t = text.trim();
  if (/\bevents?\b/i.test(t)) return false;
  return NON_EVENT_RENTAL_RE.test(t) || NON_EVENT_FOOD_VENUE_RE.test(t);
}

/**
 * Structured text signals strong enough to run event fast-path (not chip/clarify memory).
 * Neighborhood alone is never sufficient — e.g. "1BR in Laureles" must reach rental agent.
 */
export function hasEventFastPathSignals(
  text: string,
  s: EventQuerySignals,
): boolean {
  if (looksLikeNonEventSearch(text)) return false;
  if (s.hasShowAll) return true;
  if (/\bevents?\b/i.test(text) || /\bwhat'?s on\b/i.test(text)) return true;
  if (s.hasDateWindow) return true;
  if (s.hasCategory) {
    if (s.category === "food") {
      return /\bevents?\b/i.test(text);
    }
    return true;
  }
  if (s.hasNeighborhood) return false;
  return false;
}

/** Score structured signals from free-text user message. */
export function scoreEventQuery(text: string): EventQuerySignals {
  const normalized = text.trim();
  const hasShowAll = SHOW_ALL_RE.test(normalized);

  let category: EventCategory | undefined;
  for (const { category: cat, re } of CATEGORY_PATTERNS) {
    if (re.test(normalized)) {
      category = cat;
      break;
    }
  }

  let dateWindow: EventDateWindow | undefined;
  for (const { dateWindow: dw, re } of DATE_PATTERNS) {
    if (re.test(normalized)) {
      dateWindow = dw;
      break;
    }
  }

  let neighborhood: string | undefined;
  for (const { neighborhood: n, re } of NEIGHBORHOOD_PATTERNS) {
    if (re.test(normalized)) {
      neighborhood = n;
      break;
    }
  }

  return {
    hasCategory: category != null,
    hasDateWindow: dateWindow != null,
    hasNeighborhood: neighborhood != null,
    hasShowAll,
    category,
    dateWindow,
    neighborhood,
  };
}

/**
 * Generic = user wants events but gave no category, date window, neighborhood, or show-all.
 * City-only queries like "list events medellin" return true.
 */
export function isGenericEventQuery(text: string): boolean {
  const s = scoreEventQuery(text);
  if (s.hasShowAll) return false;
  if (s.hasCategory) return false;
  if (s.hasDateWindow) return false;
  if (s.hasNeighborhood) return false;
  return /\bevents?\b/i.test(text) || /\bwhat'?s on\b/i.test(text);
}

/** Natural-language message to send when user taps an event sub-chip. */
export function eventSubChipPrompt(
  chip: {
    label: string;
    category?: EventCategory;
    dateWindow?: EventDateWindow;
    showAll?: boolean;
  },
): string {
  if (chip.showAll) return "Show all events in Medellín";
  if (chip.category && chip.dateWindow) {
    return `${chip.label} events ${chip.dateWindow.replace("_", " ")} in Medellín`;
  }
  if (chip.category) return `${chip.label} events in Medellín`;
  if (chip.dateWindow) {
    const when =
      chip.dateWindow === "this_weekend"
        ? "this weekend"
        : chip.dateWindow === "this_week"
          ? "this week"
          : chip.dateWindow === "next_week"
            ? "next week"
            : "tonight";
    return `Events ${when} in Medellín`;
  }
  return `${chip.label} events in Medellín`;
}
