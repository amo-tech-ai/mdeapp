"use client";

import { AssistantMessage } from "@copilotkit/react-ui";
import type { Message } from "@copilotkit/shared";
import {
  getAssistantMessageText,
  isToolPayloadChatContent,
  sanitizeAssistantChatContent,
  shouldHideAssistantChatContent,
} from "@/lib/sanitize-assistant-chat-content";

type AssistantMessageProps = Parameters<typeof AssistantMessage>[0];

function hasGenerativeUi(message: Message | undefined): boolean {
  return typeof (message as { generativeUI?: () => unknown })?.generativeUI ===
    "function";
}

/** Concierge assistant bubble — strips raw tool JSON the model sometimes echoes. */
export function ConciergeAssistantMessage(props: AssistantMessageProps) {
  const message = props.message;
  const raw = message ? getAssistantMessageText(message) : "";
  const hideText =
    isToolPayloadChatContent(raw) ||
    (Boolean(raw) && shouldHideAssistantChatContent(raw));
  const content = hideText ? "" : sanitizeAssistantChatContent(raw);

  if (hideText && !hasGenerativeUi(message) && !props.subComponent) {
    return null;
  }

  return (
    <AssistantMessage
      {...props}
      message={
        message && message.role === "assistant"
          ? { ...message, content }
          : props.message
      }
    />
  );
}

export function shouldSkipCopilotMessage(message: Message): boolean {
  if (message.role === "tool") return true;
  if (message.role !== "assistant") return false;
  const raw = getAssistantMessageText(message);
  if (!raw) return false;
  return (
    isToolPayloadChatContent(raw) &&
    !hasGenerativeUi(message)
  );
}
