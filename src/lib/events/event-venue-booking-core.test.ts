import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import {
  buildEventProposalIdempotencyKey,
  insertEventProposal,
  resolvePartnerIdForLocation,
} from "@/lib/events/event-venue-booking-core";

const MAMACITA_LOCATION_ID = "00000000-0000-4001-8201-000000000001";
const MAMACITA_PARTNER_ID = "00000000-0000-4001-8101-000000000001";

const validBody = {
  partnerLocationId: MAMACITA_LOCATION_ID,
  eventType: "birthday",
  startDate: "2026-06-14",
  startTime: "19:00",
  partySize: 25,
  contactName: "Tourist",
  contactEmail: "tourist@example.com",
  venueTitle: "Mamacita Provenza",
};

function mockSupabaseInsert(
  insertResult: { data: { id: string } | null; error: { code?: string; message?: string } | null },
) {
  const single = vi.fn(async () => insertResult);
  const select = vi.fn(() => ({ single }));
  const insert = vi.fn(() => ({ select }));
  const from = vi.fn((table: string) => {
    if (table === "bookings") {
      return { insert };
    }
    throw new Error(`unexpected table ${table}`);
  });
  return { from, insert } as unknown as SupabaseClient<Database> & {
    insert: typeof insert;
    from: typeof from;
  };
}

function mockSupabaseWithLookup(
  lookup: { partner_id: string; accepts_event_bookings: boolean; is_verified: boolean } | null,
  insertResult: { data: { id: string } | null; error: { code?: string; message?: string } | null },
) {
  const single = vi.fn(async () => insertResult);
  const select = vi.fn(() => ({ single }));
  const insert = vi.fn(() => ({ select }));
  const maybeSingle = vi.fn(async () => ({ data: lookup, error: null }));
  const eq = vi.fn(() => ({ maybeSingle }));
  const selectLoc = vi.fn(() => ({ eq }));
  const from = vi.fn((table: string) => {
    if (table === "partner_locations") {
      return { select: selectLoc };
    }
    if (table === "bookings") {
      return { insert };
    }
    throw new Error(`unexpected table ${table}`);
  });
  return { from, insert, maybeSingle, eq } as unknown as SupabaseClient<Database> & {
    insert: typeof insert;
    from: typeof from;
  };
}

describe("buildEventProposalIdempotencyKey", () => {
  const base = {
    partnerLocationId: MAMACITA_LOCATION_ID,
    startDate: "2026-06-14",
    partySize: 25,
  };

  it("is stable for the same inputs", () => {
    expect(buildEventProposalIdempotencyKey(base)).toBe(
      buildEventProposalIdempotencyKey(base),
    );
    expect(buildEventProposalIdempotencyKey(base)).toMatch(/^ep-[a-f0-9]{32}$/);
  });
});

describe("resolvePartnerIdForLocation", () => {
  it("returns 400 when location is unknown", async () => {
    const maybeSingle = vi.fn(async () => ({ data: null, error: null }));
    const eq = vi.fn(() => ({ maybeSingle }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));
    const supabase = { from } as unknown as SupabaseClient<Database>;

    const result = await resolvePartnerIdForLocation(
      supabase,
      MAMACITA_LOCATION_ID,
    );
    expect(result).toEqual({
      ok: false,
      status: 400,
      message: "Unknown event venue location.",
    });
  });

  it("returns partner_id for verified event-capable location", async () => {
    const maybeSingle = vi.fn(async () => ({
      data: {
        partner_id: MAMACITA_PARTNER_ID,
        accepts_event_bookings: true,
        is_verified: true,
      },
      error: null,
    }));
    const eq = vi.fn(() => ({ maybeSingle }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));
    const supabase = { from } as unknown as SupabaseClient<Database>;

    const result = await resolvePartnerIdForLocation(
      supabase,
      MAMACITA_LOCATION_ID,
    );
    expect(result).toEqual({ ok: true, partnerId: MAMACITA_PARTNER_ID });
  });
});

describe("insertEventProposal", () => {
  it("returns 400 on invalid body", async () => {
    const supabase = mockSupabaseInsert({ data: null, error: null });
    const result = await insertEventProposal(supabase, "user-1", {
      partySize: 2,
    });
    expect(result).toEqual({
      ok: false,
      status: 400,
      message: "Validation failed",
    });
  });

  it("resolves partner_id from partnerLocationId when omitted", async () => {
    const supabase = mockSupabaseWithLookup(
      {
        partner_id: MAMACITA_PARTNER_ID,
        accepts_event_bookings: true,
        is_verified: true,
      },
      { data: { id: "booking-uuid-1" }, error: null },
    );

    // validBody intentionally omits partnerId so the lookup path runs.
    const result = await insertEventProposal(supabase, "user-abc", validBody);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.bookingId).toBe("booking-uuid-1");
    }
    expect(supabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        booking_type: "event",
        resource_id: MAMACITA_LOCATION_ID,
        partner_id: MAMACITA_PARTNER_ID,
        partner_status: "pending",
        status: "pending",
        user_id: "user-abc",
        party_size: 25,
      }),
    );
  });

  it("uses provided partnerId without lookup", async () => {
    const supabase = mockSupabaseInsert({
      data: { id: "booking-uuid-2" },
      error: null,
    });

    const result = await insertEventProposal(supabase, "user-abc", {
      ...validBody,
      partnerId: MAMACITA_PARTNER_ID,
    });

    expect(result.ok).toBe(true);
    expect(supabase.from).toHaveBeenCalledTimes(1);
    expect(supabase.from).toHaveBeenCalledWith("bookings");
    expect(supabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        partner_id: MAMACITA_PARTNER_ID,
      }),
    );
  });

  it("returns 409 on idempotency conflict", async () => {
    const supabase = mockSupabaseInsert({
      data: null,
      error: { code: "23505" },
    });

    const result = await insertEventProposal(supabase, "user-abc", {
      ...validBody,
      partnerId: MAMACITA_PARTNER_ID,
    });

    expect(result).toEqual({
      ok: false,
      status: 409,
      message: "You already submitted this event proposal.",
    });
  });

  it("returns 400 when trigger rejects ineligible venue", async () => {
    const supabase = mockSupabaseInsert({
      data: null,
      error: {
        message:
          "bookings.resource_id 00000000-0000-4001-8201-000000000001 must be a verified event-capable partner_location for active partner 00000000-0000-4001-8101-000000000001",
      },
    });

    const result = await insertEventProposal(supabase, "user-abc", {
      ...validBody,
      partnerId: MAMACITA_PARTNER_ID,
    });

    expect(result).toEqual({
      ok: false,
      status: 400,
      message: "This venue is not eligible for event proposals.",
    });
  });
});
