/**
 * Deterministic tool forcing for ai-chat when Gemini "auto" skips search tools.
 * Rentals are checked before events — bare `show` must not steal rental prompts.
 */

const RENTAL_RE =
  /\b(apartment|apartments|rental|rentals|rent|renting|housing|flat|place to stay|accommodation|map pins?)\b/i;

/** Events — no bare `show` (matches "Show me 5 rentals…"). */
const EVENT_RE =
  /\b(event|events|concert|festival|nightlife|party|parties|things to do|what.*happen|gig|performance|tickets?)\b/i;

const RESTAURANT_RE =
  /\b(restaurant|food|eat|eating|dining|lunch|dinner|brunch|cafe|café|coffee|where.*eat)\b/i;

const ATTRACTION_RE =
  /\b(attraction|attractions|museum|tour|tours|park|sightseeing|cable car|things to see|tourist|activity|activities)\b/i;

export type ForcedToolName =
  | "capture_lead"
  | "search_apartments"
  | "search_events"
  | "search_restaurants"
  | "search_attractions";

/** Contact-host / email intent — must run before search regex on same message. */
const LEAD_RE =
  /\b(contact\s+(the\s+)?host|contact\s+me|my\s+email\s+is|send\s+me\s+(your\s+)?details|want\s+to\s+apply|reach\s+out|i\s+want\s+to\s+contact)\b/i;

/**
 * Force capture_lead when the user clearly wants follow-up (Proof 004).
 */
export function resolveForcedLeadToolName(lastUserContent: string): "capture_lead" | null {
  const text = lastUserContent.trim();
  if (!text) return null;
  if (LEAD_RE.test(text)) return "capture_lead";
  return null;
}

/**
 * Returns a forced tool name when the user message clearly implies one domain.
 * Order: rentals → restaurants → attractions → events (rentals win over "show").
 */
export function resolveForcedToolName(lastUserContent: string): ForcedToolName | null {
  const text = lastUserContent.trim();
  if (!text) return null;

  if (RENTAL_RE.test(text)) return "search_apartments";
  if (RESTAURANT_RE.test(text)) return "search_restaurants";
  if (ATTRACTION_RE.test(text)) return "search_attractions";
  if (EVENT_RE.test(text)) return "search_events";

  return null;
}

export function buildToolChoice(
  lastUserContent: string,
): unknown {
  const lead = resolveForcedLeadToolName(lastUserContent);
  if (lead) {
    return { type: "function", function: { name: lead } };
  }
  const forced = resolveForcedToolName(lastUserContent);
  if (forced) {
    return { type: "function", function: { name: forced } };
  }
  return "auto";
}
