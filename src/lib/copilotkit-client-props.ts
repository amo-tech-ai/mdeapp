type CopilotAgentName = "conciergeAgent" | "hostEventAgent";

type CopilotKitClientProps =
  | { agent: CopilotAgentName; runtimeUrl: string; publicApiKey?: never; showDevConsole: false }
  | { agent: CopilotAgentName; publicApiKey: string; runtimeUrl?: never; showDevConsole: false };

/**
 * Local dev → direct Mastra via same-origin runtime (Cloud cannot reach localhost).
 * Production → CopilotKit Cloud when NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY is set.
 */
export function getCopilotKitClientProps(agent: CopilotAgentName): CopilotKitClientProps {
  const publicApiKey = process.env.NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY;

  // showDevConsole=false — CopilotKit defaults to loading web-inspector on localhost;
  // after dev restarts a stale .next chunk causes ChunkLoadError for that bundle.
  const inspectorOff = { showDevConsole: false as const };

  if (process.env.NODE_ENV === "development") {
    return { runtimeUrl: "/api/copilotkit", agent, ...inspectorOff };
  }

  if (publicApiKey) {
    return { publicApiKey, agent, ...inspectorOff };
  }

  return { runtimeUrl: "/api/copilotkit", agent, ...inspectorOff };
}
