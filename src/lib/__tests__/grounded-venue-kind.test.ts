import { describe, expect, it } from "vitest";
import {
  inferGroundedVenueKindFromRows,
  readGroundedVenueKind,
} from "@/lib/grounded-venue-kind";

describe("grounded venue kind", () => {
  it("reads venueKind from tool metadata", () => {
    expect(
      readGroundedVenueKind({
        results: [{ id: "1", title: "Cafe X", latitude: 1, longitude: 1 }],
        source: "grounding",
        metadata: { venueKind: "nightlife" },
      }),
    ).toBe("nightlife");
  });

  it("infers nightlife from row titles", () => {
    expect(
      inferGroundedVenueKindFromRows([
        { title: "Salsa Bar Provenza", primaryType: "bar" },
        { title: "Rooftop Lounge", primaryType: "bar" },
      ]),
    ).toBe("nightlife");
  });

  it("infers cafe when coffee titles dominate", () => {
    expect(
      inferGroundedVenueKindFromRows([
        { title: "Gardenia Brunch & Coffee" },
        { title: "Specialty Café" },
      ]),
    ).toBe("cafe");
  });
});
