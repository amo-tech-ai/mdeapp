import { describe, expect, it, beforeEach } from "vitest";
import {
  isPlacesDetailRateLimited,
  placesDetailRateLimitKey,
  resetPlacesDetailRateLimitsForTests,
} from "../places-detail-rate-limit";

describe("placesDetailRateLimitKey", () => {
  it("prefers x-forwarded-for first hop", () => {
    const req = new Request("http://localhost/api/places/detail?placeId=abc", {
      headers: { "x-forwarded-for": "10.0.0.1, 10.0.0.2" },
    });
    expect(placesDetailRateLimitKey(req)).toBe("10.0.0.1");
  });

  it("falls back to x-real-ip", () => {
    const req = new Request("http://localhost/api/places/detail?placeId=abc", {
      headers: { "x-real-ip": "10.0.0.3" },
    });
    expect(placesDetailRateLimitKey(req)).toBe("10.0.0.3");
  });
});

describe("isPlacesDetailRateLimited", () => {
  beforeEach(() => {
    resetPlacesDetailRateLimitsForTests();
  });

  it("allows requests under the 30/min cap", () => {
    for (let i = 0; i < 30; i += 1) {
      expect(isPlacesDetailRateLimited("test-ip")).toBe(false);
    }
  });

  it("blocks on the 31st request within the same window", () => {
    for (let i = 0; i < 30; i += 1) {
      isPlacesDetailRateLimited("burst-ip");
    }
    expect(isPlacesDetailRateLimited("burst-ip")).toBe(true);
  });

  it("separate IPs have independent buckets", () => {
    for (let i = 0; i < 30; i += 1) {
      isPlacesDetailRateLimited("ip-a");
    }
    // ip-a is blocked, ip-b should still be allowed
    expect(isPlacesDetailRateLimited("ip-a")).toBe(true);
    expect(isPlacesDetailRateLimited("ip-b")).toBe(false);
  });

  it("resets correctly between tests", () => {
    for (let i = 0; i < 30; i += 1) {
      isPlacesDetailRateLimited("reset-ip");
    }
    expect(isPlacesDetailRateLimited("reset-ip")).toBe(true);
    resetPlacesDetailRateLimitsForTests();
    expect(isPlacesDetailRateLimited("reset-ip")).toBe(false);
  });
});
