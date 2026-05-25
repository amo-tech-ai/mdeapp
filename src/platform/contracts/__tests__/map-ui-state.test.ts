import { describe, it, expect } from "vitest";
import { MapUiStateSchema } from "../map-ui-state";

describe("MapUiStateSchema", () => {
  it("parses a minimal map UI summary", () => {
    const parsed = MapUiStateSchema.parse({
      selectedPinId: "rental-1",
      activeCategories: ["rental", "grounded"],
      pinCountByCategory: { rental: 3, grounded: 1 },
    });
    expect(parsed.selectedPinId).toBe("rental-1");
    expect(parsed.activeCategories).toContain("rental");
  });

  it("allows null selectedPinId", () => {
    const parsed = MapUiStateSchema.parse({
      selectedPinId: null,
      activeCategories: [],
    });
    expect(parsed.selectedPinId).toBeNull();
  });
});
