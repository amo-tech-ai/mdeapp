"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import {
  useAgent,
  useHumanInTheLoop,
  UseAgentUpdate,
} from "@copilotkit/react-core/v2";
import {
  VenueBookingHitlPanel,
  type VenueBookingHitlArgs,
} from "@/components/chat/venue-booking-hitl-panel";
import { useRentalUi } from "@/components/chat/rental-ui-context";
import { useSearchToolRenders } from "@/components/copilot/search-tool-renders";
import {
  MASTRA_COPILOT_TOOL_ACTIONS,
  MASTRA_TOOL_IDS,
} from "@/platform/copilot/mastra-tool-action-names";
import { venueBookingRequestSchema } from "@/lib/venues/venue-booking-form-schema";

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

type HitlRenderProps = {
  args: Partial<VenueBookingHitlArgs>;
  status: "inProgress" | "executing" | "complete";
  result?: unknown;
  respond?: (result: unknown) => Promise<void>;
};

function createVenueBookingHitlRender() {
  return function VenueBookingHitlRender({
    args,
    status,
    result,
    respond,
  }: HitlRenderProps) {
    const hitlArgs = args as VenueBookingHitlArgs;
    if (!hitlArgs?.placeId || !hitlArgs?.requestedAt || !hitlArgs?.partySize) {
      return null;
    }

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
  };
}

type ConciergeCopilotBridgeProps = {
  children: ReactNode;
};

export function ConciergeCopilotBridge({
  children,
}: ConciergeCopilotBridgeProps) {
  useAgent({
    agentId: "conciergeAgent",
    updates: [UseAgentUpdate.OnStateChanged],
  });

  useSearchToolRenders();
  const VenueBookingHitlRender = useMemo(() => createVenueBookingHitlRender(), []);

  useHumanInTheLoop(
    {
      name: MASTRA_COPILOT_TOOL_ACTIONS.venueBooking,
      description:
        "Show booking confirmation card before inserting a venue_booking_requests row",
      parameters: venueBookingRequestSchema,
      render: VenueBookingHitlRender,
    },
    [VenueBookingHitlRender],
  );

  useHumanInTheLoop(
    {
      name: MASTRA_TOOL_IDS.venueBooking,
      description:
        "Show booking confirmation card before inserting a venue_booking_requests row",
      parameters: venueBookingRequestSchema,
      render: VenueBookingHitlRender,
    },
    [VenueBookingHitlRender],
  );

  return <>{children}</>;
}
