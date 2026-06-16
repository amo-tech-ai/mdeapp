import type { BaseEvent, RunAgentInput } from "@ag-ui/client";
import {
  MastraAgent,
  type GetLocalAgentsOptions,
  type MastraAgentConfig,
} from "@ag-ui/mastra";
import type { Mastra } from "@mastra/core/mastra";
import type { RequestContext } from "@mastra/core/request-context";
import { Observable } from "rxjs";
import { finalize, tap } from "rxjs/operators";
import {
  logAgentRunForTurn,
  type TurnLogInput,
} from "@/mastra/lib/log-agent-run";
import {
  buildTurnTelemetryMetadata,
  classifyAgentError,
  describeAgentError,
  logTurnTelemetryDebug,
  type AgentErrorType,
} from "@/mastra/lib/mastra-telemetry";
import {
  getToolSpans,
  summarizeToolSpans,
} from "@/mastra/lib/tool-audit-context";
import {
  createTokenSink,
  runWithTokenSink,
} from "@/mastra/lib/token-usage-als";
/**
 * [SAN-905 · CK-V2-007d — Console clean on hostEventAgent stream](https://linear.app/sanjiovani/issue/SAN-905/ck-v2-007d-console-clean-on-hosteventagent-stream):
 * CopilotKit replays AG-UI messages without Gemini thought_signature on assistant
 * tool-call parts. Mastra MessageHistory loads signed DB history — keep only the
 * latest user message so unsigned client-tool replay cannot reach Gemini.
 */
function sanitizeHostEventAgUiInput(input: RunAgentInput): RunAgentInput {
  const messages = input.messages ?? [];
  if (messages.length <= 1) return input;

  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length === 0) return input;

  return {
    ...input,
    messages: [userMessages[userMessages.length - 1]!],
  };
}


/** Route may wrap with next/server after(); scripts default to fire-and-forget. */
export type PersistTurnLog = (opts: TurnLogInput) => void;

export type LoggingMastraAgentConfig = MastraAgentConfig & {
  /** Key in Mastra({ agents: { pingAgent } }) — not agent.id */
  agentMapKey: string;
  userId?: string | null;
  persistTurnLog?: PersistTurnLog;
};

/**
 * Wraps @ag-ui/mastra MastraAgent.run() so each CopilotKit turn logs to public.ai_runs.
 * AG-UI calls agent.stream() without onFinish — this is the Pattern 1 hook point.
 */
export class LoggingMastraAgent extends MastraAgent {
  private readonly agentMapKey: string;
  private readonly userId: string | null;
  private readonly persistTurnLog: PersistTurnLog;

  constructor(config: LoggingMastraAgentConfig) {
    super(config);
    this.agentMapKey = config.agentMapKey;
    this.userId = config.userId ?? null;
    this.persistTurnLog =
      config.persistTurnLog ??
      ((opts) => {
        void logAgentRunForTurn(opts);
      });
  }

  override clone(): LoggingMastraAgent {
    return new LoggingMastraAgent({
      agentId: this.agentMapKey,
      agentMapKey: this.agentMapKey,
      agent: this.agent,
      resourceId: this.resourceId,
      requestContext: this.requestContext,
      userId: this.userId,
      persistTurnLog: this.persistTurnLog,
    });
  }

