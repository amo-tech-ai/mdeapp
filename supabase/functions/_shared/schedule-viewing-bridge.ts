import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type ScheduleViewingPayload = {
  listingId: string;
  preferredAt: string;
  tripId?: string | null;
  idempotencyKey?: string | null;
  userId?: string | null;
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  source?: string;
  metadata?: Record<string, unknown>;
};

export type ScheduleViewingResult = {
  leadId: string;
  showingId: string;
  idempotentReplay: boolean;
};

export function parsePreferredShowingAt(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (
    !/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?([zZ]|[+-]\d{2}:\d{2})?)?$/.test(
      trimmed,
    )
  ) {
    return null;
  }
  const withTz = /[zZ]|[+-]\d{2}:\d{2}$/.test(trimmed)
    ? trimmed
    : `${trimmed.length === 16 ? `${trimmed}:00` : trimmed}-05:00`;
  const d = new Date(withTz);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export async function resolveApartmentId(
  client: SupabaseClient,
  listingId: string,
): Promise<string | null> {
  const trimmed = listingId.trim();
  if (!trimmed) return null;

  if (UUID_RE.test(trimmed)) {
    const { data } = await client
      .from("apartments")
      .select("id")
      .eq("id", trimmed)
      .maybeSingle();
    return data?.id ?? null;
  }

  const { data } = await client
    .from("apartments")
    .select("id")
    .eq("slug", trimmed)
    .maybeSingle();
  return data?.id ?? null;
}

async function findExistingSchedule(
  client: SupabaseClient,
  payload: ScheduleViewingPayload,
  apartmentId: string,
  scheduledAt: string,
): Promise<ScheduleViewingResult | null> {
  const { idempotencyKey, userId, email } = payload;
  if (!idempotencyKey || idempotencyKey.length < 8) return null;

  let leadQuery = client
    .from("leads")
    .select("id")
    .eq("idempotency_key", idempotencyKey);

  if (userId) {
    leadQuery = leadQuery.eq("user_id", userId);
  } else if (email) {
    leadQuery = leadQuery.is("user_id", null).eq("email", email);
  } else {
    return null;
  }

  const { data: lead } = await leadQuery.maybeSingle();
  if (!lead?.id) return null;

  const { data: showing } = await client
    .from("showings")
    .select("id")
    .eq("lead_id", lead.id)
    .eq("apartment_id", apartmentId)
    .eq("scheduled_at", scheduledAt)
    .eq("status", "scheduled")
    .maybeSingle();

  if (!showing?.id) return null;

  return {
    leadId: lead.id,
    showingId: showing.id,
    idempotentReplay: true,
  };
}

export async function createScheduleViewingBridge(
  client: SupabaseClient,
  payload: ScheduleViewingPayload,
): Promise<
  | { ok: true; result: ScheduleViewingResult }
  | { ok: false; code: string; message: string }
> {
  const apartmentId = await resolveApartmentId(client, payload.listingId);
  if (!apartmentId) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "listing_id did not resolve to a known apartment",
    };
  }

  const scheduledAt = parsePreferredShowingAt(payload.preferredAt);
  if (!scheduledAt) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "preferred_at must be a valid datetime",
    };
  }

  const existing = await findExistingSchedule(
    client,
    payload,
    apartmentId,
    scheduledAt,
  );
  if (existing) {
    return { ok: true, result: existing };
  }

  const leadRow: Record<string, unknown> = {
    user_id: payload.userId ?? null,
    intent: "rental",
    source: payload.source ?? "form",
    email: payload.email ?? null,
    phone: payload.phone ?? null,
    name: payload.name ?? null,
    apartment_id: apartmentId,
    preferred_showing_at: scheduledAt,
    trip_id: payload.tripId ?? null,
    status: "new",
    pipeline_stage: "showing_scheduled",
    metadata: {
      listing_id: payload.listingId,
      preferred_at: payload.preferredAt,
      ...(payload.metadata ?? {}),
    },
  };

  if (payload.idempotencyKey && payload.idempotencyKey.length >= 8) {
    leadRow.idempotency_key = payload.idempotencyKey;
  }

  const { data: lead, error: leadError } = await client
    .from("leads")
    .insert(leadRow)
    .select("id")
    .single();

  if (leadError || !lead?.id) {
    console.error("[schedule-viewing-bridge] lead insert:", leadError);
    return {
      ok: false,
      code: "DB_ERROR",
      message: "Failed to save lead",
    };
  }

  const { data: showing, error: showingError } = await client
    .from("showings")
    .insert({
      lead_id: lead.id,
      apartment_id: apartmentId,
      scheduled_at: scheduledAt,
      status: "scheduled",
      trip_id: payload.tripId ?? null,
      metadata: {
        source: "chat-lead-capture",
        listing_id: payload.listingId,
      },
    })
    .select("id")
    .single();

  if (showingError || !showing?.id) {
    console.error("[schedule-viewing-bridge] showing insert:", showingError);
    await client.from("leads").delete().eq("id", lead.id);
    return {
      ok: false,
      code: "DB_ERROR",
      message: "Failed to save showing",
    };
  }

  return {
    ok: true,
    result: {
      leadId: lead.id,
      showingId: showing.id,
      idempotentReplay: false,
    },
  };
}

export function isScheduleViewingRequest(
  intent: string,
  listingId: unknown,
  preferredAt: unknown,
): listingId is string {
  return (
    intent === "rental" &&
    typeof listingId === "string" &&
    listingId.trim().length > 0 &&
    typeof preferredAt === "string" &&
    preferredAt.trim().length > 0
  );
}
