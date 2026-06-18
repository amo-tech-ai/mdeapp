import { RequestContext } from "@mastra/core/request-context";
import { describe, expect, it } from "vitest";
import {
  getToolSpans,
  getTokenUsage,
  MDEAI_TOKEN_USAGE_KEY,
  recordTokenUsage,
  recordToolSpan,
  summarizeToolSpans,
  type ToolSpan,
} from "./tool-audit-context";

function ctxWithRequestContext() {
  const requestContext = new RequestContext();
  return { context: { requestContext }, requestContext };
}

describe("recordToolSpan / getToolSpans (AGT-00C)", () => {
  it("accumulates spans on the shared RequestContext in order", () => {
    const { context } = ctxWithRequestContext();
    recordToolSpan(context, { tool: "search_rentals", ms: 120, status: "ok", ts: 1 });
    recordToolSpan(context, { tool: "search_events", ms: 80, status: "ok", ts: 2 });

    const spans = getToolSpans(context);
    expect(spans).toHaveLength(2);
    expect(spans.map((s) => s.tool)).toEqual(["search_rentals", "search_events"]);
  });

  it("records error status without throwing", () => {
    const { context } = ctxWithRequestContext();
    recordToolSpan(context, { tool: "search_events", ms: 40, status: "error", ts: 1 });
    expect(getToolSpans(context)[0]).toMatchObject({ status: "error", ms: 40 });
  });

  it("is a no-op when there is no RequestContext (anonymous turn)", () => {
    expect(() => recordToolSpan(undefined, { tool: "x", ms: 1, status: "ok", ts: 1 })).not.toThrow();
    expect(getToolSpans()).toEqual([]);
    expect(getToolSpans({})).toEqual([]);
  });
});

describe("recordTokenUsage / getTokenUsage (AGT-00C)", () => {
  it("ignores non-finite token deltas", () => {
    const { context, requestContext } = ctxWithRequestContext();
    recordTokenUsage(context, {
      input_tokens: Number.NaN,
      output_tokens: Infinity,
      total_tokens: -5,
    });
    expect(getTokenUsage(context)).toBeNull();
    recordTokenUsage(context, { input_tokens: 10, output_tokens: 5 });
    expect(getTokenUsage(context)).toEqual({
      input_tokens: 10,
      output_tokens: 5,
      total_tokens: 15,
    });
    requestContext.set(MDEAI_TOKEN_USAGE_KEY, {
      input_tokens: Number.NaN,
      output_tokens: 2,
      total_tokens: 2,
    });
    expect(getTokenUsage(context)).toEqual({
      input_tokens: 0,
      output_tokens: 2,
      total_tokens: 2,
    });
  });
});

describe("summarizeToolSpans (AGT-00C ai_runs.metadata)", () => {
  it("sums duration and identifies the slowest tool", () => {
    const spans: ToolSpan[] = [
      { tool: "search_rentals", ms: 120, status: "ok", ts: 1 },
      { tool: "search_grounded_places", ms: 940, status: "ok", ts: 2 },
      { tool: "search_events", ms: 60, status: "ok", ts: 3 },
    ];
    expect(summarizeToolSpans(spans)).toEqual({
      tool_spans: spans,
      tool_count: 3,
      tool_ms_total: 1120,
      slowest_tool: "search_grounded_places",
      slowest_tool_ms: 940,
      tool_error_count: 0,
      failed_tools: [],
    });
  });

  it("counts failed tools separately from ok spans", () => {
    const spans: ToolSpan[] = [
      { tool: "search-restaurants", ms: 200, status: "ok", ts: 1 },
      { tool: "search-grounded-places", ms: 50, status: "error", ts: 2 },
    ];
    expect(summarizeToolSpans(spans)).toMatchObject({
      tool_error_count: 1,
      failed_tools: ["search-grounded-places"],
    });
  });

  it("returns a safe empty summary for a turn with no tool calls", () => {
    expect(summarizeToolSpans([])).toEqual({
      tool_spans: [],
      tool_count: 0,
      tool_ms_total: 0,
      slowest_tool: null,
      slowest_tool_ms: 0,
      tool_error_count: 0,
      failed_tools: [],
    });
  });
});
