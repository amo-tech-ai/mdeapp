"use client";

import { useCallback, useMemo, type ReactNode } from "react";
import {
  useAgent,
  useHumanInTheLoop,
  useRenderTool,
  UseAgentUpdate,
} from "@copilotkit/react-core/v2";
import { z } from "zod";
import {
  VenueBookingHitlPanel,
  type VenueBookingHitlArgs,
} from "@/components/chat/venue-booking-hitl-panel";
import {
  MASTRA_COPILOT_TOOL_ACTIONS,
  MASTRA_TOOL_IDS,
} from "@/platform/copilot/mastra-tool-action-names";
import { venueBookingRequestSchema } from "@/lib/venues/venue-booking-form-schema";

const searchRentalsParams = z.object({
  neighborhood: z.string().optional(),
  minBedrooms: z.number().int().min(0).optional(),
  maxPricePerNight: z.number().positive().optional(),
  limit: z.number().int().min(1).max(20).optional(),
  queryText: z.string().optional(),
});

type ToolRenderProps = { status: string; result?: unknown };

function SpikeRentalToolRender({ status, result }: ToolRenderProps) {
  if (status !== "complete" || !result) {
    return (
      <p
        className="mx-2 my-2 text-sm text-muted-foreground"
        data-testid="spike-rental-loading"
      >
        Searching rentals…
      </p>
    );
  }

  const envelope = result as {
    results?: Array<{ id?: string; title?: string; neighborhood?: string }>;
  };
  const rows = envelope.results ?? [];

  if (rows.length === 0) {
    return (
      <p
        className="mx-2 my-2 text-sm text-muted-foreground"
        data-testid="spike-rental-empty"
      >
        No rentals matched this search.
      </p>
    );
  }

  return (
    <div
      className="mx-2 my-2 space-y-2 rounded-md border border-border bg-card p-3"
      data-testid="spike-rental-results"
    >
      <p className="text-sm font-medium text-foreground">Rental results</p>
      <ul className="space-y-1 text-sm text-muted-foreground">
        {rows.slice(0, 5).map((row) => (
          <li key={row.id ?? row.title}>
            {row.title ?? "Rental"}
            {row.neighborhood ? ` · ${row.neighborhood}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

type HitlRenderProps = {
  args: Partial<VenueBookingHitlArgs>;
  status: "inProgress" | "executing" | "complete";
  respond?: (result: unknown) => Promise<void>;
};

function createVenueBookingHitlRender() {
  return function VenueBookingHitlRender({
    args,
    status,
    respond,
  }: HitlRenderProps) {
    const hitlArgs = args as VenueBookingHitlArgs;
    return (
      <VenueBookingHitlPanel
        args={hitlArgs}
        status={status}
        respond={(decision) => {
          void respond?.(decision);
        }}
      />
    );
  };
}

type ConciergeCopilotBridgeV2Props = {
  children: ReactNode;
};

/**
 * SAN-901 · CK-V2-004A — minimal v2 bridge: useAgent + 1 tool render + 1 HITL.
 * v1 geo-chat-shell bridges untouched for flag-off rollback.
 */
export function ConciergeCopilotBridgeV2({
  children,
}: ConciergeCopilotBridgeV2Props) {
  useAgent({
    agentId: "conciergeAgent",
    updates: [UseAgentUpdate.OnStateChanged],
  });

  const rentalRender = useCallback(
    (props: ToolRenderProps) => <SpikeRentalToolRender {...props} />,
    [],
  );

  const VenueBookingHitlRender = useMemo(() => createVenueBookingHitlRender(), []);

  useRenderTool(
    {
      name: MASTRA_COPILOT_TOOL_ACTIONS.rentals,
      parameters: searchRentalsParams,
      render: rentalRender,
    },
    [rentalRender],
  );

  useRenderTool(
    {
      name: MASTRA_TOOL_IDS.rentals,
      parameters: searchRentalsParams,
      render: rentalRender,
    },
    [rentalRender],
  );

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
