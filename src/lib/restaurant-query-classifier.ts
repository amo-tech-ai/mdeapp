/** Pure classifier for restaurant discovery — mirrors event-query-classifier. */

const CAFE_RE =
  /\b(caf[eé]s?|coffee|espresso|barista|specialty coffee|quiet caf[eé]s?|coffee shops?|best cafes?|juice bar|smoothie)\b/i;

/** Bars / clubs / salsa — use search-grounded-places (VEN-012), not restaurant fast path. */
const NIGHTLIFE_GROUNDING_RE =
  /\b(nightlife|salsa bars?|hidden bars?|rooftop cocktails?|rooftop bars?|live music bars?|locals go to|nightclub|discotec)\b/i;

/** Generic POI nightlife (no "events" word) — e.g. SAN-549 / VEN-025 prod gap. */
const GENERIC_NIGHTLIFE_VENUE_RE =
  /\b((popular\s+)?venues?|clubs?|discotecas?|where to party|party spots?)\b/i;

const NIGHTLIFE_TIME_RE =
  /\b(tonight|this evening|today evening|this weekend|weekend)\b/i;

const RESTAURANT_RE =
  /\b(restaurants?|dinner|lunch|brunch|food recommendations?|suggest.*restaurants?|where to eat|eat out|cuisine|steakhouse|rooftop dinner|bistro|dine|eatery|tasting menu|date night dinner)\b/i;

const RENTAL_RE =
  /\b(1\s?br|2\s?br|3\s?br|bedroom|bedrooms|apartment|apartments|rental|rentals|airbnb|under\s+\$?\d+|\/night|per night|monthly|for rent)\b/i;

const EVENT_RE = /\bevents?\b/i;

const NEIGHBORHOOD_PATTERNS: Array<{ neighborhood: string; re: RegExp }> = [
  { neighborhood: "El Poblado", re: /\b(el poblad[oa]|poblado|provenza)\b/i },
  { neighborhood: "Laureles", re: /\blaureles\b/i },
  { neighborhood: "Envigado", re: /\benvigado\b/i },
  { neighborhood: "Belén", re: /\bbel[eé]n\b/i },
  { neighborhood: "Estadio", re: /\bestadio\b/i },
  { neighborhood: "Centro", re: /\b(centro|downtown)\b/i },
];

const CUISINE_PATTERNS: Array<{ cuisine: string; re: RegExp }> = [
  { cuisine: "steakhouse", re: /\b(steakhouse|steak|asado)\b/i },
  { cuisine: "seafood", re: /\b(seafood|fish|ceviche)\b/i },
  { cuisine: "vegetarian", re: /\b(vegetarian|vegan|plant[- ]based)\b/i },
  { cuisine: "colombian", re: /\b(colombian|bandeja|paisa)\b/i },
  { cuisine: "international", re: /\b(international|fusion|fine dining)\b/i },
];

export type RestaurantSearchSignals = {
  hasRestaurantIntent: boolean;
  isCafeIntent: boolean;
  neighborhood?: string;
  cuisine?: string;
};

/** Ticketed listings — must stay on search-events, not grounded nightlife POIs. */
export function looksLikeTicketedEventSearch(text: string): boolean {
  return EVENT_RE.test(text.trim());
}

export function looksLikeGenericNightlifeVenueSearch(text: string): boolean {
  const t = text.trim();
  if (!t || looksLikeTicketedEventSearch(t)) return false;
  if (RENTAL_RE.test(t)) return false;
  return GENERIC_NIGHTLIFE_VENUE_RE.test(t) && NIGHTLIFE_TIME_RE.test(t);
}

/** Ticketed inventory phrasing — "nightlife this weekend", not map POI bars. */
function looksLikeEventCategoryNightlifeDiscovery(text: string): boolean {
  const t = text.trim();
  if (looksLikeTicketedEventSearch(t) || looksLikeGenericNightlifeVenueSearch(t)) {
    return false;
  }
  if (!/\bnightlife\b/i.test(t)) return false;
  return NIGHTLIFE_TIME_RE.test(t) || /\b(this week|next week)\b/i.test(t);
}

export function looksLikeNightlifeGroundingSearch(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (RENTAL_RE.test(t)) return false;
  if (looksLikeTicketedEventSearch(t)) return false;
  if (looksLikeEventCategoryNightlifeDiscovery(t)) return false;
  return (
    NIGHTLIFE_GROUNDING_RE.test(t) || looksLikeGenericNightlifeVenueSearch(t)
  );
}

export function looksLikeCafeSearch(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (NIGHTLIFE_GROUNDING_RE.test(t)) return false;
  if (/\b(rooftop dinner|steakhouse|restaurants?)\b/i.test(t)) return false;
  return CAFE_RE.test(t);
}

export function looksLikeRestaurantSearch(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (looksLikeNightlifeGroundingSearch(t)) return false;
  if (looksLikeCafeSearch(t)) return false;
  if (RENTAL_RE.test(t)) return false;
  if (EVENT_RE.test(t)) return false;
  return RESTAURANT_RE.test(t);
}

export function scoreRestaurantQuery(text: string): RestaurantSearchSignals {
  const t = text.trim();
  const isCafeIntent = looksLikeCafeSearch(t);
  const hasRestaurantIntent = looksLikeRestaurantSearch(t);

  let neighborhood: string | undefined;
  for (const { neighborhood: n, re } of NEIGHBORHOOD_PATTERNS) {
    if (re.test(t)) {
      neighborhood = n;
      break;
    }
  }

  let cuisine: string | undefined;
  for (const { cuisine: c, re } of CUISINE_PATTERNS) {
    if (re.test(t)) {
      cuisine = c;
      break;
    }
  }

  return { hasRestaurantIntent, isCafeIntent, neighborhood, cuisine };
}
