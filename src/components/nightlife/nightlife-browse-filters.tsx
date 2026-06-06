"use client";

import Link from "next/link";
import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import type { NightlifeVibe } from "@/lib/nightlife-browse";

const NEIGHBORHOODS = [
  "Provenza",
  "Laureles",
  "El Poblado",
  "Manila",
] as const;

const VIBES: { value: NightlifeVibe; label: string }[] = [
  { value: "reggaeton", label: "Reggaeton" },
  { value: "rooftop", label: "Rooftop" },
  { value: "salsa", label: "Salsa" },
  { value: "cocktails", label: "Cocktails" },
  { value: "live-music", label: "Live DJ" },
];

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

function toggleNeighborhood(
  current: string | null,
  value: string,
): string | null {
  return current === value ? null : value;
}

function toggleVibe(
  current: NightlifeVibe | null,
  value: NightlifeVibe,
): NightlifeVibe | null {
  return current === value ? null : value;
}

const filterChipClass = cn(
  toggleVariants({ variant: "outline", size: "sm" }),
  "min-h-9 rounded-full px-3",
);

type NightlifeBrowseFiltersProps = {
  neighborhood: string | null;
  vibe: NightlifeVibe | null;
};

export function NightlifeBrowseFilters({
  neighborhood,
  vibe,
}: NightlifeBrowseFiltersProps) {
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
                  vibe,
                })}
                aria-pressed={active}
                data-testid={`nightlife-filter-neighborhood-${n.toLowerCase().replace(/\s+/g, "-")}`}
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
        <p className="mb-2 text-xs font-medium text-muted-foreground">Vibe</p>
        <div
          role="group"
          aria-label="Vibe filters"
          className="flex flex-wrap gap-2"
        >
          {VIBES.map(({ value, label }) => {
            const active = vibe === value;
            return (
              <Link
                key={value}
                href={buildFilterUrl({
                  neighborhood,
                  vibe: toggleVibe(vibe, value),
                })}
                aria-pressed={active}
                data-testid={`nightlife-filter-vibe-${value}`}
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
