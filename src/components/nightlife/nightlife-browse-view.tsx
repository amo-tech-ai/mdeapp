import Link from "next/link";
import { MoonStar } from "lucide-react";
import { BrowseLayout } from "@/components/browse/BrowseLayout";
import { EmptyState } from "@/components/empty/empty-state";
import { Button } from "@/components/ui/button";
import { NightlifeBrowseCard } from "@/components/nightlife/nightlife-browse-card";
import { NightlifeBrowseFilters } from "@/components/nightlife/nightlife-browse-filters";
import type { NightlifeListing, NightlifeVibe } from "@/lib/nightlife-browse";

function buildFilterUrl(filters: {
  neighborhood?: string | null;
  vibe?: NightlifeVibe | null;
}): string {
  const params = new URLSearchParams();
  if (filters.neighborhood) params.set("neighborhood", filters.neighborhood);
  if (filters.vibe) params.set("vibe", filters.vibe);
  const query = params.toString();
  return query ? `/nightlife?${query}` : "/nightlife";
}

type NightlifeBrowseViewProps = {
  results: NightlifeListing[];
  error: string | null;
  neighborhood: string | null;
  vibe: NightlifeVibe | null;
};

export function NightlifeBrowseView({
  results,
  error,
  neighborhood,
  vibe,
}: NightlifeBrowseViewProps) {
  const retryHref = buildFilterUrl({ neighborhood, vibe });

  const notice = (
    <p
      className="mt-4 rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
      data-testid="nightlife-safety-notice"
    >
      Safety: use licensed taxis at night and stay in busy, well-lit areas.
    </p>
  );

  return (
    <BrowseLayout
      testId="nightlife-page"
      title="Nightlife"
      subtitle="Clubs & bars in Medellín — browse without chat"
      filterBar={
        <NightlifeBrowseFilters neighborhood={neighborhood} vibe={vibe} />
      }
      notice={notice}
    >
      <section className="mt-6" aria-label="Nightlife listings">
        {error ? (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"
            data-testid="nightlife-error"
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
            testId="nightlife-empty"
            title="No nightlife venues matched"
            description="Try another neighborhood or vibe, or ask the concierge on chat."
            icon={<MoonStar className="size-8" aria-hidden />}
          />
        ) : null}

        {!error && results.length > 0 ? (
          <div
            className="grid auto-rows-fr gap-4 sm:grid-cols-2"
            aria-label={`${results.length} nightlife venues`}
            data-testid="nightlife-grid"
          >
            {results.map((listing) => (
              <NightlifeBrowseCard
                key={listing.id}
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
