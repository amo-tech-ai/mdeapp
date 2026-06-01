"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useCopilotChatInternal } from "@copilotkit/react-core";
import type { Message } from "@copilotkit/shared";
import { useRentalSearchFastPath } from "@/hooks/use-rental-search-fast-path";
import { useEventSearchFastPath } from "@/hooks/use-event-search-fast-path";
import { useRestaurantSearchFastPath } from "@/hooks/use-restaurant-search-fast-path";
import { useGroundedSearchFastPath } from "@/hooks/use-grounded-search-fast-path";
import { clearConciergeError, reportConciergeError } from "@/lib/concierge-error-store";
import {
  clearConciergePendingSend,
  getConciergePendingSendVersion,
  getConciergePendingSendVersionServer,
  setConciergePendingSend,
  subscribeConciergePendingSend,
} from "@/lib/concierge-pending-store";
import { ConciergeThinkingIndicator } from "@/components/chat/concierge-thinking-indicator";

/** Mirrors CopilotKit InputProps — do not import from @copilotkit/react-ui (Input is not exported in 1.55.2). */
export type ConciergeChatInputProps = {
  inProgress: boolean;
  onSend: (text: string) => Promise<Message>;
  isVisible?: boolean;
  onStop?: () => void;
  onUpload?: () => void;
  hideStopButton?: boolean;
  chatReady?: boolean;
};

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="animate-spin"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  );
}

/**
 * Custom CopilotChat input — plain textarea + send (no @copilotkit/react-ui Input export).
 * Intercepts rental clarify/search before CopilotKit runs conciergeAgent.
 */
export function ConciergeChatInput({
  inProgress,
  onSend,
  onStop,
  hideStopButton,
  chatReady = true,
}: ConciergeChatInputProps) {
  const { interrupt } = useCopilotChatInternal();
  const { handleUserMessage: handleRentalMessage } = useRentalSearchFastPath();
  const { handleUserMessage: handleEventMessage } = useEventSearchFastPath();
  const { handleUserMessage: handleRestaurantMessage } =
    useRestaurantSearchFastPath();
  const { handleUserMessage: handleGroundedMessage } =
    useGroundedSearchFastPath();
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingVersion = useSyncExternalStore(
    subscribeConciergePendingSend,
    getConciergePendingSendVersion,
    getConciergePendingSendVersionServer,
  );
  const showThinking = inProgress || pendingVersion > 0;

  const canSend = useMemo(
    () => !inProgress && text.trim().length > 0 && !interrupt,
    [inProgress, text, interrupt],
  );
  const canStop = inProgress && !hideStopButton;

  useEffect(() => {
    if (!inProgress) {
      clearConciergePendingSend();
    }
  }, [inProgress]);

  const send = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || inProgress) return;
    clearConciergeError();
    setText("");
    const handledRental = await handleRentalMessage(trimmed);
    if (handledRental) return;
    const handledEvent = await handleEventMessage(trimmed);
    if (handledEvent) return;
    const handledGrounded = await handleGroundedMessage(trimmed);
    if (handledGrounded) return;
    const handledRestaurant = await handleRestaurantMessage(trimmed);
    if (!handledRestaurant) {
      setConciergePendingSend(true);
      try {
        await onSend(trimmed);
      } catch {
        clearConciergePendingSend();
        reportConciergeError();
      }
    }
    textareaRef.current?.focus();
  }, [
    text,
    inProgress,
    handleRentalMessage,
    handleEventMessage,
    handleGroundedMessage,
    handleRestaurantMessage,
    onSend,
  ]);

  const buttonIcon = !chatReady ? (
    <SpinnerIcon />
  ) : canStop ? (
    <StopIcon />
  ) : (
    <SendIcon />
  );
  const buttonAlt = canStop ? "Stop" : !chatReady ? "Loading" : "Send";

  return (
    <div className="copilotKitInputContainer">
      {showThinking && <ConciergeThinkingIndicator />}
      <div className="copilotKitInput">
        <textarea
          ref={textareaRef}
          className="copilotKitTextarea"
          placeholder="Type a message..."
          value={text}
          rows={1}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (canSend) void send();
            }
          }}
          disabled={!chatReady}
        />
        <div className="copilotKitInputControls">
          <div style={{ flexGrow: 1 }} />
          <button
            type="button"
            disabled={!canSend && !canStop}
            onClick={canStop && onStop ? onStop : () => void send()}
            data-copilotkit-in-progress={inProgress}
            data-testid={
              inProgress
                ? "copilot-chat-request-in-progress"
                : "copilot-chat-ready"
            }
            className="copilotKitInputControlButton"
            aria-label={buttonAlt}
          >
            {buttonIcon}
          </button>
        </div>
      </div>
    </div>
  );
}
