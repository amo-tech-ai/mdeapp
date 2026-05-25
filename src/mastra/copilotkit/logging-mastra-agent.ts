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
import { logAgentRunForTurn } from "@/mastra/lib/log-agent-run";

export type LoggingMastraAgentConfig = MastraAgentConfig & {
  /** Key in Mastra({ agents: { pingAgent } }) — not agent.id */
  agentMapKey: string;
  userId?: string | null;
};

/**
 * Wraps @ag-ui/mastra MastraAgent.run() so each CopilotKit turn logs to public.ai_runs.
 * AG-UI calls agent.stream() without onFinish — this is the Pattern 1 hook point.
 */
export class LoggingMastraAgent extends MastraAgent {
  private readonly agentMapKey: string;
  private readonly userId: string | null;

  constructor(config: LoggingMastraAgentConfig) {
    super(config);
    this.agentMapKey = config.agentMapKey;
    this.userId = config.userId ?? null;
  }

  override clone(): LoggingMastraAgent {
    return new LoggingMastraAgent({
      agentId: this.agentMapKey,
      agentMapKey: this.agentMapKey,
      agent: this.agent,
      resourceId: this.resourceId,
      requestContext: this.requestContext,
      userId: this.userId,
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
        void logAgentRunForTurn({
          agentMapKey: this.agentMapKey,
          userId: this.userId,
          status,
          durationMs: Date.now() - startMs,
          metadata: {
            thread_id: input.threadId,
            run_id: input.runId,
            integration: "copilotkit-pattern-1",
          },
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
}): Record<string, LoggingMastraAgent> {
  const {
    mastra,
    resourceId = "anonymous",
    userId = null,
    requestContext,
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
      });
      return acc;
    },
    {},
  );
}

/** @deprecated Use getLocalAgentsWithLogging — kept for route typing parity */
export type GetLocalAgentsWithLoggingOptions = GetLocalAgentsOptions;
