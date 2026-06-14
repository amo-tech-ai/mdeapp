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
  logTurnTelemetryDebug,
} from "@/mastra/lib/mastra-telemetry";
import {
  getToolSpans,
  summarizeToolSpans,
} from "@/mastra/lib/tool-audit-context";
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
    let status: "success" | "error" = "success";
    const runInput =
      this.agentMapKey === "hostEventAgent"
        ? sanitizeHostEventAgUiInput(input)
        : input;

    return super.run(runInput).pipe(
      tap({
        error: () => {
          status = "error";
        },
      }),
      finalize(() => {
        const durationMs = Date.now() - startMs;
        const toolSummary = summarizeToolSpans(
          getToolSpans({ requestContext: this.requestContext }),
        );
        const telemetry = buildTurnTelemetryMetadata({
          agentMapKey: this.agentMapKey,
          agent: this.agent,
          status,
          durationMs,
          toolSummary,
          threadId: input.threadId,
          runId: input.runId,
          requestContext: this.requestContext,
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
          metadata: telemetry as unknown as Record<string, unknown>,
        });
      }),
    );
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
