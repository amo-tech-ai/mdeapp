/** Shared in-process rate limiter factory for Places API proxy routes. */

const WINDOW_MS = 60_000;

type Bucket = { count: number; resetAt: number };

export interface PlacesRateLimiter {
  isRateLimited(key: string): boolean;
  /**
   * Derives a per-client bucket key from the request.
   * Returns the first hop of x-forwarded-for, x-real-ip, or "unknown".
   * In production (Vercel) x-forwarded-for is always injected, so "unknown"
   * is only reachable in local dev or bare Node environments.
   */
  rateLimitKey(req: Request): string;
  resetForTests(): void;
}

/**
 * Creates an in-process fixed-window rate limiter per IP.
 * Expired IP buckets are pruned once per window to bound memory growth.
 */
export function createPlacesRateLimiter(maxPerWindow: number): PlacesRateLimiter {
  if (maxPerWindow < 1 || !Number.isInteger(maxPerWindow)) {
    throw new Error(`maxPerWindow must be a positive integer, got ${maxPerWindow}`);
  }
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
    if (forwarded) {
      const first = forwarded.split(",")[0]?.trim();
      if (first) return first;
    }
    return req.headers.get("x-real-ip") ?? "unknown";
  }

  function resetForTests(): void {
    buckets.clear();
    nextPruneAt = Date.now() + WINDOW_MS;
  }

  return { isRateLimited, rateLimitKey, resetForTests };
}
