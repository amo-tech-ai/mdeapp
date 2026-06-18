import { describe, expect, it } from "vitest";
import { eventMatchesDateWindow } from "../intelligence-event-search";

describe("eventMatchesDateWindow — real-instant comparison", () => {
  const bounds = { gte: "2026-06-20T00:00:00Z", lte: "2026-06-20T23:59:59Z" };

  it("includes events on the exact window boundaries", () => {
    expect(eventMatchesDateWindow("2026-06-20T00:00:00Z", bounds)).toBe(true);
    expect(eventMatchesDateWindow("2026-06-20T23:59:59Z", bounds)).toBe(true);
  });

  it("treats Z and +00:00 as the same instant (no lexicographic drift)", () => {
    const mixed = { gte: "2026-06-20T00:00:00+00:00", lte: "2026-06-20T12:00:00Z" };
    expect(eventMatchesDateWindow("2026-06-20T06:00:00Z", mixed)).toBe(true);
  });

  it("excludes events outside the window and handles open bounds", () => {
    expect(eventMatchesDateWindow("2026-06-19T23:00:00Z", bounds)).toBe(false);
    expect(eventMatchesDateWindow("2026-06-21T00:30:00Z", bounds)).toBe(false);
    expect(eventMatchesDateWindow("2026-06-20T10:00:00Z", {})).toBe(true);
    expect(eventMatchesDateWindow(null, bounds)).toBe(false);
  });
});
