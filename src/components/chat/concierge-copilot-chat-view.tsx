"use client";

import { useCallback } from "react";
import {
  CopilotChatView,
  type CopilotChatViewProps,
} from "@copilotkit/react-core/v2";
import { sendConciergeUserMessage } from "@/lib/concierge-send-user-message";
import { useConciergeSendHandlers } from "@/lib/hooks/use-concierge-send-handlers";

/** Wrap CopilotChatView — route composer submit through classify + fast-path before agent fallback (CK-V2-015). */
function ConciergeChatViewInner(props: CopilotChatViewProps) {
  const handlers = useConciergeSendHandlers();
  const onSubmitMessage = useCallback(
    (text: string) => {
      void sendConciergeUserMessage(text, handlers);
    },
    [handlers],
  );
  return (
    <div data-testid="concierge-chat-view-mounted" className="contents">
      <CopilotChatView
        {...props}
        input={
          typeof props.input === "object" &&
          props.input !== null &&
          !("$$typeof" in props.input)
            ? { ...props.input, onSubmitMessage }
            : { onSubmitMessage }
        }
      />
    </div>
  );
}

/** CopilotChat view slot — classify + fast-path before agent (CK-V2-015). */
export const ConciergeChatView = Object.assign(
  ConciergeChatViewInner,
  CopilotChatView,
);
