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
};

export function resolveAgentLoggingMeta(agentMapKey: string): AgentLoggingMeta {
  const mapped = AGENT_MAP_KEY_TO_LOGGING[agentMapKey];
  if (mapped) return mapped;
  return {
    agentName: agentMapKey.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, ""),
    agentType: "general_concierge",
  };
}

export async function logAgentRunForTurn(opts: {
  agentMapKey: string;
  userId: string | null;
  status: AiRunStatus;
  durationMs: number;
  modelName?: string;
  inputSummary?: Record<string, unknown>;
  outputSummary?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const { agentName, agentType } = resolveAgentLoggingMeta(opts.agentMapKey);
  await recordMastraRun({
    user_id: opts.userId,
    agent_name: agentName,
    agent_type: agentType,
    status: opts.status,
    duration_ms: opts.durationMs,
    model_name: opts.modelName ?? "gemini-3.5-flash",
    input_data: opts.inputSummary ?? {},
    output_data: opts.outputSummary ?? {},
    metadata: opts.metadata,
  });
}
