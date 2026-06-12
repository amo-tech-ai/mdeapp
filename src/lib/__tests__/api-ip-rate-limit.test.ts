import { afterEach, describe, expect, it } from "vitest";
import {
  checkCopilotKitRateLimit,
  checkSearchFastPathRateLimit,
  resetApiIpRateLimitsForTests,
} from "../api-ip-rate-limit";

function reqWithIp(ip: string): Request {
  return new Request("http://localhost/api/test", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
  });
}

describe("api-ip-rate-limit", () => {
  afterEach(() => {
    resetApiIpRateLimitsForTests();
  });

  it("returns 429 on the 16th anonymous CopilotKit request from one IP", () => {
    const req = reqWithIp("203.0.113.10");
    for (let i = 0; i < 15; i += 1) {
      expect(checkCopilotKitRateLimit(req, null)).toBeNull();
    }
    const blocked = checkCopilotKitRateLimit(req, null);
    expect(blocked?.status).toBe(429);
  });

  it("returns 429 on the 41st authed CopilotKit request for one user", () => {
    const req = reqWithIp("203.0.113.11");
    const userId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    for (let i = 0; i < 40; i += 1) {
      expect(checkCopilotKitRateLimit(req, userId)).toBeNull();
    }
    const blocked = checkCopilotKitRateLimit(req, userId);
    expect(blocked?.status).toBe(429);
  });

  it("returns 429 on the 31st search fast-path request from one IP", async () => {
    const req = reqWithIp("203.0.113.12");
    for (let i = 0; i < 30; i += 1) {
      expect(checkSearchFastPathRateLimit(req)).toBeNull();
    }
    const blocked = checkSearchFastPathRateLimit(req);
    expect(blocked?.status).toBe(429);
    expect(await blocked?.json()).toEqual({ error: "rate_limited" });
  });
});
