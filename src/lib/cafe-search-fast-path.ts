import { analyzeVenueIntelligenceQuery } from "@/mastra/lib/intelligence-restaurant-venue-wrapper";

export type CafeSearchApiParams = {
  query: string;
  neighborhood?: string;
  limit?: number;
  intent?: "cafe" | "nightlife";
};

const FAST_PATH_LIMIT = 5;

export function buildCafeSearchParams(text: string): CafeSearchApiParams | null {
  const trimmed = text.trim();
  const analysis = analyzeVenueIntelligenceQuery(trimmed);
  if (analysis.action !== "search_now") return null;
  if (analysis.route === "nightlife_anchor") {
    return {
      query: analysis.slots.queryText,
      neighborhood: analysis.slots.neighborhood,
      limit: FAST_PATH_LIMIT,
      intent: "nightlife",
    };
  }
  if (analysis.route === "cafe_anchor") {
    return {
      query: analysis.slots.queryText,
      neighborhood: analysis.slots.neighborhood,
      limit: FAST_PATH_LIMIT,
      intent: "cafe",
    };
  }
  return null;
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
    if (query && analyzeVenueIntelligenceQuery(query).route === "nightlife_anchor") {
      return "No nightlife venues matched — try salsa bars, rooftops, or another neighborhood.";
    }
    return "No cafés matched — try another neighborhood or phrasing.";
  }
  const area = neighborhood ? ` in the ${neighborhood} area` : " in Medellín";
  if (query && analyzeVenueIntelligenceQuery(query).route === "nightlife_anchor") {
    return `Found ${count} nightlife venue${count === 1 ? "" : "s"}${area} — see cards below and pins on the map.`;
  }
  return `Found ${count} specialty coffee shop${count === 1 ? "" : "s"}${area} — see cards below and pins on the map.`;
}
