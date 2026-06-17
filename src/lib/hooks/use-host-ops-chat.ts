"use client";

import { useCallback } from "react";
import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";

/** Host analytics chat — same runAgent pattern as concierge `useConciergeChat`. */
export function useHostOpsChat() {
  const { copilotkit } = useCopilotKit();
  const { agent } = useAgent({ agentId: "hostOpsAgent" });

  const isLoading = Boolean(agent?.isRunning);

  const appendMessage = useCallback(
    async (content: string) => {
      if (!agent) return false;
      agent.addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content,
      });
      await copilotkit.runAgent({ agent });
      return true;
    },
    [agent, copilotkit],
  );

  return { isLoading, appendMessage };
}
