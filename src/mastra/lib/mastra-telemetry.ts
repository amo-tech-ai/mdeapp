import type { ToolSpanSummary } from "./tool-audit-context";
import { getTokenUsage, type TokenUsage } from "./tool-audit-context";

/** Schema version stamped on every `ai_runs.metadata` telemetry payload (AGT-00C). */
export const TELEMETRY_SCHEMA_VERSION = "agt-00c-v1";

export type TurnStatus = "success" | "error";

export interface TurnTelemetryPayload extends ToolSpanSummary {
  telemetry_version: typeof TELEMETRY_SCHEMA_VERSION;
  agent_map_key: string;
  model_name: string;
  turn_status: TurnStatus;
  turn_duration_ms: number;
  thread_id?: string;
  run_id?: string;
  integration: "copilotkit-pattern-1";
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}

/** Resolve model id from a Mastra Agent's AI SDK model config when available. */
export function resolveAgentModelName(
  agent: unknown,
  fallback = "gemini-3.5-flash",
): string {
  const model = (agent as { model?: unknown })?.model;
  if (
    model &&
    typeof model === "object" &&
    "modelId" in model &&
    typeof (model as { modelId: unknown }).modelId === "string"
  ) {
    return (model as { modelId: string }).modelId;
  }
  return fallback;
}

function normalizeTokenUsage(usage: TokenUsage | null): Pick<
  TurnTelemetryPayload,
  "input_tokens" | "output_tokens" | "total_tokens"
> {
  if (!usage) {
    return { input_tokens: 0, output_tokens: 0, total_tokens: 0 };
  }
  return {
    input_tokens: usage.input_tokens,
    output_tokens: usage.output_tokens,
    total_tokens: usage.total_tokens,
  };
}

function toTelemetryContext(requestContext?: unknown): unknown {
  if (
    requestContext &&
    typeof requestContext === "object" &&
    "get" in requestContext &&
    "set" in requestContext
  ) {
    return { requestContext };
  }
  return requestContext;
}

/** Build the metadata object persisted to `ai_runs` for one CopilotKit turn. */
export function buildTurnTelemetryMetadata(opts: {
  agentMapKey: string;
  agent: unknown;
  status: TurnStatus;
  durationMs: number;
  toolSummary: ToolSpanSummary;
  threadId?: string;
  runId?: string;
  requestContext?: unknown;
}): TurnTelemetryPayload {
  const tokens = normalizeTokenUsage(
    getTokenUsage(toTelemetryContext(opts.requestContext)),
  );
  return {
    telemetry_version: TELEMETRY_SCHEMA_VERSION,
    agent_map_key: opts.agentMapKey,
    model_name: resolveAgentModelName(opts.agent),
    turn_status: opts.status,
    turn_duration_ms: opts.durationMs,
    thread_id: opts.threadId,
    run_id: opts.runId,
    integration: "copilotkit-pattern-1",
    ...opts.toolSummary,
    ...tokens,
  };
}

/** Structured console line for local debugging (LOG_LEVEL=debug only). */
export function logTurnTelemetryDebug(payload: TurnTelemetryPayload): void {
  if (process.env.LOG_LEVEL !== "debug") return;
  console.debug("[mastra-telemetry]", JSON.stringify(payload));
}
