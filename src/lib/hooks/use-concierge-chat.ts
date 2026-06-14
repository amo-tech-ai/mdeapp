"use client";

import { useCallback } from "react";
import {
  useAgent,
  useCopilotKit,
  UseAgentUpdate,
} from "@copilotkit/react-core/v2";
import { gqlToAGUI, type TextMessage } from "@copilotkit/runtime-client-gql";

/** Shared concierge chat controller for v2 routes. */
export function useConciergeChat() {
  const { copilotkit } = useCopilotKit();
  const { agent } = useAgent({
    agentId: "conciergeAgent",
    updates: [
      UseAgentUpdate.OnRunStatusChanged,
      UseAgentUpdate.OnMessagesChanged,
    ],
  });

  const isLoading = Boolean(agent?.isRunning);

  const reset = useCallback(() => {
    agent?.setMessages([]);
    agent?.setState({});
  }, [agent]);

  const appendMessage = useCallback(
    async (message: TextMessage) => {
      if (!agent) return;
      const aguiMessage = gqlToAGUI([message])[0];
      agent.addMessage(aguiMessage);
      await copilotkit.runAgent({ agent });
    },
    [agent, copilotkit],
  );

  return { isLoading, reset, appendMessage };
}
