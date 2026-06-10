"use client";

import { useState } from "react";
import { useEventLocalChat } from "@/components/chat/event-local-chat-context";
import { useRestaurantSearchFastPath } from "@/hooks/use-restaurant-search-fast-path";
import {
  RESTAURANT_FILTER_CHIP_GROUPS,
  RESTAURANT_GEO_FALLBACK_CHIPS,
  type RestaurantFilterChip,
} from "@/lib/restaurant-filter-chips";
import { cn } from "@/lib/utils";

/** Quick-reply filter chips below restaurant clarify assistant message. */
export function RestaurantFilterChips() {
  const { clarifyKind } = useEventLocalChat();
  const { handleRestaurantChip } = useRestaurantSearchFastPath();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [geoDenied, setGeoDenied] = useState(false);
  const [activeByGroup, setActiveByGroup] = useState<Partial<Record<string, string>>>({});

  if (clarifyKind !== "restaurant") return null;

  async function onChip(chip: RestaurantFilterChip) {
    if (busyId) return;
    setBusyId(chip.id);
    setActiveByGroup((prev) => ({ ...prev, [chip.group]: chip.id }));
    try {
      const { handled, geoDenied: denied } = await handleRestaurantChip(chip);
      if (denied) {
        setGeoDenied(true);
        setActiveByGroup((prev) => {
          const next = { ...prev };
          delete next.area;
          return next;
        });
      } else if (!handled) {
        setActiveByGroup((prev) => {
          const next = { ...prev };
          if (next[chip.group] === chip.id) delete next[chip.group];
          return next;
        });
      }
    } finally {
      setBusyId(null);
    }
  }

  const areaChips = geoDenied
    ? RESTAURANT_GEO_FALLBACK_CHIPS
    : RESTAURANT_FILTER_CHIP_GROUPS.find((g) => g.label === "Area")?.chips ?? [];

  return (
    <div
      data-testid="restaurant-filter-chips"
      className="mt-3 space-y-3 border-t border-border/60 pt-3"
      role="group"
      aria-label="Restaurant filters"
    >
      {geoDenied ? (
        <p className="text-xs text-muted-foreground" data-testid="restaurant-geo-fallback">
          Location unavailable — pick a neighborhood instead.
        </p>
      ) : null}
      {RESTAURANT_FILTER_CHIP_GROUPS.map((group) => {
        const chips = group.label === "Area" ? areaChips : group.chips;
        return (
          <div key={group.label}>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">{group.label}</p>
            <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={group.label}>
              {chips.map((chip) => {
                const active = activeByGroup[chip.group] === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    data-testid={`restaurant-filter-${chip.id}`}
                    data-active={active ? "true" : "false"}
                    disabled={busyId != null}
                    onClick={() => void onChip(chip)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/50 text-foreground hover:bg-muted",
                    )}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
