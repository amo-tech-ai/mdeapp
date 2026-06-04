import { describe, expect, it } from "vitest";
import {
  mapVenueAnchorToNightlifeListing,
  matchesNightlifeVibe,
} from "./nightlife-browse";

describe("nightlife-browse", () => {
  it("maps venue anchor rows to browse listings", () => {
    const listing = mapVenueAnchorToNightlifeListing({
      id: "abc",
      kind: "nightclub",
      name: "Test Club",
      google_place_id: "ChIJtest",
      neighborhood: "Provenza",
      latitude: 6.2,
      longitude: -75.5,
      tags: ["reggaeton", "rooftop"],
      metadata: { ai_vibe_summary: "Late-night reggaeton." },
    });
    expect(listing.name).toBe("Test Club");
    expect(listing.summary).toBe("Late-night reggaeton.");
    expect(listing.mapsUrl).toContain("ChIJtest");
  });

  it("filters listings by vibe tag", () => {
    const listing = mapVenueAnchorToNightlifeListing({
      id: "1",
      kind: "nightclub",
      name: "Club",
      google_place_id: "x",
      neighborhood: "Provenza",
      latitude: null,
      longitude: null,
      tags: ["reggaeton"],
      metadata: null,
    });
    expect(matchesNightlifeVibe(listing, "reggaeton")).toBe(true);
    expect(matchesNightlifeVibe(listing, "salsa")).toBe(false);
  });
});
