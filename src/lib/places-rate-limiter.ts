/** Shared in-process rate limiter factory for Places API proxy routes. */

const WINDOW_MS = 60_000;

type Bucket = { count: number; resetAt: number };

export interface PlacesRateLimiter {
  isRateLimited(key: string): boolean;
  rateLimitKey(req: Request): string;
  resetForTests(): void;
}

/**
 * Creates an in-process sliding-window rate limiter.
 * Expired IP buckets are pruned once per window to bound memory growth.
 */
export function createPlacesRateLimiter(maxPerWindow: number): PlacesRateLimiter {
  const buckets = new Map<string, Bucket>();
  let nextPruneAt = Date.now() + WINDOW_MS;

  function prune(now: number): void {
    if (now < nextPruneAt) return;
    for (const [key, b] of buckets) {
      if (now >= b.resetAt) buckets.delete(key);
    }
    nextPruneAt = now + WINDOW_MS;
  }

  function isRateLimited(key: string): boolean {
    const now = Date.now();
    prune(now);
    const bucket = buckets.get(key);
    if (!bucket || now >= bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
      return false;
    }
    if (bucket.count >= maxPerWindow) return true;
    bucket.count += 1;
    return false;
  }

  function rateLimitKey(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
    return req.headers.get("x-real-ip") ?? "unknown";
  }

  function resetForTests(): void {
    buckets.clear();
    nextPruneAt = Date.now() + WINDOW_MS;
  }

  return { isRateLimited, rateLimitKey, resetForTests };
}
