/** Pure classifier for restaurant discovery — mirrors event-query-classifier. */

const CAFE_RE =
  /\b(caf[eé]s?|coffee|espresso|barista|specialty coffee|quiet caf[eé]s?|coffee shops?|best cafes?|juice bar|smoothie)\b/i;

const RESTAURANT_RE =
  /\b(restaurants?|dinner|lunch|brunch|food recommendations?|suggest.*restaurants?|where to eat|eat out|cuisine|steakhouse|rooftop|bistro|dine|eatery|lounge|tasting menu|date night dinner)\b/i;

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

export function looksLikeCafeSearch(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (/\b(rooftop dinner|steakhouse|restaurants?)\b/i.test(t)) return false;
  return CAFE_RE.test(t);
}

export function looksLikeRestaurantSearch(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
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
