/** Shared in-process rate limiter factory for Places API proxy routes. */

const WINDOW_MS = 60_000;

type Bucket = { count: number; resetAt: number };

export interface PlacesRateLimiter {
  /** Returns false when key is null (unidentifiable IP — let request through). */
  isRateLimited(key: string | null): boolean;
  /** Returns null when no IP header is present; callers must not rate-limit in that case. */
  rateLimitKey(req: Request): string | null;
  resetForTests(): void;
}

/**
 * Creates an in-process fixed-window rate limiter per IP.
 * Expired IP buckets are pruned once per window to bound memory growth.
 *
 * When rateLimitKey returns null (no identifiable client IP), isRateLimited
 * returns false so unidentifiable requests are never blocked under a shared bucket.
 * In production (Vercel) every request carries x-forwarded-for, so null is
 * only encountered in local dev or bare Node environments.
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

  function isRateLimited(key: string | null): boolean {
    if (key === null) return false;
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

  function rateLimitKey(req: Request): string | null {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
      const first = forwarded.split(",")[0]?.trim();
      if (first) return first;
    }
    return req.headers.get("x-real-ip") ?? null;
  }

  function resetForTests(): void {
    buckets.clear();
    nextPruneAt = Date.now() + WINDOW_MS;
  }

  return { isRateLimited, rateLimitKey, resetForTests };
}
