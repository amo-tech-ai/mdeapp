import { afterEach, describe, expect, it, vi } from "vitest";
import { redactIpForLog } from "../distributed-rate-limit";

const rpcMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase/service", () => ({
  createServiceRoleClient: vi.fn(() => ({ rpc: rpcMock })),
}));

import { checkRateLimitDurable, clientIpFromRequest } from "../distributed-rate-limit";

function req(headers: Record<string, string>): Request {
  return new Request("http://localhost/api/copilotkit", { headers });
}

describe("distributed-rate-limit", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("redacts IPv4 for logs", () => {
    expect(redactIpForLog("186.81.102.183")).toBe("186.81.*.*");
  });

  it("maps RPC payload into allowed/count/max/retryAfterSeconds", async () => {
    rpcMock.mockResolvedValueOnce({
      data: {
        allowed: false,
        count: 31,
        max: 30,
        retry_after_seconds: 145,
      },
      error: null,
    });

    const result = await checkRateLimitDurable("copilotkit:anon:203.0.113.1", 30, 300);
    expect(result.storeAvailable).toBe(true);
    expect(result.allowed).toBe(false);
    expect(result.count).toBe(31);
    expect(result.retryAfterSeconds).toBe(145);
  });

  it("fails open when RPC errors", async () => {
    rpcMock.mockResolvedValueOnce({
      data: null,
      error: { message: "connection failed" },
    });

    const result = await checkRateLimitDurable("copilotkit:anon:203.0.113.2", 30, 300);
    expect(result.storeAvailable).toBe(false);
    expect(result.allowed).toBe(true);
  });

  it("prefers x-real-ip over spoofed x-forwarded-for in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(
      clientIpFromRequest(
        req({
          "x-real-ip": "186.81.102.183",
          "x-forwarded-for": "10.0.0.1, 10.0.0.2",
        }),
      ),
    ).toBe("186.81.102.183");
  });

  it("ignores client x-forwarded-for in production without platform IP", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(clientIpFromRequest(req({ "x-forwarded-for": "10.0.0.99" }))).toBe("unknown");
  });

  it("ignores spoofed x-vercel-id and x-forwarded-for in production without x-real-ip", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(
      clientIpFromRequest(
        req({
          "x-vercel-id": "spoofed-deployment-id",
          "x-forwarded-for": "203.0.113.99",
        }),
      ),
    ).toBe("unknown");
  });

  it("uses x-forwarded-for leftmost in non-production for local tests", () => {
    vi.stubEnv("NODE_ENV", "test");
    expect(clientIpFromRequest(req({ "x-forwarded-for": "203.0.113.77" }))).toBe("203.0.113.77");
  });
});
