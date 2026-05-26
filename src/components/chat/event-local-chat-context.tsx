"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type EventLocalChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** True for EVP-006 canned clarify assistant bubble. */
  isClarify?: boolean;
};

type EventLocalChatContextValue = {
  messages: EventLocalChatMessage[];
  /** True after EVP-006 clarify — merged into fast-path memory without CoAgent sync. */
  clarifyPending: boolean;
  showClarify: (userText: string, assistantText: string) => void;
  showExchange: (userText: string, assistantText: string) => void;
  clearLocalMessages: () => void;
};

const EventLocalChatContext = createContext<EventLocalChatContextValue | null>(
  null,
);

function nextId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function EventLocalChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<EventLocalChatMessage[]>([]);
  const [clarifyPending, setClarifyPending] = useState(false);

  const showClarify = useCallback((userText: string, assistantText: string) => {
    setClarifyPending(true);
    setMessages([
      { id: nextId(), role: "user", content: userText },
      {
        id: nextId(),
        role: "assistant",
        content: assistantText,
        isClarify: true,
      },
    ]);
  }, []);

  const showExchange = useCallback((userText: string, assistantText: string) => {
    setClarifyPending(false);
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", content: userText },
      { id: nextId(), role: "assistant", content: assistantText },
    ]);
  }, []);

  const clearLocalMessages = useCallback(() => {
    setMessages([]);
    setClarifyPending(false);
  }, []);

  const value = useMemo(
    () => ({
      messages,
      clarifyPending,
      showClarify,
      showExchange,
      clearLocalMessages,
    }),
    [messages, clarifyPending, showClarify, showExchange, clearLocalMessages],
  );

  return (
    <EventLocalChatContext.Provider value={value}>
      {children}
    </EventLocalChatContext.Provider>
  );
}

export function useEventLocalChat() {
  const ctx = useContext(EventLocalChatContext);
  if (!ctx) {
    throw new Error("useEventLocalChat must be used within EventLocalChatProvider");
  }
  return ctx;
}
