/**
 * ticket-payment-webhook — Stripe webhook receiver (Phase 1 events).
 *
 * Subscribed events (configure all in Stripe Dashboard):
 *   - checkout.session.completed → ticket_payment_finalize (primary Checkout path)
 *   - checkout.session.async_payment_succeeded → ticket_payment_finalize (delayed methods)
 *   - checkout.session.expired → ticket_checkout_cancel (release qty_pending)
 *   - payment_intent.succeeded → ticket_payment_finalize (idempotent if session event also fires)
 *   - charge.refunded → ticket_payment_refund RPC
 *
 * Auth: Stripe signature verification ONLY. No Supabase JWT — Stripe doesn't
 * send one. `verify_jwt = false` in supabase/config.toml.
 *
 * Idempotency: Stripe retries up to 3 days on 5xx. We dedupe on `event.id`
 * via the existing `idempotency_keys` table — same event.id → 200 OK no-op.
 *
 * Audit fixes implemented:
 *   B1 — Reads ONLY `pi.metadata.order_id`; everything else from DB.
 *   R4 — Single SECURITY DEFINER RPC handles flip+attendees+qty in one txn.
 *   R5 — `charge.payment_intent` accessed correctly as a string|object.
 *   R6 — Attendees already created in checkout with caller-provided UUIDs +
 *        QR JWTs; webhook just flips their status.
 *
 * PDF + email (HE-3 react-pdf MIT + SendGrid) are PHASE-1.5 best-effort:
 *   - If SENDGRID_API_KEY is unset, we skip email silently and return 200.
 *   - Buyers retrieve tickets via /me/tickets/<order_id>?token=<access>
 *     (task 008) regardless. The email is delight, not the source of truth.
 */
import Stripe from "https://esm.sh/stripe@14.21.0?target=denonext";
import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { errorBody, getCorsHeaders, jsonResponse } from "../_shared/http.ts";
import { getServiceClient } from "../_shared/supabase-clients.ts";
// Lazy Stripe init so missing-key configurations surface as 500 CONFIG_ERROR
// rather than crashing on cold-start before headers are sent.
let _stripe: Stripe | null = null;
interface TicketFinalizeData {
  order?: {
    id?: string;
    access_token?: string;
    buyer_email?: string;
    short_id?: string | null;
  };
  event?: {
    name?: string;
    address?: string | null;
  };
  attendees?: unknown[];
}

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
const ENDPOINT = "ticket-payment-webhook";
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: getCorsHeaders(req),
    });
  }
  if (req.method !== "POST") {
    return jsonResponse(errorBody("METHOD_NOT_ALLOWED", "Use POST"), 405, req);
  }
  const stripe = getStripe();
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripe || !webhookSecret) {
    console.error(
      "ticket-payment-webhook: missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET",
    );
    return jsonResponse(
      errorBody("CONFIG_ERROR", "Server is missing Stripe credentials"),
      500,
      req,
    );
  }
  // 1. Verify Stripe signature using the RAW body. We MUST NOT call req.json()
  //    before this — JSON-parsing-and-re-stringifying changes whitespace and
  //    breaks the HMAC verification.
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return jsonResponse(
      errorBody("BAD_SIGNATURE", "Missing stripe-signature header"),
      400,
      req,
    );
  }
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      sig,
      webhookSecret,
    );
  } catch (err) {
    console.error(
      "ticket-payment-webhook: signature verification failed",
      err instanceof Error ? err.message : err,
    );
    return jsonResponse(
      errorBody("BAD_SIGNATURE", "Stripe signature did not match"),
      400,
      req,
    );
  }
  // 2. Idempotency — Stripe retries on 5xx. Same event.id = no-op success.
  const service = getServiceClient();
  const idemKey = `stripe_${event.id}`;
  {
    const { data: cached } = await service.from("idempotency_keys").select(
      "response",
    ).eq("key", idemKey).eq("endpoint", ENDPOINT).maybeSingle();
    if (cached?.response) {
      return jsonResponse(
        {
          success: true,
          replayed: true,
        },
        200,
        req,
      );
    }
  }
  // 3. Branch on event type.
  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      await handleCheckoutSessionPaid(
        event.data.object as Stripe.Checkout.Session,
        service,
      );
    } else if (event.type === "checkout.session.expired") {
      await handleCheckoutSessionExpired(
        event.data.object as Stripe.Checkout.Session,
        service,
      );
    } else if (event.type === "payment_intent.succeeded") {
      await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent, service);
    } else if (event.type === "charge.refunded") {
      await handleRefund(event.data.object as Stripe.Charge, service);
    } else {
      // Unsubscribed event types: 200 OK so Stripe stops retrying. Logged for
      // observability but not an error.
      console.log(
        `ticket-payment-webhook: ignoring unsubscribed event type ${event.type}`,
      );
    }
  } catch (err) {
    console.error("ticket-payment-webhook: handler failed", {
      event_id: event.id,
      err: err instanceof Error ? err.message : err,
    });
    // 500 → Stripe retries with exponential backoff (up to 3 days).
    return jsonResponse(
      errorBody(
        "HANDLER_FAILED",
        err instanceof Error ? err.message : "Unknown handler error",
      ),
      500,
      req,
    );
  }
  // 4. Cache the (small) success response so retries within the 3-day window
  //    short-circuit at step 2.
  const { error: idemWriteErr } = await service.from("idempotency_keys").upsert(
    {
      key: idemKey,
      endpoint: ENDPOINT,
      response: {
        success: true,
        event_type: event.type,
      },
    },
    { onConflict: "key" },
  );
  if (idemWriteErr) {
    console.error("ticket-payment-webhook: idempotency_keys upsert failed", idemWriteErr);
  }
  return jsonResponse(
    {
      success: true,
      event_id: event.id,
    },
    200,
    req,
  );
});
function paymentIntentIdFromSession(session: Stripe.Checkout.Session): string | null {
  if (typeof session.payment_intent === "string") return session.payment_intent;
  return session.payment_intent?.id ?? null;
}

