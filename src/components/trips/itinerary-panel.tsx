import { AlertTriangle, MapPin } from "lucide-react";
import type { TripItemRow } from "@/lib/trips/trip-item-types";
import {
  detectScheduleOverlaps,
  formatItemTimeRange,
  groupTripItemsByDay,
  itemTypeLabel,
} from "@/lib/trips/itinerary-logic";
import { cn } from "@/lib/utils";

type ItineraryPanelProps = {
  items: TripItemRow[];
};

/** SCREEN-013 — day-grouped timeline from trip_items. */
export function ItineraryPanel({ items }: ItineraryPanelProps) {
  const dayGroups = groupTripItemsByDay(items);
  const overlaps = detectScheduleOverlaps(items);

  return (
    <section data-testid="itinerary-panel" className="space-y-4">
      {overlaps.length > 0 ? (
        <div
          data-testid="itinerary-conflict"
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm"
          role="alert"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden />
            <div>
              <p className="font-medium text-foreground">
                {overlaps.length === 1
                  ? "1 schedule conflict"
                  : `${overlaps.length} schedule conflicts`}
              </p>
              <ul className="mt-1 list-inside list-disc text-muted-foreground">
                {overlaps.map((o) => (
                  <li key={o.id}>{o.message}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                Resolve in chat (coming soon) or adjust times manually.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {dayGroups.length === 0 ? (
        <p
          data-testid="itinerary-empty"
          className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground"
        >
          No items yet — save rentals or events from chat to build your itinerary.
        </p>
      ) : (
        <div className="space-y-4">
          {dayGroups.map((group) => (
            <section
              key={group.dayKey}
              data-testid={`itinerary-day-${group.dayKey}`}
              className="rounded-xl border border-border bg-card"
            >
              <header className="border-b border-border px-4 py-2">
                <h2 className="text-sm font-semibold">{group.label}</h2>
              </header>
              <ul className="divide-y divide-border">
                {group.items.map((item) => {
                  const conflictIds = new Set(
                    overlaps.flatMap((o) => [o.itemAId, o.itemBId]),
                  );
                  const hasConflict = conflictIds.has(item.id);

                  return (
                    <li
                      key={item.id}
                      data-testid={`itinerary-item-${item.id}`}
                      className={cn(
                        "flex gap-3 px-4 py-3",
                        hasConflict && "bg-amber-500/5",
                      )}
                    >
                      <div className="w-24 shrink-0 text-xs text-muted-foreground">
                        {formatItemTimeRange(item)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {itemTypeLabel(item.item_type)}
                          {item.location_name ? ` · ${item.location_name}` : ""}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}

type TripMapPanelProps = {
  items: TripItemRow[];
};

/** Static pin list for scheduled items with coordinates (MAP-011 routes deferred). */
export function TripMapPanel({ items }: TripMapPanelProps) {
  const mappable = items.filter(
    (i) =>
      i.latitude != null &&
      i.longitude != null &&
      Number.isFinite(i.latitude) &&
      Number.isFinite(i.longitude),
  );

  return (
    <section data-testid="trip-map-panel" className="space-y-3">
      {mappable.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No map pins yet — items need a location from chat saves.
        </p>
      ) : (
        <ul className="space-y-2">
          {mappable.map((item) => (
            <li
              key={item.id}
              data-testid="trip-map-pin"
              data-item-id={item.id}
              className="flex items-start gap-2 rounded-lg border border-border px-3 py-2 text-sm"
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.location_name ?? "Medellín"} · {item.latitude?.toFixed(4)},{" "}
                  {item.longitude?.toFixed(4)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
