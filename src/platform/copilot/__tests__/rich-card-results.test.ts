import { describe, expect, it } from "vitest";
import {
  isRichCardCategory,
  shouldSuppressGenericMapResults,
} from "@/platform/copilot/rich-card-results";

describe("rich-card-results", () => {
  it("identifies rich card verticals", () => {
    expect(isRichCardCategory("rental")).toBe(true);
    expect(isRichCardCategory("event")).toBe(true);
    expect(isRichCardCategory("grounded")).toBe(true);
    expect(isRichCardCategory("venue")).toBe(false);
    expect(isRichCardCategory(null)).toBe(false);
  });

  it("suppresses generic map results when active category has rich cards", () => {
    expect(
      shouldSuppressGenericMapResults({ event: 2 }, "event"),
    ).toBe(true);
    expect(
      shouldSuppressGenericMapResults({ grounded: 3 }, "grounded"),
    ).toBe(true);
    expect(
      shouldSuppressGenericMapResults({ rental: 5 }, "event"),
    ).toBe(false);
    expect(shouldSuppressGenericMapResults({}, "event")).toBe(false);
    expect(shouldSuppressGenericMapResults({ event: 2 }, null)).toBe(false);
  });
});
