import {
  looksLikeCafeSearch,
  looksLikeNightlifeGroundingSearch,
  scoreRestaurantQuery,
} from "@/lib/restaurant-query-classifier";

export type CafeSearchApiParams = {
  query: string;
  neighborhood?: string;
  limit?: number;
};

const FAST_PATH_LIMIT = 5;

export function buildCafeSearchParams(text: string): CafeSearchApiParams | null {
  const trimmed = text.trim();
  if (!looksLikeCafeSearch(trimmed) && !looksLikeNightlifeGroundingSearch(trimmed)) {
    return null;
  }
  const { neighborhood } = scoreRestaurantQuery(trimmed);
  return {
    query: trimmed,
    neighborhood,
    limit: FAST_PATH_LIMIT,
  };
}

export function canFastPathCafeSearch(text: string): boolean {
  return buildCafeSearchParams(text) != null;
}

export function fastPathCafeSummary(
  count: number,
  neighborhood?: string,
  query?: string,
): string {
  if (count === 0) {
    if (query && looksLikeNightlifeGroundingSearch(query)) {
      return "No nightlife venues matched — try salsa bars, rooftops, or another neighborhood.";
    }
    return "No cafés matched — try another neighborhood or phrasing.";
  }
  const area = neighborhood ? ` in the ${neighborhood} area` : " in Medellín";
  if (query && looksLikeNightlifeGroundingSearch(query)) {
    return `Found ${count} nightlife venue${count === 1 ? "" : "s"}${area} — see cards below and pins on the map.`;
  }
  return `Found ${count} specialty coffee shop${count === 1 ? "" : "s"}${area} — see cards below and pins on the map.`;
}
