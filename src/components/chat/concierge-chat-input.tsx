"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useCopilotChatInternal } from "@copilotkit/react-core";
import { useChatContext, type InputProps } from "@copilotkit/react-ui";
import { useEventSearchFastPath } from "@/hooks/use-event-search-fast-path";

/**
 * CopilotKit 1.55.2 does not export `Input` — custom send intercept with same DOM/classes as default.
 * Intercepts event clarify/search before CopilotKit runs conciergeAgent.
 */
export function ConciergeChatInput({
  inProgress,
  onSend,
  onStop,
  hideStopButton,
  chatReady = true,
}: InputProps) {
  const context = useChatContext();
  const { interrupt } = useCopilotChatInternal();
  const { handleUserMessage } = useEventSearchFastPath();
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = useMemo(
    () => !inProgress && text.trim().length > 0 && !interrupt,
    [inProgress, text, interrupt],
  );
  const canStop = inProgress && !hideStopButton;

  const send = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || inProgress) return;
    setText("");
    const handled = await handleUserMessage(trimmed);
    if (!handled) {
      await onSend(trimmed);
    }
    textareaRef.current?.focus();
  }, [text, inProgress, handleUserMessage, onSend]);

  const buttonIcon =
    !chatReady
      ? context.icons.spinnerIcon
      : canStop
        ? context.icons.stopIcon
        : context.icons.sendIcon;
  const buttonAlt = canStop ? "Stop" : !chatReady ? "Loading" : "Send";

  return (
    <div className="copilotKitInputContainer">
      <div className="copilotKitInput">
        <textarea
          ref={textareaRef}
          className="copilotKitTextarea"
          placeholder={context.labels.placeholder}
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
