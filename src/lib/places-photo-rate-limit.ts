/** In-process rate limit for /api/places/photo — MAP-018 audit hardening. */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 120;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function placesPhotoRateLimitKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

export function isPlacesPhotoRateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  bucket.count += 1;
  return false;
}

/** Test helper — reset in-memory buckets. */
export function resetPlacesPhotoRateLimitsForTests(): void {
  buckets.clear();
}
