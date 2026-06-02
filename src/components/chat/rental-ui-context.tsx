"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { GroundedPhotoAttribution } from "@/lib/parse-grounded-tool-result";

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

export type EventVenueSheetStep = "detail" | "checkout";

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
  sourceUrl?: string;
  step?: EventVenueSheetStep;
};

export type VenueDetailTarget = RentalVenueDetail | EventVenueDetail;

/** Grounded café card + map detail panel (SCREEN-021). */
export type CafeVenueDetail = {
  kind: "cafe";
  pinId: string;
  title: string;
  placeId?: string;
  mapsUrl?: string;
  directionsUrl?: string;
  reviewsUrl?: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  openNow?: boolean | null;
  formattedAddress?: string;
  primaryType?: string;
  summary?: string;
  photoName?: string;
  photoAuthorAttributions?: GroundedPhotoAttribution[];
  fieldMaskVersion?: string;
  factsCheckedAt?: string;
  rank?: number;
};

/** Grounded nightlife card + detail panel (SCREEN-022). */
export type NightlifeVenueDetail = {
  kind: "nightlife";
  pinId: string;
  title: string;
  placeId?: string;
  mapsUrl?: string;
  directionsUrl?: string;
  reviewsUrl?: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  openNow?: boolean | null;
  formattedAddress?: string;
  primaryType?: string;
  summary?: string;
  photoName?: string;
  photoAuthorAttributions?: GroundedPhotoAttribution[];
  fieldMaskVersion?: string;
  rank?: number;
};

