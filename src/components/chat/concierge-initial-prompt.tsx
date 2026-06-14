"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useConciergeChat } from "@/lib/hooks/use-concierge-chat";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import { useRentalSearchFastPath } from "@/hooks/use-rental-search-fast-path";
import { useEventSearchFastPath } from "@/hooks/use-event-search-fast-path";
import { useRestaurantSearchFastPath } from "@/hooks/use-restaurant-search-fast-path";
import { useGroundedSearchFastPath } from "@/hooks/use-grounded-search-fast-path";
import { useEventVenueBookingFastPath } from "@/hooks/use-event-venue-booking-fast-path";
import { sendConciergeUserMessage } from "@/lib/concierge-send-user-message";

/**
 * Reads /chat?q= from home CTAs, auto-sends once, then strips the query param.
 * No UI — must mount inside GeoChatShell fast-path providers.
 */
export function ConciergeInitialPrompt() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { appendMessage, isLoading } = useConciergeChat();
  const { handleUserMessage: handleRentalMessage } = useRentalSearchFastPath();
  const { handleUserMessage: handleEventMessage } = useEventSearchFastPath();
  const { handleUserMessage: handleRestaurantMessage } =
    useRestaurantSearchFastPath();
  const { handleUserMessage: handleGroundedMessage } =
    useGroundedSearchFastPath();
  const { handleUserMessage: handleEventVenueBookingMessage } =
    useEventVenueBookingFastPath();
  const sentRef = useRef(false);

  const onAgentSend = useCallback(
    async (text: string) => {
      await appendMessage(
        new TextMessage({ role: MessageRole.User, content: text }),
      );
    },
    [appendMessage],
  );

  useEffect(() => {
    const rawQ = searchParams.get("q");
    const trimmedQ = rawQ?.trim();
    if (rawQ !== null && trimmedQ === "") {
      sentRef.current = true;
      router.replace("/chat", { scroll: false });
      return;
    }
    if (!trimmedQ || sentRef.current || isLoading) return;

    sentRef.current = true;

    void sendConciergeUserMessage(trimmedQ, {
      handleRentalMessage,
      handleEventVenueBookingMessage,
      handleEventMessage,
      handleGroundedMessage,
      handleRestaurantMessage,
      onAgentSend,
    }).finally(() => {
      if (typeof window === "undefined") return;
      const onChatWithQ =
        window.location.pathname === "/chat" &&
        new URLSearchParams(window.location.search).has("q");
      if (onChatWithQ) {
        router.replace("/chat", { scroll: false });
      }
    });
  }, [
    searchParams,
    isLoading,
    router,
    handleRentalMessage,
    handleEventVenueBookingMessage,
    handleEventMessage,
    handleGroundedMessage,
    handleRestaurantMessage,
    onAgentSend,
  ]);

  return null;
}
