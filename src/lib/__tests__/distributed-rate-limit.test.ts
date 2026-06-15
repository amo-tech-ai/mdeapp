import { describe, expect, it, vi } from "vitest";
import { redactIpForLog } from "../distributed-rate-limit";

const rpcMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/supabase/service", () => ({
  createServiceRoleClient: vi.fn(() => ({ rpc: rpcMock })),
}));

import { checkRateLimitDurable } from "../distributed-rate-limit";

describe("distributed-rate-limit", () => {
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
});
