import { describe, expect, it } from "vitest";
import {
  venueBookingStatusChip,
  venueKindForBookingQuery,
} from "@/lib/venues/venue-booking-status-display";

describe("venueBookingStatusChip", () => {
  it("maps pending to honest copy", () => {
    expect(venueBookingStatusChip("pending")).toEqual({
      status: "pending",
      label: "Request pending",
      variant: "secondary",
    });
  });

  it("maps confirmed only when DB says confirmed", () => {
    expect(venueBookingStatusChip("confirmed")?.label).toBe("Confirmed");
  });

  it("maps declined and cancelled to declined copy", () => {
    expect(venueBookingStatusChip("declined")?.label).toBe("Request declined");
    expect(venueBookingStatusChip("cancelled")?.label).toBe("Request declined");
  });

  it("maps reviewing and contacted when present", () => {
    expect(venueBookingStatusChip("reviewing")?.label).toBe("Under review");
    expect(venueBookingStatusChip("contacted")?.label).toBe("Contacted");
  });

  it("returns null for unknown status", () => {
    expect(venueBookingStatusChip("bogus")).toBeNull();
  });
});

describe("venueKindForBookingQuery", () => {
  it("maps nightlife UI to nightclub in DB", () => {
    expect(venueKindForBookingQuery("nightlife")).toBe("nightclub");
  });

  it("passes cafe and restaurant through", () => {
    expect(venueKindForBookingQuery("cafe")).toBe("cafe");
    expect(venueKindForBookingQuery("restaurant")).toBe("restaurant");
  });
});
