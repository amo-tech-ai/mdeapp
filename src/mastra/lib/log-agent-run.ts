import { recordMastraRun, type AgentType, type AiRunStatus } from "./ai-runs";

export interface AgentLoggingMeta {
  agentName: string;
  agentType: AgentType;
}

/** CopilotKit agents map key → ai_runs insert shape (Postgres enum-safe). */
const AGENT_MAP_KEY_TO_LOGGING: Record<string, AgentLoggingMeta> = {
  pingAgent: { agentName: "ping-agent", agentType: "general_concierge" },
  eventAgent: { agentName: "event-agent", agentType: "event_curator" },
  rentalAgent: { agentName: "rental-agent", agentType: "local_scout" },
  routerAgent: { agentName: "router-agent", agentType: "concierge" },
  conciergeAgent: { agentName: "concierge-agent", agentType: "general_concierge" },
  hostOpsAgent: { agentName: "host-ops-agent", agentType: "general_concierge" },
};

export type TurnLogInput = {
  agentMapKey: string;
  userId: string | null;
  status: AiRunStatus;
  durationMs: number;
  modelName?: string;
  input_tokens?: number;
  output_tokens?: number;
  /** OBS-002 — coarse failure class, set only when status !== "success". */
  errorType?: string;
  /** OBS-002 — trimmed cause, set only when status !== "success". */
  errorMessage?: string;
  inputSummary?: Record<string, unknown>;
  outputSummary?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

export function resolveAgentLoggingMeta(agentMapKey: string): AgentLoggingMeta {
  const mapped = AGENT_MAP_KEY_TO_LOGGING[agentMapKey];
  if (mapped) return mapped;
  return {
    agentName: agentMapKey.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, ""),
    agentType: "general_concierge",
  };
}

export async function logAgentRunForTurn(opts: TurnLogInput): Promise<void> {
  const { agentName, agentType } = resolveAgentLoggingMeta(opts.agentMapKey);
  const inputTokens = opts.input_tokens ?? 0;
  const outputTokens = opts.output_tokens ?? 0;
  await recordMastraRun({
    user_id: opts.userId,
    agent_name: agentName,
    agent_type: agentType,
    status: opts.status,
    error_message: opts.errorMessage ?? null,
    error_type: opts.errorType ?? null,
    duration_ms: opts.durationMs,
    model_name: opts.modelName ?? "gemini-3.5-flash",
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    total_tokens: inputTokens + outputTokens,
    input_data: opts.inputSummary ?? {},
    output_data: opts.outputSummary ?? {},
    metadata: opts.metadata,
  });
}
