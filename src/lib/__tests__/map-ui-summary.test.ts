import { describe, expect, it } from "vitest";
import { buildMapUiSummary } from "../map-ui-summary";

describe("buildMapUiSummary", () => {
  it("includes viewport when provided", () => {
    const summary = buildMapUiSummary(
      [{ id: "grounded-a", category: "grounded" }],
      "grounded-a",
      { lat: 6.21, lng: -75.57, zoom: 14 },
    );
    expect(summary.viewport).toEqual({ lat: 6.21, lng: -75.57, zoom: 14 });
    expect(summary.selectedPinId).toBe("grounded-a");
    expect(summary.pinCountByCategory?.grounded).toBe(1);
  });

  it("omits viewport key when not provided", () => {
    const summary = buildMapUiSummary([], null);
    expect(summary.viewport).toBeUndefined();
  });
});
