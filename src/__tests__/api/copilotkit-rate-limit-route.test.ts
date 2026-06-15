import { beforeEach, describe, expect, it, vi } from "vitest";

const handleRequestMock = vi.hoisted(() => vi.fn());
const getUserMock = vi.hoisted(() => vi.fn());
const ipHardCeilingMock = vi.hoisted(() => vi.fn());
const distributedRateLimitMock = vi.hoisted(() => vi.fn());

vi.mock("@copilotkit/runtime", () => ({
  CopilotRuntime: vi.fn(function CopilotRuntime() {
    return {};
  }),
  ExperimentalEmptyAdapter: vi.fn(function ExperimentalEmptyAdapter() {
    return {};
  }),
  copilotRuntimeNextJSAppRouterEndpoint: vi.fn(() => ({
    handleRequest: handleRequestMock,
  })),
}));

vi.mock("@/mastra", () => ({ mastra: {} }));
vi.mock("@/mastra/copilotkit/logging-mastra-agent", () => ({
  getLocalAgentsWithLogging: vi.fn(() => ({})),
}));
vi.mock("@/mastra/lib/log-agent-run", () => ({ logAgentRunForTurn: vi.fn() }));
vi.mock("@/lib/copilotkit-auth", () => ({
  assertCopilotKitAuthorized: vi.fn(() => null),
}));
vi.mock("@/lib/copilotkit-distributed-rate-limit", () => ({
  checkCopilotKitDistributedIpHardCeiling: (...args: unknown[]) => ipHardCeilingMock(...args),
  checkCopilotKitDistributedRateLimit: (...args: unknown[]) =>
    distributedRateLimitMock(...args),
}));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: getUserMock },
  })),
}));

import { POST } from "@/app/api/copilotkit/[[...path]]/route";

function postRequest(ip: string, body = ""): Request {
  return new Request("http://localhost/api/copilotkit", {
    method: "POST",
    headers: {
      "x-forwarded-for": ip,
      "content-type": "application/json",
    },
    body,
  });
}

describe("POST /api/copilotkit — distributed rate limit gate", () => {
  beforeEach(() => {
    handleRequestMock.mockReset();
    getUserMock.mockReset();
    ipHardCeilingMock.mockReset();
    distributedRateLimitMock.mockReset();

    ipHardCeilingMock.mockResolvedValue(null);
    distributedRateLimitMock.mockResolvedValue(null);
    getUserMock.mockResolvedValue({ data: { user: null } });
    handleRequestMock.mockResolvedValue(new Response("bad request", { status: 400 }));
  });

  it("does not call Mastra runtime when distributed rate limit blocks", async () => {
    distributedRateLimitMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "rate_limited", retryAfter: 120 }), {
        status: 429,
      }),
    );

    const res = await POST(postRequest("186.81.102.183") as never);
    expect(res.status).toBe(429);
    expect(handleRequestMock).not.toHaveBeenCalled();
  });

  it("passes through to runtime when under limit (empty body keeps 400 behavior)", async () => {
    const res = await POST(postRequest("203.0.113.60") as never);
    expect(res.status).toBe(400);
    expect(handleRequestMock).toHaveBeenCalledTimes(1);
    expect(ipHardCeilingMock.mock.invocationCallOrder[0]).toBeLessThan(
      distributedRateLimitMock.mock.invocationCallOrder[0] ?? Number.MAX_SAFE_INTEGER,
    );
  });

  it("blocks at IP hard ceiling before Supabase getUser", async () => {
    ipHardCeilingMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "rate_limited", retryAfter: 300 }), {
        status: 429,
      }),
    );

    const res = await POST(postRequest("186.81.102.183") as never);
    expect(res.status).toBe(429);
    expect(getUserMock).not.toHaveBeenCalled();
    expect(handleRequestMock).not.toHaveBeenCalled();
  });
});
