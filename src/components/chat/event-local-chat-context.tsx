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

export type LocalClarifyKind = "event" | "rental";

type EventLocalChatContextValue = {
  messages: EventLocalChatMessage[];
  /** True after canned clarify — merged into fast-path memory without CoAgent sync. */
  clarifyPending: boolean;
  clarifyKind: LocalClarifyKind | null;
  showClarify: (
    userText: string,
    assistantText: string,
    kind: LocalClarifyKind,
  ) => void;
  showExchange: (
    userText: string,
    assistantText: string,
    kind?: LocalClarifyKind,
  ) => void;
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
  const [clarifyKind, setClarifyKind] = useState<LocalClarifyKind | null>(null);

  const showClarify = useCallback(
    (userText: string, assistantText: string, kind: LocalClarifyKind) => {
      setClarifyPending(true);
      setClarifyKind(kind);
      setMessages([
        { id: nextId(), role: "user", content: userText },
        {
          id: nextId(),
          role: "assistant",
          content: assistantText,
          isClarify: true,
        },
      ]);
    },
    [],
  );

  const showExchange = useCallback(
    (userText: string, assistantText: string, _kind?: LocalClarifyKind) => {
      setClarifyPending(false);
      setClarifyKind(null);
      setMessages((prev) => {
        const next: EventLocalChatMessage[] = [
          ...prev,
          { id: nextId(), role: "user", content: userText },
        ];
        if (assistantText.trim()) {
          next.push({ id: nextId(), role: "assistant", content: assistantText });
        }
        return next;
      });
    },
    [],
  );

  const clearLocalMessages = useCallback(() => {
    setMessages([]);
    setClarifyPending(false);
    setClarifyKind(null);
  }, []);

  const value = useMemo(
    () => ({
      messages,
      clarifyPending,
      clarifyKind,
      showClarify,
      showExchange,
      clearLocalMessages,
    }),
    [
      messages,
      clarifyPending,
      clarifyKind,
      showClarify,
      showExchange,
      clearLocalMessages,
    ],
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
