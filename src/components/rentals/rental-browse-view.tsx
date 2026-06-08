"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { BrowseLayout } from "@/components/browse/BrowseLayout";
import { BrowseMapContextShell } from "@/components/browse/BrowseMapContextShell";
import { BrowseMapPanel } from "@/components/browse/BrowseMapPanel";
import { BrowseMapSheet } from "@/components/browse/BrowseMapSheet";
import { RentalBrowseCard } from "@/components/rentals/rental-browse-card";
import { RentalBrowseFilters } from "@/components/rentals/rental-browse-filters";
import { EmptyState } from "@/components/empty/empty-state";
import { Button } from "@/components/ui/button";
import { useMapContext } from "@/platform/maps/map-context";
import { useBrowseMapSync } from "@/hooks/use-browse-map-sync";
import { useBrowseCardScroll } from "@/hooks/use-browse-card-scroll";
import { rentalToMapPin } from "@/lib/browse/browse-pin-converters";
import type { Rental } from "@/mastra/tools/search-rentals";

function buildRetryHref(filters: {
  neighborhood?: string | null;
  beds?: string | null;
  maxPrice?: string | null;
}): string {
  const p = new URLSearchParams();
  if (filters.neighborhood) p.set("neighborhood", filters.neighborhood);
  if (filters.beds) p.set("beds", filters.beds);
  if (filters.maxPrice) p.set("maxPrice", filters.maxPrice);
  const q = p.toString();
  return q ? `/rentals?${q}` : "/rentals";
}

function formatCountSubtitle(total: number, shown: number): string {
  if (total === 0) return "0 apartments";
  if (total === 1) return "1 apartment";
  if (shown < total) return `${total} apartments (showing ${shown})`;
  return `${total} apartments`;
}

export type RentalBrowseViewProps = {
  results: Rental[];
  total: number;
  error: string | null;
  neighborhood: string | null;
  beds: string | null;
  maxPrice: string | null;
};

function RentalBrowseViewInner({
  results,
  total,
  error,
  neighborhood,
  beds,
  maxPrice,
}: RentalBrowseViewProps) {
  const { selectedPinId, setSelectedPinId } = useMapContext();
  const retryHref = buildRetryHref({ neighborhood, beds, maxPrice });

  const pins = useMemo(
    () =>
      results.flatMap((r) => {
        const pin = rentalToMapPin(r);
        return pin ? [pin] : [];
      }),
    [results],
  );

  useBrowseMapSync(pins, "rental");
  useBrowseCardScroll();

  const countLabel = formatCountSubtitle(total, results.length);

  return (
    <>
      <BrowseLayout
        testId="rentals-browse"
        title="Rentals in Medellín"
        subtitle={`Curated long-stay apartments — ${countLabel}`}
        filterBar={
          <RentalBrowseFilters
            neighborhood={neighborhood}
            beds={beds}
            maxPrice={maxPrice}
          />
        }
        mapSlot={<BrowseMapPanel />}
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
              className="grid gap-4 sm:grid-cols-2"
              aria-label={`${results.length} rentals`}
              data-testid="rentals-grid"
            >
              {results.map((r) => {
                const pinId = `rental-${r.id}`;
                return (
                  <RentalBrowseCard
                    key={r.id}
                    rental={r}
                    selected={selectedPinId === pinId}
                    onSelect={() => setSelectedPinId(pinId)}
                  />
                );
              })}
            </div>
          ) : null}
        </section>
      </BrowseLayout>

      <BrowseMapSheet />
    </>
  );
}

export function RentalBrowseView(props: RentalBrowseViewProps) {
  return (
    <BrowseMapContextShell>
      <RentalBrowseViewInner {...props} />
    </BrowseMapContextShell>
  );
}
