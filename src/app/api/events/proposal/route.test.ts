import { describe, expect, it, vi, beforeEach } from "vitest";

const { getUser, insertEventProposal } = vi.hoisted(() => ({
  getUser: vi.fn(),
  insertEventProposal: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser },
    from: vi.fn(),
  })),
}));

vi.mock("@/lib/events/event-venue-booking-core", () => ({
  insertEventProposal,
}));

import { POST } from "./route";

const validBody = {
  partnerLocationId: "00000000-0000-4001-8201-000000000001",
  eventType: "birthday",
  startDate: "2026-06-14",
  partySize: 25,
  contactName: "Tourist",
  contactEmail: "tourist@example.com",
  venueTitle: "Mamacita Provenza",
};

describe("POST /api/events/proposal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 on invalid JSON", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });

    const res = await POST(
      new Request("http://localhost/api/events/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not json",
      }),
    );

    expect(res.status).toBe(400);
    expect(insertEventProposal).not.toHaveBeenCalled();
  });

  it("returns 401 when not signed in", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    const res = await POST(
      new Request("http://localhost/api/events/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validBody),
      }),
    );

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error.message).toContain("Sign in");
    expect(insertEventProposal).not.toHaveBeenCalled();
  });

  it("returns bookingId when the proposal is saved", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    insertEventProposal.mockResolvedValue({
      ok: true,
      data: { bookingId: "booking-uuid-1", message: "Proposal sent." },
    });

    const res = await POST(
      new Request("http://localhost/api/events/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validBody),
      }),
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.bookingId).toBe("booking-uuid-1");
    expect(insertEventProposal).toHaveBeenCalledWith(
      expect.anything(),
      "user-1",
      expect.objectContaining({ partnerLocationId: validBody.partnerLocationId }),
    );
  });

  it("passes through the core's error status (e.g. 409 idempotency conflict)", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    insertEventProposal.mockResolvedValue({
      ok: false,
      status: 409,
      message: "You already submitted this event proposal.",
    });

    const res = await POST(
      new Request("http://localhost/api/events/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validBody),
      }),
    );

    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.message).toContain("already submitted");
  });
});
