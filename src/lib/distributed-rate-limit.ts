import { createHash } from "crypto";
import { createServiceRoleClient } from "@/lib/supabase/service";

export interface DistributedRateLimitResult {
  allowed: boolean;
  count: number;
  max: number;
  retryAfterSeconds: number;
  storeAvailable: boolean;
}

/**
 * Client IP for rate limiting.
 * Production: trust only platform-set x-real-ip (Vercel edge). Never trust
 * client x-forwarded-for or spoofable x-vercel-id in prod.
 * Dev/test: allow x-forwarded-for leftmost for local curl without a proxy.
 */
export function clientIpFromRequest(req: Request): string {
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  if (process.env.NODE_ENV === "production") {
    return "unknown";
  }

  const devForwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (devForwarded) return devForwarded;

  return "unknown";
}

/** Log-safe user id: first 8 chars only (matches IP redaction pattern). */
export function redactUserIdForLog(userId: string): string {
  return userId.length <= 8 ? userId : `${userId.slice(0, 8)}…`;
}

/** Log-safe IP: IPv4 first two octets; IPv6 short hash prefix. */
export function redactIpForLog(ip: string): string {
  if (ip === "unknown") return ip;
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.*.*`;
  }
  return createHash("sha256").update(ip).digest("hex").slice(0, 12);
}

/** Map Supabase check_rate_limit RPC payload into a typed result. */
function parseRpcResult(
  data: unknown,
  max: number,
): Omit<DistributedRateLimitResult, "storeAvailable"> | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  const count = typeof row.count === "number" ? row.count : Number(row.count);
  const retryAfterSeconds =
    typeof row.retry_after_seconds === "number"
      ? row.retry_after_seconds
      : Number(row.retry_after_seconds);
  return {
    allowed: row.allowed === true,
    count: Number.isFinite(count) ? count : 0,
    max: typeof row.max === "number" ? row.max : max,
    retryAfterSeconds: Number.isFinite(retryAfterSeconds) ? retryAfterSeconds : 0,
  };
}

/** Postgres-backed fixed-window limiter via public.check_rate_limit RPC. */
export async function checkRateLimitDurable(
  key: string,
  max: number,
  windowSeconds: number,
): Promise<DistributedRateLimitResult> {
  const client = createServiceRoleClient();
  if (!client) {
    return {
      allowed: true,
      count: 0,
      max,
      retryAfterSeconds: 0,
      storeAvailable: false,
    };
  }

  const { data, error } = await client.rpc("check_rate_limit", {
    p_key: key,
    p_max: max,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    console.error("[distributed-rate-limit] RPC error, failing open:", error.message);
    return {
      allowed: true,
      count: 0,
      max,
      retryAfterSeconds: 0,
      storeAvailable: false,
    };
  }

  const parsed = parseRpcResult(data, max);
  if (!parsed) {
    console.error("[distributed-rate-limit] RPC returned unexpected payload");
    return {
      allowed: true,
      count: 0,
      max,
      retryAfterSeconds: 0,
      storeAvailable: false,
    };
  }

  return { ...parsed, storeAvailable: true };
}
