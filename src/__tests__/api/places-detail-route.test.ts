/**
 * Route-level integration tests for GET /api/places/detail
 *
 * Covers:
 *  - 30 requests allowed per IP per window
 *  - 31st request → HTTP 429 with { error: "rate_limited" } + Cache-Control: no-store
 *  - Separate IPs have independent buckets
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetPlacesDetailRateLimitsForTests } from "@/lib/places-detail-rate-limit";

// Stable top-level mocks — route never calls real Google APIs in tests
vi.mock("@/lib/place-details-cache", () => ({
  fetchPlaceDetailsWithCache: vi.fn(async () => ({
    raw: { id: "ChIJtest", displayName: { text: "Test Place" } },
    cacheHit: true,
  })),
}));

vi.mock("@/lib/place-details", () => ({
  normalizePlaceDetails: vi.fn(() => ({
    placeId: "ChIJtest",
    name: "Test Place",
  })),
}));

vi.mock("@/mastra/lib/google-places-client", () => ({
  normalizePlaceId: (id: string) => id,
  PlacesConfigError: class PlacesConfigError extends Error {},
  PlacesRequestError: class PlacesRequestError extends Error {},
}));

// Import route once — rate limiter state is reset between tests via beforeEach
import { GET } from "@/app/api/places/detail/route";

function makeRequest(ip: string, placeId = "ChIJtestplace12345") {
  return new Request(
    `http://localhost/api/places/detail?placeId=${placeId}`,
    { headers: { "x-forwarded-for": ip } },
  );
}

describe("GET /api/places/detail — rate limiting", () => {
  beforeEach(() => {
    resetPlacesDetailRateLimitsForTests();
  });

  it("allows the first 30 requests from the same IP", async () => {
    for (let i = 0; i < 30; i++) {
      const res = await GET(makeRequest("1.2.3.4"));
      expect(res.status, `request ${i + 1} should be 200`).toBe(200);
    }
  });

  it("returns 429 with rate_limited body and no-store on the 31st request", async () => {
    for (let i = 0; i < 30; i++) {
      await GET(makeRequest("2.2.2.2"));
    }
    const res = await GET(makeRequest("2.2.2.2"));

    expect(res.status).toBe(429);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("rate_limited");
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });

  it("separate IPs have independent rate-limit buckets", async () => {
    // Exhaust IP A
    for (let i = 0; i < 30; i++) {
      await GET(makeRequest("3.3.3.3"));
    }
    const blockedA = await GET(makeRequest("3.3.3.3"));
    expect(blockedA.status).toBe(429);

    // IP B still has a fresh bucket
    const allowedB = await GET(makeRequest("4.4.4.4"));
    expect(allowedB.status).toBe(200);
  });
});
