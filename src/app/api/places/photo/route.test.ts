import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET } from "./route";
import { resetPlacesPhotoRateLimitsForTests } from "@/lib/places-photo-rate-limit";

vi.mock("@/mastra/lib/google-places-client", () => ({
  requirePlacesApiKey: () => "test-server-key",
}));

describe("GET /api/places/photo", () => {
  beforeEach(() => {
    resetPlacesPhotoRateLimitsForTests();
  });

  it("returns 400 for invalid photo name", async () => {
    const res = await GET(
      new Request("http://localhost/api/places/photo?name=evil"),
    );
    expect(res.status).toBe(400);
  });

  it("proxies photo bytes without key in client URL", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(new Uint8Array([1, 2, 3]), {
        status: 200,
        headers: { "Content-Type": "image/jpeg" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const res = await GET(
      new Request(
        "http://localhost/api/places/photo?name=places%2FChIJ%2Fphotos%2Fabc&maxWidthPx=400",
      ),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/jpeg");
    expect(fetchMock).toHaveBeenCalled();
    const calledUrl = String(
      (fetchMock.mock.calls as unknown as [RequestInfo | URL][])[0][0],
    );
    expect(calledUrl).toContain("test-server-key");
    expect(calledUrl).toContain("/media?maxWidthPx=400");

    vi.unstubAllGlobals();
  });

  it("returns 429 when rate limit exceeded", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(new Uint8Array([1]), {
        status: 200,
        headers: { "Content-Type": "image/jpeg" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const req = new Request(
      "http://localhost/api/places/photo?name=places%2FChIJ%2Fphotos%2Fabc",
      { headers: { "x-forwarded-for": "rate-limit-test-ip" } },
    );
    for (let i = 0; i < 120; i += 1) {
      const res = await GET(req);
      expect(res.status).toBe(200);
    }
    const blocked = await GET(req);
    expect(blocked.status).toBe(429);
    expect(fetchMock).toHaveBeenCalledTimes(120);

    vi.unstubAllGlobals();
  });
});
