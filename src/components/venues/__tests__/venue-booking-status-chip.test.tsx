import { describe, expect, it, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const { useVenueBookingStatus } = vi.hoisted(() => ({
  useVenueBookingStatus: vi.fn(),
}));

vi.mock("@/hooks/use-venue-booking-status", () => ({
  useVenueBookingStatus,
}));

import { VenueBookingStatusChip } from "@/components/venues/venue-booking-status-chip";

describe("VenueBookingStatusChip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders pending chip when user has a row", () => {
    useVenueBookingStatus.mockReturnValue({
      chip: {
        status: "pending",
        label: "Request pending",
        variant: "secondary",
      },
      loading: false,
      error: false,
    });

    const html = renderToStaticMarkup(
      <VenueBookingStatusChip
        placeId="ChIJven021proof01"
        uiKind="cafe"
      />,
    );

    expect(html).toContain('data-testid="venue-booking-status-chip"');
    expect(html).toContain("Request pending");
    expect(html).toContain('data-booking-status="pending"');
  });

  it("renders nothing when no row", () => {
    useVenueBookingStatus.mockReturnValue({
      chip: null,
      loading: false,
      error: false,
    });

    const html = renderToStaticMarkup(
      <VenueBookingStatusChip placeId="ChIJnoRow12345678" uiKind="cafe" />,
    );

    expect(html).not.toContain("venue-booking-status-chip");
  });

  it("renders nothing without placeId", () => {
    useVenueBookingStatus.mockReturnValue({
      chip: null,
      loading: false,
      error: false,
    });

    const html = renderToStaticMarkup(
      <VenueBookingStatusChip uiKind="nightlife" />,
    );

    expect(html).toBe("");
  });
});
