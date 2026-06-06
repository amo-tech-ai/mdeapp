import { google } from "@ai-sdk/google";
import { RequestContext } from "@mastra/core/request-context";
import { describe, expect, it, vi } from "vitest";
import {
  buildTurnTelemetryMetadata,
  resolveAgentModelName,
  TELEMETRY_SCHEMA_VERSION,
} from "./mastra-telemetry";
import {
  getTokenUsage,
  recordTokenUsage,
  recordToolSpan,
  summarizeToolSpans,
} from "./tool-audit-context";

describe("resolveAgentModelName (AGT-00C)", () => {
  it("reads modelId from Mastra agent config", () => {
    expect(
      resolveAgentModelName({ model: google("gemini-3.5-flash") }),
    ).toBe("gemini-3.5-flash");
  });

  it("falls back when model is dynamic or missing", () => {
    expect(resolveAgentModelName({})).toBe("gemini-3.5-flash");
    expect(resolveAgentModelName(null, "custom-model")).toBe("custom-model");
  });
});

describe("buildTurnTelemetryMetadata (AGT-00C)", () => {
  it("stamps schema version, agent, model, and tool summary", () => {
    const requestContext = new RequestContext();
    const context = { requestContext };
    recordToolSpan(context, {
      tool: "search-rentals",
      ms: 180,
      status: "ok",
      ts: 1,
    });
    recordTokenUsage(context, { input_tokens: 120, output_tokens: 40 });

    const payload = buildTurnTelemetryMetadata({
      agentMapKey: "conciergeAgent",
      agent: { model: google("gemini-3.5-flash") },
      status: "success",
      durationMs: 950,
      toolSummary: summarizeToolSpans([
        { tool: "search-rentals", ms: 180, status: "ok", ts: 1 },
      ]),
      threadId: "thread-1",
      runId: "run-1",
      requestContext,
    });

    expect(payload).toMatchObject({
      telemetry_version: TELEMETRY_SCHEMA_VERSION,
      agent_map_key: "conciergeAgent",
      model_name: "gemini-3.5-flash",
      turn_status: "success",
      turn_duration_ms: 950,
      thread_id: "thread-1",
      run_id: "run-1",
      tool_count: 1,
      slowest_tool: "search-rentals",
      input_tokens: 120,
      output_tokens: 40,
      total_tokens: 160,
    });
    expect(getTokenUsage(context)?.total_tokens).toBe(160);
  });
});

describe("logTurnTelemetryDebug", () => {
  it("no-ops unless LOG_LEVEL=debug", async () => {
    const { logTurnTelemetryDebug } = await import("./mastra-telemetry");
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    logTurnTelemetryDebug({
      telemetry_version: TELEMETRY_SCHEMA_VERSION,
      agent_map_key: "conciergeAgent",
      model_name: "gemini-3.5-flash",
      turn_status: "success",
      turn_duration_ms: 1,
      integration: "copilotkit-pattern-1",
      tool_spans: [],
      tool_count: 0,
      tool_ms_total: 0,
      slowest_tool: null,
      slowest_tool_ms: 0,
      tool_error_count: 0,
      failed_tools: [],
      input_tokens: 0,
      output_tokens: 0,
      total_tokens: 0,
    });
    expect(debugSpy).not.toHaveBeenCalled();
    debugSpy.mockRestore();
  });
});