  override run(input: RunAgentInput): Observable<BaseEvent> {
    const startMs = Date.now();
    // OBS-002 — track the real turn outcome instead of discarding it. rxjs
    // `finalize` fires on complete, error, AND unsubscribe (client navigates
    // away), while `tap.error`/`tap.complete` distinguish the cause. Previously
    // only `error` flipped a boolean and the thrown value was thrown away, so
    // every failure landed in ai_runs with status=error + error_message=NULL,
    // and aborts were silently mislabeled success.
    let status: "success" | "error" = "success";
    let completed = false;
    let errorType: AgentErrorType | undefined;
    let errorMessage: string | undefined;
    const runInput =
      this.agentMapKey === "hostEventAgent"
        ? sanitizeHostEventAgUiInput(input)
        : input;

    // COST-001 — open a per-turn token sink. The wrapped Gemini model
    // (token-usage-middleware) writes usage here while the model runs inside
    // this turn's async context; we read it back in finalize().
    const tokenSink = createTokenSink();

    const stream = super.run(runInput).pipe(
      tap({
        complete: () => {
          completed = true;
        },
        error: (err: unknown) => {
          status = "error";
          errorType = classifyAgentError(err);
          errorMessage = describeAgentError(err);
        },
      }),
      finalize(() => {
        // Unsubscribed before completing and without an error = client abort.
        if (status === "success" && !completed) {
          status = "error";
          errorType = "client_abort";
          errorMessage = "stream unsubscribed before completion (client abort)";
        }
        const durationMs = Date.now() - startMs;
        const toolSummary = summarizeToolSpans(
          getToolSpans({ requestContext: this.requestContext }),
        );
        // Prefer the sink (real captured usage); 0 calls ⇒ leave undefined so
        // the telemetry token fields fall back to any RequestContext usage.
        const tokens =
          tokenSink.calls > 0
            ? {
                input_tokens: tokenSink.inputTokens,
                output_tokens: tokenSink.outputTokens,
                total_tokens: tokenSink.totalTokens,
              }
            : undefined;
        const telemetry = buildTurnTelemetryMetadata({
          agentMapKey: this.agentMapKey,
          agent: this.agent,
          status,
          durationMs,
          toolSummary,
          threadId: input.threadId,
          runId: input.runId,
          requestContext: this.requestContext,
          errorType,
          errorMessage,
          tokens,
        });
        logTurnTelemetryDebug(telemetry);
        this.persistTurnLog({
          agentMapKey: this.agentMapKey,
          userId: this.userId,
          status,
          durationMs,
          modelName: telemetry.model_name,
          input_tokens: telemetry.input_tokens,
          output_tokens: telemetry.output_tokens,
          estimatedCostUsd: telemetry.estimated_cost_usd,
          errorType,
          errorMessage,
          metadata: telemetry as unknown as Record<string, unknown>,
        });
      }),
    );

    // Subscribe inside the sink's async context so model calls triggered by the
    // AG-UI bridge (which starts its work synchronously on subscribe) inherit it.
    return new Observable<BaseEvent>((subscriber) => {
      const sub = runWithTokenSink(tokenSink, () => stream.subscribe(subscriber));
      return () => sub.unsubscribe();
    });
  }
}

/** Phase-1 CopilotKit runtime allowlist (AGT-00D / SAN-591). */
export const RUNTIME_AGENT_ALLOWLIST = new Set([
  "conciergeAgent",
  "hostEventAgent",
  "hostOpsAgent",
  "pingAgent",
]);

function resolveRuntimeAllowlist(): Set<string> {
  const raw = process.env.MASTRA_RUNTIME_AGENT_ALLOWLIST?.trim();
  if (raw) {
    return new Set(raw.split(",").map((s) => s.trim()).filter(Boolean));
  }
  return RUNTIME_AGENT_ALLOWLIST;
}

function filterRuntimeAgents<T extends Record<string, unknown>>(agents: T): T {
  const allowlist = resolveRuntimeAllowlist();
  return Object.fromEntries(
    Object.entries(agents).filter(([key]) => allowlist.has(key)),
  ) as T;
}

export function getLocalAgentsWithLogging(options: {
  mastra: Mastra;
  resourceId?: string;
  userId?: string | null;
  requestContext?: RequestContext;
  persistTurnLog?: PersistTurnLog;
}): Record<string, LoggingMastraAgent> {
  const {
    mastra,
    resourceId = "anonymous",
    userId = null,
    requestContext,
    persistTurnLog,
  } = options;
  const agents = filterRuntimeAgents(mastra.listAgents() ?? {});

  return Object.entries(agents).reduce<Record<string, LoggingMastraAgent>>(
    (acc, [agentMapKey, agent]) => {
      acc[agentMapKey] = new LoggingMastraAgent({
        agentId: agentMapKey,
        agentMapKey,
        agent,
        resourceId,
        requestContext,
        userId,
        persistTurnLog,
      });
      return acc;
    },
    {},
  );
}

/** @deprecated Use getLocalAgentsWithLogging — kept for route typing parity */
export type GetLocalAgentsWithLoggingOptions = GetLocalAgentsOptions;
