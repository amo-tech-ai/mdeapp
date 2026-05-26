import { describe, expect, it, beforeEach } from "vitest";
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
});
