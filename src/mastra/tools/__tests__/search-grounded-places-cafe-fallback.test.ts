import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../lib/adk-grounding-client", () => ({
  invokeAdkGrounding: vi.fn(),
}));

vi.mock("../../lib/grounding-quota", () => ({
  incrementAndCheckGroundingQuota: vi.fn().mockResolvedValue({ allowed: true }),
}));

vi.mock("../../lib/grounding-location-bias", () => ({
  resolveGroundingLocationBias: vi.fn(({ locationBias }) => locationBias),
}));

vi.mock("../search-restaurants", () => ({
  searchRestaurants: vi.fn(),
}));

vi.mock("../search-venue-anchors", () => ({
  isCoffeeVenueQuery: vi.fn((q: string) =>
    /\b(coffee|caf[eé]|espresso|specialty coffee)\b/i.test(q),
  ),
  searchCafeVenueAnchors: vi.fn(),
  venueAnchorMapsUrl: vi.fn(
    (id: string) => `https://www.google.com/maps/search/?api=1&query_place_id=${id}`,
  ),
  venueAnchorSummary: vi.fn(() => "Specialty coffee"),
  venueAnchorToCoordinates: vi.fn(() => ({
    latitude: 6.2489,
    longitude: -75.5843,
  })),
}));

import { invokeAdkGrounding } from "../../lib/adk-grounding-client";
import { searchRestaurants } from "../search-restaurants";
import { searchCafeVenueAnchors } from "../search-venue-anchors";
import { searchGroundedPlacesTool } from "../search-grounded-places";

const anchorRow = {
  id: "anchor-1",
  kind: "cafe",
  name: "Pergamino Café Laureles",
  google_place_id: "ChIJtest",
  neighborhood: "Laureles",
  latitude: 6.2489,
  longitude: -75.5843,
  tags: ["specialty-coffee"],
  metadata: { ai_vibe_summary: "Third-wave roaster" },
};

describe("searchGroundedPlacesTool café venue_anchors fallback (UX-T-013)", () => {
  beforeEach(() => {
    vi.mocked(invokeAdkGrounding).mockReset();
    vi.mocked(searchRestaurants).mockReset();
    vi.mocked(searchCafeVenueAnchors).mockReset();
  });

  it("returns venue_anchors rows when ADK unavailable and query is coffee", async () => {
    vi.mocked(invokeAdkGrounding).mockResolvedValue({
      pins: [],
      attribution: [],
      metadata: { reason: "adk_unavailable", status: 403 },
    });
    vi.mocked(searchCafeVenueAnchors).mockResolvedValue([anchorRow]);

    const out = await searchGroundedPlacesTool.execute!({
      query: "good specialty coffee in Laureles",
    });

    expect(searchCafeVenueAnchors).toHaveBeenCalledWith(
      expect.objectContaining({ neighborhood: expect.stringMatching(/laureles/i), limit: 5 }),
    );
    expect(searchRestaurants).not.toHaveBeenCalled();
    expect(out.results.length).toBeGreaterThan(0);
    expect(out.results[0]?.title).toBe("Pergamino Café Laureles");
    expect(out.results[0]?.placeId).toBe("ChIJtest");
    expect(out.metadata?.fallback).toBe("curated");
  });

  it("falls through to searchRestaurants when anchors empty", async () => {
    vi.mocked(invokeAdkGrounding).mockResolvedValue({
      pins: [],
      attribution: [],
      metadata: { reason: "adk_unavailable" },
    });
    vi.mocked(searchCafeVenueAnchors).mockResolvedValue([]);
    vi.mocked(searchRestaurants).mockResolvedValue({
      results: [],
      total: 0,
      source: "fallback",
    });

    const out = await searchGroundedPlacesTool.execute!({
      query: "specialty coffee Laureles",
    });

    expect(searchCafeVenueAnchors).toHaveBeenCalled();
    expect(searchRestaurants).toHaveBeenCalled();
    expect(out.results).toEqual([]);
  });

  it("does not query venue_anchors for non-coffee restaurant queries", async () => {
    vi.mocked(invokeAdkGrounding).mockResolvedValue({
      pins: [],
      attribution: [],
      metadata: { reason: "adk_unavailable" },
    });
    vi.mocked(searchRestaurants).mockResolvedValue({
      results: [],
      total: 0,
      source: "fallback",
    });

    await searchGroundedPlacesTool.execute!({
      query: "quiet rooftop dinner in Provenza",
    });

    expect(searchCafeVenueAnchors).not.toHaveBeenCalled();
    expect(searchRestaurants).toHaveBeenCalled();
  });
});
