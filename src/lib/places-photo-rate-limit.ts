/** In-process rate limit for /api/places/photo — MAP-018 audit hardening. */
import { createPlacesRateLimiter } from "./places-rate-limiter";

const limiter = createPlacesRateLimiter(120);

export const placesPhotoRateLimitKey = limiter.rateLimitKey;
export const isPlacesPhotoRateLimited = limiter.isRateLimited;
export const resetPlacesPhotoRateLimitsForTests = limiter.resetForTests;
