"use client";

import { useCallback, type ReactNode } from "react";
import { useAgent } from "@copilotkit/react-core/v2";
import { ConciergeSessionProviderInner } from "@/components/chat/concierge-session-context";

/**
 * SAN-890 · v2 /chat — reset via useAgent (not v1 useCopilotChat).
 */
export function ConciergeSessionProviderV2({ children }: { children: ReactNode }) {
  const { agent } = useAgent({ agentId: "conciergeAgent" });
  const resetChat = useCallback(() => {
    agent.setMessages([]);
    agent.setState({});
  }, [agent]);

  return (
    <ConciergeSessionProviderInner resetChat={resetChat}>
      {children}
    </ConciergeSessionProviderInner>
  );
}
