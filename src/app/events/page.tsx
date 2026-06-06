import { fetchPublicEventsCatalog } from "@/lib/events/fetch-public-events-catalog";
import { EventBrowseView } from "@/components/events/event-browse-view";
import type { DateWindow, EventCategory } from "@/mastra/tools/search-events";

export const metadata = {
  title: "Events in Medellín · mdeai",
  description:
    "Browse published events in Medellín — filter by date, category, neighborhood, and price.",
};

const CATEGORY_VALUES = new Set<string>([
  "music",
  "food",
  "culture",
  "sport",
  "nightlife",
]);

const DATE_WINDOW_VALUES = new Set<string>([
  "tonight",
  "this_weekend",
  "this_week",
  "next_week",
  "any",
]);

const PRICE_VALUES = new Set<string>(["free", "paid"]);

function normalizeSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0]?.trim() || undefined;
  return value?.trim() || undefined;
}

type EventsPageProps = {
  searchParams: Promise<{
    category?: string | string[];
    neighborhood?: string | string[];
    dateWindow?: string | string[];
    price?: string | string[];
  }>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const neighborhood = normalizeSearchParam(params.neighborhood);
  const categoryRaw = normalizeSearchParam(params.category);
  const dateWindowRaw = normalizeSearchParam(params.dateWindow);
  const priceRaw = normalizeSearchParam(params.price);

  const category =
    categoryRaw && CATEGORY_VALUES.has(categoryRaw)
      ? (categoryRaw as EventCategory)
      : undefined;
  const dateWindow =
    dateWindowRaw && DATE_WINDOW_VALUES.has(dateWindowRaw)
      ? (dateWindowRaw as DateWindow)
      : undefined;
  const price =
    priceRaw && PRICE_VALUES.has(priceRaw)
      ? (priceRaw as "free" | "paid")
      : undefined;

  const { results, total, error } = await fetchPublicEventsCatalog({
    category,
    neighborhood,
    dateWindow: dateWindow && dateWindow !== "any" ? dateWindow : undefined,
    price,
    limit: 24,
  });

  return (
    <EventBrowseView
      results={results}
      total={total}
      error={error}
      category={category ?? null}
      neighborhood={neighborhood ?? null}
      dateWindow={dateWindow ?? null}
      price={price ?? null}
    />
  );
}
