/**
 * Supabase Edge best practices (`.cursor/rules/supabase/writing-supabase-edge-functions.mdc`):
 * `Deno.serve`, pinned `npm:` imports, OPTIONS → 204, Zod body validation, JWT + rate limit before work.
 */
import { createClient } from "npm:@supabase/supabase-js@2.101.1";
import { z } from "npm:zod@3.25.76";
import {
  getCorsHeaders,
  errorBody,
  httpStatusFromP1AtomicRpcError,
  jsonResponse,
} from "../_shared/http.ts";
import { allowRate } from "../_shared/rate-limit.ts";

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 30;

const bodySchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("create_lead"),
    neighborhood_id: z.string().uuid().optional().nullable(),
    source: z.string().min(1).max(120).default("web"),
    score: z.number().min(0).max(10).optional().nullable(),
    email: z.string().email().optional().nullable(),
    phone: z.string().max(40).optional().nullable(),
    notes: z.string().max(4000).optional().nullable(),
    metadata: z.record(z.unknown()).optional(),
    /** When set, upserts on (user_id, idempotency_key) — safe retries */
    idempotency_key: z.string().min(8).max(128).optional().nullable(),
  }),
  z.object({
    action: z.literal("schedule_tour_atomic"),
    idempotency_key: z.string().min(8).max(128),
    neighborhood_id: z.string().uuid().optional().nullable(),
    source: z.string().min(1).max(120).default("apartment_tour"),
    email: z.string().email().optional().nullable(),
    phone: z.string().max(40).optional().nullable(),
    notes: z.string().max(4000).optional().nullable(),
    lead_metadata: z.record(z.unknown()).optional(),
    apartment_id: z.string().uuid(),
    scheduled_at: z.string().min(1).max(64),
    renter_notes: z.string().max(2000).optional().nullable(),
    showing_metadata: z.record(z.unknown()).optional(),
  }),
  z.object({
    action: z.literal("start_rental_application_atomic"),
    idempotency_key: z.string().min(8).max(128),
    neighborhood_id: z.string().uuid().optional().nullable(),
    source: z.string().min(1).max(120).default("apartment_application"),
    notes: z.string().max(4000).optional().nullable(),
    lead_metadata: z.record(z.unknown()).optional(),
    apartment_id: z.string().uuid(),
    application_metadata: z.record(z.unknown()).optional(),
  }),
  z.object({
    action: z.literal("record_payment"),
    booking_id: z.string().uuid(),
    amount: z.number().nonnegative(),
    currency: z.string().min(1).max(8).default("USD"),
    stripe_payment_intent_id: z.string().max(200).optional().nullable(),
    status: z
      .enum([
        "pending",
        "processing",
        "succeeded",
        "failed",
        "refunded",
        "canceled",
      ])
      .default("pending"),
    metadata: z.record(z.unknown()).optional(),
  }),
  z.object({
    action: z.literal("schedule_showing"),
    lead_id: z.string().uuid(),
    apartment_id: z.string().uuid(),
    scheduled_at: z.string().min(1).max(64),
    renter_notes: z.string().max(2000).optional().nullable(),
    metadata: z.record(z.unknown()).optional(),
  }),
  z.object({
    action: z.literal("create_rental_application"),
    apartment_id: z.string().uuid(),
    lead_id: z.string().uuid().optional().nullable(),
    metadata: z.record(z.unknown()).optional(),
  }),
]);

