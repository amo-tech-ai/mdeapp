"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCopilotChat } from "@copilotkit/react-core";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import { useRentalSearchFastPath } from "@/hooks/use-rental-search-fast-path";
import { useEventSearchFastPath } from "@/hooks/use-event-search-fast-path";
import { useRestaurantSearchFastPath } from "@/hooks/use-restaurant-search-fast-path";
import { useGroundedSearchFastPath } from "@/hooks/use-grounded-search-fast-path";
import { sendConciergeUserMessage } from "@/lib/concierge-send-user-message";

/**
 * Reads /chat?q= from home CTAs, auto-sends once, then strips the query param.
 * No UI — must mount inside GeoChatShell fast-path providers.
 */
export function ConciergeInitialPrompt() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { appendMessage, isLoading } = useCopilotChat();
  const { handleUserMessage: handleRentalMessage } = useRentalSearchFastPath();
  const { handleUserMessage: handleEventMessage } = useEventSearchFastPath();
  const { handleUserMessage: handleRestaurantMessage } =
    useRestaurantSearchFastPath();
  const { handleUserMessage: handleGroundedMessage } =
    useGroundedSearchFastPath();
  const sentRef = useRef(false);
  const [chatReady, setChatReady] = useState(false);

  useEffect(() => {
    if (chatReady || sentRef.current) return;
    const id = window.setInterval(() => {
      const ready = document.querySelector(
        '[data-testid="copilot-chat-ready"]',
      );
      if (ready) {
        setChatReady(true);
        window.clearInterval(id);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [chatReady]);

  const onAgentSend = useCallback(
    async (text: string) => {
      await appendMessage(
        new TextMessage({ role: MessageRole.User, content: text }),
      );
    },
    [appendMessage],
  );

  useEffect(() => {
    const q = searchParams.get("q")?.trim();
    if (!q || sentRef.current || isLoading || !chatReady) return;

    sentRef.current = true;
    router.replace("/chat", { scroll: false });

    void sendConciergeUserMessage(q, {
      handleRentalMessage,
      handleEventMessage,
      handleGroundedMessage,
      handleRestaurantMessage,
      onAgentSend,
    });
  }, [
    searchParams,
    isLoading,
    chatReady,
    router,
    handleRentalMessage,
    handleEventMessage,
    handleGroundedMessage,
    handleRestaurantMessage,
    onAgentSend,
  ]);

  return null;
}
