type CopilotAgentName = "conciergeAgent" | "hostEventAgent";

type CopilotKitClientProps =
  | {
      agent: CopilotAgentName;
      runtimeUrl: string;
      useSingleEndpoint: true;
      publicApiKey?: never;
      showDevConsole: false;
    }
  | { agent: CopilotAgentName; publicApiKey: string; runtimeUrl?: never; showDevConsole: false };

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
    ...inspectorOff,
  };
}
