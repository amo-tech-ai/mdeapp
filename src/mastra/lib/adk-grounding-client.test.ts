import { describe, expect, it, vi, afterEach } from "vitest";
import { invokeAdkGrounding, invokeAdkSearchGrounding } from "./adk-grounding-client";

describe("invokeAdkGrounding", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns fail-closed envelope when fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    const out = await invokeAdkGrounding({ query: "cafés Laureles" });
    expect(out.metadata.reason).toBe("adk_unavailable");
    expect(out.pins).toEqual([]);
  });

  it("sends Bearer when ADK_INTERNAL_TOKEN is set", async () => {
    vi.stubEnv("ADK_INTERNAL_TOKEN", "test-secret-token");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ pins: [], attribution: [], metadata: {} }),
    });
    vi.stubGlobal("fetch", fetchMock);
    await invokeAdkGrounding({ query: "cafés" });
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(init.headers).toMatchObject({
      Authorization: "Bearer test-secret-token",
    });
  });

  it("returns fail-closed on 401 without Bearer", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ detail: "missing_bearer_token" }),
      }),
    );
    const out = await invokeAdkGrounding({ query: "cafés" });
    expect(out.metadata?.reason).toBe("adk_unavailable");
    expect(out.metadata?.status).toBe(401);
  });

  it("forwards locationBias in request body", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ pins: [], attribution: [], metadata: {} }),
    });
    vi.stubGlobal("fetch", fetchMock);
    await invokeAdkGrounding({
      query: "cafés",
      locationBias: { latitude: 6.21, longitude: -75.57 },
    });
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(init.body));
    expect(body.locationBias).toEqual({
      latitude: 6.21,
      longitude: -75.57,
    });
  });

  it("parses successful ADK JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          pins: [
            {
              id: "ChIJx",
              title: "Café",
              latitude: 6.24,
              longitude: -75.58,
              placeId: "ChIJx",
              mapsUrl: "https://maps.google.com/?cid=1",
            },
          ],
          attribution: [
            {
              source: "google_maps_grounding",
              placeUri: "https://maps.google.com/?cid=1",
            },
          ],
          confidence: 0.9,
          metadata: { source: "grounding-lite" },
        }),
      }),
    );
    const out = await invokeAdkGrounding({ query: "cafés" });
    expect(out.pins).toHaveLength(1);
    expect(out.attribution).toHaveLength(1);
  });
});

describe("invokeAdkSearchGrounding", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts search_grounded_events tool", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        citations: [],
        metadata: { reason: "search_disabled" },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    await invokeAdkSearchGrounding({ query: "events Friday" });
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(init.body));
    expect(body.tool).toBe("search_grounded_events");
    expect(body.query).toBe("events Friday");
  });
});
