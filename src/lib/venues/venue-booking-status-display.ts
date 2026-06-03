import type { VenueBookingKind } from "@/lib/venues/venue-booking-form-schema";

/** DB + forward-compatible booking request statuses for display chips. */
export type VenueBookingStatusValue =
  | "pending"
  | "reviewing"
  | "contacted"
  | "confirmed"
  | "cancelled"
  | "declined"
  | "rejected"
  | "sent"
  | "needs_user"
  | "approved";

export type VenueBookingStatusChip = {
  status: VenueBookingStatusValue;
  label: string;
  variant: "secondary" | "outline" | "destructive";
};

const LABELS: Record<VenueBookingStatusValue, Omit<VenueBookingStatusChip, "status">> = {
  pending: { label: "Request pending", variant: "secondary" },
  reviewing: { label: "Under review", variant: "secondary" },
  approved: { label: "Under review", variant: "secondary" },
  sent: { label: "Contacted", variant: "secondary" },
  contacted: { label: "Contacted", variant: "secondary" },
  needs_user: { label: "Venue has a question", variant: "outline" },
  confirmed: { label: "Confirmed", variant: "secondary" },
  cancelled: { label: "Request declined", variant: "outline" },
  declined: { label: "Request declined", variant: "outline" },
  rejected: { label: "Request declined", variant: "destructive" },
};

const DB_ALIASES: Record<string, VenueBookingStatusValue> = {
  pending: "pending",
  confirmed: "confirmed",
  declined: "declined",
  cancelled: "cancelled",
  reviewing: "reviewing",
  contacted: "contacted",
  rejected: "rejected",
  sent: "sent",
  needs_user: "needs_user",
  approved: "approved",
};

export function normalizeVenueBookingStatus(
  raw: string,
): VenueBookingStatusValue | null {
  const key = raw.trim().toLowerCase();
  return DB_ALIASES[key] ?? null;
}

export function venueBookingStatusChip(
  raw: string,
): VenueBookingStatusChip | null {
  const status = normalizeVenueBookingStatus(raw);
  if (!status) return null;
  const meta = LABELS[status];
  return { status, ...meta };
}

/** UI nightlife cards use kind `nightlife`; DB stores `nightclub`. */
export function venueKindForBookingQuery(
  uiKind: "cafe" | "nightlife" | "restaurant",
): VenueBookingKind {
  if (uiKind === "nightlife") return "nightclub";
  return uiKind;
}
