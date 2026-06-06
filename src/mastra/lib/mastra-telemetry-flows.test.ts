import { RequestContext } from "@mastra/core/request-context";
import { describe, expect, it } from "vitest";
import {
  buildTurnTelemetryMetadata,
  TELEMETRY_SCHEMA_VERSION,
} from "./mastra-telemetry";
import { getToolSpans, recordToolSpan, summarizeToolSpans } from "./tool-audit-context";

/** Vertical flow fixtures — tool ids only; no INT-021 / DATA-041 logic touched. */
const FLOW_TOOLS = {
  concierge: ["search-rentals", "search-events"],
  restaurant: ["search-restaurants"],
  nightlife: ["search-grounded-places"],
  cafe: ["search-grounded-places"],
} as const;

function simulateFlow(tools: readonly string[]) {
  const requestContext = new RequestContext();
  const context = { requestContext };
  for (const [i, tool] of tools.entries()) {
    recordToolSpan(context, {
      tool,
      ms: 100 + i * 50,
      status: "ok",
      ts: i + 1,
    });
  }
  const spans = getToolSpans(context);
  return buildTurnTelemetryMetadata({
    agentMapKey: "conciergeAgent",
    agent: {},
    status: "success",
    durationMs: spans.reduce((n, s) => n + s.ms, 0) + 200,
    toolSummary: summarizeToolSpans(spans),
    threadId: `flow-${tools[0]}`,
    requestContext,
  });
}

describe("SAN-589 vertical telemetry flows (AGT-00C)", () => {
  it.each([
    ["concierge", FLOW_TOOLS.concierge],
    ["restaurant", FLOW_TOOLS.restaurant],
    ["nightlife", FLOW_TOOLS.nightlife],
    ["cafe", FLOW_TOOLS.cafe],
  ] as const)("captures %s tool spans in ai_runs metadata", (label, tools) => {
    const payload = simulateFlow(tools);
    expect(payload.telemetry_version).toBe(TELEMETRY_SCHEMA_VERSION);
    expect(payload.agent_map_key).toBe("conciergeAgent");
    expect(payload.model_name).toBe("gemini-3.5-flash");
    expect(payload.tool_count).toBe(tools.length);
    expect(payload.tool_spans.map((s) => s.tool)).toEqual([...tools]);
    expect(payload.turn_status).toBe("success");
    expect(payload.thread_id).toContain(tools[0]);
  });
});
