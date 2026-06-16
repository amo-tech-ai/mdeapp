import { calculateModelCost } from "./model-cost";
import type { ToolSpanSummary } from "./tool-audit-context";
import { getTokenUsage, type TokenUsage } from "./tool-audit-context";

/** Schema version stamped on every `ai_runs.metadata` telemetry payload (AGT-00C). */
export const TELEMETRY_SCHEMA_VERSION = "agt-00c-v1";

export type TurnStatus = "success" | "error";

/**
 * OBS-002 — coarse failure class for every non-success turn so Patricia can see
 * *why* turns fail without a stack-trace pipeline. Stored on `ai_runs.metadata`
 * (and mirrored to a column via migration) so `error_message` is never the only
 * signal. `client_abort` is distinct from a real failure: AG-UI unsubscribes the
 * stream when the user navigates away mid-turn — that is not an outage.
 */
export type AgentErrorType =
  | "client_abort"
  | "timeout"
  | "rate_limit"
  | "auth"
  | "tool_failure"
  | "model_failure"
  | "validation"
  | "database"
  | "unknown";

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
  /** COST-001 — model provider id (currently always "google"/Gemini). */
  provider: string;
  /** COST-001 — estimated USD cost of this turn from token counts × rate. */
  estimated_cost_usd: number;
  /** True when the model id was unknown and a fallback rate was used. */
  cost_rate_fallback?: boolean;
  /** Populated only when turn_status === "error". */
  error_type?: AgentErrorType;
  /** Trimmed human-readable cause; never the full stack. */
  error_message?: string;
}

/** Normalize an unknown thrown value into a short, log-safe message. */
export function describeAgentError(err: unknown): string {
  if (err instanceof Error) return err.message.slice(0, 500);
  if (typeof err === "string") return err.slice(0, 500);
  try {
    return JSON.stringify(err).slice(0, 500);
  } catch {
    return "non-serializable error";
  }
}

/**
 * Classify a thrown turn error into an {@link AgentErrorType}. Heuristic and
 * intentionally conservative — anything unrecognized is `unknown`, which is the
 * signal to add a new branch rather than hide the failure.
 */
export function classifyAgentError(err: unknown): AgentErrorType {
  const msg = describeAgentError(err).toLowerCase();
  const name = err instanceof Error ? err.name.toLowerCase() : "";
  const status = (err as { status?: number; statusCode?: number } | null)?.status
    ?? (err as { statusCode?: number } | null)?.statusCode;

  if (name === "aborterror" || msg.includes("abort") || msg.includes("cancel"))
    return "client_abort";
  if (name === "timeouterror" || msg.includes("timeout") || msg.includes("timed out"))
    return "timeout";
  if (status === 429 || msg.includes("rate limit") || msg.includes("too many requests") || msg.includes("resource_exhausted"))
    return "rate_limit";
  if (status === 401 || status === 403 || msg.includes("unauthorized") || msg.includes("permission") || msg.includes("forbidden"))
    return "auth";
  if (msg.includes("tool") && (msg.includes("fail") || msg.includes("error")))
    return "tool_failure";
  if (msg.includes("zod") || msg.includes("invalid") || msg.includes("validation") || msg.includes("schema"))
    return "validation";
  if (msg.includes("supabase") || msg.includes("postgres") || msg.includes("rpc") || msg.includes("relation") || msg.includes("database"))
    return "database";
  if (msg.includes("gemini") || msg.includes("model") || msg.includes("generativelanguage") || (typeof status === "number" && status >= 500))
    return "model_failure";
  return "unknown";
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
  errorType?: AgentErrorType;
  errorMessage?: string;
  /** COST-001 — explicit usage captured by the model middleware; preferred over
   * the RequestContext fallback when present. */
  tokens?: Partial<TokenUsage>;
}): TurnTelemetryPayload {
  const tokens = normalizeTokenUsage(
    opts.tokens
      ? {
          input_tokens: opts.tokens.input_tokens ?? 0,
          output_tokens: opts.tokens.output_tokens ?? 0,
          total_tokens:
            opts.tokens.total_tokens ??
            (opts.tokens.input_tokens ?? 0) + (opts.tokens.output_tokens ?? 0),
        }
      : getTokenUsage(toTelemetryContext(opts.requestContext)),
  );
  const modelName = resolveAgentModelName(opts.agent);
  const cost = calculateModelCost({
    modelName,
    inputTokens: tokens.input_tokens,
    outputTokens: tokens.output_tokens,
  });
  return {
    telemetry_version: TELEMETRY_SCHEMA_VERSION,
    agent_map_key: opts.agentMapKey,
    model_name: modelName,
    turn_status: opts.status,
    turn_duration_ms: opts.durationMs,
    thread_id: opts.threadId,
    run_id: opts.runId,
    integration: "copilotkit-pattern-1",
    provider: "google",
    estimated_cost_usd: cost.estimatedCostUsd,
    ...(cost.rateFallback ? { cost_rate_fallback: true } : {}),
    ...opts.toolSummary,
    ...tokens,
    ...(opts.status === "error"
      ? { error_type: opts.errorType ?? "unknown", error_message: opts.errorMessage }
      : {}),
  };
}

/** Structured console line for local debugging (LOG_LEVEL=debug only). */
export function logTurnTelemetryDebug(payload: TurnTelemetryPayload): void {
  if (process.env.LOG_LEVEL !== "debug") return;
  console.debug("[mastra-telemetry]", JSON.stringify(payload));
}
