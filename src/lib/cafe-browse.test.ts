import { describe, expect, it, vi } from "vitest";
import {
  loadCafeListings,
  mapVenueAnchorToCafeListing,
  matchesCafeFeature,
  normalizeSearchParam,
} from "./cafe-browse";

vi.mock("@/mastra/tools/search-venue-anchors", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/mastra/tools/search-venue-anchors")>();
  return {
    ...actual,
    searchCafeVenueAnchorsForBrowse: vi.fn(),
  };
});

describe("cafe-browse", () => {
  it("maps venue anchor rows to browse listings", () => {
    const listing = mapVenueAnchorToCafeListing({
      id: "abc",
      kind: "cafe",
      name: "Test Café",
      google_place_id: "ChIJtest",
      neighborhood: "Laureles",
      latitude: 6.2,
      longitude: -75.5,
      tags: ["specialty", "workspace"],
      metadata: { ai_vibe_summary: "Quiet specialty coffee." },
    });
    expect(listing.name).toBe("Test Café");
    expect(listing.summary).toBe("Quiet specialty coffee.");
    expect(listing.mapsUrl).toContain("ChIJtest");
  });

  it("filters listings by feature tag", () => {
    const listing = mapVenueAnchorToCafeListing({
      id: "1",
      kind: "cafe",
      name: "Café",
      google_place_id: "x",
      neighborhood: "Laureles",
      latitude: null,
      longitude: null,
      tags: ["specialty"],
      metadata: null,
    });
    expect(matchesCafeFeature(listing, "specialty")).toBe(true);
    expect(matchesCafeFeature(listing, "workspace")).toBe(false);
  });

  it("normalizeSearchParam accepts first value when duplicated", () => {
    expect(normalizeSearchParam([" specialty ", "workspace"])) .toBe("specialty");
    expect(normalizeSearchParam()).toBeUndefined();
    expect(normalizeSearchParam("  Laureles  ")).toBe("Laureles");
  });

  it("loadCafeListings surfaces upstream query errors", async () => {
    const { searchCafeVenueAnchorsForBrowse } = await import(
      "@/mastra/tools/search-venue-anchors"
    );
    vi.mocked(searchCafeVenueAnchorsForBrowse).mockResolvedValueOnce({
      rows: [],
      error: "Could not load cafés. Try again in a moment.",
    });

    const { results, error } = await loadCafeListings({ limit: 12 });
    expect(results).toEqual([]);
    expect(error).toMatch(/could not load/i);
  });
});
