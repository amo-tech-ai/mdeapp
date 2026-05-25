import { describe, expect, it } from "vitest";
import { mapPinSchema } from "../map-pin";

describe("MapPinSchema", () => {
  it("accepts a valid pin with tool provenance", () => {
    const parsed = mapPinSchema.safeParse({
      id: "rental-1",
      category: "rental",
      lat: 6.25,
      lng: -75.59,
      title: "Laureles 2BR",
      source: "tool",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid latitude", () => {
    const parsed = mapPinSchema.safeParse({
      id: "bad",
      category: "rental",
      lat: 95,
      lng: -75.59,
      title: "Bad",
      source: "tool",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects missing title", () => {
    const parsed = mapPinSchema.safeParse({
      id: "bad",
      category: "rental",
      lat: 6.25,
      lng: -75.59,
      title: "",
      source: "tool",
    });
    expect(parsed.success).toBe(false);
  });
});
