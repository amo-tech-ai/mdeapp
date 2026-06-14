type CopilotAgentName = "conciergeAgent" | "hostEventAgent" | "hostOpsAgent";

/** Module-level empties — never inline `{}` on <CopilotKit>; new refs each render retrigger connect. */
const STABLE_HEADERS: Record<string, string> = {};
const STABLE_PROPERTIES: Record<string, unknown> = {};
const STABLE_DEV_AGENTS: Record<string, never> = {};
const STABLE_SELF_MANAGED_AGENTS: Record<string, never> = {};

type CopilotKitClientProps =
  | {
      agent: CopilotAgentName;
      runtimeUrl: string;
      useSingleEndpoint: true;
      headers: Record<string, string>;
      properties: Record<string, unknown>;
      agents__unsafe_dev_only: Record<string, never>;
      selfManagedAgents: Record<string, never>;
      publicApiKey?: never;
      showDevConsole: false;
    }
  | {
      agent: CopilotAgentName;
      publicApiKey: string;
      runtimeUrl?: never;
      headers: Record<string, string>;
      properties: Record<string, unknown>;
      agents__unsafe_dev_only: Record<string, never>;
      selfManagedAgents: Record<string, never>;
      showDevConsole: false;
    };

/**
 * Always use the same-origin Pattern-1 runtime ("/api/copilotkit").
 *
 * CopilotKit Cloud (the publicApiKey path) runs a v2 runtime that cannot reach
 * our in-process v1 Mastra agents, so production requests timed out before any
 * token and the client synthesized RUN_ERROR/INCOMPLETE_STREAM. Same-origin
 * routing keeps the agents in-process and lets ai_runs log each turn. See UX-001.
 * publicApiKey is intentionally NOT passed for now.
 */
export function getCopilotKitClientProps(agent: CopilotAgentName): CopilotKitClientProps {
  // showDevConsole=false — CopilotKit defaults to loading web-inspector on localhost;
  // after dev restarts a stale .next chunk causes ChunkLoadError for that bundle.
  const inspectorOff = { showDevConsole: false as const };

  return {
    runtimeUrl: "/api/copilotkit",
    useSingleEndpoint: true,
    agent,
    headers: STABLE_HEADERS,
    properties: STABLE_PROPERTIES,
    agents__unsafe_dev_only: STABLE_DEV_AGENTS,
    selfManagedAgents: STABLE_SELF_MANAGED_AGENTS,
    ...inspectorOff,
  };
}
