/**
 * INT-021 — Restaurant & Venue Intelligence Wrapper
 * Routes queries to SEARCH-003 (restaurant hybrid), DATA-041 café/nightlife anchors,
 * or VEN-025 nightlife grounding — without changing DATA-041 rank math.
 */
import type { SharedSlots } from "@/lib/intent-slots";
import {
  looksLikeCafeSearch,
  looksLikeNightlifeGroundingSearch,
  looksLikeRestaurantSearch,
  looksLikeTicketedEventSearch,
  scoreRestaurantQuery,
} from "@/lib/restaurant-query-classifier";
import {
  parseIntelligenceSlots,
  type IntelligenceSlots,
} from "./intelligence-restaurant-search";

export type VenueIntelligenceRoute =
  | "restaurant_hybrid"
  | "cafe_anchor"
  | "nightlife_anchor"
  | "clarify"
  | "unsupported";

export type VenueIntelligenceIntent =
  | "restaurant_search"
  | "cafe_search"
  | "venue_search";

export type VenueIntelligenceAnalysis = {
  route: VenueIntelligenceRoute;
  intent: VenueIntelligenceIntent;
  action: "search_now" | "clarify";
  confidence: number;
  reason: string;
  slots: IntelligenceSlots & {
    queryText: string;
    cuisine?: string;
  };
  sharedSlots: Pick<
    SharedSlots,
    "neighborhood" | "queryText" | "timeOfDay" | "groupSize" | "occasion" | "needs" | "vibes"
  >;
  rankReasonHints: string[];
  clarification?: {
    message: string;
    options: string[];
  };
  userExplanation: string;
};

const AMBIGUOUS_VENUE_RE =
  /\b(nice|good|great|best|cool|fun)\s+(place|spot|venue|location)\b/i;

const LOCAL_RESTAURANT_RE =
  /\b(local|authentic|hidden gem|not touristy|avoid tourist|non-touristy)\b/i;

const RENTAL_RE =
  /\b(1\s?br|2\s?br|bedroom|apartment|rental|rentals|airbnb|under\s+\$?\d+\s*(?:\/night|per night)|monthly)\b/i;

function hasClearVerticalSignal(text: string): boolean {
  const slots = parseIntelligenceSlots(text);
  const hasHood = Boolean(slots.neighborhood ?? scoreRestaurantQuery(text).neighborhood);
  return (
    looksLikeNightlifeGroundingSearch(text) ||
    looksLikeCafeSearch(text) ||
    looksLikeRestaurantSearch(text) ||
    (LOCAL_RESTAURANT_RE.test(text) && hasHood) ||
    ((slots.wantsRooftop || slots.wantsQuiet) && hasHood)
  );
}

function isAmbiguousVenueQuery(text: string): boolean {
  const t = text.trim();
  if (!t || RENTAL_RE.test(t)) return false;
  if (looksLikeTicketedEventSearch(t)) return false;
  if (hasClearVerticalSignal(t)) return false;
  return AMBIGUOUS_VENUE_RE.test(t) || /\bgood spot\b/i.test(t);
}

function buildRankReasonHints(slots: IntelligenceSlots): string[] {
  const hints: string[] = [];
  if (slots.wantsRooftop) hints.push("rooftop_score");
  if (slots.wantsQuiet) hints.push("quiet_score");
  if (slots.wantsDateNight) hints.push("date_night_score");
  if (slots.wantsCocktails) hints.push("cocktail_score");
  if (slots.wantsHiddenGem) hints.push("hidden_gem_score");
  if (slots.wantsAntiTouristy) hints.push("touristy_score");
  if (slots.wantsValue) hints.push("value_score");
  if (slots.wantsService) hints.push("service_score");
  if (slots.wantsNomad || slots.wantsSpecialtyCoffee) {
    hints.push("digital_nomad_score", "wifi_score");
  }
  if (slots.wantsNightlife || slots.wantsSalsa) {
    hints.push("nightlife_score", "local_authenticity_score");
  }
  return hints;
}

