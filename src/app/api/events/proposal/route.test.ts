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

vi.mock("@/lib/events/start-admin-review-workflow", () => ({
  startAdminReviewWorkflow: vi.fn(async () => null),
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
    const res = await POST(
      new Request("http://localhost/api/events/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not json",
      }),
    );

    expect(res.status).toBe(400);
    // JSON is parsed before auth — the gate must not run on a malformed body.
    expect(getUser).not.toHaveBeenCalled();
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

  it("returns 400 when core rejects validation (malformed body)", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    insertEventProposal.mockResolvedValue({
      ok: false,
      status: 400,
      message: "Validation failed",
    });

    const res = await POST(
      postReq({ ...validBody, partnerLocationId: "bad-id" }),
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.message).toBe("Validation failed");
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

  it("returns a structured 500 when the core unexpectedly throws", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    insertEventProposal.mockRejectedValue(new Error("supabase down"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      const res = await POST(postReq(validBody));
      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error.message).toContain("unexpected");
    } finally {
      errorSpy.mockRestore();
    }
  });
});

function postReq(body: unknown) {
  return new Request("http://localhost/api/events/proposal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}
