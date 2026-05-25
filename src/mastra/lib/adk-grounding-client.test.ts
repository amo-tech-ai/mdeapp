import { describe, expect, it, vi, afterEach } from "vitest";
import { invokeAdkGrounding } from "./adk-grounding-client";

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
