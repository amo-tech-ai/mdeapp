import { createHash } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase/database.types";
import {
  eventProposalSchema,
  type EventProposalInput,
  type EventProposalSubmitResult,
} from "@/lib/events/event-proposal-form-schema";

export function buildEventProposalIdempotencyKey(input: {
  partnerLocationId: string;
  startDate: string;
  partySize: number;
}): string {
  const raw = `${input.partnerLocationId}|${input.startDate}|${input.partySize}`;
  const digest = createHash("sha256").update(raw).digest("hex").slice(0, 32);
  return `ep-${digest}`;
}

type CoreError = { ok: false; status: number; message: string };

function mapInsertError(error: { code?: string; message?: string }): CoreError {
  if (error.code === "23505") {
    return {
      ok: false,
      status: 409,
      message: "You already submitted this event proposal.",
    };
  }

  const msg = error.message ?? "";
  if (
    msg.includes("event booking requires partner_id") ||
    msg.includes("must be a verified event-capable partner_location") ||
    msg.includes("event booking requires resource_id")
  ) {
    return {
      ok: false,
      status: 400,
      message: "This venue is not eligible for event proposals.",
    };
  }

  return {
    ok: false,
    status: 500,
    message: "Could not save event proposal",
  };
}

/** SAN-865 — resolve partner_id for bookings trigger (bookings_validate_event_resource). */
export async function resolvePartnerIdForLocation(
  supabase: SupabaseClient<Database>,
  partnerLocationId: string,
): Promise<{ ok: true; partnerId: string } | CoreError> {
  const { data, error } = await supabase
    .from("partner_locations")
    .select("partner_id, accepts_event_bookings, is_verified")
    .eq("id", partnerLocationId)
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      status: 500,
      message: "Could not resolve event venue",
    };
  }

  if (!data?.partner_id) {
    return {
      ok: false,
      status: 400,
      message: "Unknown event venue location.",
    };
  }

  if (!data.accepts_event_bookings || !data.is_verified) {
    return {
      ok: false,
      status: 400,
      message: "This venue is not available for event proposals.",
    };
  }

  return { ok: true, partnerId: String(data.partner_id) };
}

/**
 * SAN-865 — insert event proposal into bookings (booking_type='event').
 * Callers: SAN-496 · createEventProposal tool only (no UI in this task).
 * TODO SAN-496: add bookings.idempotency_key column + unique index before relying on 23505.
 */
export async function insertEventProposal(
  supabase: SupabaseClient<Database>,
  userId: string,
  body: unknown,
): Promise<
  | { ok: true; data: EventProposalSubmitResult }
  | { ok: false; status: number; message: string }
> {
  const parsed = eventProposalSchema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      message: "Validation failed",
    };
  }

  const input: EventProposalInput = parsed.data;

  let partnerId = input.partnerId;
  if (!partnerId) {
    const resolved = await resolvePartnerIdForLocation(
      supabase,
      input.partnerLocationId,
    );
    if (!resolved.ok) {
      return resolved;
    }
    partnerId = resolved.partnerId;
  }

  const idempotencyKey =
    input.idempotencyKey ??
    buildEventProposalIdempotencyKey({
      partnerLocationId: input.partnerLocationId,
      startDate: input.startDate,
      partySize: input.partySize,
    });

  const metadata: Json = {
    event_type: input.eventType,
    idempotency_key: idempotencyKey,
    contact_name: input.contactName,
    contact_email: input.contactEmail,
    ...(input.contactPhone ? { contact_phone: input.contactPhone } : {}),
    ...(input.requirements?.length ? { requirements: input.requirements } : {}),
    ...(input.budgetCents != null ? { budget_cents: input.budgetCents } : {}),
  };

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_id: userId,
      booking_type: "event",
      resource_id: input.partnerLocationId,
      resource_title: input.venueTitle ?? "Event venue proposal",
      partner_id: partnerId,
      start_date: input.startDate,
      start_time: input.startTime ?? null,
      end_time: input.endTime ?? null,
      party_size: input.partySize,
      notes: input.notes ?? null,
      partner_status: "pending",
      status: "pending",
      metadata,
    })
    .select("id")
    .single();

  if (error) {
    return mapInsertError(error);
  }

  return {
    ok: true,
    data: {
      bookingId: data.id,
      message:
        "Proposal sent — Patricia will review with the venue. This is not a confirmed booking yet.",
    },
  };
}
