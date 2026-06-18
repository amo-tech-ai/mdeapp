import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  COPILOTKIT_ANON_IP_MAX,
  COPILOTKIT_AUTH_USER_MAX,
  COPILOTKIT_HARD_IP_MAX,
  buildRateLimitedResponse,
  checkCopilotKitDistributedIpHardCeiling,
  checkCopilotKitDistributedRateLimit,
  resetCopilotKitDistributedRateLimitsForTests,
} from "../copilotkit-distributed-rate-limit";

const rpcMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/distributed-rate-limit", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../distributed-rate-limit")>();
  return {
    ...actual,
    checkRateLimitDurable: (...args: Parameters<typeof actual.checkRateLimitDurable>) =>
      rpcMock(...args),
  };
});

function reqWithIp(ip: string): Request {
  return new Request("http://localhost/api/copilotkit", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
  });
}

function mockRpcSequence(
  results: Array<{
    allowed: boolean;
    count: number;
    max: number;
    retryAfterSeconds?: number;
    storeAvailable?: boolean;
  }>,
): void {
  let index = 0;
  rpcMock.mockImplementation(async (_key: string, max: number) => {
    const next = results[index] ?? results[results.length - 1] ?? {};
    index += 1;
    return {
      retryAfterSeconds: 0,
      storeAvailable: true,
      ...next,
      max: next.max ?? max,
    };
  });
}

describe("copilotkit-distributed-rate-limit", () => {
  beforeEach(() => {
    rpcMock.mockReset();
    resetCopilotKitDistributedRateLimitsForTests();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 429 on the 31st anonymous request from one IP", async () => {
    const req = reqWithIp("203.0.113.50");
    mockRpcSequence([
      ...Array.from({ length: 30 }, (_, i) => ({
        allowed: true,
        count: i + 1,
        max: COPILOTKIT_ANON_IP_MAX,
      })),
      {
        allowed: false,
        count: 31,
        max: COPILOTKIT_ANON_IP_MAX,
        retryAfterSeconds: 180,
      },
    ]);

    for (let i = 0; i < 30; i += 1) {
      expect(await checkCopilotKitDistributedRateLimit(req, null)).toBeNull();
    }

    const blocked = await checkCopilotKitDistributedRateLimit(req, null);
    expect(blocked?.status).toBe(429);
    const body = (await blocked?.json()) as { error: string; retryAfter: number };
    expect(body.error).toBe("rate_limited");
    expect(body.retryAfter).toBeGreaterThan(0);
    expect(blocked?.headers.get("Retry-After")).toBeTruthy();
    expect(blocked?.headers.get("X-RateLimit-Limit")).toBe(String(COPILOTKIT_ANON_IP_MAX));
    expect(blocked?.headers.get("X-RateLimit-Remaining")).toBe("0");
  });

  it("allows authenticated requests under the user limit", async () => {
    const req = reqWithIp("203.0.113.51");
    const userId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    mockRpcSequence([
      { allowed: true, count: 1, max: COPILOTKIT_AUTH_USER_MAX },
      { allowed: true, count: 50, max: COPILOTKIT_AUTH_USER_MAX },
    ]);

    expect(await checkCopilotKitDistributedRateLimit(req, userId)).toBeNull();
    expect(await checkCopilotKitDistributedRateLimit(req, userId)).toBeNull();
  });

  it("returns 429 when authenticated user exceeds the user limit", async () => {
    const req = reqWithIp("203.0.113.52");
    const userId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
    mockRpcSequence([
      {
        allowed: false,
        count: COPILOTKIT_AUTH_USER_MAX + 1,
        max: COPILOTKIT_AUTH_USER_MAX,
        retryAfterSeconds: 90,
      },
    ]);

    const blocked = await checkCopilotKitDistributedRateLimit(req, userId);
    expect(blocked?.status).toBe(429);
  });

  it("returns 429 when IP hard ceiling is exceeded before auth", async () => {
    const req = reqWithIp("186.81.102.183");
    mockRpcSequence([
      {
        allowed: false,
        count: COPILOTKIT_HARD_IP_MAX + 1,
        max: COPILOTKIT_HARD_IP_MAX,
        retryAfterSeconds: 240,
      },
    ]);

    const blocked = await checkCopilotKitDistributedIpHardCeiling(req);
    expect(blocked?.status).toBe(429);
    expect(rpcMock).toHaveBeenCalledWith(
      "copilotkit:ip-hard:186.81.102.183",
      COPILOTKIT_HARD_IP_MAX,
      300,
    );
  });

  it("fails open when durable store is unavailable for normal volume", async () => {
    rpcMock.mockResolvedValueOnce({
      allowed: true,
      count: 0,
      max: COPILOTKIT_ANON_IP_MAX,
      retryAfterSeconds: 0,
      storeAvailable: false,
    });

    expect(await checkCopilotKitDistributedRateLimit(reqWithIp("203.0.113.53"), null)).toBeNull();
  });

  it("uses ?? so retryAfterSeconds 0 does not fall back to full window", () => {
    const res = buildRateLimitedResponse({
      max: 30,
      count: 31,
      retryAfterSeconds: 0,
    });
    expect(res.headers.get("Retry-After")).toBe("1");
  });

  it("fails closed on obvious local flood when durable store is unavailable", async () => {
    rpcMock.mockResolvedValue({
      allowed: true,
      count: 0,
      max: COPILOTKIT_HARD_IP_MAX,
      retryAfterSeconds: 0,
      storeAvailable: false,
    });

    const req = reqWithIp("203.0.113.54");
    for (let i = 0; i < 81; i += 1) {
      const result = await checkCopilotKitDistributedIpHardCeiling(req);
      if (i < 80) {
        expect(result).toBeNull();
      } else {
        expect(result?.status).toBe(429);
      }
    }
  });

  it("does not double-count emergency fallback on anon check when store is down", async () => {
    rpcMock.mockResolvedValue({
      allowed: true,
      count: 0,
      max: COPILOTKIT_ANON_IP_MAX,
      retryAfterSeconds: 0,
      storeAvailable: false,
    });

    const req = reqWithIp("203.0.113.55");
    for (let i = 0; i < 120; i += 1) {
      expect(await checkCopilotKitDistributedRateLimit(req, null)).toBeNull();
    }
  });
});
