import { describe, expect, it, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const { insertVenueBookingRequest, createServiceRoleClient } = vi.hoisted(() => ({
  insertVenueBookingRequest: vi.fn(),
  createServiceRoleClient: vi.fn(),
}));

vi.mock("@/lib/venues/venue-booking-core", () => ({
  insertVenueBookingRequest,
}));

vi.mock("@/lib/supabase/service", () => ({
  createServiceRoleClient,
}));

import { requestVenueBookingTool } from "../request-venue-booking";

const bookingRequestId = "11111111-1111-4111-8111-111111111111";

const validInput = {
  venueKind: "restaurant" as const,
  placeId: "ChIJtest12345678",
  requestedAt: "2026-06-15T20:00:00.000Z",
  partySize: 4,
  contactName: "Tourist",
  contactEmail: "tourist@example.com",
  venueTitle: "Mamasita",
};

function mockSupabase() {
  return {} as SupabaseClient<Database>;
}

describe("requestVenueBookingTool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createServiceRoleClient.mockReturnValue(mockSupabase());
  });

  it("returns sign-in message when user is anonymous", async () => {
    const result = await requestVenueBookingTool.execute!(
      validInput
    );
    expect(result).toEqual({
      success: false,
      message: "Sign in to request a booking.",
    });
    expect(insertVenueBookingRequest).not.toHaveBeenCalled();
  });

  it("inserts pending row for authenticated user", async () => {
    insertVenueBookingRequest.mockResolvedValue({
      ok: true,
      data: {
        requestId: bookingRequestId,
        message:
          "Request sent — we'll confirm by WhatsApp. This is not a confirmed reservation yet.",
      },
    });

    const result = await requestVenueBookingTool.execute!(
      validInput,
      {
        requestContext: {
          get: (key: string) => (key === "mdeaiUserId" ? "user-abc" : undefined),
        },
      },
    );

    expect(result).toMatchObject({
      success: true,
      requestId: bookingRequestId,
    });
    expect(insertVenueBookingRequest).toHaveBeenCalledWith(
      expect.anything(),
      "user-abc",
      expect.objectContaining(validInput),
    );
  });

  it("surfaces idempotency conflict", async () => {
    insertVenueBookingRequest.mockResolvedValue({
      ok: false,
      status: 409,
      message: "You already submitted this booking request.",
    });

    const result = await requestVenueBookingTool.execute!(
      validInput,
      {
        requestContext: {
          get: () => "user-abc",
        },
      },
    );

    expect(result).toEqual({
      success: false,
      message: "You already submitted this booking request.",
    });
  });
});
