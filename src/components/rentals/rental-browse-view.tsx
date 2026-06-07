"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { BrowseLayout } from "@/components/browse/BrowseLayout";
import { RentalCard } from "@/components/copilot/rental-card";
import { RentalBrowseFilters } from "@/components/rentals/rental-browse-filters";
import { EmptyState } from "@/components/empty/empty-state";
import { Button } from "@/components/ui/button";
import type { Rental } from "@/mastra/tools/search-rentals";

function buildRetryHref(filters: {
  neighborhood?: string | null;
  beds?: string | null;
  maxPrice?: string | null;
}): string {
  const p = new URLSearchParams();
  if (filters.neighborhood) p.set("neighborhood", filters.neighborhood);
  if (filters.beds)         p.set("beds", filters.beds);
  if (filters.maxPrice)     p.set("maxPrice", filters.maxPrice);
  const q = p.toString();
  return q ? `/rentals?${q}` : "/rentals";
}

type RentalBrowseViewProps = {
  results: Rental[];
  error: string | null;
  neighborhood: string | null;
  beds: string | null;
  maxPrice: string | null;
};

export function RentalBrowseView({
  results,
  error,
  neighborhood,
  beds,
  maxPrice,
}: RentalBrowseViewProps) {
  const retryHref = buildRetryHref({ neighborhood, beds, maxPrice });

  return (
    <BrowseLayout
      testId="rentals-browse"
      title="Rentals"
      subtitle="Apartments & rentals in Medellín — browse without chat"
      filterBar={
        <RentalBrowseFilters
          neighborhood={neighborhood}
          beds={beds}
          maxPrice={maxPrice}
        />
      }
    >
      <section className="mt-6" aria-label="Rental listings">
        {error ? (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"
            data-testid="rentals-error"
          >
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              render={<Link href={retryHref} />}
            >
              Retry
            </Button>
          </div>
        ) : null}

        {!error && results.length === 0 ? (
          <EmptyState
            testId="rentals-empty"
            title="No rentals matched"
            description="Try another neighborhood or price range, or ask the concierge on chat."
            icon={<Building2 className="size-8" aria-hidden />}
          />
        ) : null}

        {!error && results.length > 0 ? (
          <div
            className="grid auto-rows-fr gap-4 sm:grid-cols-2"
            aria-label={`${results.length} rentals`}
            data-testid="rentals-grid"
          >
            {results.map((r) => (
              <RentalCard
                key={r.id}
                id={r.id}
                listingId={r.id}
                title={r.title}
                neighborhood={r.neighborhood}
                nightly_price={r.nightly_price}
                bedrooms={r.bedrooms}
                wifi={r.wifi}
                amenities={r.amenities}
                tags={r.tags}
                availability={r.availability}
                host_name={r.host_name}
                photoUrl={r.image}
                onSchedule={
                  r.schedule_viewing_url
                    ? () =>
                        window.open(
                          r.schedule_viewing_url,
                          "_blank",
                          "noopener,noreferrer",
                        )
                    : undefined
                }
              />
            ))}
          </div>
        ) : null}
      </section>
    </BrowseLayout>
  );
}
