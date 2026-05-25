import { describe, expect, it } from "vitest";
import { normalizeToolOutput } from "../normalize-tool-output";

describe("normalizeToolOutput", () => {
  it("maps rental tool rows with coordinates to pins", () => {
    const { pins, resultCount } = normalizeToolOutput("rental", {
      results: [
        {
          id: "apt-1",
          title: "Laureles loft",
          neighborhood: "Laureles",
          latitude: 6.252,
          longitude: -75.591,
        },
        {
          id: "apt-2",
          title: "No coords",
          neighborhood: "Centro",
        },
      ],
      source: "mock",
    });
    expect(resultCount).toBe(2);
    expect(pins).toHaveLength(1);
    expect(pins[0]?.category).toBe("rental");
    expect(pins[0]?.id).toBe("rental-apt-1");
  });

  it("returns empty for invalid envelope", () => {
    expect(normalizeToolOutput("event", null).pins).toEqual([]);
  });
});
