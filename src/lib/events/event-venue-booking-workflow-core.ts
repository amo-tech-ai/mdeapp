import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase/database.types";

/**
 * SAN-501 · EVT-042 — shared helpers for eventVenueBookingWorkflow.
 * Mode A: no inserts — validates an existing bookings row and applies admin decisions.
 */

export type EventVenueBookingWorkflowInput = {
  bookingId: string;
  userId: string;
  threadId?: string;
};

export type ValidatedEventBooking = {
  bookingId: string;
  userId: string;
  summary: string;
  venueTitle: string;
  partySize: number | null;
  startDate: string;
};

export type AdminReviewResumeData = {
  decision: "approved" | "declined";
  actorId: string;
  declineReason?: string;
};

type CoreError = { ok: false; status: number; message: string };

type BookingRow = {
  id: string;
  user_id: string;
  booking_type: string;
  partner_status: string;
  resource_id: string | null;
  partner_id: string | null;
  party_size: number | null;
  start_date: string;
  resource_title: string;
  metadata: Json | null;
};

function asRecord(value: Json | null | undefined): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function str(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export async function validateEventBookingForWorkflow(
  supabase: SupabaseClient<Database>,
  bookingId: string,
  userId: string,
): Promise<{ ok: true; data: ValidatedEventBooking } | CoreError> {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, user_id, booking_type, partner_status, resource_id, partner_id, party_size, start_date, resource_title, metadata",
    )
    .eq("id", bookingId)
    .maybeSingle();

  if (error) {
    return { ok: false, status: 500, message: "Could not load event proposal" };
  }
  if (!data) {
    return { ok: false, status: 404, message: "Event proposal not found" };
  }

  const row = data as BookingRow;

  if (row.user_id !== userId) {
    return { ok: false, status: 403, message: "Proposal belongs to another user" };
  }
  if (row.booking_type !== "event") {
    return { ok: false, status: 400, message: "Not an event venue proposal" };
  }
  if (row.partner_status !== "pending") {
    return {
      ok: false,
      status: 409,
      message: "Proposal is no longer pending admin review",
    };
  }
  if (!row.resource_id || !row.partner_id) {
    return {
      ok: false,
      status: 400,
      message: "Proposal is missing venue partner linkage",
    };
  }

  const meta = asRecord(row.metadata);
  const eventType = str(meta.event_type) ?? "Event";
  const summary = `${eventType} · ${row.party_size ?? "?"} guests · ${row.start_date} · ${row.resource_title}`;

  return {
    ok: true,
    data: {
      bookingId: row.id,
      userId: row.user_id,
      summary,
      venueTitle: row.resource_title,
      partySize: row.party_size,
      startDate: row.start_date,
    },
  };
}

export async function attachWorkflowRunToBooking(
  supabase: SupabaseClient<Database>,
  bookingId: string,
  runId: string,
): Promise<{ ok: true } | CoreError> {
  const { data: current, error: readError } = await supabase
    .from("bookings")
    .select("metadata")
    .eq("id", bookingId)
    .eq("booking_type", "event")
    .maybeSingle();

  if (readError) {
    return { ok: false, status: 500, message: "Could not attach workflow run" };
  }
  if (!current) {
    return { ok: false, status: 404, message: "Event proposal not found" };
  }

  const metadata = {
    ...asRecord(current.metadata as Json | null),
    mastra_workflow_run_id: runId,
  } as Json;

  const { error } = await supabase
    .from("bookings")
    .update({ metadata })
    .eq("id", bookingId)
    .eq("booking_type", "event");

  if (error) {
    return { ok: false, status: 500, message: "Could not attach workflow run" };
  }

  return { ok: true };
}

export async function applyEventBookingAdminDecision(
  supabase: SupabaseClient<Database>,
  bookingId: string,
  resume: AdminReviewResumeData,
): Promise<
  { ok: true; data: { bookingId: string; partnerStatus: string } } | CoreError
> {
  const now = new Date().toISOString();

  if (resume.decision === "approved") {
    const { data, error } = await supabase
      .from("bookings")
      .update({
        partner_status: "approved",
        approved_at: now,
        approved_by: resume.actorId,
      })
      .eq("id", bookingId)
      .eq("booking_type", "event")
      .eq("partner_status", "pending")
      .select("id, partner_status")
      .maybeSingle();

    if (error) {
      return { ok: false, status: 500, message: "Could not approve proposal" };
    }
    if (!data) {
      return {
        ok: false,
        status: 409,
        message: "Proposal is no longer pending admin review",
      };
    }
    return {
      ok: true,
      data: { bookingId: data.id, partnerStatus: data.partner_status },
    };
  }

  const { data: current, error: readError } = await supabase
    .from("bookings")
    .select("metadata")
    .eq("id", bookingId)
    .eq("booking_type", "event")
    .maybeSingle();

  if (readError) {
    return { ok: false, status: 500, message: "Could not decline proposal" };
  }
  if (!current) {
    return { ok: false, status: 404, message: "Event proposal not found" };
  }

  const metadata = {
    ...asRecord(current.metadata as Json | null),
    declined_at: now,
    declined_by: resume.actorId,
    ...(resume.declineReason ? { decline_reason: resume.declineReason } : {}),
  } as Json;

  const { data, error } = await supabase
    .from("bookings")
    .update({
      partner_status: "declined",
      metadata,
    })
    .eq("id", bookingId)
    .eq("booking_type", "event")
    .eq("partner_status", "pending")
    .select("id, partner_status")
    .maybeSingle();

  if (error) {
    return { ok: false, status: 500, message: "Could not decline proposal" };
  }
  if (!data) {
    return {
      ok: false,
      status: 409,
      message: "Proposal is no longer pending admin review",
    };
  }

  return {
    ok: true,
    data: { bookingId: data.id, partnerStatus: data.partner_status },
  };
}