function buildSharedSlots(
  queryText: string,
  slots: IntelligenceSlots,
  cuisine?: string,
): VenueIntelligenceAnalysis["sharedSlots"] {
  const q = queryText.toLowerCase();
  let timeOfDay: SharedSlots["timeOfDay"];
  if (/\blunch\b/.test(q)) timeOfDay = "lunch";
  else if (/\bbrunch\b/.test(q)) timeOfDay = "brunch";
  else if (/\bdinner\b/.test(q)) timeOfDay = "dinner";
  else if (/\btonight\b/.test(q)) timeOfDay = "late-night";

  const groupMatch =
    q.match(/\bfor\s+(\d+)\s+(?:people|persons|guests)\b/) ||
    q.match(/\bparty\s+of\s+(\d+)\b/);
  const groupSize = groupMatch ? parseInt(groupMatch[1], 10) : undefined;

  let occasion: SharedSlots["occasion"];
  if (/\bromantic|date night|anniversary\b/.test(q)) occasion = "date-night";
  else if (/\bfriends\b/.test(q)) occasion = "friends";
  else if (/\bfamily\b/.test(q)) occasion = "family";

  const needs: string[] = [];
  if (slots.wantsNomad || /\bwifi|laptop|work spot\b/.test(q)) needs.push("remote_work");
  if (slots.wantsQuiet) needs.push("quiet");

  const vibes: string[] = [];
  if (slots.wantsSalsa) vibes.push("salsa");
  if (slots.wantsNightlife) vibes.push("nightlife");
  if (cuisine) vibes.push(cuisine);

  return {
    neighborhood: slots.neighborhood,
    queryText,
    timeOfDay,
    groupSize,
    occasion,
    needs: needs.length ? needs : undefined,
    vibes: vibes.length ? vibes : undefined,
  };
}

function buildClarification(text: string): VenueIntelligenceAnalysis["clarification"] {
  const hood =
    parseIntelligenceSlots(text).neighborhood ??
    (/\blaureles\b/i.test(text)
      ? "Laureles"
      : /\b(poblado|provenza)\b/i.test(text)
        ? "El Poblado"
        : undefined);
  const area = hood ? ` in ${hood}` : "";
  return {
    message: `What kind of spot are you looking for${area} — sit-down dinner, specialty coffee, or nightlife bars and clubs?`,
    options: ["Restaurant dinner", "Specialty café", "Nightlife / bars"],
  };
}

function buildUserExplanation(params: {
  route: VenueIntelligenceRoute;
  slots: IntelligenceSlots;
  neighborhood?: string;
  rankReasonHints: string[];
}): string {
  const { route, slots, neighborhood, rankReasonHints } = params;
  const area = neighborhood ? ` in ${neighborhood}` : " in Medellín";
  if (route === "clarify") {
    return "Need a bit more detail before searching — dinner, café, or nightlife?";
  }
  if (route === "restaurant_hybrid") {
    const vibes: string[] = [];
    if (slots.wantsDateNight) vibes.push("date-night");
    if (slots.wantsRooftop) vibes.push("rooftop");
    if (slots.wantsQuiet) vibes.push("quiet");
    if (slots.wantsAntiTouristy) vibes.push("local, not touristy");
    if (slots.wantsCocktails) vibes.push("cocktails");
    if (slots.wantsValue) vibes.push("good value");
    const vibeText = vibes.length ? ` (${vibes.join(", ")})` : "";
    const signalNote =
      rankReasonHints.length > 0
        ? " Rank uses venue_signals boosts — underlying scores unchanged."
        : "";
    return `Searching restaurants${area}${vibeText}.${signalNote}`;
  }
  if (route === "cafe_anchor") {
    return `Searching specialty cafés${area} with signal-backed ranking for quiet and work-friendly spots.`;
  }
  if (route === "nightlife_anchor") {
    return `Searching nightlife venues${area} — bars and clubs, not ticketed events.`;
  }
  return "Query routed outside restaurant and venue discovery.";
}

