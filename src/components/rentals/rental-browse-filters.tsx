"use client";

import Link from "next/link";
import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

const NEIGHBORHOODS = [
  "Laureles",
  "El Poblado",
  "Envigado",
  "Sabaneta",
  "Belén",
] as const;

const BEDS = [
  { value: "0", label: "Studio" },
  { value: "1", label: "1 BR" },
  { value: "2", label: "2 BR" },
  { value: "3", label: "3 BR+" },
] as const;

const MAX_PRICES = [
  { value: "50",  label: "≤ $50/night" },
  { value: "75",  label: "≤ $75/night" },
  { value: "100", label: "≤ $100/night" },
  { value: "150", label: "≤ $150/night" },
] as const;

function buildRentalsUrl(filters: {
  neighborhood?: string | null;
  beds?: string | null;
  maxPrice?: string | null;
}): string {
  const p = new URLSearchParams();
  if (filters.neighborhood) p.set("neighborhood", filters.neighborhood);
  if (filters.beds)        p.set("beds", filters.beds);
  if (filters.maxPrice)    p.set("maxPrice", filters.maxPrice);
  const q = p.toString();
  return q ? `/rentals?${q}` : "/rentals";
}

function toggle(current: string | null, value: string): string | null {
  return current === value ? null : value;
}

const chip = cn(
  toggleVariants({ variant: "outline", size: "sm" }),
  "min-h-9 rounded-full px-3",
);

type RentalBrowseFiltersProps = {
  neighborhood: string | null;
  beds: string | null;
  maxPrice: string | null;
};

export function RentalBrowseFilters({
  neighborhood,
  beds,
  maxPrice,
}: RentalBrowseFiltersProps) {
  return (
    <>
      {/* Neighborhood */}
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
                href={buildRentalsUrl({
                  neighborhood: toggle(neighborhood, n),
                  beds,
                  maxPrice,
                })}
                aria-pressed={active}
                data-testid={`rentals-filter-neighborhood-${n.toLowerCase().replace(/\s+/g, "-")}`}
                className={cn(
                  chip,
                  active && "border-primary bg-primary/10 text-primary",
                )}
              >
                {n}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Bedrooms
        </p>
        <div
          role="group"
          aria-label="Bedroom filters"
          className="flex flex-wrap gap-2"
        >
          {BEDS.map(({ value, label }) => {
            const active = beds === value;
            return (
              <Link
                key={value}
                href={buildRentalsUrl({
                  neighborhood,
                  beds: toggle(beds, value),
                  maxPrice,
                })}
                aria-pressed={active}
                data-testid={`rentals-filter-beds-${value}`}
                className={cn(
                  chip,
                  active && "border-primary bg-primary/10 text-primary",
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Max price */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Max price / night
        </p>
        <div
          role="group"
          aria-label="Price filters"
          className="flex flex-wrap gap-2"
        >
          {MAX_PRICES.map(({ value, label }) => {
            const active = maxPrice === value;
            return (
              <Link
                key={value}
                href={buildRentalsUrl({
                  neighborhood,
                  beds,
                  maxPrice: toggle(maxPrice, value),
                })}
                aria-pressed={active}
                data-testid={`rentals-filter-price-${value}`}
                className={cn(
                  chip,
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
