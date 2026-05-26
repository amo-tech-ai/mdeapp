import { describe, expect, it, beforeEach } from "vitest";
import {
  MAP_CLUSTER_MIN_PINS,
  mapClusteringEnabled,
  shouldClusterMapPins,
} from "../map-clustering";

describe("map-clustering (MAP-009)", () => {
  const env = process.env;

  beforeEach(() => {
    process.env = { ...env };
  });

  it("is enabled by default", () => {
    delete process.env.NEXT_PUBLIC_MAP_CLUSTERING;
    expect(mapClusteringEnabled()).toBe(true);
  });

  it("disables when NEXT_PUBLIC_MAP_CLUSTERING=0", () => {
    process.env.NEXT_PUBLIC_MAP_CLUSTERING = "0";
    expect(mapClusteringEnabled()).toBe(false);
    expect(shouldClusterMapPins(50)).toBe(false);
  });

  it(`clusters at ${MAP_CLUSTER_MIN_PINS}+ pins when enabled`, () => {
    delete process.env.NEXT_PUBLIC_MAP_CLUSTERING;
    expect(shouldClusterMapPins(MAP_CLUSTER_MIN_PINS - 1)).toBe(false);
    expect(shouldClusterMapPins(MAP_CLUSTER_MIN_PINS)).toBe(true);
    expect(shouldClusterMapPins(20)).toBe(true);
  });
});
