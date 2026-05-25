import { describe, expect, it } from "vitest";
import type { MapPin } from "@/platform/contracts";
import { mergePinsByCategory } from "../merge-pins-by-category";

const rental = (id: string, lat: number): MapPin => ({
  id,
  category: "rental",
  lat,
  lng: -75.59,
  title: `Rental ${id}`,
  source: "tool",
});

const restaurant = (id: string, lat: number): MapPin => ({
  id,
  category: "restaurant",
  lat,
  lng: -75.59,
  title: `Restaurant ${id}`,
  source: "tool",
});

describe("mergePinsByCategory", () => {
  it("does not wipe other categories when merging rentals", () => {
    const existing = [rental("r1", 6.25), restaurant("f1", 6.26)];
    const merged = mergePinsByCategory(existing, "rental", [
      rental("r2", 6.251),
    ]);
    expect(merged.filter((p) => p.category === "restaurant")).toHaveLength(1);
    expect(merged.filter((p) => p.category === "rental")).toHaveLength(2);
  });

  it("dedupes by id within category", () => {
    const merged = mergePinsByCategory([], "rental", [
      rental("r1", 6.25),
      rental("r1", 6.251),
    ]);
    expect(merged).toHaveLength(1);
  });

  it("keeps rental pins when merging grounded category", () => {
    const grounded = (id: string, lat: number): MapPin => ({
      id: `grounded-${id}`,
      category: "grounded",
      lat,
      lng: -75.59,
      title: `Café ${id}`,
      source: "grounding",
    });
    const existing = [rental("r1", 6.25), rental("r2", 6.251)];
    const merged = mergePinsByCategory(existing, "grounded", [
      grounded("c1", 6.246),
      grounded("c2", 6.247),
    ]);
    expect(merged.filter((p) => p.category === "rental")).toHaveLength(2);
    expect(merged.filter((p) => p.category === "grounded")).toHaveLength(2);
  });
});