Deno.serve(async (req) => {
  const jr = (body: Record<string, unknown>, status = 200) =>
    jsonResponse(body, status, req);

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(req),
    });
  }

  if (req.method !== "POST") {
    return jr(errorBody("METHOD_NOT_ALLOWED", "Use POST"), 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceKey) {
    console.error("p1-crm: missing Supabase env");
    return jr(errorBody("SERVER_CONFIG", "Server misconfigured"), 500);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return jr(errorBody("UNAUTHORIZED", "Missing Bearer token"), 401);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const token = authHeader.replace("Bearer ", "");
  const { data: userData, error: userErr } = await userClient.auth.getUser(token);
  if (userErr || !userData.user) {
    return jr(errorBody("UNAUTHORIZED", "Invalid or expired session"), 401);
  }

  const userId = userData.user.id;
  if (!allowRate(`p1-crm:${userId}`, RATE_MAX, RATE_WINDOW_MS)) {
    return jr(errorBody("RATE_LIMIT", "Too many requests"), 429);
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return jr(errorBody("BAD_REQUEST", "Invalid JSON body"), 400);
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return jr(
      errorBody("VALIDATION_ERROR", "Invalid request", parsed.error.flatten()),
      400,
    );
  }

  const service = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const input = parsed.data;

  try {
    if (input.action === "schedule_tour_atomic") {
      const scheduledAt = new Date(input.scheduled_at);
      if (Number.isNaN(scheduledAt.getTime())) {
        return jr(
          errorBody("VALIDATION_ERROR", "Invalid scheduled_at"),
          400,
        );
      }
      const { data: rpcData, error: rpcErr } = await service.rpc(
        "p1_schedule_tour_atomic",
        {
          p_user_id: userId,
          p_idempotency_key: input.idempotency_key,
          p_neighborhood_id: input.neighborhood_id ?? null,
          p_source: input.source,
          p_email: input.email ?? null,
          p_phone: input.phone ?? null,
          p_notes: input.notes ?? null,
          p_lead_metadata: (input.lead_metadata ?? {}) as Record<string, unknown>,
          p_apartment_id: input.apartment_id,
          p_scheduled_at: scheduledAt.toISOString(),
          p_renter_notes: input.renter_notes ?? null,
          p_showing_metadata: (input.showing_metadata ?? {}) as Record<string, unknown>,
        },
      );
      if (rpcErr) {
        console.error("p1-crm schedule_tour_atomic:", rpcErr);
        const status = httpStatusFromP1AtomicRpcError(rpcErr);
        const errCode = status === 409 ? "CONFLICT" : "DB_ERROR";
        return jr(errorBody(errCode, rpcErr.message, rpcErr), status);
      }
      const payload = rpcData as { lead: unknown; showing: unknown };
      const showing = payload?.showing;
      const showingId =
        showing &&
        typeof showing === "object" &&
        showing !== null &&
        "id" in showing &&
        typeof (showing as { id: unknown }).id === "string" &&
        (showing as { id: string }).id.length > 0
          ? (showing as { id: string }).id
          : null;
      if (!showingId) {
        console.error(
          "p1-crm schedule_tour_atomic: RPC returned no showing id",
          rpcData,
        );
        return jr(
          errorBody(
            "DB_ERROR",
            "Tour schedule did not persist a showing row",
          ),
          500,
        );
      }
      return jr({ success: true as const, data: payload });
    }

    if (input.action === "start_rental_application_atomic") {
      const { data: rpcData, error: rpcErr } = await service.rpc(
        "p1_start_rental_application_atomic",
        {
          p_user_id: userId,
          p_idempotency_key: input.idempotency_key,
          p_neighborhood_id: input.neighborhood_id ?? null,
          p_source: input.source,
          p_notes: input.notes ?? null,
          p_lead_metadata: (input.lead_metadata ?? {}) as Record<string, unknown>,
          p_apartment_id: input.apartment_id,
          p_application_metadata: (input.application_metadata ?? {}) as Record<string, unknown>,
        },
      );
      if (rpcErr) {
        console.error("p1-crm start_rental_application_atomic:", rpcErr);
        const status = httpStatusFromP1AtomicRpcError(rpcErr);
        const errCode = status === 409 ? "CONFLICT" : "DB_ERROR";
        return jr(errorBody(errCode, rpcErr.message, rpcErr), status);
      }
      const payload = rpcData as { lead: unknown; application: unknown };
      return jr({ success: true as const, data: payload });
    }

    if (input.action === "create_lead") {
      if (input.idempotency_key) {
        const { data: existing } = await service
          .from("leads")
          .select()
          .eq("user_id", userId)
          .eq("idempotency_key", input.idempotency_key)
          .maybeSingle();
        if (existing) {
          return jr({ success: true as const, data: existing });
        }
      }

      const { data, error } = await service
        .from("leads")
        .insert({
          user_id: userId,
          neighborhood_id: input.neighborhood_id ?? null,
          source: input.source,
          score: input.score ?? null,
          email: input.email ?? null,
          phone: input.phone ?? null,
          notes: input.notes ?? null,
          metadata: (input.metadata ?? {}) as Record<string, unknown>,
          idempotency_key: input.idempotency_key ?? null,
        })
        .select()
        .single();

      if (error) {
        console.error("p1-crm create_lead:", error);
        return jr(
          errorBody("DB_ERROR", error.message, error),
          500,
        );
      }
      return jr({ success: true as const, data });
    }

    if (input.action === "schedule_showing") {
      const { data: lead, error: leadErr } = await service
        .from("leads")
        .select("id, user_id")
        .eq("id", input.lead_id)
        .maybeSingle();

      if (leadErr || !lead || lead.user_id !== userId) {
        return jr(errorBody("FORBIDDEN", "Lead not found or not yours"), 403);
      }

      const { data: apt, error: aptErr } = await service
        .from("apartments")
        .select("id")
        .eq("id", input.apartment_id)
        .maybeSingle();

      if (aptErr || !apt) {
        return jr(errorBody("NOT_FOUND", "Apartment not found"), 404);
      }

      const { data, error } = await service
        .from("showings")
        .insert({
          lead_id: input.lead_id,
          apartment_id: input.apartment_id,
          scheduled_at: input.scheduled_at,
          status: "scheduled",
          renter_notes: input.renter_notes ?? null,
          metadata: (input.metadata ?? {}) as Record<string, unknown>,
        })
        .select()
        .single();

      if (error) {
        console.error("p1-crm schedule_showing:", error);
        return jr(errorBody("DB_ERROR", error.message, error), 500);
      }
      return jr({ success: true as const, data });
    }

    if (input.action === "create_rental_application") {
      const { data: apt, error: aptErr } = await service
        .from("apartments")
        .select("id")
        .eq("id", input.apartment_id)
        .maybeSingle();

      if (aptErr || !apt) {
        return jr(errorBody("NOT_FOUND", "Apartment not found"), 404);
      }

      if (input.lead_id) {
        const { data: lead, error: leadErr } = await service
          .from("leads")
          .select("id, user_id")
          .eq("id", input.lead_id)
          .maybeSingle();
        if (leadErr || !lead || lead.user_id !== userId) {
          return jr(errorBody("FORBIDDEN", "Lead not found or not yours"), 403);
        }
      }

      const { data, error } = await service
        .from("rental_applications")
        .insert({
          lead_id: input.lead_id ?? null,
          apartment_id: input.apartment_id,
          applicant_id: userId,
          status: "draft",
          metadata: (input.metadata ?? {}) as Record<string, unknown>,
        })
        .select()
        .single();

      if (error) {
        console.error("p1-crm create_rental_application:", error);
        return jr(errorBody("DB_ERROR", error.message, error), 500);
      }
      return jr({ success: true as const, data });
    }

    const { data: booking, error: bErr } = await service
      .from("bookings")
      .select("id, user_id")
      .eq("id", input.booking_id)
      .maybeSingle();

    if (bErr || !booking) {
      return jr(errorBody("NOT_FOUND", "Booking not found"), 404);
    }
    if (booking.user_id !== userId) {
      return jr(errorBody("FORBIDDEN", "Not your booking"), 403);
    }

    const { data, error } = await service
      .from("payments")
      .insert({
        booking_id: input.booking_id,
        amount: input.amount,
        currency: input.currency,
        stripe_payment_intent_id: input.stripe_payment_intent_id ?? null,
        status: input.status,
        metadata: (input.metadata ?? {}) as Record<string, unknown>,
      })
      .select()
      .single();

    if (error) {
      console.error("p1-crm record_payment:", error);
      return jr(
        errorBody("DB_ERROR", error.message, error),
        500,
      );
    }
    return jr({ success: true as const, data });
  } catch (e) {
    console.error("p1-crm:", e);
    return jr(
      errorBody("INTERNAL", e instanceof Error ? e.message : "Unexpected error"),
      500,
    );
  }
});
