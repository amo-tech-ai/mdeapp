import { describe, expect, it } from "vitest";
import type { MapPin } from "@/platform/contracts";
import {
  computeLatLngBounds,
  filterRenderableMapPins,
  hasNonMockPins,
} from "../map-pin-filters";

const mockPin: MapPin = {
  id: "mock-laureles-pin",
  category: "rental",
  lat: 6.252,
  lng: -75.591,
  title: "Laureles — map ready",
  source: "mock",
};

const rentalPin: MapPin = {
  id: "rental-1",
  category: "rental",
  lat: 6.25,
  lng: -75.59,
  title: "Test rental",
  source: "sql",
};

describe("filterRenderableMapPins", () => {
  it("keeps mock pin when no live pins", () => {
    expect(filterRenderableMapPins([mockPin])).toHaveLength(1);
    expect(hasNonMockPins([mockPin])).toBe(false);
  });

  it("drops mock pin when live pins exist", () => {
    const filtered = filterRenderableMapPins([mockPin, rentalPin]);
    expect(filtered).toEqual([rentalPin]);
  });
});

describe("computeLatLngBounds", () => {
  it("returns NE/SW for multiple coords", () => {
    const box = computeLatLngBounds([
      { lat: 6.24, lng: -75.58 },
      { lat: 6.26, lng: -75.6 },
      { lat: 6.25, lng: -75.59 },
    ]);
    expect(box).toEqual({
      north: 6.26,
      south: 6.24,
      east: -75.58,
      west: -75.6,
    });
  });

  it("returns null for empty input", () => {
    expect(computeLatLngBounds([])).toBeNull();
  });
});
