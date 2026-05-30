"use client";

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { useCopilotChatInternal, useCopilotChat } from "@copilotkit/react-core";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import type { Message } from "@copilotkit/shared";
import {
  UserMessage,
  useChatContext,
  type MessagesProps,
} from "@copilotkit/react-ui";
import { ConciergeAssistantMessage, shouldSkipCopilotMessage } from "@/components/chat/concierge-assistant-message";
import { ConciergeErrorNotice } from "@/components/chat/concierge-error-notice";
import { sanitizeAssistantChatContent } from "@/lib/sanitize-assistant-chat-content";
import { useEventLocalChat } from "@/components/chat/event-local-chat-context";
import {
  clearConciergeError,
  getConciergeErrorVersion,
  getConciergeErrorVersionServer,
  subscribeConciergeError,
} from "@/lib/concierge-error-store";

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
  const { appendMessage } = useCopilotChat();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to the module-level error store — safe for React Compiler (no setState
  // in effects, no ref reads in render). reportConciergeError() is called from the
  // <CopilotKit onError> prop in layout.tsx whenever a RUN_ERROR fires.
  const errorVersion = useSyncExternalStore(
    subscribeConciergeError,
    getConciergeErrorVersion,
    getConciergeErrorVersionServer,
  );

  // chatError: true only when a failed turn has not yet been acknowledged by a retry
  // or a new user message. Hidden while inProgress so the thinking indicator takes over.
  const chatError = !inProgress && errorVersion > 0;

  const handleRetry = useCallback(() => {
    clearConciergeError();
    const lastUserMsg = [...visibleMessages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;
    const content = typeof lastUserMsg.content === "string" ? lastUserMsg.content : "";
    if (!content) return;
    void appendMessage(
      new TextMessage({ role: MessageRole.User, content }),
    );
  }, [visibleMessages, appendMessage]);

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
          const assistantText = sanitizeAssistantChatContent(local.content);
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
        {localMessages.length === 0 && !inProgress && chatError && (
          <ConciergeErrorNotice onRetry={handleRetry} />
        )}
        {interrupt}
      </div>
      <footer className="copilotKitMessagesFooter" ref={messagesEndRef}>
        {children}
      </footer>
    </div>
  );
}
