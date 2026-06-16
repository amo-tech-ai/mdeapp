"use client";

import { useCallback, useMemo } from "react";
import { useConciergeCoAgent } from "@/components/chat/concierge-coagent-context";
import { useConciergeChat } from "@/lib/hooks/use-concierge-chat";
import type { ConciergeSendHandlers } from "@/lib/concierge-send-user-message";
import { useEventSearchFastPath } from "@/hooks/use-event-search-fast-path";
import { useEventVenueBookingFastPath } from "@/hooks/use-event-venue-booking-fast-path";
import { useGroundedSearchFastPath } from "@/hooks/use-grounded-search-fast-path";
import { useRentalSearchFastPath } from "@/hooks/use-rental-search-fast-path";
import { useRestaurantSearchFastPath } from "@/hooks/use-restaurant-search-fast-path";

/** Fast-path + agent handlers for sendConciergeUserMessage (CopilotChat + ?q=). */
export function useConciergeSendHandlers(): ConciergeSendHandlers {
  const { appendMessage } = useConciergeChat();
  const { state } = useConciergeCoAgent();
  const { handleUserMessage: handleRentalMessage } = useRentalSearchFastPath();
  const { handleUserMessage: handleEventMessage } = useEventSearchFastPath();
  const { handleUserMessage: handleRestaurantMessage } =
    useRestaurantSearchFastPath();
  const { handleUserMessage: handleGroundedMessage } =
    useGroundedSearchFastPath();
  const { handleUserMessage: handleEventVenueBookingMessage } =
    useEventVenueBookingFastPath();

  const onAgentSend = useCallback(
    async (text: string) => appendMessage(text),
    [appendMessage],
  );

  return useMemo(
    () => ({
      handleRentalMessage,
      handleEventVenueBookingMessage,
      handleEventMessage,
      handleGroundedMessage,
      handleRestaurantMessage,
      onAgentSend,
      lastIntent: state?.lastIntent,
    }),
    [
      handleRentalMessage,
      handleEventVenueBookingMessage,
      handleEventMessage,
      handleGroundedMessage,
      handleRestaurantMessage,
      onAgentSend,
      state?.lastIntent,
    ],
  );
}
