import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import {
  listEventBookingRequests,
  decideEventBooking,
  mapBookingRowToRequest,
} from "@/lib/events/admin-event-bookings-core";

const BOOKING_ID = "00000000-0000-4002-8301-000000000001";

const row = {
  id: BOOKING_ID,
  resource_title: "Mamacita Provenza",
  party_size: 25,
  start_date: "2026-06-14",
  start_time: "19:00",
  partner_status: "pending",
  status: "pending",
  partner_notes: null,
  metadata: {
    event_type: "birthday",
    contact_name: "Tourist",
    contact_email: "tourist@example.com",
    needs_info: true,
  },
  created_at: "2026-06-10T18:00:00Z",
};

function mockList(result: { data: unknown; error: unknown }) {
  const order = vi.fn(async () => result);
  const eq = vi.fn(() => ({ order }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));
  return { from } as unknown as SupabaseClient<Database>;
}

function mockUpdate(result: { data: unknown; error: unknown }) {
  const maybeSingle = vi.fn(async () => result);
  const select = vi.fn(() => ({ maybeSingle }));
  const eq2 = vi.fn(() => ({ select }));
  const eq1 = vi.fn(() => ({ eq: eq2 }));
  const update = vi.fn(() => ({ eq: eq1 }));
  const from = vi.fn(() => ({ update }));
  const client = { from } as unknown as SupabaseClient<Database>;
  return { client, update };
}

function mockNeedsInfo(
  readResult: { data: unknown; error: unknown },
  updateResult: { data: unknown; error: unknown },
) {
  const readMaybe = vi.fn(async () => readResult);
  const readEq2 = vi.fn(() => ({ maybeSingle: readMaybe }));
  const readEq1 = vi.fn(() => ({ eq: readEq2 }));
  const readSelect = vi.fn(() => ({ eq: readEq1 }));

  const updMaybe = vi.fn(async () => updateResult);
  const updSelect = vi.fn(() => ({ maybeSingle: updMaybe }));
  const updEq2 = vi.fn(() => ({ select: updSelect }));
  const updEq1 = vi.fn(() => ({ eq: updEq2 }));
  const update = vi.fn(() => ({ eq: updEq1 }));

  let call = 0;
  const from = vi.fn(() => (call++ === 0 ? { select: readSelect } : { update }));
  const client = { from } as unknown as SupabaseClient<Database>;
  return { client, update };
}

describe("mapBookingRowToRequest", () => {
  it("pulls venue, party size, status and event details out of the row + metadata", () => {
    const req = mapBookingRowToRequest(row);
    expect(req).toMatchObject({
      id: BOOKING_ID,
      venueTitle: "Mamacita Provenza",
      partySize: 25,
      partnerStatus: "pending",
      bookingStatus: "pending",
      needsInfo: true,
      eventType: "birthday",
      contactName: "Tourist",
      contactEmail: "tourist@example.com",
      contactPhone: null,
    });
  });
});

describe("listEventBookingRequests", () => {
  it("returns mapped event requests", async () => {
    const result = await listEventBookingRequests(mockList({ data: [row], error: null }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.venueTitle).toBe("Mamacita Provenza");
    }
  });

  it("returns 500 when the query errors", async () => {
    const result = await listEventBookingRequests(
      mockList({ data: null, error: { message: "boom" } }),
    );
    expect(result).toEqual({
      ok: false,
      status: 500,
      message: "Could not load event requests",
    });
  });
});

describe("decideEventBooking", () => {
  it("approve sets partner_status='approved'", async () => {
    const { client, update } = mockUpdate({
      data: { id: BOOKING_ID, partner_status: "approved" },
      error: null,
    });
    const result = await decideEventBooking(client, BOOKING_ID, "approve");
    expect(result).toEqual({
      ok: true,
      data: { bookingId: BOOKING_ID, partnerStatus: "approved" },
    });
    expect(update).toHaveBeenCalledWith({ partner_status: "approved" });
  });

  it("decline sets partner_status='declined'", async () => {
    const { client, update } = mockUpdate({
      data: { id: BOOKING_ID, partner_status: "declined" },
      error: null,
    });
    await decideEventBooking(client, BOOKING_ID, "decline");
    expect(update).toHaveBeenCalledWith({ partner_status: "declined" });
  });

  it("needs_info keeps pending, flags metadata.needs_info and records the note", async () => {
    const { client, update } = mockNeedsInfo(
      { data: { metadata: { event_type: "birthday" } }, error: null },
      { data: { id: BOOKING_ID, partner_status: "pending" }, error: null },
    );
    const result = await decideEventBooking(
      client,
      BOOKING_ID,
      "needs_info",
      "Please confirm the date.",
    );
    expect(result.ok).toBe(true);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        partner_status: "pending",
        partner_notes: "Please confirm the date.",
        metadata: expect.objectContaining({ needs_info: true, event_type: "birthday" }),
      }),
    );
  });

  it("returns 404 when the booking does not exist", async () => {
    const { client } = mockUpdate({ data: null, error: null });
    const result = await decideEventBooking(client, BOOKING_ID, "approve");
    expect(result).toEqual({
      ok: false,
      status: 404,
      message: "Event request not found",
    });
  });

  it("returns 400 when bookingId is missing", async () => {
    const { client } = mockUpdate({ data: null, error: null });
    const result = await decideEventBooking(client, "", "approve");
    expect(result).toEqual({
      ok: false,
      status: 400,
      message: "Missing booking id",
    });
  });
});
