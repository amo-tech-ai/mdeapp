"use client";

import Link from "next/link";
import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import type { DateWindow, EventCategory } from "@/mastra/tools/search-events";

const DATE_WINDOWS: { value: DateWindow; label: string }[] = [
  { value: "tonight", label: "Tonight" },
  { value: "this_weekend", label: "This weekend" },
  { value: "this_week", label: "This week" },
  { value: "next_week", label: "Next week" },
  { value: "any", label: "Any date" },
];

const CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: "music", label: "Music" },
  { value: "food", label: "Food" },
  { value: "culture", label: "Culture" },
  { value: "sport", label: "Sport" },
  { value: "nightlife", label: "Nightlife" },
];

const NEIGHBORHOODS = ["Laureles", "El Poblado", "Envigado", "Provenza"] as const;

const PRICES = [
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
] as const;

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

function toggleChip<T extends string>(current: T | null, value: T): T | null {
  return current === value ? null : value;
}

function toggleDateWindow(
  current: DateWindow | null,
  value: DateWindow,
): DateWindow | null {
  const active = current ?? "any";
  if (value === "any") return null;
  return active === value ? null : value;
}

const filterChipClass = cn(
  toggleVariants({ variant: "outline", size: "sm" }),
  "min-h-9 rounded-full px-3",
);

type EventBrowseFiltersProps = {
  category: EventCategory | null;
  neighborhood: string | null;
  dateWindow: DateWindow | null;
  price: "free" | "paid" | null;
};

export function EventBrowseFilters({
  category,
  neighborhood,
  dateWindow,
  price,
}: EventBrowseFiltersProps) {
  const activeDateWindow = dateWindow ?? "any";
  const dateForUrl =
    activeDateWindow === "any" ? null : activeDateWindow;

  return (
    <>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Date</p>
        <div
          role="group"
          aria-label="Date filters"
          className="flex flex-wrap gap-2"
        >
          {DATE_WINDOWS.map(({ value, label }) => {
            const active = activeDateWindow === value;
            return (
              <Link
                key={value}
                href={buildFilterUrl({
                  category,
                  neighborhood,
                  dateWindow: toggleDateWindow(dateWindow, value),
                  price,
                })}
                aria-pressed={active}
                data-testid={`events-filter-date-${value.replace(/_/g, "-")}`}
                className={cn(
                  filterChipClass,
                  active && "border-primary bg-primary/10 text-primary",
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Category
        </p>
        <div
          role="group"
          aria-label="Category filters"
          className="flex flex-wrap gap-2"
        >
          {CATEGORIES.map(({ value, label }) => {
            const active = category === value;
            return (
              <Link
                key={value}
                href={buildFilterUrl({
                  category: toggleChip(category, value),
                  neighborhood,
                  dateWindow: dateForUrl,
                  price,
                })}
                aria-pressed={active}
                data-testid={`events-filter-category-${value}`}
                className={cn(
                  filterChipClass,
                  active && "border-primary bg-primary/10 text-primary",
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Neighborhood
        </p>
        <div
          role="group"
          aria-label="Neighborhood filters"
          className="flex flex-wrap gap-2"
        >
          {NEIGHBORHOODS.map((n) => {
            const active = neighborhood === n;
            return (
              <Link
                key={n}
                href={buildFilterUrl({
                  category,
                  neighborhood: toggleChip(neighborhood, n),
                  dateWindow: dateForUrl,
                  price,
                })}
                aria-pressed={active}
                data-testid={`events-filter-neighborhood-${n.toLowerCase().replace(/\s+/g, "-")}`}
                className={cn(
                  filterChipClass,
                  active && "border-primary bg-primary/10 text-primary",
                )}
              >
                {n}
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Price</p>
        <div
          role="group"
          aria-label="Price filters"
          className="flex flex-wrap gap-2"
        >
          {PRICES.map(({ value, label }) => {
            const active = price === value;
            return (
              <Link
                key={value}
                href={buildFilterUrl({
                  category,
                  neighborhood,
                  dateWindow: dateForUrl,
                  price: toggleChip(price, value),
                })}
                aria-pressed={active}
                data-testid={`events-filter-price-${value}`}
                className={cn(
                  filterChipClass,
                  active && "border-primary bg-primary/10 text-primary",
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
