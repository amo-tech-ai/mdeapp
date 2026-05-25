"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ScheduleViewingTarget = {
  listingId: string;
  title: string;
  neighborhood: string;
};

export type LeadConfirmation = {
  leadId: string;
  message: string;
  listingTitle: string;
};

export type RentalVenueDetail = {
  kind: "rental";
  listingId: string;
  pinId: string;
  title: string;
  neighborhood: string;
  nightlyPrice?: number;
  bedrooms?: number;
  photoUrl?: string;
  amenities?: string[];
  availability?: string;
  hostName?: string;
};

export type EventVenueDetail = {
  kind: "event";
  eventId: string;
  pinId: string;
  title: string;
  neighborhood: string;
  venue: string;
  startsAt: string;
  pricePerTicket: number;
  imageUrl?: string;
  ticketUrl: string;
};

export type VenueDetailTarget = RentalVenueDetail | EventVenueDetail;

type RentalUiContextValue = {
  scheduleTarget: ScheduleViewingTarget | null;
  venueDetail: VenueDetailTarget | null;
  leadConfirmation: LeadConfirmation | null;
  openScheduleViewing: (target: ScheduleViewingTarget) => void;
  closeScheduleViewing: () => void;
  openVenueDetail: (target: VenueDetailTarget) => void;
  closeVenueDetail: () => void;
  setLeadConfirmation: (value: LeadConfirmation | null) => void;
  clearLeadConfirmation: () => void;
};

const RentalUiContext = createContext<RentalUiContextValue | null>(null);

export function RentalUiProvider({ children }: { children: ReactNode }) {
  const [scheduleTarget, setScheduleTarget] =
    useState<ScheduleViewingTarget | null>(null);
  const [venueDetail, setVenueDetail] = useState<VenueDetailTarget | null>(
    null,
  );
  const [leadConfirmation, setLeadConfirmation] =
    useState<LeadConfirmation | null>(null);

  const openScheduleViewing = useCallback((target: ScheduleViewingTarget) => {
    setScheduleTarget(target);
  }, []);

  const closeScheduleViewing = useCallback(() => {
    setScheduleTarget(null);
  }, []);

  const openVenueDetail = useCallback((target: VenueDetailTarget) => {
    setVenueDetail(target);
  }, []);

  const closeVenueDetail = useCallback(() => {
    setVenueDetail(null);
  }, []);

  const clearLeadConfirmation = useCallback(() => {
    setLeadConfirmation(null);
  }, []);

  const value = useMemo(
    () => ({
      scheduleTarget,
      venueDetail,
      leadConfirmation,
      openScheduleViewing,
      closeScheduleViewing,
      openVenueDetail,
      closeVenueDetail,
      setLeadConfirmation,
      clearLeadConfirmation,
    }),
    [
      scheduleTarget,
      venueDetail,
      leadConfirmation,
      openScheduleViewing,
      closeScheduleViewing,
      openVenueDetail,
      closeVenueDetail,
      clearLeadConfirmation,
    ],
  );

  return (
    <RentalUiContext.Provider value={value}>{children}</RentalUiContext.Provider>
  );
}

export function useRentalUi() {
  const ctx = useContext(RentalUiContext);
  if (!ctx) {
    throw new Error("useRentalUi must be used within RentalUiProvider");
  }
  return ctx;
}
