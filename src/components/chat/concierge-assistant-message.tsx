"use client";

import { AssistantMessage } from "@copilotkit/react-ui";
import type { Message } from "@copilotkit/shared";

type AssistantMessageProps = Parameters<typeof AssistantMessage>[0];

function hasGenerativeUi(message: Message | undefined): boolean {
  return typeof (message as { generativeUI?: () => unknown })?.generativeUI ===
    "function";
}

function getAssistantMessageText(message: Message): string {
  const content = (message as { content?: unknown }).content;
  return typeof content === "string" ? content : "";
}

function isToolPayloadChatContent(raw: string): boolean {
  const trimmed = raw.trim();
  return (
    trimmed.startsWith("{\"results\":") ||
    trimmed.startsWith("{\"success\":") ||
    trimmed.includes("\"schedule_viewing_url\"")
  );
}

/** Concierge assistant bubble — strips raw tool JSON the model sometimes echoes. */
export function ConciergeAssistantMessage(props: AssistantMessageProps) {
  const message = props.message;
  const raw = message ? getAssistantMessageText(message) : "";
  const hideText = isToolPayloadChatContent(raw);
  const content = hideText ? "" : raw;

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
