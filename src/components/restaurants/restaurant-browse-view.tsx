import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { BrowseLayout } from "@/components/browse/BrowseLayout";
import { RestaurantCard } from "@/components/copilot/restaurant-card";
import { RestaurantBrowseFilters } from "@/components/restaurants/restaurant-browse-filters";
import { EmptyState } from "@/components/empty/empty-state";
import { Button } from "@/components/ui/button";
import type { Restaurant } from "@/mastra/tools/search-restaurants";

function buildFilterUrl(filters: {
  neighborhood?: string | null;
  cuisine?: string | null;
}): string {
  const params = new URLSearchParams();
  if (filters.neighborhood) params.set("neighborhood", filters.neighborhood);
  if (filters.cuisine) params.set("cuisine", filters.cuisine);
  const query = params.toString();
  return query ? `/restaurants?${query}` : "/restaurants";
}

type RestaurantBrowseViewProps = {
  results: Restaurant[];
  error: string | null;
  neighborhood: string | null;
  cuisine: string | null;
};

export function RestaurantBrowseView({
  results,
  error,
  neighborhood,
  cuisine,
}: RestaurantBrowseViewProps) {
  const retryHref = buildFilterUrl({ neighborhood, cuisine });

  return (
    <BrowseLayout
      testId="restaurants-browse"
      title="Restaurants"
      subtitle="Food & dining in Medellín — browse without chat"
      filterBar={
        <RestaurantBrowseFilters neighborhood={neighborhood} cuisine={cuisine} />
      }
    >
      <section className="mt-6" aria-label="Restaurant listings">
        {error ? (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"
            data-testid="restaurants-error"
          >
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              nativeButton={false}
              render={<Link href={retryHref} />}
            >
              Retry
            </Button>
          </div>
        ) : null}

        {!error && results.length === 0 ? (
          <EmptyState
            testId="restaurants-empty"
            title="No restaurants matched"
            description="Try another neighborhood or cuisine, or ask the concierge on chat."
            icon={<UtensilsCrossed className="size-8" aria-hidden />}
          />
        ) : null}

        {!error && results.length > 0 ? (
          <div
            className="grid auto-rows-fr gap-4 sm:grid-cols-2"
            aria-label={`${results.length} restaurants`}
            data-testid="restaurants-grid"
          >
            {results.map((r) => (
              <RestaurantCard
                key={r.id}
                title={r.name}
                neighborhood={r.neighborhood}
                cuisine={r.cuisine}
                priceTier={r.priceTier}
                avgPricePerPerson={r.avgPricePerPerson}
                rating={r.rating}
                imageUrl={r.imageUrl}
                mapsUrl={r.mapsUrl}
                aiSummary={r.aiSummary}
                pinId={`restaurant-${r.id}`}
                testId={`restaurant-card-${r.id}`}
                composition="nova"
                mediaLayout="cover"
              />
            ))}
          </div>
        ) : null}
      </section>
    </BrowseLayout>
  );
}
