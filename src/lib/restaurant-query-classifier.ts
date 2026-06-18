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
  /\b(restaurants?|dinner|lunch|brunch|food recommendations?|suggest.*restaurants?|where to eat|eat out|cuisine|steakhouse|rooftop dinner|bistro|dine|eatery|tasting menu|date night dinner|fine dining|casual dining|italian|sushi|pizza|vegan|steak|colombian)\b/i;

const GENERIC_RESTAURANT_RE =
  /\b(suggest\s+restaurants?|restaurants?\s+in|restaurants?\s+medell[ií]n|where\s+to\s+eat|food\s+recommendations?|recommend\s+restaurants?)\b/i;

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
  { cuisine: "seafood", re: /\b(seafood|fish|ceviche|sushi|japanese)\b/i },
  { cuisine: "vegetarian", re: /\b(vegetarian|vegan|plant[- ]based)\b/i },
  { cuisine: "colombian", re: /\b(colombian|bandeja|paisa)\b/i },
  { cuisine: "italian", re: /\b(italian)\b/i },
  { cuisine: "pizza", re: /\b(pizza)\b/i },
  { cuisine: "international", re: /\b(international|fusion|fine dining|modern)\b/i },
];

const VIBE_PATTERNS: Array<{ vibe: string; re: RegExp }> = [
  { vibe: "fine dining", re: /\b(fine dining|tasting menu|upscale)\b/i },
  { vibe: "casual", re: /\b(casual|laid[- ]back|relaxed)\b/i },
  { vibe: "date night", re: /\b(date night|romantic|anniversary)\b/i },
  { vibe: "rooftop", re: /\b(rooftop)\b/i },
  { vibe: "family", re: /\b(family|kid[- ]friendly|kids)\b/i },
];

const BUDGET_PATTERNS: Array<{ priceTier: "$" | "$$" | "$$$"; re: RegExp }> = [
  { priceTier: "$", re: /\b(budget|cheap|under \$20|\$\s*only)\b/i },
  { priceTier: "$$", re: /\b(\$\$|mid[- ]range|moderate)\b/i },
  { priceTier: "$$$", re: /\b(\$\$\$|splurge|expensive|luxury)\b/i },
];

export type RestaurantSearchSignals = {
  hasRestaurantIntent: boolean;
  isCafeIntent: boolean;
  neighborhood?: string;
  cuisine?: string;
  vibe?: string;
  priceTier?: "$" | "$$" | "$$$";
  nearMe?: boolean;
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

// skipcq: JS-0067 - ES module export; not browser global scope
export function looksLikeNightlifeGroundingSearch(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (RENTAL_RE.test(t)) return false;
  if (looksLikeTicketedEventSearch(t)) return false;
  if (looksLikeEventCategoryNightlifeDiscovery(t)) return false;
  if (NIGHTLIFE_GROUNDING_RE.test(t)) return true;
  return looksLikeGenericNightlifeVenueSearch(t);
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

  let vibe: string | undefined;
  for (const { vibe: v, re } of VIBE_PATTERNS) {
    if (re.test(t)) {
      vibe = v;
      break;
    }
  }

  let priceTier: "$" | "$$" | "$$$" | undefined;
  for (const { priceTier: tier, re } of BUDGET_PATTERNS) {
    if (re.test(t)) {
      priceTier = tier;
      break;
    }
  }

  const nearMe = /\bnear me\b/i.test(t);

  return { hasRestaurantIntent, isCafeIntent, neighborhood, cuisine, vibe, priceTier, nearMe };
}

/** Broader restaurant discovery — includes cuisine/vibe phrases without "restaurant" keyword. */
export function looksLikeRestaurantDiscovery(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (looksLikeNightlifeGroundingSearch(t)) return false;
  if (looksLikeCafeSearch(t)) return false;
  if (RENTAL_RE.test(t)) return false;
  if (EVENT_RE.test(t)) return false;
  if (looksLikeRestaurantSearch(t)) return true;
  if (GENERIC_RESTAURANT_RE.test(t)) return true;
  const signals = scoreRestaurantQuery(t);
  return Boolean(signals.cuisine || signals.vibe);
}

/**
 * Strong enough to search immediately (cuisine, vibe, neighborhood, budget, or near me).
 * Neighborhood alone is not enough for generic "restaurants in poblado" — still search.
 */
export function hasRestaurantFastPathSignals(
  text: string,
  s: RestaurantSearchSignals,
): boolean {
  if (s.nearMe) return true;
  if (s.cuisine) return true;
  if (s.vibe) return true;
  if (s.priceTier) return true;
  if (s.neighborhood) return true;
  if (/\b(rooftop dinner|quiet dinner|steakhouse|fine dining)\b/i.test(text)) return true;
  return false;
}

/** Generic = wants restaurants but no cuisine, vibe, area, or budget signal. */
export function isGenericRestaurantQuery(text: string): boolean {
  const s = scoreRestaurantQuery(text);
  if (!looksLikeRestaurantDiscovery(text)) return false;
  if (hasRestaurantFastPathSignals(text, s)) return false;
  return true;
}
