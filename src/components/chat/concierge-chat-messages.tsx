"use client";

import { useEffect, useMemo, useRef } from "react";
import { useCopilotChatInternal } from "@copilotkit/react-core";
import type { Message } from "@copilotkit/shared";
import {
  UserMessage,
  useChatContext,
  type MessagesProps,
} from "@copilotkit/react-ui";
import { ConciergeAssistantMessage, shouldSkipCopilotMessage } from "@/components/chat/concierge-assistant-message";
import { useEventLocalChat } from "@/components/chat/event-local-chat-context";

function makeInitialMessages(initial: string | string[] | undefined): Message[] {
  if (!initial) return [];
  if (Array.isArray(initial)) {
    return initial.map((message) => ({
      id: message,
      role: "assistant" as const,
      content: message,
    }));
  }
  return [{ id: initial, role: "assistant" as const, content: initial }];
}

/** CopilotKit Messages + local fast-path bubbles (no runtime persist on clarify/search). */
export function ConciergeChatMessages(props: MessagesProps) {
  const {
    inProgress,
    children,
    AssistantMessage: AssistantMessageProp = ConciergeAssistantMessage,
    UserMessage: UserMessageProp = UserMessage,
    ImageRenderer,
  } = props;
  const { labels } = useChatContext();
  const { messages: visibleMessages, interrupt } = useCopilotChatInternal();
  const { messages: localMessages } = useEventLocalChat();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages = useMemo(
    () => makeInitialMessages(labels.initial),
    [labels.initial],
  );
  const copilotMessages = [...initialMessages, ...visibleMessages];

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [copilotMessages.length, localMessages.length, inProgress]);

  return (
    <div className="copilotKitMessages" ref={messagesContainerRef}>
      <div className="copilotKitMessagesContainer">
        {copilotMessages.map((message, index) => {
          if (shouldSkipCopilotMessage(message)) return null;
          const isCurrentMessage = index === copilotMessages.length - 1;
          const isUser = message.role === "user";
          const Component = isUser ? UserMessageProp : AssistantMessageProp;
          return (
            <Component
              key={`cpk-${message.id ?? index}`}
              message={message as never}
              isCurrentMessage={isCurrentMessage && localMessages.length === 0}
              isLoading={false}
              isGenerating={false}
              rawData={undefined}
              ImageRenderer={ImageRenderer}
            />
          );
        })}
        {localMessages.map((local) => {
          if (local.role === "user") {
            return (
              <div key={local.id} className="copilotKitMessage copilotKitUserMessage">
                <p>{local.content}</p>
              </div>
            );
          }
          const assistantText = local.content;
          const assistant = (
            <div
              key={local.id}
              className="copilotKitMessage copilotKitAssistantMessage"
            >
              {assistantText ? (
                <p className="whitespace-pre-wrap">{assistantText}</p>
              ) : null}
            </div>
          );
          if (local.isClarify) {
            return (
              <div key={local.id} data-testid="event-clarify">
                {assistant}
              </div>
            );
          }
          return assistant;
        })}
        {copilotMessages[copilotMessages.length - 1]?.role === "user" &&
          inProgress &&
          localMessages.length === 0 && (
            <span className="copilotKitActivityIndicator" aria-hidden />
          )}
        {interrupt}
      </div>
      <footer className="copilotKitMessagesFooter" ref={messagesEndRef}>
        {children}
      </footer>
    </div>
  );
}
