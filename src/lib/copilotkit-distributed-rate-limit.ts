import { createPlacesRateLimiter } from "@/lib/places-rate-limiter";
import {
  checkRateLimitDurable,
  clientIpFromRequest,
  redactIpForLog,
  type DistributedRateLimitResult,
} from "@/lib/distributed-rate-limit";

export const COPILOTKIT_ROUTE = "copilotkit";
export const COPILOTKIT_WINDOW_SECONDS = 300;
export const COPILOTKIT_ANON_IP_MAX = 30;
export const COPILOTKIT_AUTH_USER_MAX = 120;
export const COPILOTKIT_HARD_IP_MAX = 300;

/** Per-instance emergency brake when durable store is unavailable. */
const emergencyFloodLimiter = createPlacesRateLimiter(80);

export function buildCopilotKitRateLimitKey(
  scope: "ip-hard" | "anon" | "user",
  value: string,
): string {
  return `${COPILOTKIT_ROUTE}:${scope}:${value}`;
}

export function buildRateLimitedResponse(
  result: Pick<DistributedRateLimitResult, "max" | "count" | "retryAfterSeconds">,
): Response {
  const retryAfter = Math.max(1, result.retryAfterSeconds || COPILOTKIT_WINDOW_SECONDS);
  const remaining = Math.max(0, result.max - result.count);

  return new Response(
    JSON.stringify({ error: "rate_limited", retryAfter }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(result.max),
        "X-RateLimit-Remaining": String(remaining),
      },
    },
  );
}

function logRateLimitBlock(input: {
  scope: string;
  ip: string;
  userId: string | null;
  count: number;
  max: number;
  storeAvailable: boolean;
}): void {
  console.warn("[copilotkit rate limit]", {
    route: COPILOTKIT_ROUTE,
    scope: input.scope,
    ip: redactIpForLog(input.ip),
    userId: input.userId,
    count: input.count,
    max: input.max,
    storeAvailable: input.storeAvailable,
  });
}

function emergencyFloodBlocked(req: Request): boolean {
  const key = `emergency:${clientIpFromRequest(req)}`;
  return emergencyFloodLimiter.isRateLimited(key);
}

async function evaluateLimit(
  req: Request,
  key: string,
  max: number,
  scope: string,
  userId: string | null,
): Promise<Response | null> {
  const result = await checkRateLimitDurable(key, max, COPILOTKIT_WINDOW_SECONDS);

  if (!result.storeAvailable) {
    if (emergencyFloodBlocked(req)) {
      logRateLimitBlock({
        scope: `${scope}:emergency-local`,
        ip: clientIpFromRequest(req),
        userId,
        count: 0,
        max,
        storeAvailable: false,
      });
      return buildRateLimitedResponse({
        max,
        count: max + 1,
        retryAfterSeconds: 60,
      });
    }
    return null;
  }

  if (result.allowed) return null;

  logRateLimitBlock({
    scope,
    ip: clientIpFromRequest(req),
    userId,
    count: result.count,
    max: result.max,
    storeAvailable: true,
  });
  return buildRateLimitedResponse(result);
}

/** Runs before Supabase auth — blocks IP floods from reaching getUser. */
export async function checkCopilotKitDistributedIpHardCeiling(
  req: Request,
): Promise<Response | null> {
  const ip = clientIpFromRequest(req);
  return evaluateLimit(
    req,
    buildCopilotKitRateLimitKey("ip-hard", ip),
    COPILOTKIT_HARD_IP_MAX,
    "ip-hard",
    null,
  );
}

/** Runs after auth — anonymous IP bucket or authenticated user bucket. */
export async function checkCopilotKitDistributedRateLimit(
  req: Request,
  userId: string | null,
): Promise<Response | null> {
  const ip = clientIpFromRequest(req);

  if (userId) {
    return evaluateLimit(
      req,
      buildCopilotKitRateLimitKey("user", userId),
      COPILOTKIT_AUTH_USER_MAX,
      "user",
      userId,
    );
  }

  return evaluateLimit(
    req,
    buildCopilotKitRateLimitKey("anon", ip),
    COPILOTKIT_ANON_IP_MAX,
    "anon",
    null,
  );
}

/** @internal Vitest only */
export function resetCopilotKitDistributedRateLimitsForTests(): void {
  emergencyFloodLimiter.resetForTests();
}
