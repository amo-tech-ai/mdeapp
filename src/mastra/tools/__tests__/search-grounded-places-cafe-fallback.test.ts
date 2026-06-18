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
  isNightlifeVenueQuery: vi.fn(() => false),
  searchCafeVenueAnchors: vi.fn(),
  searchNightclubVenueAnchors: vi.fn().mockResolvedValue([]),
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
import { adkUnavailableMock } from "./grounded-places-test-helpers";

type GroundedOut = {
  results: { title?: string; placeId?: string; latitude?: number; longitude?: number }[];
  source: string;
  metadata?: Record<string, unknown>;
};

async function runGrounded(query: string): Promise<GroundedOut> {
  if (!searchGroundedPlacesTool.execute) {
    throw new Error('searchGroundedPlacesTool.execute is not available');
  }
  const out = await searchGroundedPlacesTool.execute({ query }, {} as never);
  return out as GroundedOut;
}

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
    vi.mocked(invokeAdkGrounding).mockResolvedValue(
      adkUnavailableMock({ reason: "adk_unavailable", status: 403 }),
    );
    vi.mocked(searchCafeVenueAnchors).mockResolvedValue([anchorRow]);

    const out = await runGrounded("good specialty coffee in Laureles");

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
    vi.mocked(invokeAdkGrounding).mockResolvedValue(adkUnavailableMock());
    vi.mocked(searchCafeVenueAnchors).mockResolvedValue([]);
    vi.mocked(searchRestaurants).mockResolvedValue({
      results: [],
      total: 0,
      source: "fallback",
    });

    const out = await runGrounded("specialty coffee Laureles");

    expect(searchCafeVenueAnchors).toHaveBeenCalled();
    expect(searchRestaurants).toHaveBeenCalled();
    expect(out.results).toEqual([]);
  });

  it("does not query venue_anchors for non-coffee restaurant queries", async () => {
    vi.mocked(invokeAdkGrounding).mockResolvedValue(adkUnavailableMock());
    vi.mocked(searchRestaurants).mockResolvedValue({
      results: [],
      total: 0,
      source: "fallback",
    });

    await runGrounded("quiet rooftop dinner in Provenza");

    expect(searchCafeVenueAnchors).not.toHaveBeenCalled();
    expect(searchRestaurants).toHaveBeenCalled();
  });
});