type RentalUiContextValue = {
  scheduleTarget: ScheduleViewingTarget | null;
  venueDetail: VenueDetailTarget | null;
  cafeDetail: CafeVenueDetail | null;
  cafeSiblings: CafeVenueDetail[];
  cafeBookingTarget: CafeVenueDetail | null;
  cafeBookingOpen: boolean;
  nightlifeDetail: NightlifeVenueDetail | null;
  nightlifeSiblings: NightlifeVenueDetail[];
  nightlifeBookingTarget: NightlifeVenueDetail | null;
  nightlifeBookingOpen: boolean;
  leadConfirmation: LeadConfirmation | null;
  openScheduleViewing: (target: ScheduleViewingTarget) => void;
  closeScheduleViewing: () => void;
  openVenueDetail: (target: VenueDetailTarget) => void;
  setEventVenueStep: (step: EventVenueSheetStep) => void;
  closeVenueDetail: () => void;
  openCafeDetail: (detail: CafeVenueDetail, siblings?: CafeVenueDetail[]) => void;
  closeCafeDetail: () => void;
  openCafeBooking: (target: CafeVenueDetail) => void;
  closeCafeBooking: () => void;
  openNightlifeDetail: (
    detail: NightlifeVenueDetail,
    siblings?: NightlifeVenueDetail[],
  ) => void;
  closeNightlifeDetail: () => void;
  openNightlifeBooking: (target: NightlifeVenueDetail) => void;
  closeNightlifeBooking: () => void;
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
  const [cafeDetail, setCafeDetail] = useState<CafeVenueDetail | null>(null);
  const [cafeSiblings, setCafeSiblings] = useState<CafeVenueDetail[]>([]);
  const [cafeBookingTarget, setCafeBookingTarget] =
    useState<CafeVenueDetail | null>(null);
  const [cafeBookingOpen, setCafeBookingOpen] = useState(false);
  const [nightlifeDetail, setNightlifeDetail] =
    useState<NightlifeVenueDetail | null>(null);
  const [nightlifeSiblings, setNightlifeSiblings] = useState<
    NightlifeVenueDetail[]
  >([]);
  const [nightlifeBookingTarget, setNightlifeBookingTarget] =
    useState<NightlifeVenueDetail | null>(null);
  const [nightlifeBookingOpen, setNightlifeBookingOpen] = useState(false);

  const openScheduleViewing = useCallback((target: ScheduleViewingTarget) => {
    setScheduleTarget(target);
  }, []);

  const closeScheduleViewing = useCallback(() => {
    setScheduleTarget(null);
  }, []);

  const openVenueDetail = useCallback((target: VenueDetailTarget) => {
    setVenueDetail(
      target.kind === "event"
        ? { ...target, step: target.step ?? "detail" }
        : target,
    );
  }, []);

  const setEventVenueStep = useCallback((step: EventVenueSheetStep) => {
    setVenueDetail((prev) => {
      if (prev?.kind !== "event") return prev;
      return { ...prev, step };
    });
  }, []);

  const closeVenueDetail = useCallback(() => {
    setVenueDetail(null);
  }, []);

  const openCafeDetail = useCallback(
    (detail: CafeVenueDetail, siblings: CafeVenueDetail[] = []) => {
      setVenueDetail(null);
      setNightlifeDetail(null);
      setNightlifeSiblings([]);
      setCafeDetail(detail);
      setCafeSiblings(siblings);
    },
    [],
  );

  const closeCafeDetail = useCallback(() => {
    setCafeDetail(null);
    setCafeSiblings([]);
  }, []);

  const openCafeBooking = useCallback((target: CafeVenueDetail) => {
    setCafeBookingTarget(target);
    setCafeBookingOpen(true);
  }, []);

  const closeCafeBooking = useCallback(() => {
    setCafeBookingOpen(false);
    setCafeBookingTarget(null);
  }, []);

  const openNightlifeDetail = useCallback(
    (detail: NightlifeVenueDetail, siblings: NightlifeVenueDetail[] = []) => {
      setVenueDetail(null);
      setCafeDetail(null);
      setCafeSiblings([]);
      setNightlifeDetail(detail);
      setNightlifeSiblings(siblings);
    },
    [],
  );

  const closeNightlifeDetail = useCallback(() => {
    setNightlifeDetail(null);
    setNightlifeSiblings([]);
  }, []);

  const openNightlifeBooking = useCallback((target: NightlifeVenueDetail) => {
    setNightlifeBookingTarget(target);
    setNightlifeBookingOpen(true);
  }, []);

  const closeNightlifeBooking = useCallback(() => {
    setNightlifeBookingOpen(false);
    setNightlifeBookingTarget(null);
  }, []);

  const clearLeadConfirmation = useCallback(() => {
    setLeadConfirmation(null);
  }, []);

  const value = useMemo(
    () => ({
      scheduleTarget,
      venueDetail,
      cafeDetail,
      cafeSiblings,
      cafeBookingTarget,
      cafeBookingOpen,
      nightlifeDetail,
      nightlifeSiblings,
      nightlifeBookingTarget,
      nightlifeBookingOpen,
      leadConfirmation,
      openScheduleViewing,
      closeScheduleViewing,
      openVenueDetail,
      setEventVenueStep,
      closeVenueDetail,
      openCafeDetail,
      closeCafeDetail,
      openCafeBooking,
      closeCafeBooking,
      openNightlifeDetail,
      closeNightlifeDetail,
      openNightlifeBooking,
      closeNightlifeBooking,
      setLeadConfirmation,
      clearLeadConfirmation,
    }),
    [
      scheduleTarget,
      venueDetail,
      cafeDetail,
      cafeSiblings,
      cafeBookingTarget,
      cafeBookingOpen,
      nightlifeDetail,
      nightlifeSiblings,
      nightlifeBookingTarget,
      nightlifeBookingOpen,
      leadConfirmation,
      openScheduleViewing,
      closeScheduleViewing,
      openVenueDetail,
      setEventVenueStep,
      closeVenueDetail,
      openCafeDetail,
      closeCafeDetail,
      openCafeBooking,
      closeCafeBooking,
      openNightlifeDetail,
      closeNightlifeDetail,
      openNightlifeBooking,
      closeNightlifeBooking,
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
