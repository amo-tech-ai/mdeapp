import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/adk-grounding-client", () => ({
  invokeAdkSearchGrounding: vi.fn(),
}));

vi.mock("../../lib/search-grounding-quota", () => ({
  incrementAndCheckSearchGroundingQuota: vi.fn(),
}));

import { invokeAdkSearchGrounding } from "../../lib/adk-grounding-client";
import { incrementAndCheckSearchGroundingQuota } from "../../lib/search-grounding-quota";
import { searchWebGroundedEventsTool } from "../search-web-grounded-events";

type WebToolOut = {
  answer: string;
  citations: { title: string; url: string }[];
  source: "web";
  confidence: number;
  metadata?: Record<string, unknown>;
};

async function runTool(input: {
  query: string;
  sqlEventCount?: number;
}): Promise<WebToolOut> {
  const out = await searchWebGroundedEventsTool.execute!(input, {} as never);
  return out as WebToolOut;
}

describe("searchWebGroundedEventsTool", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("skips router when query is map-only", async () => {
    vi.mocked(incrementAndCheckSearchGroundingQuota).mockResolvedValue({
      allowed: true,
    });

    const out = await runTool({
      query: "quiet cafés near Laureles",
      sqlEventCount: 0,
    });

    expect(out.metadata?.reason).toBe("router_skip");
    expect(invokeAdkSearchGrounding).not.toHaveBeenCalled();
  });

  it("returns disabled when quota gate blocks", async () => {
    vi.mocked(incrementAndCheckSearchGroundingQuota).mockResolvedValue({
      allowed: false,
      reason: "disabled",
    });

    const out = await runTool({
      query: "rooftop events Poblado this Friday",
      sqlEventCount: 0,
    });

    expect(out.citations).toHaveLength(0);
    expect(out.metadata?.reason).toBe("disabled");
    expect(invokeAdkSearchGrounding).not.toHaveBeenCalled();
  });

  it("returns citations when ADK returns grounding chunks", async () => {
    vi.mocked(incrementAndCheckSearchGroundingQuota).mockResolvedValue({
      allowed: true,
    });
    vi.mocked(invokeAdkSearchGrounding).mockResolvedValue({
      citations: [
        {
          title: "Event guide",
          url: "https://example.com/events",
          snippet: "Lineup",
        },
      ],
      confidence: 0.8,
      metadata: { source: "google-search-grounding" },
    });

    const out = await runTool({
      query: "rooftop events Poblado this Friday",
      sqlEventCount: 0,
    });

    expect(out.citations).toHaveLength(1);
    expect(out.citations[0]?.url).toBe("https://example.com/events");
    expect(invokeAdkSearchGrounding).toHaveBeenCalledWith({
      query: "rooftop events Poblado this Friday",
    });
  });
});
