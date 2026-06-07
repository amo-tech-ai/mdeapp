import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import {
  isPlacesPhotoRateLimited,
  placesPhotoRateLimitKey,
  resetPlacesPhotoRateLimitsForTests,
} from "../places-photo-rate-limit";

describe("placesPhotoRateLimitKey", () => {
  it("prefers x-forwarded-for first hop", () => {
    const req = new Request("http://localhost/api/places/photo", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(placesPhotoRateLimitKey(req)).toBe("1.2.3.4");
  });
});

describe("isPlacesPhotoRateLimited", () => {
  beforeEach(() => {
    resetPlacesPhotoRateLimitsForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests under the cap", () => {
    expect(isPlacesPhotoRateLimited("test-ip")).toBe(false);
    expect(isPlacesPhotoRateLimited("test-ip")).toBe(false);
  });

  it("blocks after 120 requests in the same window", () => {
    for (let i = 0; i < 120; i += 1) {
      expect(isPlacesPhotoRateLimited("burst-ip")).toBe(false);
    }
    expect(isPlacesPhotoRateLimited("burst-ip")).toBe(true);
  });

  it("prunes expired buckets after a window elapses", () => {
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);

    // Fill a bucket to capacity so it exists in memory
    for (let i = 0; i < 120; i += 1) {
      isPlacesPhotoRateLimited("stale-ip");
    }
    expect(isPlacesPhotoRateLimited("stale-ip")).toBe(true);

    // Advance past the prune window — the bucket should be evicted
    vi.setSystemTime(now + 61_000);

    // A new request resets the bucket (bucket was expired → no longer limited)
    expect(isPlacesPhotoRateLimited("stale-ip")).toBe(false);
  });
});