/** Main INT-021 entry — classify, route, explain; no search I/O. */
export function analyzeVenueIntelligenceQuery(
  queryText: string,
): VenueIntelligenceAnalysis {
  const text = queryText.trim();
  const empty: VenueIntelligenceAnalysis = {
    route: "unsupported",
    intent: "restaurant_search",
    action: "search_now",
    confidence: 0,
    reason: "empty query",
    slots: { queryText: text },
    sharedSlots: { queryText: text },
    rankReasonHints: [],
    userExplanation: buildUserExplanation({
      route: "unsupported",
      slots: {},
      rankReasonHints: [],
    }),
  };
  if (!text) return empty;

  if (RENTAL_RE.test(text) || looksLikeTicketedEventSearch(text)) {
    return {
      ...empty,
      route: "unsupported",
      reason: "rental or ticketed event query",
    };
  }

  if (isAmbiguousVenueQuery(text)) {
    const slots = parseIntelligenceSlots(text);
    return {
      route: "clarify",
      intent: "venue_search",
      action: "clarify",
      confidence: 0.42,
      reason: "ambiguous venue phrasing",
      slots: { ...slots, queryText: text },
      sharedSlots: buildSharedSlots(text, slots),
      rankReasonHints: [],
      clarification: buildClarification(text),
      userExplanation: buildUserExplanation({
        route: "clarify",
        slots,
        neighborhood: slots.neighborhood,
        rankReasonHints: [],
      }),
    };
  }

  const signalSlots = parseIntelligenceSlots(text);
  const { neighborhood, cuisine } = scoreRestaurantQuery(text);
  const mergedSlots: VenueIntelligenceAnalysis["slots"] = {
    ...signalSlots,
    neighborhood: neighborhood ?? signalSlots.neighborhood,
    queryText: text,
    cuisine,
  };
  const rankReasonHints = buildRankReasonHints(mergedSlots);
  const sharedSlots = buildSharedSlots(text, mergedSlots, cuisine);

  if (looksLikeNightlifeGroundingSearch(text)) {
    return {
      route: "nightlife_anchor",
      intent: "venue_search",
      action: "search_now",
      confidence: 0.88,
      reason: "VEN-025 nightlife grounding",
      slots: { ...mergedSlots, wantsNightlife: true },
      sharedSlots,
      rankReasonHints,
      userExplanation: buildUserExplanation({
        route: "nightlife_anchor",
        slots: mergedSlots,
        neighborhood: mergedSlots.neighborhood,
        rankReasonHints,
      }),
    };
  }

  if (looksLikeCafeSearch(text)) {
    return {
      route: "cafe_anchor",
      intent: "cafe_search",
      action: "search_now",
      confidence: 0.86,
      reason: "café / work-spot signals",
      slots: { ...mergedSlots, wantsSpecialtyCoffee: /\bspecialty|third-wave\b/i.test(text) },
      sharedSlots,
      rankReasonHints,
      userExplanation: buildUserExplanation({
        route: "cafe_anchor",
        slots: mergedSlots,
        neighborhood: mergedSlots.neighborhood,
        rankReasonHints,
      }),
    };
  }

  const localRestaurant =
    LOCAL_RESTAURANT_RE.test(text) &&
    mergedSlots.neighborhood &&
    !looksLikeCafeSearch(text);

  const rooftopDinner =
    (mergedSlots.wantsRooftop || mergedSlots.wantsQuiet) &&
    mergedSlots.neighborhood &&
    !looksLikeNightlifeGroundingSearch(text) &&
    !looksLikeCafeSearch(text);

  if (looksLikeRestaurantSearch(text) || localRestaurant || rooftopDinner) {
    return {
      route: "restaurant_hybrid",
      intent: "restaurant_search",
      action: "search_now",
      confidence: localRestaurant || rooftopDinner ? 0.78 : 0.85,
      reason: localRestaurant
        ? "local/authentic restaurant signals"
        : rooftopDinner
          ? "rooftop/quiet restaurant signals"
          : "SEARCH-003 restaurant hybrid",
      slots: mergedSlots,
      sharedSlots,
      rankReasonHints,
      userExplanation: buildUserExplanation({
        route: "restaurant_hybrid",
        slots: mergedSlots,
        neighborhood: mergedSlots.neighborhood,
        rankReasonHints,
      }),
    };
  }

  return {
    ...empty,
    reason: "no restaurant or venue vertical match",
  };
}

export function shouldClarifyVenueIntelligence(queryText: string): boolean {
  return analyzeVenueIntelligenceQuery(queryText).action === "clarify";
}

export function getVenueIntelligenceClarification(queryText: string): string | null {
  const analysis = analyzeVenueIntelligenceQuery(queryText);
  return analysis.clarification?.message ?? null;
}
