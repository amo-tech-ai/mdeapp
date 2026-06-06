import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { BrowseLayout } from "@/components/browse/BrowseLayout";
import { EventBrowseCard } from "@/components/events/event-browse-card";
import { EventBrowseFilters } from "@/components/events/event-browse-filters";
import { EmptyState } from "@/components/empty/empty-state";
import { Button } from "@/components/ui/button";
import type { PublishedEventListItem } from "@/lib/events/list-published-events";
import type { DateWindow, EventCategory } from "@/mastra/tools/search-events";

function buildFilterUrl(filters: {
  category?: EventCategory | null;
  neighborhood?: string | null;
  dateWindow?: DateWindow | null;
  price?: "free" | "paid" | null;
}): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.neighborhood) params.set("neighborhood", filters.neighborhood);
  if (filters.dateWindow && filters.dateWindow !== "any") {
    params.set("dateWindow", filters.dateWindow);
  }
  if (filters.price) params.set("price", filters.price);
  const query = params.toString();
  return query ? `/events?${query}` : "/events";
}

type EventBrowseViewProps = {
  results: PublishedEventListItem[];
  total: number;
  error: string | null;
  category: EventCategory | null;
  neighborhood: string | null;
  dateWindow: DateWindow | null;
  price: "free" | "paid" | null;
};

export function EventBrowseView({
  results,
  total,
  error,
  category,
  neighborhood,
  dateWindow,
  price,
}: EventBrowseViewProps) {
  const retryHref = buildFilterUrl({
    category,
    neighborhood,
    dateWindow,
    price,
  });
  const countLabel =
    total === 1 ? "1 upcoming event" : `${total} upcoming events`;

  return (
    <BrowseLayout
      testId="events-browse"
      title="Events in Medellín"
      subtitle={`Real published events — ${countLabel}`}
      filterBar={
        <EventBrowseFilters
          category={category}
          neighborhood={neighborhood}
          dateWindow={dateWindow}
          price={price}
        />
      }
    >
      <section className="mt-6" aria-label="Event listings">
        {error ? (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"
            data-testid="events-browse-error"
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
          <div className="space-y-4">
            <EmptyState
              testId="events-browse-empty"
              title="No events match"
              description="Try another date, category, or neighborhood — or ask the concierge on chat."
              icon={<CalendarDays className="size-8" aria-hidden />}
            />
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href="/" />}
              >
                Ask the concierge
              </Button>
            </div>
          </div>
        ) : null}

        {!error && results.length > 0 ? (
          <div
            className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-label={`${results.length} events`}
            data-testid="events-grid"
          >
            {results.map((event) => (
              <EventBrowseCard key={event.id} event={event} />
            ))}
          </div>
        ) : null}
      </section>
    </BrowseLayout>
  );
}
