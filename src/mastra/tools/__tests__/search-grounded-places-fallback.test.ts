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
  searchCafeVenueAnchors: vi.fn().mockResolvedValue([]),
  venueAnchorMapsUrl: vi.fn(
    (id: string) => `https://www.google.com/maps/search/?api=1&query_place_id=${id}`,
  ),
  venueAnchorSummary: vi.fn(),
  venueAnchorToCoordinates: vi.fn(() => ({
    latitude: 6.2489,
    longitude: -75.5843,
  })),
}));

import { invokeAdkGrounding } from "../../lib/adk-grounding-client";
import { searchRestaurants } from "../search-restaurants";
import { searchGroundedPlacesTool } from "../search-grounded-places";

const cafeRow = {
  id: "rst_lau_cafe_001",
  name: "Pergamino Café",
  cuisine: "cafe" as const,
  neighborhood: "Laureles",
  priceTier: "$" as const,
  avgPricePerPerson: 8,
  currency: "USD" as const,
  rating: 4.7,
  vibe: ["specialty-coffee"],
  imageUrl: "https://example.com/img.jpg",
  sourceUrl: "https://mdeai.co/restaurants/rst_lau_cafe_001",
  latitude: 6.2489,
  longitude: -75.5843,
  placeId: "ChIJtest",
  mapsUrl: "https://maps.google.com/?cid=123",
};

describe("searchGroundedPlacesTool fallback", () => {
  beforeEach(() => {
    vi.mocked(invokeAdkGrounding).mockReset();
    vi.mocked(searchRestaurants).mockReset();
  });

  it("GM-P0-06 returns curated fallback when ADK unavailable (403)", async () => {
    vi.mocked(invokeAdkGrounding).mockResolvedValue({
      pins: [],
      attribution: [],
      metadata: { reason: "adk_unavailable", status: 403 },
    });
    vi.mocked(searchRestaurants).mockResolvedValue({
      results: [cafeRow],
      total: 1,
      source: "fallback",
    });

    const out = await searchGroundedPlacesTool.execute!({
      query: "specialty coffee Laureles",
    });

    expect(out.results.length).toBeGreaterThan(0);
    expect(out.results[0]?.title).toBe("Pergamino Café");
    expect(out.results[0]?.latitude).toBe(6.2489);
    expect(out.metadata?.fallback).toBe("curated");
  });

  it("GM-P2-04 returns empty results without throwing when ADK and fallback empty", async () => {
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

    const out = await searchGroundedPlacesTool.execute!({
      query: "coffee Laureles",
    });

    expect(out.results).toEqual([]);
    expect(out.source).toBe("grounding");
  });

  it("GM-P0-07 uses restaurant coordinates in fallback rows", async () => {
    vi.mocked(invokeAdkGrounding).mockResolvedValue({
      pins: [],
      attribution: [],
      metadata: { reason: "adk_unavailable" },
    });
    vi.mocked(searchRestaurants).mockResolvedValue({
      results: [cafeRow],
      total: 1,
      source: "fallback",
    });

    const out = await searchGroundedPlacesTool.execute!({
      query: "quiet café Laureles",
    });

    expect(out.results[0]?.placeId).toBe("ChIJtest");
    expect(out.results[0]?.longitude).toBe(-75.5843);
  });
});
