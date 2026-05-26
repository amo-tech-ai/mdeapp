import { describe, expect, it } from "vitest";
import { parseSearchGroundedSidecarPayload } from "./search-grounding-types";

describe("parseSearchGroundedSidecarPayload", () => {
  it("parses citations with valid URLs", () => {
    const out = parseSearchGroundedSidecarPayload({
      citations: [
        {
          url: "https://example.com/a",
          title: "Article",
        },
      ],
      confidence: 0.8,
      metadata: {
        reason: null,
        source: "google-search-grounding",
        webSearchQueries: ["query one"],
        answer: "Summary.",
      },
    });
    expect(out.citations).toHaveLength(1);
    expect(out.citations[0]?.url).toBe("https://example.com/a");
    expect(out.metadata.reason).toBeNull();
    expect(out.webSearchQueries).toEqual(["query one"]);
  });

  it("rejects invented URLs and fail-closes", () => {
    const out = parseSearchGroundedSidecarPayload({
      citations: [{ url: "ftp://bad", title: "X" }],
      confidence: 0,
      metadata: { reason: null, source: "google-search-grounding" },
    });
    expect(out.citations).toHaveLength(0);
    expect(out.metadata.reason).toBe("no_grounding_metadata");
  });

  it("handles search_disabled stub", () => {
    const out = parseSearchGroundedSidecarPayload({
      citations: [],
      confidence: 0,
      metadata: {
        reason: "search_disabled",
        source: "google-search-grounding",
        searchDisabled: true,
      },
    });
    expect(out.metadata.searchDisabled).toBe(true);
    expect(out.metadata.reason).toBe("search_disabled");
  });
});
