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

/**
 * SAN-865 scaffold — insert event proposal into bookings (booking_type='event').
 * Full wiring lands in SAN-496 · createEventProposal tool.
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
      partner_id: input.partnerId ?? null,
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
    if (error.code === "23505") {
      return {
        ok: false,
        status: 409,
        message: "You already submitted this event proposal.",
      };
    }
    return {
      ok: false,
      status: 500,
      message: "Could not save event proposal",
    };
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
