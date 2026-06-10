import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  eventBookingStatus,
  EventBookingStatusChip,
} from "@/components/admin/event-bookings-status";

const base = { partnerStatus: "pending", bookingStatus: "pending", needsInfo: false };

describe("eventBookingStatus", () => {
  it("maps pending", () => {
    expect(eventBookingStatus(base)).toEqual({ label: "Pending", variant: "secondary" });
  });

  it("maps approved", () => {
    expect(eventBookingStatus({ ...base, partnerStatus: "approved" })).toEqual({
      label: "Approved",
      variant: "default",
    });
  });

  it("maps declined", () => {
    expect(eventBookingStatus({ ...base, partnerStatus: "declined" })).toEqual({
      label: "Declined",
      variant: "destructive",
    });
  });

  it("maps needs-info (pending partner_status + needsInfo flag)", () => {
    expect(eventBookingStatus({ ...base, needsInfo: true })).toEqual({
      label: "Needs info",
      variant: "outline",
    });
  });

  it("confirmed (bookings.status) wins over partner_status", () => {
    expect(
      eventBookingStatus({ partnerStatus: "approved", bookingStatus: "confirmed", needsInfo: false }),
    ).toEqual({ label: "Confirmed", variant: "default" });
  });
});

describe("EventBookingStatusChip", () => {
  it("renders the status label with the queue test-id", () => {
    const html = renderToStaticMarkup(
      <EventBookingStatusChip request={{ ...base, partnerStatus: "approved" }} />,
    );
    expect(html).toContain('data-testid="event-booking-status"');
    expect(html).toContain("Approved");
  });
});
