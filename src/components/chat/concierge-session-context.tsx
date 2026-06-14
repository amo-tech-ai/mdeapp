"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useCopilotChat } from "@copilotkit/react-core";
import { useConciergeCoAgent } from "@/components/chat/concierge-coagent-context";
import { useEventLocalChat } from "@/components/chat/event-local-chat-context";
import { useEventSearchResults } from "@/components/chat/event-search-results-context";
import { useGroundedFastPath } from "@/components/chat/grounded-fast-path-context";
import { useRestaurantFastPath } from "@/components/chat/restaurant-fast-path-context";
import { useEventFastPath } from "@/components/chat/event-fast-path-context";
import { useRentalFastPath } from "@/components/chat/rental-fast-path-context";
import { useRichCardResults } from "@/components/chat/rich-card-results-context";
import { useRentalUi } from "@/components/chat/rental-ui-context";
import { clearConciergeError } from "@/lib/concierge-error-store";
import { useMapContext } from "@/platform/maps/map-context";

type ConciergeSessionContextValue = {
  /** Bump to remount chip bar + fast-path panels with clean local React state. */
  sessionKey: number;
  startNewChat: () => void;
};

const ConciergeSessionContext =
  createContext<ConciergeSessionContextValue | null>(null);

export function ConciergeSessionProviderInner({
  children,
  resetChat,
}: {
  children: ReactNode;
  resetChat: () => void;
}) {
  const [sessionKey, setSessionKey] = useState(0);
  const { setState } = useConciergeCoAgent();
  const { clearPins, setSelectedPinId, clearFocusPinRequest } = useMapContext();
  const { setToolResult: setRentalFp } = useRentalFastPath();
  const { setToolResult: setEventFp } = useEventFastPath();
  const { setToolResult: setRestaurantFp } = useRestaurantFastPath();
  const { setToolResult: setGroundedFp } = useGroundedFastPath();
  const { clearRows, clearWebCitations } = useEventSearchResults();
  const { clearRichCardCounts } = useRichCardResults();
  const { clearLocalMessages } = useEventLocalChat();
  const {
    closeScheduleViewing,
    closeVenueDetail,
    closeCafeDetail,
    closeCafeBooking,
    closeEventVenueOfferings,
    closeEventProposalShell,
    clearLeadConfirmation,
  } = useRentalUi();

  const startNewChat = useCallback(() => {
    resetChat();
    setState({});
    clearPins();
    setSelectedPinId(null);
    clearFocusPinRequest();
    setRentalFp(null);
    setEventFp(null);
    setRestaurantFp(null);
    setGroundedFp(null);
    clearRows();
    clearWebCitations();
    clearRichCardCounts();
    clearLocalMessages();
    closeScheduleViewing();
    closeVenueDetail();
    closeCafeDetail();
    closeCafeBooking();
    closeEventVenueOfferings();
    closeEventProposalShell();
    clearLeadConfirmation();
    clearConciergeError();
    setSessionKey((k) => k + 1);
  }, [
    resetChat,
    setState,
    clearPins,
    setSelectedPinId,
    clearFocusPinRequest,
    setRentalFp,
    setEventFp,
    setRestaurantFp,
    setGroundedFp,
    clearRows,
    clearWebCitations,
    clearRichCardCounts,
    clearLocalMessages,
    closeScheduleViewing,
    closeVenueDetail,
    closeCafeDetail,
    closeCafeBooking,
    closeEventVenueOfferings,
    closeEventProposalShell,
    clearLeadConfirmation,
  ]);

  const value = useMemo(
    () => ({ sessionKey, startNewChat }),
    [sessionKey, startNewChat],
  );

  return (
    <ConciergeSessionContext.Provider value={value}>
      {children}
    </ConciergeSessionContext.Provider>
  );
}

/** v1 /chat shell — useCopilotChat reset under root CopilotKit provider. */
export function ConciergeSessionProvider({ children }: { children: ReactNode }) {
  const { reset } = useCopilotChat();
  const resetChat = useCallback(() => {
    reset();
  }, [reset]);
  return (
    <ConciergeSessionProviderInner resetChat={resetChat}>
      {children}
    </ConciergeSessionProviderInner>
  );
}

export function useConciergeSession(): ConciergeSessionContextValue {
  const ctx = useContext(ConciergeSessionContext);
  if (!ctx) {
    throw new Error(
      "useConciergeSession must be used within ConciergeSessionProvider",
    );
  }
  return ctx;
}
