/** In-process rate limit for /api/places/detail — 30 req/min/IP. */
import { createPlacesRateLimiter } from "./places-rate-limiter";

const limiter = createPlacesRateLimiter(30);

export const placesDetailRateLimitKey = limiter.rateLimitKey;
export const isPlacesDetailRateLimited = limiter.isRateLimited;
export const resetPlacesDetailRateLimitsForTests = limiter.resetForTests;
