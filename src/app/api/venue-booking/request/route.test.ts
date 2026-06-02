import { describe, expect, it, vi, beforeEach } from "vitest";

const { getUser, insertVenueBookingRequest } = vi.hoisted(() => ({
  getUser: vi.fn(),
  insertVenueBookingRequest: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser },
    from: vi.fn(),
  })),
}));

vi.mock("@/lib/venues/venue-booking-core", () => ({
  insertVenueBookingRequest,
}));

import { POST } from "./route";

describe("POST /api/venue-booking/request", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not signed in", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    const res = await POST(
      new Request("http://localhost/api/venue-booking/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
    );

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error.message).toContain("Sign in");
    expect(insertVenueBookingRequest).not.toHaveBeenCalled();
  });

  it("returns success payload when insert succeeds", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    insertVenueBookingRequest.mockResolvedValue({
      ok: true,
      data: {
        requestId: "row-1",
        message: "Request sent — we'll confirm by WhatsApp.",
      },
    });

    const res = await POST(
      new Request("http://localhost/api/venue-booking/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueKind: "cafe",
          placeId: "ChIJabcdefghijklmnop",
          requestedAt: "2026-06-15T18:00:00.000Z",
          partySize: 2,
          contactName: "A",
          contactEmail: "a@b.co",
        }),
      }),
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.requestId).toBe("row-1");
    expect(insertVenueBookingRequest).toHaveBeenCalledWith(
      expect.anything(),
      "user-1",
      expect.objectContaining({ venueKind: "cafe" }),
    );
  });

  it("returns error status from insert helper", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    insertVenueBookingRequest.mockResolvedValue({
      ok: false,
      status: 409,
      message: "You already submitted this booking request.",
    });

    const res = await POST(
      new Request("http://localhost/api/venue-booking/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
    );

    expect(res.status).toBe(409);
  });
});
