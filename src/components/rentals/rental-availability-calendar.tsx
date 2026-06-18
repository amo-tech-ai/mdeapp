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

type DayState = "available" | "outside" | "spill" | "unknown";

const WEEKDAYS = [
  { id: "sun", label: "S" },
  { id: "mon", label: "M" },
  { id: "tue", label: "T" },
  { id: "wed", label: "W" },
  { id: "thu", label: "Th" },
  { id: "fri", label: "F" },
  { id: "sat", label: "Sa" },
];

// skipcq: JS-0067 - module-local helper; not browser global scope
const parseDate = (value: string | null): Date | null => {
  if (!value) return null;
  const trimmed = value.trim();
  // Date-only strings ("2026-06-01") must be local midnight, not UTC — `new
  // Date("2026-06-01")` is UTC and drifts a day in Medellín (UTC-5).
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (dateOnly) {
    return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
  }
  const parsedDate = new Date(trimmed);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

// skipcq: JS-0067 - module-local helper; not browser global scope
const dayKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** 42-cell (6-week) grid of real dates starting on the Sunday on/before the 1st. */
// skipcq: JS-0067 - module-local helper; not browser global scope
const buildMonthGrid = (year: number, month: number): Date[] => {
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());
  return Array.from({ length: 42 }, (_unused, dayOffset) => {
    const cell = new Date(gridStart);
    cell.setDate(gridStart.getDate() + dayOffset);
    return cell;
  });
};

/** Classify one cell against the available window (dates only, no time). */
// skipcq: JS-0067, JS-R1005 - intentional date-window branching; metric, not a bug
const classifyDay = (
  cell: Date,
  month: number,
  window: { from: Date | null; to: Date | null; has: boolean },
): DayState => {
  if (cell.getMonth() !== month) return "spill";
  if (!window.has) return "unknown";
  const day = new Date(cell.getFullYear(), cell.getMonth(), cell.getDate());
  if (window.from && day < new Date(window.from.getFullYear(), window.from.getMonth(), window.from.getDate())) {
    return "outside";
  }
  if (window.to && day > new Date(window.to.getFullYear(), window.to.getMonth(), window.to.getDate())) {
    return "outside";
  }
  return "available";
};

// skipcq: JS-0067 - React component (ES module); not browser global scope
const CalendarLegend = () => (
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
);

const CELL_CLASS: Record<DayState, string> = {
  available: "bg-primary/15 text-foreground",
  outside: "text-muted-foreground/40",
  spill: "text-muted-foreground/30",
  unknown: "text-muted-foreground",
};

// skipcq: JS-0067 - ES module export; not browser global scope
export function RentalAvailabilityCalendar({
  availableFrom,
  availableTo,
  minimumStayDays,
}: RentalAvailabilityCalendarProps) {
  const from = parseDate(availableFrom);
  const to = parseDate(availableTo);
  const hasWindow = Boolean(from || to);

  const anchor = from ?? new Date();
  const [offset, setOffset] = useState(0);
  const viewMonth = new Date(anchor.getFullYear(), anchor.getMonth() + offset, 1);
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const monthLabel = viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const grid = buildMonthGrid(year, month);
  const window = { from, to, has: hasWindow };

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
            onClick={() => setOffset((current) => current - 1)}
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
            onClick={() => setOffset((current) => current + 1)}
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
        {WEEKDAYS.map((weekday) => (
          <div key={weekday.id} className="py-1 font-medium text-muted-foreground" role="columnheader">
            {weekday.label}
          </div>
        ))}
        {grid.map((cell) => {
          const state = classifyDay(cell, month, window);
          return (
            <div key={dayKey(cell)} role="gridcell" className={cn("rounded-md py-1.5", CELL_CLASS[state])}>
              {cell.getDate()}
            </div>
          );
        })}
      </div>

      <CalendarLegend />

      <p className="text-xs text-muted-foreground">
        {minimumStayDays != null
          ? `Minimum stay: ${minimumStayDays} night${minimumStayDays === 1 ? "" : "s"}.`
          : "Minimum stay: data pending."}
      </p>
    </section>
  );
}
