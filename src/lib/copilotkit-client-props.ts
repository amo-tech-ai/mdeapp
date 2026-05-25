type CopilotAgentName = "conciergeAgent" | "hostEventAgent";

type CopilotKitClientProps =
  | { agent: CopilotAgentName; runtimeUrl: string; publicApiKey?: never }
  | { agent: CopilotAgentName; publicApiKey: string; runtimeUrl?: never };

/**
 * Local dev → direct Mastra via same-origin runtime (Cloud cannot reach localhost).
 * Production → CopilotKit Cloud when NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY is set.
 */
export function getCopilotKitClientProps(agent: CopilotAgentName): CopilotKitClientProps {
  const publicApiKey = process.env.NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY;

  if (process.env.NODE_ENV === "development") {
    return { runtimeUrl: "/api/copilotkit", agent };
  }

  if (publicApiKey) {
    return { publicApiKey, agent };
  }

  return { runtimeUrl: "/api/copilotkit", agent };
}
