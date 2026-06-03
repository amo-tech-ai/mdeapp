import { prepareRestaurantSearchResults } from "@/lib/restaurant-place-photo";
import { searchRestaurants } from "@/mastra/tools/search-restaurants";
import type { Cuisine, Restaurant } from "@/mastra/tools/search-restaurants";
import { RestaurantBrowseView } from "@/components/restaurants/restaurant-browse-view";

export const metadata = {
  title: "Restaurants · mdeai",
  description: "Browse restaurants in Medellín — neighborhoods, cuisine, and map-ready listings.",
};

const CUISINE_VALUES = new Set<string>([
  "colombian",
  "paisa",
  "seafood",
  "steakhouse",
  "vegetarian",
  "cafe",
  "international",
  "street-food",
]);

type RestaurantsPageProps = {
  searchParams: Promise<{ neighborhood?: string; cuisine?: string }>;
};

async function loadRestaurants(filters: {
  neighborhood?: string;
  cuisine?: Cuisine;
}): Promise<{ results: Restaurant[]; error: string | null }> {
  try {
    const { results } = await searchRestaurants({
      neighborhood: filters.neighborhood,
      cuisine: filters.cuisine,
      limit: 12,
    });
    const enriched = await prepareRestaurantSearchResults(results);
    return { results: enriched, error: null };
  } catch {
    return {
      results: [],
      error: "Could not load restaurants. Try again in a moment.",
    };
  }
}

export default async function RestaurantsPage({
  searchParams,
}: RestaurantsPageProps) {
  const params = await searchParams;
  const neighborhood = params.neighborhood?.trim() || undefined;
  const cuisineRaw = params.cuisine?.trim();
  const cuisine = cuisineRaw && CUISINE_VALUES.has(cuisineRaw)
    ? (cuisineRaw as Cuisine)
    : undefined;

  const { results, error } = await loadRestaurants({ neighborhood, cuisine });

  return (
    <RestaurantBrowseView
      results={results}
      error={error}
      neighborhood={neighborhood ?? null}
      cuisine={cuisine ?? null}
    />
  );
}
