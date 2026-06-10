import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const buckets = new Map<string, number[]>();

export function allowRate(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  let stamps = buckets.get(key) ?? [];
  stamps = stamps.filter((t) => t > windowStart);
  if (stamps.length >= max) return false;
  stamps.push(now);
  buckets.set(key, stamps);
  return true;
}

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  max: number;
  retry_after_seconds: number;
}

export async function allowRateDurable(
  supabase: SupabaseClient,
  key: string,
  max: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_key: key,
    p_max: max,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error(
      "allowRateDurable: RPC error, failing open:",
      error.message ?? error,
    );
    return { allowed: true, count: 0, max, retry_after_seconds: 0 };
  }
  const result = data as RateLimitResult | null;
  return result ?? { allowed: true, count: 0, max, retry_after_seconds: 0 };
}

export function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return req.headers.get("cf-connecting-ip") ?? "unknown";
}
