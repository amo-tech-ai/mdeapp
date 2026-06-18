/**
 * Private event venue hire — birthday, wedding, corporate, etc.
 * Must bypass ticketed event discovery (searchEvents) and route to restaurant cards
 * with Event Venue CTA ([SAN-494 · Canonical router intent schema + deterministic classifier](https://linear.app/sanjiovani/issue/SAN-494/evt-035-restaurant-card-event-venue-cta) → [SAN-495 · EVT-036 — Event offerings detail panel](https://linear.app/sanjiovani/issue/SAN-495/evt-036-event-offerings-detail-panel)).
 */

const PRIVATE_EVENT_TYPE_RE =
  /\b(birthday(?:\s+party)?|wedding(?:\s+reception)?|corporate(?:\s+event)?|private(?:\s+event)?|baby\s+shower|anniversary(?:\s+(?:party|dinner))?|graduation(?:\s+party)?|celebration|reception|quincea[nñ]era)\b/i;

const VENUE_SEEKING_RE =
  /\b(?:need|want|looking for|find|search(?:ing)? for|book)\s+(?:a\s+)?(?:venue|event\s+space|space|place|location)\b/i;

const VENUE_FOR_EVENT_RE =
  /\bvenue\s+for\s+(?:a\s+)?(?:birthday|wedding|corporate|private|party|celebration|\d)/i;

const RESTAURANT_FOR_EVENT_RE =
  /\b(?:restaurant|rooftop|bar|space)\s+for\s+(?:a\s+)?(?:private\s+event|birthday|wedding|corporate|\d+)/i;

const RESTAURANT_GROUP_VENUE_RE =
  /\b(?:restaurant|rooftop|bar|venue)\s+for\s+(?:\d+\s*(?:people|guests|ppl)?|a\s+group)\b/i;

const EVENT_VENUE_NOUN_RE =
  /\b(?:birthday|wedding|corporate|private)\s+venue\b/i;

const GUEST_COUNT_EVENT_RE = /\b(?:for\s+)?\d+\s+(?:people|guests)\b/i;

const SUGGEST_VENUES_RE = /\bsuggest\s+venues?\b/i;

const PRIVATE_EVENT_SPACE_RE = /\bprivate\s+event\s+space\b/i;

const SOMEWHERE_BIRTHDAY_RE = /\bsomewhere\s+for\s+(?:a\s+)?birthday\b/i;

/** Named venue hire — e.g. "book Mamacita for 30" (not ticket purchases). */
const BOOK_NAMED_VENUE_FOR_GUESTS_RE =
  /\bbook\s+(?!tickets?\b)(?:[A-Za-zÀ-ÿ][\wÀ-ÿ'-]*(?:\s+[A-Za-zÀ-ÿ][\wÀ-ÿ'-]*)*)\s+for\s+(\d+)\b/i;

const NEIGHBORHOOD_PATTERNS: Array<{ neighborhood: string; re: RegExp }> = [
  { neighborhood: "El Poblado", re: /\b(el poblad[oa]|poblado|provenza)\b/i },
  { neighborhood: "Laureles", re: /\blaureles\b/i },
  { neighborhood: "Envigado", re: /\benvigado\b/i },
  { neighborhood: "Belén", re: /\bbel[eé]n\b/i },
  { neighborhood: "Estadio", re: /\bestadio\b/i },
];

/** Ticketed catalogue discovery — not private venue hire. */
function looksLikeTicketedEventDiscovery(text: string): boolean {
  const t = text.trim();
  if (/\b(?:salsa|concert|festival|gig|tickets?)\b/i.test(t)) return true;
  if (/\b(?:music|nightlife|sport|culture|food)\s+events?\b/i.test(t)) return true;
  if (/\bevents?\s+(?:this\s+weekend|tonight|in\s+medell)/i.test(t)) return true;
  if (/\bwhat'?s on\b/i.test(t)) return true;
  if (/\bshow all events\b/i.test(t)) return true;
  if (
    /\b(?:clubs?|nightlife|party\s+events?|parties\s+this)\b/i.test(t) &&
    !VENUE_SEEKING_RE.test(t)
  ) {
    return true;
  }
  return false;
}

function hasPrivateEventVenueSignals(text: string): boolean {
  const t = text.trim();
  if (VENUE_SEEKING_RE.test(t) && PRIVATE_EVENT_TYPE_RE.test(t)) return true;
  if (VENUE_FOR_EVENT_RE.test(t)) return true;
  if (RESTAURANT_FOR_EVENT_RE.test(t)) return true;
  if (RESTAURANT_GROUP_VENUE_RE.test(t)) return true;
  if (EVENT_VENUE_NOUN_RE.test(t)) return true;
  if (VENUE_SEEKING_RE.test(t) && GUEST_COUNT_EVENT_RE.test(t)) return true;
  if (PRIVATE_EVENT_TYPE_RE.test(t) && /\bvenue\b/i.test(t)) return true;
  if (SUGGEST_VENUES_RE.test(t)) {
    const hasPartyOrGuests =
      /\bparty\b/i.test(t) || GUEST_COUNT_EVENT_RE.test(t);
    if (hasPartyOrGuests) return true;
  }
  if (PRIVATE_EVENT_SPACE_RE.test(t)) return true;
  if (SOMEWHERE_BIRTHDAY_RE.test(t)) return true;
  if (BOOK_NAMED_VENUE_FOR_GUESTS_RE.test(t)) return true;
  return false;
}

export function looksLikeEventVenueBookingQuery(text: string): boolean {
  const t = text.trim();
  if (!t || looksLikeTicketedEventDiscovery(t)) return false;
  return hasPrivateEventVenueSignals(t);
}

export type EventVenueBookingIntent = {
  partySize?: number;
  neighborhood?: string;
  eventType?: string;
};

export function parseEventVenueBookingIntent(text: string): EventVenueBookingIntent {
  const t = text.trim();
  const intent: EventVenueBookingIntent = {};

  const guestMatch =
    t.match(/\b(?:for\s+)?(\d+)\s+(?:people|guests)\b/i) ??
    t.match(BOOK_NAMED_VENUE_FOR_GUESTS_RE);
  if (guestMatch) {
    intent.partySize = Number.parseInt(guestMatch[1], 10);
  }

  for (const { neighborhood, re } of NEIGHBORHOOD_PATTERNS) {
    if (re.test(t)) {
      intent.neighborhood = neighborhood;
      break;
    }
  }

  const eventTypes: Array<{ re: RegExp; label: string }> = [
    { re: /\bbirthday(?:\s+party)?\b/i, label: "birthday" },
    { re: /\bwedding\b/i, label: "wedding" },
    { re: /\bcorporate(?:\s+event)?\b/i, label: "corporate" },
    { re: /\bprivate(?:\s+event)?\b/i, label: "private event" },
    { re: /\bbaby\s+shower\b/i, label: "baby shower" },
    { re: /\banniversary\b/i, label: "anniversary" },
    { re: /\bgraduation(?:\s+party)?\b/i, label: "graduation" },
  ];
  for (const { re, label } of eventTypes) {
    if (re.test(t)) {
      intent.eventType = label;
      break;
    }
  }

  return intent;
}
