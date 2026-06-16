"use client";

import { useCallback } from "react";
import {
  CopilotChatView,
  type CopilotChatViewProps,
} from "@copilotkit/react-core/v2";
import { sendConciergeUserMessage } from "@/lib/concierge-send-user-message";
import { useConciergeSendHandlers } from "@/lib/hooks/use-concierge-send-handlers";

/** CopilotChat view slot — classify + fast-path before agent (CK-V2-015). */
export function ConciergeChatView(props: CopilotChatViewProps) {
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
        onSubmitMessage={onSubmitMessage}
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
