import { describe, expect, it, vi, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { assertCopilotKitAuthorized } from "./copilotkit-auth";

describe("assertCopilotKitAuthorized", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows any request when COPILOTKIT_API_KEY is unset", () => {
    vi.stubEnv("COPILOTKIT_API_KEY", "");
    const req = new NextRequest("http://localhost:3001/api/copilotkit", {
      method: "POST",
    });
    expect(assertCopilotKitAuthorized(req)).toBeNull();
  });

  it("allows dev requests without bearer", () => {
    vi.stubEnv("COPILOTKIT_API_KEY", "secret");
    vi.stubEnv("NODE_ENV", "development");
    const req = new NextRequest("http://localhost:3001/api/copilotkit", {
      method: "POST",
    });
    expect(assertCopilotKitAuthorized(req)).toBeNull();
  });

  it("rejects production requests without bearer from foreign origin", () => {
    vi.stubEnv("COPILOTKIT_API_KEY", "secret");
    vi.stubEnv("NODE_ENV", "production");
    const req = new NextRequest("http://localhost:3001/api/copilotkit", {
      method: "POST",
      headers: { origin: "https://evil.example" },
    });
    const res = assertCopilotKitAuthorized(req);
    expect(res?.status).toBe(401);
  });

  it("allows same-origin browser POST in production without bearer", () => {
    vi.stubEnv("COPILOTKIT_API_KEY", "secret");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.mdeai.co");
    const req = new NextRequest("https://www.mdeai.co/api/copilotkit", {
      method: "POST",
      headers: {
        origin: "https://www.mdeai.co",
        host: "www.mdeai.co",
      },
    });
    expect(assertCopilotKitAuthorized(req)).toBeNull();
  });

  it("accepts matching bearer in production", () => {
    vi.stubEnv("COPILOTKIT_API_KEY", "secret");
    vi.stubEnv("NODE_ENV", "production");
    const req = new NextRequest("http://localhost:3001/api/copilotkit", {
      method: "POST",
      headers: { authorization: "Bearer secret" },
    });
    expect(assertCopilotKitAuthorized(req)).toBeNull();
  });
});
