import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/mastra/tools/search-grounded-places", () => ({
  searchGroundedPlacesTool: {
    execute: vi.fn(),
  },
}));

import { POST } from "../route";
import { searchGroundedPlacesTool } from "@/mastra/tools/search-grounded-places";

describe("POST /api/grounded/search", () => {
  beforeEach(() => {
    vi.mocked(searchGroundedPlacesTool.execute!).mockReset();
  });

  it("returns grounded tool envelope", async () => {
    vi.mocked(searchGroundedPlacesTool.execute!).mockResolvedValue({
      results: [{ id: "a1", title: "Pergamino", latitude: 6.2, longitude: -75.5 }],
      attribution: [],
      source: "grounding",
    });

    const res = await POST(
      new Request("http://localhost/api/grounded/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "good specialty coffee in Laureles",
          neighborhood: "Laureles",
        }),
      }),
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.results).toHaveLength(1);
    expect(searchGroundedPlacesTool.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.stringMatching(/Laureles/i),
        pageSize: 5,
      }),
      expect.anything(),
    );
  });

  it("forwards intent nightlife to grounded tool", async () => {
    vi.mocked(searchGroundedPlacesTool.execute!).mockResolvedValue({
      results: [],
      attribution: [],
      source: "grounding",
    });

    const res = await POST(
      new Request("http://localhost/api/grounded/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "popular venues tonight in Provenza",
          intent: "nightlife",
        }),
      }),
    );

    expect(res.status).toBe(200);
    expect(searchGroundedPlacesTool.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        intent: "nightlife",
        query: expect.stringMatching(/Provenza/i),
      }),
      expect.anything(),
    );
  });
});
