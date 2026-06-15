"use client";

import { useCallback } from "react";
import { useCopilotKit } from "@copilotkit/react-core/v2";
import { useConciergeCoAgent } from "@/components/chat/concierge-coagent-context";

/** Shared concierge chat controller for v2 routes. */
export function useConciergeChat() {
  const { copilotkit } = useCopilotKit();
  const { agent } = useConciergeCoAgent();

  const isLoading = Boolean(agent?.isRunning);

  const reset = useCallback(() => {
    agent?.setMessages([]);
    agent?.setState({});
  }, [agent]);

  const appendMessage = useCallback(
    async (content: string) => {
      if (!agent) return;
      agent.addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content,
      });
      await copilotkit.runAgent({ agent });
    },
    [agent, copilotkit],
  );

  return { isLoading, reset, appendMessage };
}
