"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * SAN-1202 · RE-DES-007 — availability calendar.
 * Shows the real available window from `availableFrom/availableTo`. Per-date
 * booked / pending / blocked data has no source yet, so those are surfaced as
 * "Data pending" — never faked.
 */
export type RentalAvailabilityCalendarProps = {
  availableFrom: string | null;
  availableTo: string | null;
  minimumStayDays: number | null;
};

type DayState = "available" | "outside" | "unknown";

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

export function RentalAvailabilityCalendar({
  availableFrom,
  availableTo,
  minimumStayDays,
}: RentalAvailabilityCalendarProps) {
  const from = parseDate(availableFrom);
  const to = parseDate(availableTo);
  const hasWindow = Boolean(from || to);

  // Anchor the calendar at the available-from month, else "this month".
  const anchor = from ?? new Date();
  const [offset, setOffset] = useState(0);
  const viewMonth = new Date(anchor.getFullYear(), anchor.getMonth() + offset, 1);
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const first = startOfMonth(year, month);
  const leading = first.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function dayState(day: number): DayState {
    if (!hasWindow) return "unknown";
    const d = new Date(year, month, day);
    if (from && d < new Date(from.getFullYear(), from.getMonth(), from.getDate())) return "outside";
    if (to && d > new Date(to.getFullYear(), to.getMonth(), to.getDate())) return "outside";
    return "available";
  }

  const monthLabel = viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const cells: Array<number | null> = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <section data-testid="rental-availability-calendar" aria-label="Availability calendar" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-base font-semibold">Availability</h2>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Previous month"
            data-testid="rental-availability-prev"
            onClick={() => setOffset((o) => o - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
          <span className="min-w-32 text-center text-sm font-medium">{monthLabel}</span>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Next month"
            data-testid="rental-availability-next"
            onClick={() => setOffset((o) => o + 1)}
          >
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      {!hasWindow ? (
        <p data-testid="rental-availability-pending" className="text-sm text-muted-foreground">
          Availability data pending.
        </p>
      ) : null}

      <div className="grid grid-cols-7 gap-1 text-center text-xs" role="grid">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={`dow-${i}`} className="py-1 font-medium text-muted-foreground" role="columnheader">
            {d}
          </div>
        ))}
        {cells.map((day, i) =>
          day == null ? (
            <div key={`pad-${i}`} aria-hidden />
          ) : (
            <div
              key={`day-${day}`}
              role="gridcell"
              className={cn(
                "rounded-md py-1.5 text-foreground",
                dayState(day) === "available" && "bg-primary/15 text-foreground",
                dayState(day) === "outside" && "text-muted-foreground/40",
                dayState(day) === "unknown" && "text-muted-foreground",
              )}
            >
              {day}
            </div>
          ),
        )}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-primary/30" aria-hidden /> Available
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-muted" aria-hidden /> Booked — data pending
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-accent/30" aria-hidden /> Pending viewing — data pending
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-destructive/20" aria-hidden /> Blocked — data pending
        </li>
      </ul>

      <p className="text-xs text-muted-foreground">
        {minimumStayDays != null
          ? `Minimum stay: ${minimumStayDays} night${minimumStayDays === 1 ? "" : "s"}.`
          : "Minimum stay: data pending."}
      </p>
    </section>
  );
}
