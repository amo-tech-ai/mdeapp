import { describe, expect, it } from "vitest";
import { isPinDimmed, pinsForMapResults } from "../active-map-category";
import type { MapPin } from "@/platform/contracts";

const pin = (
  category: MapPin["category"],
  id: string,
  source: MapPin["source"] = "tool",
): MapPin => ({
  id: `${category}-${id}`,
  category,
  lat: 6.25,
  lng: -75.59,
  title: `${category} ${id}`,
  source,
});

describe("pinsForMapResults", () => {
  it("shows grounded pins when active category is grounded after rental search", () => {
    const pins = [
      pin("rental", "r1"),
      pin("grounded", "c1"),
      pin("grounded", "c2"),
    ];
    const visible = pinsForMapResults(pins, "grounded");
    expect(visible).toHaveLength(2);
    expect(visible.every((p) => p.category === "grounded")).toBe(true);
  });

  it("falls back to all non-mock pins when active category has no pins", () => {
    const pins = [pin("rental", "r1")];
    expect(pinsForMapResults(pins, "grounded")).toHaveLength(1);
  });

  it("excludes mock layout pin", () => {
    const pins = [pin("rental", "mock", "mock")];
    expect(pinsForMapResults(pins, null)).toHaveLength(0);
  });
});

describe("isPinDimmed", () => {
  it("dims rental pins when grounded is active", () => {
    expect(isPinDimmed(pin("rental", "r1"), "grounded")).toBe(true);
    expect(isPinDimmed(pin("grounded", "c1"), "grounded")).toBe(false);
  });
});
