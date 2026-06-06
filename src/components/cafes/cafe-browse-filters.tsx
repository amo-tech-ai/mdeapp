"use client";

import Link from "next/link";
import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import type { CafeFeature } from "@/lib/cafe-browse";

const NEIGHBORHOODS = ["Laureles", "El Poblado", "Envigado", "Provenza"] as const;

const FEATURES: { value: CafeFeature; label: string }[] = [
  { value: "specialty", label: "Specialty" },
  { value: "workspace", label: "Workspace-friendly" },
];

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

function toggleNeighborhood(
  current: string | null,
  value: string,
): string | null {
  return current === value ? null : value;
}

function toggleFeature(
  current: CafeFeature | null,
  value: CafeFeature,
): CafeFeature | null {
  return current === value ? null : value;
}

const filterChipClass = cn(
  toggleVariants({ variant: "outline", size: "sm" }),
  "min-h-9 rounded-full px-3",
);

type CafeBrowseFiltersProps = {
  neighborhood: string | null;
  feature: CafeFeature | null;
};

export function CafeBrowseFilters({
  neighborhood,
  feature,
}: CafeBrowseFiltersProps) {
  return (
    <>
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
                  neighborhood: toggleNeighborhood(neighborhood, n),
                  feature,
                })}
                aria-pressed={active}
                data-testid={`cafes-filter-neighborhood-${n.toLowerCase().replace(/\s+/g, "-")}`}
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
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Features
        </p>
        <div
          role="group"
          aria-label="Feature filters"
          className="flex flex-wrap gap-2"
        >
          {FEATURES.map(({ value, label }) => {
            const active = feature === value;
            return (
              <Link
                key={value}
                href={buildFilterUrl({
                  neighborhood,
                  feature: toggleFeature(feature, value),
                })}
                aria-pressed={active}
                data-testid={`cafes-filter-feature-${value}`}
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
