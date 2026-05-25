import { describe, expect, it } from "vitest";
import {
  detectScheduleOverlaps,
  groupTripItemsByDay,
} from "../itinerary-logic";
import type { TripItemRow } from "../trip-item-types";

const base = (over: Partial<TripItemRow>): TripItemRow => ({
  id: over.id ?? "1",
  item_type: over.item_type ?? "event",
  title: over.title ?? "Item",
  description: null,
  start_at: over.start_at ?? null,
  end_at: over.end_at ?? null,
  location_name: over.location_name ?? null,
  latitude: null,
  longitude: null,
});

describe("groupTripItemsByDay", () => {
  it("groups items by start_at date and sorts chronologically", () => {
    const groups = groupTripItemsByDay([
      base({
        id: "b",
        title: "Evening",
        start_at: "2026-06-21T20:00:00.000Z",
      }),
      base({
        id: "a",
        title: "Morning",
        start_at: "2026-06-20T10:00:00.000Z",
      }),
      base({ id: "c", title: "TBD" }),
    ]);

    expect(groups.map((g) => g.dayKey)).toEqual([
      "2026-06-20",
      "2026-06-21",
      "unscheduled",
    ]);
    expect(groups[0].items[0].id).toBe("a");
    expect(groups[2].label).toBe("Unscheduled");
  });
});

describe("detectScheduleOverlaps", () => {
  it("flags overlapping windows on the same day", () => {
    const overlaps = detectScheduleOverlaps([
      base({
        id: "a",
        title: "Salsa",
        start_at: "2026-06-21T20:00:00.000Z",
        end_at: "2026-06-21T23:00:00.000Z",
      }),
      base({
        id: "b",
        title: "Dinner",
        start_at: "2026-06-21T19:30:00.000Z",
        end_at: "2026-06-21T21:00:00.000Z",
      }),
    ]);

    expect(overlaps).toHaveLength(1);
    expect(overlaps[0].itemATitle).toMatch(/Salsa|Dinner/);
    expect(overlaps[0].message).toMatch(/overlap/i);
  });

  it("returns empty when items are on different days", () => {
    const overlaps = detectScheduleOverlaps([
      base({
        id: "a",
        start_at: "2026-06-20T20:00:00.000Z",
        end_at: "2026-06-20T23:00:00.000Z",
      }),
      base({
        id: "b",
        start_at: "2026-06-21T19:30:00.000Z",
        end_at: "2026-06-21T21:00:00.000Z",
      }),
    ]);
    expect(overlaps).toHaveLength(0);
  });
});
