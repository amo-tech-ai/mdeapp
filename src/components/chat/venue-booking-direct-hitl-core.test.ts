import { describe, expect, it, vi } from "vitest";
import { submitDirectVenueBooking } from "@/components/chat/venue-booking-direct-hitl-core";
import type { VenueBookingHitlArgs } from "@/components/chat/venue-booking-hitl-panel";

const baseArgs: VenueBookingHitlArgs = {
  venueKind: "restaurant",
  placeId: "place-123",
  requestedAt: "2026-06-14T19:00:00Z",
  partySize: 4,
  contactName: "Tourist",
  contactEmail: "tourist@example.com",
  contactPhone: "+57 300 000 0000",
  notes: "window seat",
  venueTitle: "Mamacita Provenza",
};

describe("submitDirectVenueBooking", () => {
  it("returns ok with a confirmation on success", async () => {
    const submit = vi.fn(async () => ({
      requestId: "req-1",
      message: "Request sent",
    }));

    const result = await submitDirectVenueBooking(baseArgs, submit);

    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({ placeId: "place-123", partySize: 4 }),
    );
    expect(result).toEqual({
      ok: true,
      confirmation: {
        requestId: "req-1",
        message: "Request sent",
        venueTitle: "Mamacita Provenza",
      },
    });
  });

  it("falls back to placeId when venueTitle is blank", async () => {
    const submit = vi.fn(async () => ({ requestId: "req-2", message: "ok" }));

    const result = await submitDirectVenueBooking(
      { ...baseArgs, venueTitle: "   " },
      submit,
    );

    expect(result).toEqual({
      ok: true,
      confirmation: { requestId: "req-2", message: "ok", venueTitle: "place-123" },
    });
  });

  it("returns ok:false instead of throwing when submit rejects (no swallowed errors)", async () => {
    const boom = new Error("network down");
    const submit = vi.fn(async () => {
      throw boom;
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      // Must resolve, never reject — the caller relies on this to reset the panel.
      const result = await submitDirectVenueBooking(baseArgs, submit);

      expect(result).toEqual({ ok: false, error: boom });
      expect(errorSpy).toHaveBeenCalledWith(
        "[VenueBookingDirectHitl] submitVenueBooking failed",
        boom,
      );
    } finally {
      // Restore in finally so a failed assertion doesn't leave console.error
      // silenced for the rest of the suite.
      errorSpy.mockRestore();
    }
  });
});
