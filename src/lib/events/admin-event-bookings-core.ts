import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase/database.types";

/**
 * SAN-502 · EVT-043 — Patricia admin queue (event requests).
 * Read + decision logic for event-venue proposals (bookings, booking_type='event').
 * Decisions move `partner_status` only (pending → approved/declined); "needs info"
 * keeps it pending and flags `metadata.needs_info` + records `partner_notes`.
 */

export type EventBookingDecision = "approve" | "decline" | "needs_info";

export type EventBookingRequest = {
  id: string;
  venueTitle: string;
  partySize: number | null;
  startDate: string;
  startTime: string | null;
  partnerStatus: string;
  bookingStatus: string;
  needsInfo: boolean;
  partnerNotes: string | null;
  eventType: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  createdAt: string;
};

type CoreError = { ok: false; status: number; message: string };

type BookingRow = {
  id: string;
  resource_title: string;
  party_size: number | null;
  start_date: string;
  start_time: string | null;
  partner_status: string;
  status: string;
  partner_notes: string | null;
  metadata: Json | null;
  created_at: string;
};

const SELECT_COLUMNS =
  "id, resource_title, party_size, start_date, start_time, partner_status, status, partner_notes, metadata, created_at";

function asRecord(value: Json | null | undefined): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function str(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export function mapBookingRowToRequest(row: BookingRow): EventBookingRequest {
  const meta = asRecord(row.metadata);
  return {
    id: row.id,
    venueTitle: row.resource_title,
    partySize: row.party_size,
    startDate: row.start_date,
    startTime: row.start_time,
    partnerStatus: row.partner_status,
    bookingStatus: row.status,
    needsInfo: meta.needs_info === true,
    partnerNotes: row.partner_notes,
    eventType: str(meta.event_type),
    contactName: str(meta.contact_name),
    contactEmail: str(meta.contact_email),
    contactPhone: str(meta.contact_phone),
    createdAt: row.created_at,
  };
}

export async function listEventBookingRequests(
  supabase: SupabaseClient<Database>,
): Promise<{ ok: true; data: EventBookingRequest[] } | CoreError> {
  const { data, error } = await supabase
    .from("bookings")
    .select(SELECT_COLUMNS)
    .eq("booking_type", "event")
    .order("created_at", { ascending: false });

  if (error) {
    return { ok: false, status: 500, message: "Could not load event requests" };
  }

  return {
    ok: true,
    data: ((data ?? []) as BookingRow[]).map(mapBookingRowToRequest),
  };
}

export async function decideEventBooking(
  supabase: SupabaseClient<Database>,
  bookingId: string,
  decision: EventBookingDecision,
  decidedBy: string,
  note?: string,
): Promise<
  { ok: true; data: { bookingId: string; partnerStatus: string } } | CoreError
> {
  if (!bookingId) {
    return { ok: false, status: 400, message: "Missing booking id" };
  }

  let patch: Database["public"]["Tables"]["bookings"]["Update"];
  if (decision === "approve") {
    // Audit trail: record who decided and when (SAN-502 EVT-043).
    patch = {
      partner_status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: decidedBy,
    };
  } else if (decision === "decline") {
    patch = {
      partner_status: "declined",
      approved_at: new Date().toISOString(),
      approved_by: decidedBy,
    };
  } else if (decision === "needs_info") {
    // Keep partner_status 'pending' (no invalid CHECK value) and merge
    // needs_info into metadata — read current metadata first since the JS
    // client can't do a jsonb partial update.
    const { data: current, error: readError } = await supabase
      .from("bookings")
      .select("metadata")
      .eq("id", bookingId)
      .eq("booking_type", "event")
      .maybeSingle();
    if (readError) {
      return { ok: false, status: 500, message: "Could not load event request" };
    }
    if (!current) {
      return { ok: false, status: 404, message: "Event request not found" };
    }
    patch = {
      partner_status: "pending",
      partner_notes: note ?? null,
      metadata: {
        ...asRecord(current.metadata as Json | null),
        needs_info: true,
      } as Json,
    };
  } else {
    return { ok: false, status: 400, message: "Unknown decision" };
  }

  const { data, error } = await supabase
    .from("bookings")
    .update(patch)
    .eq("id", bookingId)
    .eq("booking_type", "event")
    .select("id, partner_status")
    .maybeSingle();

  if (error) {
    return { ok: false, status: 500, message: "Could not update event request" };
  }
  if (!data) {
    return { ok: false, status: 404, message: "Event request not found" };
  }

  return {
    ok: true,
    data: { bookingId: data.id, partnerStatus: data.partner_status },
  };
}

export async function getEventBookingWorkflowRunId(
  supabase: SupabaseClient<Database>,
  bookingId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("bookings")
    .select("metadata")
    .eq("id", bookingId)
    .eq("booking_type", "event")
    .maybeSingle();

  if (error || !data) return null;
  const meta = asRecord(data.metadata as Json | null);
  const runId = meta.mastra_workflow_run_id;
  return typeof runId === "string" && runId.length > 0 ? runId : null;
}
