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
  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function startOfMonth(year: number, month: number): Date {
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
    const targetDate = new Date(year, month, day);
    const baselineFrom = from && new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const baselineTo = to && new Date(to.getFullYear(), to.getMonth(), to.getDate());
    const stateMap: Record<string, DayState> = {
      noWindow: "unknown",
      beforeWindow: "outside",
      afterWindow: "outside",
      default: "available",
    };
    const key = !hasWindow
      ? "noWindow"
      : baselineFrom && targetDate < baselineFrom
        ? "beforeWindow"
        : baselineTo && targetDate > baselineTo
          ? "afterWindow"
          : "default";
    return stateMap[key];
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
    </section>
  );
      </div>

      {!hasWindow ? (
        <p data-testid="rental-availability-pending" className="text-sm text-muted-foreground">
          Availability data pending.
        </p>
      ) : null}

      <div className="grid grid-cols-7 gap-1 text-center text-xs" role="grid">
        {[
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
    "Friday",
    "Saturday"
  ].map((day) => (
    <div key={day} className="py-1 font-medium text-muted-foreground" role="columnheader">
      {day.charAt(0)}
    </div>
  ))}
  {cells.map((day, i) =>
    day == null ? (
      <div key={`pad-${i}`} aria-hidden />
    ) : (
      <div
        key={day}
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
