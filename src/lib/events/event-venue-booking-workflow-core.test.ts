import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase/database.types";
import {
  applyEventBookingAdminDecision,
  attachWorkflowRunToBooking,
  validateEventBookingForWorkflow,
} from "@/lib/events/event-venue-booking-workflow-core";

const BOOKING_ID = "11111111-1111-4111-8111-111111111111";
const USER_ID = "22222222-2222-4222-8222-222222222222";
const ACTOR_ID = "33333333-3333-4333-8333-333333333333";

function mockSupabaseForBooking(row: Record<string, unknown> | null) {
  const maybeSingle = vi.fn(async () => ({ data: row, error: null }));
  const eqSecond = vi.fn(() => ({ maybeSingle }));
  const eqFirst = vi.fn(() => ({ eq: eqSecond, maybeSingle }));
  const select = vi.fn(() => ({ eq: eqFirst }));
  const updateEqSecond = vi.fn(async () => ({ error: null }));
  const updateEqFirst = vi.fn(() => ({ eq: updateEqSecond }));
  const update = vi.fn(() => ({ eq: updateEqFirst }));
  const from = vi.fn((table: string) => {
    if (table === "bookings") {
      return { select, update };
    }
    throw new Error(`unexpected table ${table}`);
  });
  return { from, select, update, maybeSingle } as unknown as SupabaseClient<Database> & {
    update: typeof update;
    maybeSingle: typeof maybeSingle;
  };
}

describe("validateEventBookingForWorkflow", () => {
  it("accepts a pending event booking owned by the user", async () => {
    const supabase = mockSupabaseForBooking({
      id: BOOKING_ID,
      user_id: USER_ID,
      booking_type: "event",
      partner_status: "pending",
      resource_id: "00000000-0000-4001-8201-000000000001",
      partner_id: "00000000-0000-4001-8101-000000000001",
      party_size: 30,
      start_date: "2026-07-15",
      resource_title: "Mamacita Provenza",
      metadata: { event_type: "Birthday" } as Json,
    });

    const result = await validateEventBookingForWorkflow(
      supabase,
      BOOKING_ID,
      USER_ID,
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.summary).toContain("Birthday");
      expect(result.data.summary).toContain("30 guests");
    }
  });

  it("rejects non-pending partner_status", async () => {
    const supabase = mockSupabaseForBooking({
      id: BOOKING_ID,
      user_id: USER_ID,
      booking_type: "event",
      partner_status: "approved",
      resource_id: "loc",
      partner_id: "partner",
      party_size: 30,
      start_date: "2026-07-15",
      resource_title: "Mamacita",
      metadata: null,
    });

    const result = await validateEventBookingForWorkflow(
      supabase,
      BOOKING_ID,
      USER_ID,
    );
    expect(result).toEqual({
      ok: false,
      status: 409,
      message: "Proposal is no longer pending admin review",
    });
  });
});

describe("applyEventBookingAdminDecision", () => {
  it("approves without inserting a new row", async () => {
    const single = vi.fn(async () => ({
      data: { id: BOOKING_ID, partner_status: "approved" },
      error: null,
    }));
    const selectAfterUpdate = vi.fn(() => ({ maybeSingle: single }));
    const eqBookingType = vi.fn(() => ({ select: selectAfterUpdate }));
    const eqId = vi.fn(() => ({ eq: eqBookingType }));
    const update = vi.fn(() => ({ eq: eqId }));
    const from = vi.fn(() => ({ update }));
    const supabase = { from } as unknown as SupabaseClient<Database>;

    const result = await applyEventBookingAdminDecision(supabase, BOOKING_ID, {
      decision: "approved",
      actorId: ACTOR_ID,
    });

    expect(result.ok).toBe(true);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        partner_status: "approved",
        approved_by: ACTOR_ID,
      }),
    );
    expect(from).toHaveBeenCalledWith("bookings");
  });

  it("declines and stores decline_reason in metadata", async () => {
    const readSingle = vi.fn(async () => ({
      data: { metadata: { event_type: "Birthday" } },
      error: null,
    }));
    const readEqType = vi.fn(() => ({ maybeSingle: readSingle }));
    const readEqId = vi.fn(() => ({ eq: readEqType }));
    const readSelect = vi.fn(() => ({ eq: readEqId }));

    const writeSingle = vi.fn(async () => ({
      data: { id: BOOKING_ID, partner_status: "declined" },
      error: null,
    }));
    const writeSelect = vi.fn(() => ({ maybeSingle: writeSingle }));
    const writeEqType = vi.fn(() => ({ select: writeSelect }));
    const writeEqId = vi.fn(() => ({ eq: writeEqType }));
    const update = vi.fn(() => ({ eq: writeEqId }));

    let call = 0;
    const from = vi.fn(() => {
      call += 1;
      if (call === 1) return { select: readSelect };
      return { update };
    });
    const supabase = { from } as unknown as SupabaseClient<Database>;

    const result = await applyEventBookingAdminDecision(supabase, BOOKING_ID, {
      decision: "declined",
      actorId: ACTOR_ID,
      declineReason: "Venue fully booked",
    });

    expect(result.ok).toBe(true);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        partner_status: "declined",
        metadata: expect.objectContaining({ decline_reason: "Venue fully booked" }),
      }),
    );
  });
});

describe("attachWorkflowRunToBooking", () => {
  it("merges mastra_workflow_run_id into metadata", async () => {
    const readSingle = vi.fn(async () => ({
      data: { metadata: { event_type: "Birthday" } },
      error: null,
    }));
    const readEqType = vi.fn(() => ({ maybeSingle: readSingle }));
    const readEqId = vi.fn(() => ({ eq: readEqType }));
    const readSelect = vi.fn(() => ({ eq: readEqId }));

    const updateEqType = vi.fn(async () => ({ error: null }));
    const updateEqId = vi.fn(() => ({ eq: updateEqType }));
    const update = vi.fn(() => ({ eq: updateEqId }));

    let call = 0;
    const from = vi.fn(() => {
      call += 1;
      if (call === 1) return { select: readSelect };
      return { update };
    });
    const supabase = { from } as unknown as SupabaseClient<Database>;

    const result = await attachWorkflowRunToBooking(
      supabase,
      BOOKING_ID,
      "run-abc-123",
    );
    expect(result).toEqual({ ok: true });
    expect(update).toHaveBeenCalledWith({
      metadata: expect.objectContaining({
        event_type: "Birthday",
        mastra_workflow_run_id: "run-abc-123",
      }),
    });
  });
});
