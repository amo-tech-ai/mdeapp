/**
 * ticket-checkout — Phase 1 events (revenue-unlocking edge fn).
 *
 * Receives a ticket-purchase request, atomically:
 *   1. Checks ticket capacity (qty_sold + qty_pending + quantity <= qty_total)
 *      AND increments qty_pending so a parallel checkout sees fewer slots
 *   2. Creates a `pending` order with ticket_id + quantity + access_token
 *   3. Creates N `pending` attendee rows with caller-provided UUIDs +
 *      pre-signed QR JWTs (JWT.attendee_id always == event_attendees.id)
 * — then opens a Stripe Checkout Session referencing only `order_id` in
 * payment_intent_data.metadata. The webhook (task 005) finalises:
 *   - flips order status pending → paid
 *   - flips attendees status pending → active
 *   - increments qty_sold + decrements qty_pending
 *
 * Auth: optional. Anonymous purchase allowed (buyer_email + access_token
 * carry identity). verify_jwt = false in supabase/config.toml for this fn.
 *
 * Idempotency: uses the existing `idempotency_keys` table — same key →
 * same Stripe URL on replay. Required for buyer-side network retries to
 * avoid double-creating orders + double-billing.
 *
 * Audit fixes implemented:
 *   B1 — Stripe metadata only carries { order_id }; no PII, no attendees array.
 *   B2 — order persists ticket_id + quantity so the webhook knows what to
 *        finalise.
 *   R6 — attendee UUIDs generated in JS *first*, then JWTs signed with
 *        those UUIDs, then INSERT-ed → JWT.attendee_id and row PK always
 *        match.
 *   #3 — qty_pending column increments at checkout, decrements on
 *        webhook finalize (or cancel). Prevents 50-concurrent-buyer
 *        oversell.
 */
