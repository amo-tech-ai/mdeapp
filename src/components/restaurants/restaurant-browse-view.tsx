import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { BrowseLayout } from "@/components/browse/BrowseLayout";
import { RestaurantCard } from "@/components/copilot/restaurant-card";
import { EmptyState } from "@/components/empty/empty-state";
import type { Restaurant } from "@/mastra/tools/search-restaurants";

const NEIGHBORHOODS = ["Laureles", "El Poblado", "Envigado", "Sabaneta"] as const;

const CUISINES = [
  { value: "paisa", label: "Paisa" },
  { value: "colombian", label: "Colombian" },
  { value: "cafe", label: "Café" },
  { value: "seafood", label: "Seafood" },
  { value: "steakhouse", label: "Steakhouse" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "international", label: "International" },
  { value: "street-food", label: "Street food" },
] as const;

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

function toggleNeighborhood(
  current: string | null,
  value: string,
): string | null {
  return current === value ? null : value;
}

function toggleCuisine(current: string | null, value: string): string | null {
  return current === value ? null : value;
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

  const filterBar = (
    <>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Neighborhood
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Neighborhood filters">
          {NEIGHBORHOODS.map((n) => {
            const active = neighborhood === n;
            return (
              <Link
                key={n}
                href={buildFilterUrl({
                  neighborhood: toggleNeighborhood(neighborhood, n),
                  cuisine,
                })}
                aria-pressed={active}
                data-testid={`restaurants-filter-neighborhood-${n.toLowerCase().replace(/\s+/g, "-")}`}
                className={`inline-flex min-h-9 items-center rounded-full border px-3 text-sm transition ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                {n}
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Cuisine</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Cuisine filters">
          {CUISINES.map(({ value, label }) => {
            const active = cuisine === value;
            return (
              <Link
                key={value}
                href={buildFilterUrl({
                  neighborhood,
                  cuisine: toggleCuisine(cuisine, value),
                })}
                aria-pressed={active}
                data-testid={`restaurants-filter-cuisine-${value}`}
                className={`inline-flex min-h-9 items-center rounded-full border px-3 text-sm transition ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <BrowseLayout
      testId="restaurants-browse"
      title="Restaurants"
      subtitle="Food & dining in Medellín — browse without chat"
      filterBar={filterBar}
    >
      <section className="mt-6" aria-label="Restaurant listings">
        {error ? (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"
            data-testid="restaurants-error"
          >
            <p className="text-sm text-destructive">{error}</p>
            <Link
              href={retryHref}
              className="mt-4 inline-flex min-h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted"
            >
              Retry
            </Link>
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
            className="grid gap-4 sm:grid-cols-2"
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
              />
            ))}
          </div>
        ) : null}
      </section>
    </BrowseLayout>
  );
}
