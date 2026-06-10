import type { ConciergeWorkingMemory } from "@/lib/types";
import type { Restaurant } from "@/mastra/tools/search-restaurants";
import { analyzeVenueIntelligenceQuery } from "@/mastra/lib/intelligence-restaurant-venue-wrapper";
import {
  hasRestaurantFastPathSignals,
  isGenericRestaurantQuery,
  looksLikeRestaurantDiscovery,
  looksLikeNightlifeGroundingSearch,
  looksLikeCafeSearch,
  scoreRestaurantQuery,
} from "@/lib/restaurant-query-classifier";

export type RestaurantSearchApiParams = {
  neighborhood?: string;
  cuisine?: string;
  queryText?: string;
  priceTier?: "$" | "$$" | "$$$";
  userLatitude?: number;
  userLongitude?: number;
  limit?: number;
};

const FAST_PATH_LIMIT = 5;

function looksLikeNonRestaurantSearch(text: string): boolean {
  return looksLikeNightlifeGroundingSearch(text) || looksLikeCafeSearch(text);
}

/** Show canned clarify + filter chips without calling conciergeAgent. */
export function shouldInstantRestaurantClarify(
  text: string,
  memory: ConciergeWorkingMemory,
): boolean {
  return (
    isGenericRestaurantQuery(text) &&
    memory.lastRestaurantQuery?.genericAskPending !== true
  );
}

function attachQueryText(
  params: RestaurantSearchApiParams,
  text: string,
): RestaurantSearchApiParams {
  const trimmed = text.trim();
  if (!trimmed) return params;
  return { ...params, queryText: trimmed };
}

/** Run Supabase search via /api/restaurants/search (skip LLM). */
export function buildRestaurantSearchParams(
  text: string,
  memory?: ConciergeWorkingMemory,
  overrides?: Partial<RestaurantSearchApiParams>,
): RestaurantSearchApiParams | null {
  if (looksLikeNonRestaurantSearch(text)) return null;

  const s = scoreRestaurantQuery(text);
  const q = memory?.lastRestaurantQuery;

  if (overrides) {
    const base: RestaurantSearchApiParams = {
      neighborhood: overrides.neighborhood ?? q?.neighborhood ?? s.neighborhood,
      cuisine: overrides.cuisine ?? q?.cuisine ?? s.cuisine,
      priceTier: overrides.priceTier ?? q?.priceTier ?? s.priceTier,
      userLatitude: overrides.userLatitude ?? q?.ephemeralLatitude,
      userLongitude: overrides.userLongitude ?? q?.ephemeralLongitude,
      limit: FAST_PATH_LIMIT,
    };
    const prompt =
      overrides.queryText ??
      composeRestaurantQueryText(text, {
        cuisine: base.cuisine,
        vibe: q?.vibe ?? s.vibe,
        neighborhood: base.neighborhood,
        priceTier: base.priceTier,
        nearMe: Boolean(base.userLatitude),
      });
    return attachQueryText({ ...base, queryText: prompt }, prompt);
  }

  if (q?.genericAskPending === true && hasRestaurantFastPathSignals(text, s)) {
    return attachQueryText(
      {
        neighborhood: s.neighborhood ?? q.neighborhood,
        cuisine: s.cuisine ?? q.cuisine,
        priceTier: s.priceTier ?? q.priceTier,
        userLatitude: s.nearMe ? q.ephemeralLatitude : undefined,
        userLongitude: s.nearMe ? q.ephemeralLongitude : undefined,
        queryText: text.trim(),
        limit: FAST_PATH_LIMIT,
      },
      text,
    );
  }

  const analysis = analyzeVenueIntelligenceQuery(text);
  if (analysis.route === "restaurant_hybrid" && analysis.action === "search_now") {
    return {
      neighborhood: analysis.slots.neighborhood ?? s.neighborhood,
      cuisine: analysis.slots.cuisine ?? s.cuisine,
      priceTier: s.priceTier,
      queryText: composeRestaurantQueryText(text, {
        cuisine: analysis.slots.cuisine ?? s.cuisine,
        vibe: s.vibe,
        neighborhood: analysis.slots.neighborhood ?? s.neighborhood,
        priceTier: s.priceTier,
      }),
      limit: FAST_PATH_LIMIT,
    };
  }

  if (looksLikeRestaurantDiscovery(text) && hasRestaurantFastPathSignals(text, s)) {
    return attachQueryText(
      {
        neighborhood: s.neighborhood,
        cuisine: s.cuisine,
        priceTier: s.priceTier,
        queryText: composeRestaurantQueryText(text, s),
        limit: FAST_PATH_LIMIT,
      },
      text,
    );
  }

  return null;
}

export function canFastPathRestaurantSearch(
  text: string,
  memory?: ConciergeWorkingMemory,
): boolean {
  if (shouldInstantRestaurantClarify(text, memory ?? {})) return true;
  return buildRestaurantSearchParams(text, memory) != null;
}

export function composeRestaurantQueryText(
  text: string,
  signals: {
    cuisine?: string;
    vibe?: string;
    neighborhood?: string;
    priceTier?: string;
    nearMe?: boolean;
  },
): string {
  const parts: string[] = [];
  if (signals.cuisine) parts.push(signals.cuisine);
  if (signals.vibe) parts.push(signals.vibe);
  parts.push("restaurants");
  if (signals.neighborhood) parts.push(`in ${signals.neighborhood}`);
  if (signals.nearMe) parts.push("near me");
  if (signals.priceTier) parts.push(signals.priceTier);
  if (parts.length <= 1) return text.trim();
  return parts.join(" ");
}

export function restaurantsToToolEnvelope(cards: Restaurant[]) {
  return {
    results: cards.map((r) => ({
      id: r.id,
      title: r.name,
      name: r.name,
      neighborhood: r.neighborhood,
      avgPricePerPerson: r.avgPricePerPerson,
      latitude: r.latitude ?? null,
      longitude: r.longitude ?? null,
      sourceUrl: r.sourceUrl,
      imageUrl: r.imageUrl,
      placeId: r.placeId ?? null,
      mapsUrl: r.mapsUrl ?? null,
      aiSummary: r.aiSummary ?? null,
    })),
    total: cards.length,
    source: "supabase" as const,
  };
}

export function fastPathRestaurantSummary(count: number, neighborhood?: string): string {
  if (count === 0) {
    return "No restaurants matched — try another neighborhood or cuisine.";
  }
  const area = neighborhood ? ` in ${neighborhood}` : " across Medellín";
  return `Found ${count} restaurant${count === 1 ? "" : "s"}${area} — see cards below and pins on the map.`;
}
