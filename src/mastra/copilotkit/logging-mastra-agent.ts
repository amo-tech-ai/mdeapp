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

    return super.run(input).pipe(
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
  const agents = mastra.listAgents() ?? {};

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