import Stripe from "https://esm.sh/stripe@14.21.0?target=denonext";
import { z } from "https://esm.sh/zod@3.23.8";
import { errorBody, getCorsHeaders, jsonResponse } from "../_shared/http.ts";
import { getServiceClient } from "../_shared/supabase-clients.ts";
import { signJwtHs256 } from "../_shared/jwt.ts";
// Initialise Stripe lazily so a missing key is reported via 500 CONFIG_ERROR
// rather than crashing the function on cold-start before headers are sent.
let _stripe: Stripe | null = null;
function getStripe(): Stripe | null {
  if (_stripe) return _stripe;
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (!key) return null;
  _stripe = new Stripe(key, {
    apiVersion: "2026-04-22.dahlia",
    httpClient: Stripe.createFetchHttpClient(),
  });
  return _stripe;
}
// Zod schema. quantity 1-10 enforced both here and in the RPC's
// min_per_order/max_per_order check; client-side errors return 400 fast,
// server-side guarantees the truth.
const AttendeeSchema = z.object({
  email: z.string().email().max(120),
  full_name: z.string().min(1).max(120),
});
const RequestSchema = z.object({
  event_id: z.string().uuid(),
  ticket_id: z.string().uuid(),
  quantity: z.number().int().min(1).max(10),
  buyer_email: z.string().email().max(120),
  buyer_name: z.string().min(1).max(120),
  attendees: z.array(AttendeeSchema).min(1).max(10),
  idempotency_key: z.string().uuid(),
  return_url_success: z.string().url().max(500),
  return_url_cancel: z.string().url().max(500),
});
const ENDPOINT = "ticket-checkout";
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: getCorsHeaders(req),
    });
  }
  if (req.method !== "POST") {
    return jsonResponse(errorBody("METHOD_NOT_ALLOWED", "Use POST"), 405, req);
  }
  // 1. Parse + validate body. Reject malformed first (no DB calls yet).
  let body;
  try {
    body = RequestSchema.parse(await req.json());
  } catch (err) {
    return jsonResponse(
      errorBody(
        "INVALID_PAYLOAD",
        "Request payload didn't validate",
        err instanceof z.ZodError ? err.flatten() : String(err),
      ),
      400,
      req,
    );
  }
  if (body.attendees.length !== body.quantity) {
    return jsonResponse(
      errorBody(
        "ATTENDEES_MISMATCH",
        "attendees array length must equal quantity",
      ),
      400,
      req,
    );
  }
  // 2. Idempotency check — return cached response on replay (per skill
  //    `supabase-edge-functions` §"Performance Tips" + `edge-function-patterns.md`).
  const service = getServiceClient();
  {
    const { data: cached } = await service.from("idempotency_keys").select(
      "response",
    ).eq("key", body.idempotency_key).eq("endpoint", ENDPOINT).maybeSingle();
    if (cached?.response) {
      return jsonResponse(cached.response, 200, req);
    }
  }
  // 3. Pre-mint UUIDs + sign JWTs in JS BEFORE the RPC call.
  //    Each attendee gets its real PK now, so JWT.attendee_id == event_attendees.id always.
  const qrSecret = Deno.env.get("QR_SIGNING_SECRET");
  if (!qrSecret) {
    console.error("QR_SIGNING_SECRET is not configured");
    return jsonResponse(
      errorBody("CONFIG_ERROR", "Server is missing required secret"),
      500,
      req,
    );
  }
  const stripe = getStripe();
  if (!stripe) {
    console.error("STRIPE_SECRET_KEY is not configured");
    return jsonResponse(
      errorBody("CONFIG_ERROR", "Server is missing Stripe credentials"),
      500,
      req,
    );
  }
  const accessToken = crypto.randomUUID().replaceAll("-", ""); // 32-char hex
  const nowSec = Math.floor(Date.now() / 1000);
  const attendeesWithJwts = await Promise.all(body.attendees.map(async (a) => {
    const id = crypto.randomUUID();
    const qr_token = await signJwtHs256({
      attendee_id: id,
      event_id: body.event_id,
      iat: nowSec,
    }, qrSecret);
    return {
      id,
      email: a.email,
      full_name: a.full_name,
      qr_token,
    };
  }));
  // 4. Atomic RPC: capacity check + create pending order + create pending attendees.
  //    The RPC does pg_advisory_xact_lock(event_id) + FOR UPDATE on the ticket row +
  //    qty_sold+qty_pending+quantity check. This is the oversell guard.
  const { data: rpcDataRaw, error: rpcError } = await service.rpc(
    "ticket_checkout_create_pending",
    {
      p_event_id: body.event_id,
      p_ticket_id: body.ticket_id,
      p_quantity: body.quantity,
      p_buyer_email: body.buyer_email,
      p_buyer_name: body.buyer_name,
      p_access_token: accessToken,
      p_attendees: attendeesWithJwts,
    },
  );
  if (rpcError) {
    // RPC raises EXCEPTION with a known code in the message; surface it verbatim.
    const msg = rpcError.message ?? "";
    const code = msg.match(/[A-Z][A-Z_]+/)?.[0] ?? "RPC_ERROR";
    const httpStatus = code === "OUT_OF_STOCK" ? 409 : 400;
    console.error(`ticket-checkout RPC error: ${code}`, rpcError);
    return jsonResponse(errorBody(code, msg), httpStatus, req);
  }
  const rpcData = rpcDataRaw;
  // 5. Create Stripe Checkout Session.
  //    METADATA: only order_id on payment_intent_data. The webhook reads
  //    everything else from the DB via that order_id (audit B1 fix).
  let session;
  try {
    session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        // Explicit card for COP — avoids dashboard "automatic methods" gaps in test/live.
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              // Phase 1 = COP only (CHECK constraint on event_tickets.currency
              // enforces this). When we extend to USD/MXN, surface currency
              // from the RPC return value and pass through here.
              currency: "cop",
              product_data: {
                name: `${rpcData.ticket_name} — ${rpcData.event_name}`,
                description: `${body.quantity} × ${rpcData.ticket_name}`,
              },
              unit_amount: rpcData.price_cents,
            },
            quantity: body.quantity,
          },
        ],
        customer_email: body.buyer_email,
        success_url: body.return_url_success,
        cancel_url: body.return_url_cancel,
        payment_intent_data: {
          metadata: {
            order_id: rpcData.order_id,
          },
        },
        metadata: {
          order_id: rpcData.order_id,
        },
      },
      { idempotencyKey: body.idempotency_key },
    );
  } catch (stripeErr) {
    // Stripe failure → cancel the pending RPC so qty_pending decrements
    // and the slots are immediately released. Otherwise capacity stays
    // locked until the cleanup cron runs.
    console.error("Stripe checkout session create failed:", stripeErr);
    try {
      await service.rpc("ticket_checkout_cancel", {
        p_order_id: rpcData.order_id,
      });
    } catch (cancelErr) {
      console.error("Cancel-after-Stripe-error failed:", cancelErr);
    }
    return jsonResponse(
      errorBody(
        "STRIPE_ERROR",
        "Failed to create payment session",
        stripeErr instanceof Error ? stripeErr.message : String(stripeErr),
      ),
      502,
      req,
    );
  }
  // 6. Persist stripe_session_id (best-effort — webhook still works via metadata.order_id).
  await service.from("event_orders").update({
    stripe_session_id: session.id,
  }).eq("id", rpcData.order_id);
  // 7. Cache idempotency response.
  const result = {
    success: true,
    data: {
      stripe_session_url: session.url ?? "",
      order_id: rpcData.order_id,
      short_id: rpcData.short_id,
      access_token: accessToken,
    },
  };
  const { error: idemWriteErr } = await service.from("idempotency_keys").upsert(
    {
      key: body.idempotency_key,
      endpoint: ENDPOINT,
      response: result,
    },
    { onConflict: "key" },
  );
  if (idemWriteErr) {
    console.error("ticket-checkout: idempotency_keys upsert failed", idemWriteErr);
  }
  return jsonResponse(result, 200, req);
});