async function finalizePaidOrder(
  orderId: string,
  paymentIntentId: string,
  service: SupabaseClient,
) {
  const { data, error } = await service.rpc("ticket_payment_finalize", {
    p_order_id: orderId,
    p_payment_intent_id: paymentIntentId,
  });
  if (error) {
    const msg = error.message ?? "";
    if (msg.includes("ORDER_NOT_FOUND") || msg.includes("ORDER_BAD_STATE")) {
      console.error(
        `ticket_payment_finalize: ${msg} for order=${orderId} pi=${paymentIntentId}`,
      );
      return;
    }
    throw new Error(`ticket_payment_finalize failed: ${msg}`);
  }
  try {
    await maybeSendTicketEmail(data as TicketFinalizeData | null);
  } catch (emailErr) {
    console.error(
      "ticket-payment-webhook: email send failed; tickets remain accessible via /me/tickets",
      emailErr,
    );
  }
}

async function handleCheckoutSessionPaid(
  session: Stripe.Checkout.Session,
  service: SupabaseClient,
) {
  const orderId = session.metadata?.order_id;
  if (!orderId) {
    console.log(
      `checkout session paid missing order_id; ignoring session=${session.id}`,
    );
    return;
  }
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    console.log(
      `checkout session not paid yet; session=${session.id} status=${session.payment_status}`,
    );
    return;
  }
  const piId = paymentIntentIdFromSession(session);
  if (!piId) {
    console.log(
      `checkout session paid missing payment_intent; session=${session.id}`,
    );
    return;
  }
  await finalizePaidOrder(orderId, piId, service);
}

