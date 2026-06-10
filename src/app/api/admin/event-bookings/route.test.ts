import { describe, expect, it, vi, beforeEach } from "vitest";

const { getUser, rpc, listEventBookingRequests, decideEventBooking } =
  vi.hoisted(() => ({
    getUser: vi.fn(),
    rpc: vi.fn(),
    listEventBookingRequests: vi.fn(),
    decideEventBooking: vi.fn(),
  }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser },
    rpc,
    from: vi.fn(),
  })),
}));

vi.mock("@/lib/events/admin-event-bookings-core", () => ({
  listEventBookingRequests,
  decideEventBooking,
}));

import { GET, POST } from "./route";

function postReq(body: unknown) {
  return new Request("http://localhost/api/admin/event-bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("GET /api/admin/event-bookings", () => {
  beforeEach(() => vi.clearAllMocks());

  it("401 when signed out", async () => {
    getUser.mockResolvedValue({ data: { user: null } });
    const res = await GET();
    expect(res.status).toBe(401);
    expect(listEventBookingRequests).not.toHaveBeenCalled();
  });

  it("403 when the user is not an admin", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    rpc.mockResolvedValue({ data: false, error: null });
    const res = await GET();
    expect(res.status).toBe(403);
    expect(listEventBookingRequests).not.toHaveBeenCalled();
  });

  it("returns the request list for an admin", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "admin" } } });
    rpc.mockResolvedValue({ data: true, error: null });
    listEventBookingRequests.mockResolvedValue({
      ok: true,
      data: [{ id: "b1", venueTitle: "Mamacita" }],
    });
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.requests[0].venueTitle).toBe("Mamacita");
  });
});

describe("POST /api/admin/event-bookings", () => {
  beforeEach(() => vi.clearAllMocks());

  it("400 on invalid JSON", async () => {
    const res = await POST(postReq("not json"));
    expect(res.status).toBe(400);
    expect(decideEventBooking).not.toHaveBeenCalled();
  });

  it("403 when not an admin", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    rpc.mockResolvedValue({ data: false, error: null });
    const res = await POST(postReq({ bookingId: "b1", decision: "approve" }));
    expect(res.status).toBe(403);
    expect(decideEventBooking).not.toHaveBeenCalled();
  });

  it("400 when bookingId or decision is missing", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "admin" } } });
    rpc.mockResolvedValue({ data: true, error: null });
    const res = await POST(postReq({ decision: "approve" }));
    expect(res.status).toBe(400);
    expect(decideEventBooking).not.toHaveBeenCalled();
  });

  it("applies the decision for an admin", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "admin" } } });
    rpc.mockResolvedValue({ data: true, error: null });
    decideEventBooking.mockResolvedValue({
      ok: true,
      data: { bookingId: "b1", partnerStatus: "approved" },
    });
    const res = await POST(postReq({ bookingId: "b1", decision: "approve" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.partnerStatus).toBe("approved");
    expect(decideEventBooking).toHaveBeenCalledWith(
      expect.anything(),
      "b1",
      "approve",
      undefined,
    );
  });
});
