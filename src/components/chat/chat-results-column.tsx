"use client";

import { useEffect, useRef } from "react";
import { EmptyState } from "@/components/empty/empty-state";
import { useMapContext } from "@/platform/maps/map-context";
import { pinsForMapResults } from "@/platform/maps/active-map-category";
import type { MapPin } from "@/platform/contracts";

const CATEGORY_LABEL: Record<string, string> = {
  rental: "Rental",
  restaurant: "Restaurant",
  event: "Event",
  attraction: "Attraction",
  venue: "Venue",
  grounded: "Café / place",
  mock: "Area",
};

function PinResultRow({
  pin,
  selected,
  onSelect,
}: {
  pin: MapPin;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      data-testid="results-pin-row"
      data-pin-id={pin.id}
      data-selected={selected ? "true" : "false"}
      onClick={onSelect}
      className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary/30"
          : "border-border bg-card hover:bg-muted/50"
      }`}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {CATEGORY_LABEL[pin.category] ?? pin.category}
      </span>
      <p className="font-medium text-foreground">{pin.title}</p>
      {pin.subtitle ? (
        <p className="text-xs text-muted-foreground">{pin.subtitle}</p>
      ) : null}
      {pin.placeUri ? (
        <a
          href={pin.placeUri}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-xs text-primary underline-offset-2 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Open in Google Maps
        </a>
      ) : null}
    </button>
  );
}

/** MAP-007B — pin list under center chat; synced with MapContext + F50. */
export function ChatResultsColumn({ compact = false }: { compact?: boolean }) {
  const { pins, activeMapCategory, selectedPinId, panToPin } = useMapContext();
  const listRef = useRef<HTMLDivElement>(null);
  const visiblePins = pinsForMapResults(pins, activeMapCategory);

  useEffect(() => {
    if (!selectedPinId || !listRef.current) return;
    const row = listRef.current.querySelector(
      `[data-pin-id="${selectedPinId}"]`,
    );
    row?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedPinId]);

  return (
    <section
      data-testid="results-column"
      aria-label="Search results on map"
      className={`flex min-h-0 flex-col overflow-hidden ${
        compact ? "h-full" : "h-full border-r border-border"
      }`}
    >
      <header
        className={`shrink-0 border-b border-border px-4 ${
          compact ? "py-2" : "py-3"
        }`}
      >
        <h2 className="text-sm font-semibold">Map results</h2>
        {!compact ? (
          <p className="text-xs text-muted-foreground">
            Pins from your latest search — tap to focus on the map.
          </p>
        ) : null}
      </header>
      <div
        ref={listRef}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-3"
      >
        {visiblePins.length === 0 ? (
          <EmptyState
            testId="results-empty"
            title="No pins yet"
            description="Ask the concierge for rentals or quiet cafés near Laureles and Poblado."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {visiblePins.map((pin) => (
              <li key={pin.id}>
                <PinResultRow
                  pin={pin}
                  selected={selectedPinId === pin.id}
                  onSelect={() => panToPin(pin.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
