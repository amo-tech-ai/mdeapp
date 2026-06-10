"use client";

import { useEffect, useRef } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import {
  VenueBookingHitlPanel,
  type VenueBookingHitlArgs,
} from "@/components/chat/venue-booking-hitl-panel";
import { useRentalUi } from "@/components/chat/rental-ui-context";
import { MASTRA_COPILOT_TOOL_ACTIONS } from "@/platform/copilot/mastra-tool-action-names";

function VenueBookingResultBannerSync({
  result,
  venueTitle,
}: {
  result: unknown;
  venueTitle: string;
}) {
  const { setVenueBookingConfirmation } = useRentalUi();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!result || typeof result !== "object") return;
    const payload = result as {
      success?: boolean;
      requestId?: string;
      message?: string;
    };
    if (!payload.success || !payload.requestId || !payload.message) return;
    if (syncedRef.current === payload.requestId) return;
    syncedRef.current = payload.requestId;
    setVenueBookingConfirmation({
      requestId: payload.requestId,
      message: payload.message,
      venueTitle,
    });
  }, [result, setVenueBookingConfirmation, venueTitle]);

  return null;
}

/** SAN-302 — HITL mirror for requestVenueBooking (conciergeAgent). */
export function ConciergeVenueBookingBridge() {
  useCopilotAction({
    name: MASTRA_COPILOT_TOOL_ACTIONS.venueBooking,
    description:
      "Show booking confirmation card before inserting a venue_booking_requests row",
    available: "remote",
    parameters: [
      { name: "venueKind", type: "string", required: true },
      { name: "placeId", type: "string", required: true },
      { name: "requestedAt", type: "string", required: true },
      { name: "partySize", type: "number", required: true },
      { name: "contactName", type: "string", required: true },
      { name: "contactEmail", type: "string", required: true },
      { name: "contactPhone", type: "string", required: false },
      { name: "notes", type: "string", required: false },
      { name: "venueTitle", type: "string", required: false },
      { name: "restaurantId", type: "string", required: false },
    ],
    renderAndWaitForResponse: ({ args, respond, status, result }) => {
      const hitlArgs = args as VenueBookingHitlArgs;
      const venueTitle = hitlArgs.venueTitle?.trim() || hitlArgs.placeId;

      return (
        <>
          {status === "complete" ? (
            <VenueBookingResultBannerSync result={result} venueTitle={venueTitle} />
          ) : null}
          <VenueBookingHitlPanel
            args={hitlArgs}
            status={status}
            respond={(decision) => respond?.(decision)}
          />
        </>
      );
    },
  });

  return null;
}
