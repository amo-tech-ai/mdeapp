/** Rate limiters.
 *
 * Two flavors:
 * - allowRate()         — in-memory sliding window (per-isolate, resets on cold start).
 *                         Kept for non-critical paths or as a cheap pre-check.
 * - allowRateDurable()  — Postgres-backed fixed window via public.check_rate_limit().
 *                         Survives cold starts and is shared across all isolates.
 *                         Fails OPEN on DB errors so rate-limit-DB outage does not
 *                         take down the whole service.
 */ const buckets = new Map();
export function allowRate(key, max, windowMs) {
  const now = Date.now();
  const windowStart = now - windowMs;
  let stamps = buckets.get(key) ?? [];
  stamps = stamps.filter((t)=>t > windowStart);
  if (stamps.length >= max) return false;
  stamps.push(now);
  buckets.set(key, stamps);
  return true;
}
/** Postgres-backed fixed-window rate limiter. Uses `public.check_rate_limit` RPC. */ export async function allowRateDurable(supabase, key, max, windowSeconds) {
  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_key: key,
    p_max: max,
    p_window_seconds: windowSeconds
  });
  if (error) {
    // Fail open — never hard-block traffic on a rate-limit DB outage.
    console.error("allowRateDurable: RPC error, failing open:", error.message ?? error);
    return {
      allowed: true,
      count: 0,
      max,
      retry_after_seconds: 0
    };
  }
  const result = data;
  return result ?? {
    allowed: true,
    count: 0,
    max,
    retry_after_seconds: 0
  };
}
/** Best-effort client key for unauthenticated routes. */ export function clientIp(req) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return req.headers.get("cf-connecting-ip") ?? "unknown";
}