async function handleCheckoutSessionExpired(
  session: Stripe.Checkout.Session,
  service: SupabaseClient,
) {
  const orderId = session.metadata?.order_id;
  if (!orderId) {
    console.log(
      `checkout.session.expired missing order_id; ignoring session=${session.id}`,
    );
    return;
  }
  const { error } = await service.rpc("ticket_checkout_cancel", {
    p_order_id: orderId,
  });
  if (error) {
    const msg = error.message ?? "";
    if (msg.includes("ORDER_NOT_FOUND") || msg.includes("ORDER_NOT_PENDING")) {
      console.error(
        `ticket_checkout_cancel (expired): ${msg} order=${orderId}`,
      );
      return;
    }
    throw new Error(`ticket_checkout_cancel failed: ${msg}`);
  }
}

async function handlePaymentSucceeded(pi: Stripe.PaymentIntent, service: SupabaseClient) {
  const orderId = pi.metadata?.order_id;
  if (!orderId) {
    console.log(
      `payment_intent.succeeded had no order_id metadata; ignoring pi=${pi.id}`,
    );
    return;
  }
  await finalizePaidOrder(orderId, pi.id, service);
}
async function handleRefund(charge: Stripe.Charge, service: SupabaseClient) {
  // R5 fix: charge.payment_intent is `string | Stripe.PaymentIntent | null`.
  const piId = typeof charge.payment_intent === "string"
    ? charge.payment_intent
    : charge.payment_intent?.id ?? null;
  if (!piId) {
    console.log(
      `charge.refunded had no payment_intent; ignoring charge=${charge.id}`,
    );
    return;
  }
  // Look up the order via the stored stripe_payment_intent (indexed in 001).
  const { data: order, error: lookupErr } = await service.from("event_orders")
    .select("id").eq("stripe_payment_intent", piId).maybeSingle();
  if (lookupErr) {
    throw new Error(`Order lookup failed: ${lookupErr.message}`);
  }
  if (!order) {
    console.log(
      `charge.refunded: no order for pi=${piId}; manual reconcile required`,
    );
    return;
  }
  const { error } = await service.rpc("ticket_payment_refund", {
    p_order_id: order.id,
  });
  if (error) {
    const msg = error.message ?? "";
    if (msg.includes("ORDER_NOT_REFUNDABLE")) {
      console.error(
        `ticket_payment_refund: ${msg} for order=${order.id} pi=${piId}`,
      );
      return;
    }
    throw new Error(`ticket_payment_refund failed: ${msg}`);
  }
}
// ---------------------------------------------------------------------------
// Email — best-effort; skipped silently when SENDGRID_API_KEY is unset.
// PDF rendering is deferred to Phase 1.5 (HE-3 react-pdf integration).
// ---------------------------------------------------------------------------
async function maybeSendTicketEmail(finalizeData: TicketFinalizeData | null) {
  const sendgridKey = Deno.env.get("SENDGRID_API_KEY");
  if (!sendgridKey) return; // Phase 1.5 — buyers retrieve tickets via /me/tickets
  const data = finalizeData;
  if (!data?.order?.buyer_email || !data?.event?.name) return;
  const ticketsUrl =
    `https://mdeai.co/me/tickets/${data.order.id}?token=${data.order.access_token}`;
  const html = `
    <h2>Your tickets — ${escapeHtml(data.event.name)}</h2>
    <p>Order: <strong>${escapeHtml(data.order.short_id ?? "")}</strong></p>
    <p>${
    escapeHtml(String(data.attendees?.length ?? 0))
  } ticket(s) confirmed.</p>
    <p>View your QR codes any time: <a href="${ticketsUrl}">${ticketsUrl}</a></p>
    <p style="color:#888;font-size:12px">${
    escapeHtml(data.event.address ?? "")
  }</p>
  `;
  const body = {
    personalizations: [
      {
        to: [
          {
            email: data.order.buyer_email,
          },
        ],
      },
    ],
    from: {
      email: "tickets@mdeai.co",
      name: "mdeai Events",
    },
    subject: `Your ticket: ${data.event.name}`,
    content: [
      {
        type: "text/html",
        value: html,
      },
    ],
  };
  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sendgridKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SendGrid ${res.status}: ${text}`);
  }
}
function escapeHtml(s: string) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(
    ">",
    "&gt;",
  ).replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
