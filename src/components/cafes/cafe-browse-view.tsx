import Link from "next/link";
import { Coffee } from "lucide-react";
import { BrowseLayout } from "@/components/browse/BrowseLayout";
import { EmptyState } from "@/components/empty/empty-state";
import { Button } from "@/components/ui/button";
import { VenueBrowseCard } from "@/components/browse/venue-browse-card";
import { CafeBrowseFilters } from "@/components/cafes/cafe-browse-filters";
import type { CafeFeature, CafeListing } from "@/lib/cafe-browse";

function buildFilterUrl(filters: {
  neighborhood?: string | null;
  feature?: CafeFeature | null;
}): string {
  const params = new URLSearchParams();
  if (filters.neighborhood) params.set("neighborhood", filters.neighborhood);
  if (filters.feature) params.set("feature", filters.feature);
  const query = params.toString();
  return query ? `/cafes?${query}` : "/cafes";
}

type CafeBrowseViewProps = {
  results: CafeListing[];
  error: string | null;
  neighborhood: string | null;
  feature: CafeFeature | null;
};

export function CafeBrowseView({
  results,
  error,
  neighborhood,
  feature,
}: CafeBrowseViewProps) {
  const retryHref = buildFilterUrl({ neighborhood, feature });

  return (
    <BrowseLayout
      testId="cafes-browse"
      title="Cafés"
      subtitle="Specialty coffee & workspace spots in Medellín — browse without chat"
      filterBar={
        <CafeBrowseFilters neighborhood={neighborhood} feature={feature} />
      }
    >
      <section className="mt-6" aria-label="Café listings">
        {error ? (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"
            data-testid="cafes-error"
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
            testId="cafes-empty"
            title="No cafés matched"
            description="Try another neighborhood or feature, or ask the concierge on chat."
            icon={<Coffee className="size-8" aria-hidden />}
          />
        ) : null}

        {!error && results.length > 0 ? (
          <div
            className="grid auto-rows-fr gap-4 sm:grid-cols-2"
            aria-label={`${results.length} cafés`}
            data-testid="cafes-grid"
          >
            {results.map((listing) => (
              <VenueBrowseCard
                key={listing.id}
                kind="cafe"
                listing={listing}
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
