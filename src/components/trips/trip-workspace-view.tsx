"use client";

import { useState } from "react";
import type { TripWorkspaceData } from "@/lib/trips/trip-item-types";
import { ItineraryPanel, TripMapPanel } from "@/components/trips/itinerary-panel";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "ideas", label: "Ideas" },
  { id: "itinerary", label: "Itinerary" },
  { id: "map", label: "Map" },
  { id: "bookings", label: "Bookings" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type TripWorkspaceViewProps = {
  trip: TripWorkspaceData;
};

/** SCREEN-013 — workspace tabs (Ideas · Itinerary · Map · Bookings stub). */
export function TripWorkspaceView({ trip }: TripWorkspaceViewProps) {
  const [tab, setTab] = useState<TabId>("itinerary");

  return (
    <div className="space-y-4">
      <nav
        aria-label="Trip workspace"
        data-testid="trip-workspace-tabs"
        role="tablist"
        className="flex flex-wrap gap-2"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            data-testid={`trip-tab-${t.id}`}
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              tab === t.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "ideas" ? (
        <p
          data-testid="trip-ideas-stub"
          className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground"
        >
          Shortlist before you commit — promote saves from chat in Phase 2.
        </p>
      ) : null}

      {tab === "itinerary" ? <ItineraryPanel items={trip.items} /> : null}

      {tab === "map" ? <TripMapPanel items={trip.items} /> : null}

      {tab === "bookings" ? (
        <p
          data-testid="trip-bookings-stub"
          className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground"
        >
          Confirmed bookings appear here after ticket checkout (G1).
        </p>
      ) : null}

      {trip.budget != null ? (
        <p className="text-xs text-muted-foreground">
          Budget: {trip.currency ?? "USD"} {trip.budget} (tracking in Phase 2)
        </p>
      ) : null}
    </div>
  );
}
