"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { EventDraftState } from "@/lib/types";

type HostEventFormProps = {
  draft: EventDraftState;
  onChange: (patch: Partial<EventDraftState>) => void;
};

/** Manual edit fields — stay in sync with useCoAgent state. */
export function HostEventForm({ draft, onChange }: HostEventFormProps) {
  return (
    <div
      data-testid="host-event-form"
      className="mx-2 grid gap-3 rounded-lg border border-border bg-card p-4 sm:mx-4 sm:grid-cols-2"
    >
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="host-event-title">Event title</Label>
        <Input
          id="host-event-title"
          data-testid="host-event-field-title"
          value={draft.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Startup mixer"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="host-event-neighborhood">Neighborhood</Label>
        <Input
          id="host-event-neighborhood"
          data-testid="host-event-field-neighborhood"
          value={draft.neighborhood}
          onChange={(e) => onChange({ neighborhood: e.target.value })}
          placeholder="El Poblado"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="host-event-date">Start (ISO datetime)</Label>
        <Input
          id="host-event-date"
          data-testid="host-event-field-date"
          value={draft.dateIso ?? ""}
          onChange={(e) => onChange({ dateIso: e.target.value })}
          placeholder="2026-03-15T19:00:00-05:00"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="host-event-venue">Venue</Label>
        <Input
          id="host-event-venue"
          data-testid="host-event-field-venue"
          value={draft.venue}
          onChange={(e) => onChange({ venue: e.target.value })}
          placeholder="Hotel Intercontinental"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="host-event-capacity">Capacity</Label>
        <Input
          id="host-event-capacity"
          data-testid="host-event-field-capacity"
          type="number"
          min={0}
          value={draft.capacity || ""}
          onChange={(e) => onChange({ capacity: Number(e.target.value) || 0 })}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="host-event-price">Min ticket price (COP)</Label>
        <Input
          id="host-event-price"
          data-testid="host-event-field-price"
          type="number"
          min={0}
          value={draft.priceMinCop || ""}
          onChange={(e) => onChange({ priceMinCop: Number(e.target.value) || 0 })}
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="host-event-description">Description</Label>
        <textarea
          id="host-event-description"
          data-testid="host-event-field-description"
          value={draft.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={3}
          className={cn(
            "border-input bg-background ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm",
            "focus-visible:ring-3 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
      </div>
    </div>
  );
}
