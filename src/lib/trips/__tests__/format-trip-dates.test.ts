import { describe, expect, it } from "vitest";
import { formatTripDateRange } from "../load-user-trips";

describe("formatTripDateRange", () => {
  it("formats ISO date range in English", () => {
    const label = formatTripDateRange("2026-06-01", "2026-08-31");
    expect(label).toMatch(/Jun/);
    expect(label).toMatch(/Aug/);
  });
});
