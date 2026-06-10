"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  VenueBookingHitlPanel,
  type VenueBookingHitlArgs,
} from "@/components/chat/venue-booking-hitl-panel";
import { useRentalUi } from "@/components/chat/rental-ui-context";
import { submitVenueBooking } from "@/lib/venues/submit-venue-booking";

type VenueBookingDirectHitlContextValue = {
  openDirectHitl: (args: VenueBookingHitlArgs) => void;
  clearDirectHitl: () => void;
  args: VenueBookingHitlArgs | null;
  status: "inProgress" | "executing" | "complete";
  respond: (decision: "approved" | "rejected" | "edit") => void;
};

const VenueBookingDirectHitlContext =
  createContext<VenueBookingDirectHitlContextValue | null>(null);

function useVenueBookingDirectHitlContext() {
  const ctx = useContext(VenueBookingDirectHitlContext);
  if (!ctx) {
    throw new Error(
      "VenueBookingDirectHitlContext missing — wrap with VenueBookingDirectHitlProvider",
    );
  }
  return ctx;
}

export function useVenueBookingDirectHitl() {
  const { openDirectHitl, clearDirectHitl } = useVenueBookingDirectHitlContext();
  return { openDirectHitl, clearDirectHitl };
}

export function VenueBookingDirectHitlPanel() {
  const { args, status, respond } = useVenueBookingDirectHitlContext();
  if (!args) return null;
  return (
    <div className="px-2 pb-3 sm:px-4">
      <VenueBookingHitlPanel args={args} status={status} respond={respond} />
    </div>
  );
}

/** Slot-complete booking — show HITL without waiting for conciergeAgent tool selection. */
export function VenueBookingDirectHitlProvider({ children }: { children: ReactNode }) {
  const [args, setArgs] = useState<VenueBookingHitlArgs | null>(null);
  const [status, setStatus] = useState<"inProgress" | "executing" | "complete">(
    "inProgress",
  );
  const { setVenueBookingConfirmation } = useRentalUi();

  const clearDirectHitl = useCallback(() => {
    setArgs(null);
    setStatus("executing");
  }, []);

  const openDirectHitl = useCallback((next: VenueBookingHitlArgs) => {
    setArgs(next);
    setStatus("executing");
  }, []);

  const respond = useCallback(
    (decision: "approved" | "rejected" | "edit") => {
      if (!args) return;
      if (decision === "rejected" || decision === "edit") {
        clearDirectHitl();
        return;
      }

      void (async () => {
        try {
          const result = await submitVenueBooking({
            venueKind: args.venueKind,
            placeId: args.placeId,
            requestedAt: args.requestedAt,
            partySize: args.partySize,
            contactName: args.contactName,
            contactEmail: args.contactEmail,
            contactPhone: args.contactPhone,
            notes: args.notes,
            venueTitle: args.venueTitle,
          });
          setVenueBookingConfirmation({
            requestId: result.requestId,
            message: result.message,
            venueTitle: args.venueTitle?.trim() || args.placeId,
          });
          setStatus("complete");
        } finally {
          clearDirectHitl();
        }
      })();
    },
    [args, clearDirectHitl, setVenueBookingConfirmation],
  );

  const value = useMemo(
    () => ({
      openDirectHitl,
      clearDirectHitl,
      args,
      status,
      respond,
    }),
    [openDirectHitl, clearDirectHitl, args, status, respond],
  );

  return (
    <VenueBookingDirectHitlContext.Provider value={value}>
      {children}
    </VenueBookingDirectHitlContext.Provider>
  );
}
