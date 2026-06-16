import { google } from "@ai-sdk/google";
import { RequestContext } from "@mastra/core/request-context";
import { describe, expect, it, vi } from "vitest";
import {
  buildTurnTelemetryMetadata,
  classifyAgentError,
  describeAgentError,
  resolveAgentModelName,
  TELEMETRY_SCHEMA_VERSION,
  type TurnTelemetryPayload,
} from "./mastra-telemetry";
import {
  getTokenUsage,
  recordTokenUsage,
  recordToolSpan,
  summarizeToolSpans,
} from "./tool-audit-context";

describe("classifyAgentError / describeAgentError (OBS-002)", () => {
  it("classifies common production failures", () => {
    expect(classifyAgentError(new Error("Request aborted by user"))).toBe("client_abort");
    expect(classifyAgentError(Object.assign(new Error("x"), { name: "AbortError" }))).toBe("client_abort");
    expect(classifyAgentError(new Error("operation timed out"))).toBe("timeout");
    expect(classifyAgentError({ status: 429, message: "slow down" })).toBe("rate_limit");
    expect(classifyAgentError({ status: 401, message: "nope" })).toBe("auth");
    expect(classifyAgentError(new Error("zod validation failed"))).toBe("validation");
    expect(classifyAgentError(new Error("supabase rpc relation missing"))).toBe("database");
    expect(classifyAgentError(new Error("gemini generativelanguage 503"))).toBe("model_failure");
    expect(classifyAgentError(new Error("something weird"))).toBe("unknown");
  });

  it("describeAgentError never throws and trims long messages", () => {
    expect(describeAgentError(new Error("boom"))).toBe("boom");
    expect(describeAgentError("plain string")).toBe("plain string");
    expect(describeAgentError({ a: 1 })).toContain("a");
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(describeAgentError(circular)).toBe("non-serializable error");
    expect(describeAgentError(new Error("x".repeat(900))).length).toBeLessThanOrEqual(500);
  });

  it("buildTurnTelemetryMetadata attaches error fields only on error turns", () => {
    const ok = buildTurnTelemetryMetadata({
      agentMapKey: "conciergeAgent",
      agent: {},
      status: "success",
      durationMs: 10,
      toolSummary: summarizeToolSpans([]),
    });
    expect(ok.error_type).toBeUndefined();
    const bad = buildTurnTelemetryMetadata({
      agentMapKey: "conciergeAgent",
      agent: {},
      status: "error",
      durationMs: 10,
      toolSummary: summarizeToolSpans([]),
      errorType: "rate_limit",
      errorMessage: "429",
    });
    expect(bad.error_type).toBe("rate_limit");
    expect(bad.error_message).toBe("429");
  });
});

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
  const samplePayload: TurnTelemetryPayload = {
    telemetry_version: TELEMETRY_SCHEMA_VERSION,
    agent_map_key: "conciergeAgent",
    model_name: "gemini-3.5-flash",
    turn_status: "success",
    turn_duration_ms: 1,
    integration: "copilotkit-pattern-1",
    provider: "google",
    estimated_cost_usd: 0,
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
  };

  it("no-ops unless LOG_LEVEL=debug", async () => {
    const prev = process.env.LOG_LEVEL;
    process.env.LOG_LEVEL = "info";
    try {
      const { logTurnTelemetryDebug } = await import("./mastra-telemetry");
      const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
      logTurnTelemetryDebug(samplePayload);
      expect(debugSpy).not.toHaveBeenCalled();
      debugSpy.mockRestore();
    } finally {
      if (prev === undefined) delete process.env.LOG_LEVEL;
      else process.env.LOG_LEVEL = prev;
    }
  });

  it("logs JSON when LOG_LEVEL=debug", async () => {
    const prev = process.env.LOG_LEVEL;
    process.env.LOG_LEVEL = "debug";
    try {
      const { logTurnTelemetryDebug } = await import("./mastra-telemetry");
      const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
      logTurnTelemetryDebug(samplePayload);
      expect(debugSpy).toHaveBeenCalledOnce();
      expect(debugSpy.mock.calls[0]?.[0]).toBe("[mastra-telemetry]");
      debugSpy.mockRestore();
    } finally {
      if (prev === undefined) delete process.env.LOG_LEVEL;
      else process.env.LOG_LEVEL = prev;
    }
  });
});
