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
import { submitDirectVenueBooking } from "@/components/chat/venue-booking-direct-hitl-core";

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
    setStatus("inProgress");
  }, []);

  const openDirectHitl = useCallback((next: VenueBookingHitlArgs) => {
    setArgs(next);
    setStatus("inProgress");
  }, []);

  const respond = useCallback(
    (decision: "approved" | "rejected" | "edit") => {
      if (!args) return;
      if (decision === "rejected" || decision === "edit") {
        clearDirectHitl();
        return;
      }

      setStatus("executing");
      void submitDirectVenueBooking(args).then((result) => {
        if (result.ok) {
          setVenueBookingConfirmation(result.confirmation);
          // Booking saved: close the panel but leave a terminal "complete"
          // observable. The confirmation banner is the user-facing signal.
          setArgs(null);
          setStatus("complete");
          return;
        }
        // Failure is not swallowed: submitDirectVenueBooking already logged it.
        // Reset the panel so the user isn't stuck on a dead "executing" state.
        // TODO SAN-496: surface error to the user via toast/banner.
        clearDirectHitl();
      });
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
