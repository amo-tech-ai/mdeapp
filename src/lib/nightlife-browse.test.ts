import { describe, expect, it, vi } from "vitest";
import {
  loadNightlifeListings,
  mapVenueAnchorToNightlifeListing,
  matchesNightlifeVibe,
  normalizeSearchParam,
} from "./nightlife-browse";

vi.mock("@/mastra/tools/search-venue-anchors", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/mastra/tools/search-venue-anchors")>();
  return {
    ...actual,
    searchNightclubVenueAnchorsForBrowse: vi.fn(),
  };
});

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

  it("normalizeSearchParam accepts first value when duplicated", () => {
    expect(normalizeSearchParam([" salsa ", "rooftop"])).toBe("salsa");
    expect(normalizeSearchParam()).toBeUndefined();
    expect(normalizeSearchParam("  Provenza  ")).toBe("Provenza");
  });

  it("loadNightlifeListings surfaces upstream query errors", async () => {
    const { searchNightclubVenueAnchorsForBrowse } = await import(
      "@/mastra/tools/search-venue-anchors"
    );
    vi.mocked(searchNightclubVenueAnchorsForBrowse).mockResolvedValueOnce({
      rows: [],
      error: "Could not load nightlife venues. Try again in a moment.",
    });

    const { results, error } = await loadNightlifeListings({ limit: 12 });
    expect(results).toEqual([]);
    expect(error).toMatch(/could not load/i);
  });
});
