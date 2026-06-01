import type { Restaurant } from "@/mastra/tools/search-restaurants";
import {
  looksLikeRestaurantSearch,
  scoreRestaurantQuery,
} from "@/lib/restaurant-query-classifier";

export type RestaurantSearchApiParams = {
  neighborhood?: string;
  cuisine?: string;
  queryText?: string;
  limit?: number;
};

const FAST_PATH_LIMIT = 5;

export function buildRestaurantSearchParams(
  text: string,
): RestaurantSearchApiParams | null {
  if (!looksLikeRestaurantSearch(text)) return null;

  const s = scoreRestaurantQuery(text);
  return {
    neighborhood: s.neighborhood,
    cuisine: s.cuisine,
    queryText: text.trim(),
    limit: FAST_PATH_LIMIT,
  };
}

export function canFastPathRestaurantSearch(text: string): boolean {
  return buildRestaurantSearchParams(text) != null;
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
