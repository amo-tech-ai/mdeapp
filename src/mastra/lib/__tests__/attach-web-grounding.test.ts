import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../adk-grounding-client", () => ({
  invokeAdkSearchGrounding: vi.fn(),
}));

vi.mock("../search-grounding-quota", () => ({
  incrementAndCheckSearchGroundingQuota: vi.fn(),
}));

import { invokeAdkSearchGrounding } from "../adk-grounding-client";
import {
  attachWebGroundingForEventSearch,
  buildEventSearchQueryText,
  shouldChainWebGrounding,
} from "../attach-web-grounding";
import { incrementAndCheckSearchGroundingQuota } from "../search-grounding-quota";

describe("attach-web-grounding", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("builds query text from event filters", () => {
    expect(
      buildEventSearchQueryText({
        category: "nightlife",
        neighborhood: "El Poblado",
        dateWindow: "this_weekend",
      }),
    ).toBe("nightlife events in El Poblado this weekend");
  });

  it("chains when dateWindow is fresh and catalog is thin", () => {
    expect(
      shouldChainWebGrounding(
        { category: "nightlife", dateWindow: "this_weekend" },
        0,
      ),
    ).toBe(true);
    expect(
      shouldChainWebGrounding(
        { category: "nightlife", dateWindow: "this_weekend" },
        5,
      ),
    ).toBe(false);
  });

  it("returns citations when quota allows", async () => {
    vi.mocked(incrementAndCheckSearchGroundingQuota).mockResolvedValue({
      allowed: true,
    });
    vi.mocked(invokeAdkSearchGrounding).mockResolvedValue({
      citations: [{ title: "Guide", url: "https://example.com/e", snippet: null }],
      confidence: 0.9,
      metadata: { source: "google-search-grounding" },
    });

    const out = await attachWebGroundingForEventSearch(
      {
        category: "nightlife",
        neighborhood: "El Poblado",
        dateWindow: "this_weekend",
      },
      0,
    );

    expect(out?.citations).toHaveLength(1);
    expect(invokeAdkSearchGrounding).toHaveBeenCalled();
  });
});
