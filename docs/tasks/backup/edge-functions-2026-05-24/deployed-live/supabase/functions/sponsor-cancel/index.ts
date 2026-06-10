/**
 * sponsor-cancel — Cancel or dispute a sponsor contract, or resolve a dispute (admin).
 *
 * Auth:
 *   cancel_within_window | dispute → Bearer JWT (must be the contract's sponsor_user_id)
 *   admin_resolve_cancel | admin_resolve_dispute → Authorization === service role key (via getServiceKey())
 *
 * Input:  { application_id: string, action: string, admin_note?: string, partial_refund_cents?: number }
 * Output: { success: true, data: { ... } }
 *         { success: false, error: { code, message } }
 *
 * verify_jwt = false (we validate auth manually per action type)
 */

import { getCorsHeaders, jsonResponse, errorBody } from "../_shared/http.ts";
import { getServiceClient, getServiceKey, getUserId } from "../_shared/supabase-clients.ts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RequestBody {
  application_id: string;
  action: string;
  admin_note?: string;
  partial_refund_cents?: number;
}

interface ContractRow {
  id: string;
  application_id: string;
  sponsor_user_id: string;
  status: string;
  sponsor_signed_at: string | null;
  cancellation_window_days: number;
  agreed_amount_cents: number;
  stripe_payment_intent?: string | null;
}

interface InvoiceRow {
  id: string;
  stripe_payment_intent: string | null;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const VALID_ACTIONS = new Set([
  "cancel_within_window",
  "dispute",
  "admin_resolve_cancel",
  "admin_resolve_dispute",
]);

const ADMIN_ACTIONS = new Set(["admin_resolve_cancel", "admin_resolve_dispute"]);
const USER_ACTIONS = new Set(["cancel_within_window", "dispute"]);

// ---------------------------------------------------------------------------
// Stripe refund helper (no-op when STRIPE_SECRET_KEY absent)
// ---------------------------------------------------------------------------

async function issueStripeRefund(
  paymentIntentId: string,
  amountCents?: number,
): Promise<boolean> {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) return false; // signal "not configured"

  const body: Record<string, string> = { payment_intent: paymentIntentId };
  if (amountCents && amountCents > 0) {
    body.amount = String(amountCents);
  }

  const res = await fetch("https://api.stripe.com/v1/refunds", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body).toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[sponsor-cancel] Stripe refund failed:", text);
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  // ── Parse body ──────────────────────────────────────────────────────────────
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return jsonResponse(errorBody("BAD_REQUEST", "Request body must be valid JSON"), 400, req);
  }

  const { application_id, action, admin_note, partial_refund_cents } = body;

  if (!application_id || !UUID_RE.test(application_id)) {
    return jsonResponse(
      errorBody("BAD_REQUEST", "application_id must be a valid UUID"),
      400,
      req,
    );
  }

  if (!action || !VALID_ACTIONS.has(action)) {
    return jsonResponse(
      errorBody(
        "BAD_REQUEST",
        `action must be one of: ${[...VALID_ACTIONS].join(", ")}`,
      ),
      400,
      req,
    );
  }

  void admin_note; // acknowledged — stored in future audit log if needed

  const authHeader = req.headers.get("Authorization") ?? "";
  const db = getServiceClient();
  const sponsorDb = (db as unknown as { schema: (s: string) => typeof db }).schema(
    "sponsor" as never,
  );

  // ── Auth gate ───────────────────────────────────────────────────────────────
  if (ADMIN_ACTIONS.has(action)) {
    // Admin actions: Authorization must equal the service role key
    const bearerToken = authHeader.replace("Bearer ", "");
    if (!bearerToken || bearerToken !== getServiceKey()) {
      return jsonResponse(errorBody("FORBIDDEN", "Admin action requires service role key"), 403, req);
    }
  } else if (USER_ACTIONS.has(action)) {
    // User actions: require valid JWT
    if (!authHeader) {
      return jsonResponse(errorBody("UNAUTHORIZED", "Missing Authorization header"), 401, req);
    }
  }

  // ── Load contract ───────────────────────────────────────────────────────────
  const { data: contract, error: contractErr } = await sponsorDb
    .from("contracts")
    .select(
      "id, application_id, sponsor_user_id, status, sponsor_signed_at, cancellation_window_days, agreed_amount_cents",
    )
    .eq("application_id", application_id)
    .maybeSingle() as { data: ContractRow | null; error: unknown };

  if (contractErr || !contract) {
    return jsonResponse(
      errorBody("NOT_FOUND", "Contract not found for this application"),
      404,
      req,
    );
  }

  // ── Dispatch by action ──────────────────────────────────────────────────────

  // ── cancel_within_window ────────────────────────────────────────────────────
  if (action === "cancel_within_window") {
    // Verify caller is the sponsor
    const callerId = await getUserId(authHeader);
    if (!callerId || callerId !== contract.sponsor_user_id) {
      return jsonResponse(
        errorBody("FORBIDDEN", "Only the sponsoring user may cancel this contract"),
        403,
        req,
      );
    }

    // Status check
    if (!["signed", "active"].includes(contract.status)) {
      return jsonResponse(
        errorBody(
          "BAD_REQUEST",
          `Contract status '${contract.status}' is not cancellable`,
        ),
        400,
        req,
      );
    }

    // Window check
    if (!contract.sponsor_signed_at) {
      return jsonResponse(
        errorBody("BAD_REQUEST", "Contract has not been signed yet"),
        400,
        req,
      );
    }
    const signedMs = new Date(contract.sponsor_signed_at).getTime();
    const windowMs = contract.cancellation_window_days * 86_400_000;
    if (Date.now() - signedMs > windowMs) {
      return jsonResponse(
        errorBody(
          "CANCELLATION_WINDOW_EXPIRED",
          `Cancellation window of ${contract.cancellation_window_days} days has passed`,
        ),
        400,
        req,
      );
    }

    // Cancel contract + deactivate placements
    await sponsorDb
      .from("contracts")
      .update({ status: "cancelled" })
      .eq("application_id", application_id);

    await sponsorDb
      .from("placements")
      .update({ active: false })
      .eq("application_id", application_id);

    // Attempt Stripe refund; fall back to refund_pending flag
    const { data: invoice } = await sponsorDb
      .from("invoices")
      .select("id, stripe_payment_intent")
      .eq("application_id", application_id)
      .maybeSingle() as { data: InvoiceRow | null };

    if (invoice) {
      const stripeOk = invoice.stripe_payment_intent
        ? await issueStripeRefund(invoice.stripe_payment_intent)
        : false;

      if (!stripeOk) {
        await sponsorDb
          .from("invoices")
          .update({ refund_pending: true })
          .eq("id", invoice.id);
      }
    }

    return jsonResponse({ success: true, data: { refunded: true } }, 200, req);
  }

  // ── dispute ─────────────────────────────────────────────────────────────────
  if (action === "dispute") {
    const callerId = await getUserId(authHeader);
    if (!callerId || callerId !== contract.sponsor_user_id) {
      return jsonResponse(
        errorBody("FORBIDDEN", "Only the sponsoring user may dispute this contract"),
        403,
        req,
      );
    }

    if (!["signed", "active"].includes(contract.status)) {
      return jsonResponse(
        errorBody(
          "BAD_REQUEST",
          `Contract status '${contract.status}' cannot be disputed`,
        ),
        400,
        req,
      );
    }

    await sponsorDb
      .from("contracts")
      .update({ status: "disputed" })
      .eq("application_id", application_id);

    await sponsorDb
      .from("applications")
      .update({ dispute_freeze: true })
      .eq("id", application_id);

    return jsonResponse({ success: true, data: { status: "disputed" } }, 200, req);
  }

  // ── admin_resolve_cancel ────────────────────────────────────────────────────
  if (action === "admin_resolve_cancel") {
    await sponsorDb
      .from("contracts")
      .update({ status: "cancelled" })
      .eq("application_id", application_id);

    await sponsorDb
      .from("placements")
      .update({ active: false })
      .eq("application_id", application_id);

    // Optional partial refund via Stripe, else flag refund_pending
    const { data: invoice } = await sponsorDb
      .from("invoices")
      .select("id, stripe_payment_intent")
      .eq("application_id", application_id)
      .maybeSingle() as { data: InvoiceRow | null };

    if (invoice) {
      let refundIssued = false;
      if (invoice.stripe_payment_intent && partial_refund_cents && partial_refund_cents > 0) {
        refundIssued = await issueStripeRefund(
          invoice.stripe_payment_intent,
          partial_refund_cents,
        );
      }
      if (!refundIssued) {
        await sponsorDb
          .from("invoices")
          .update({ refund_pending: true })
          .eq("id", invoice.id);
      }
    }

    await sponsorDb
      .from("applications")
      .update({ dispute_freeze: false })
      .eq("id", application_id);

    return jsonResponse({ success: true, data: { action: "admin_resolve_cancel" } }, 200, req);
  }

  // ── admin_resolve_dispute ───────────────────────────────────────────────────
  if (action === "admin_resolve_dispute") {
    await sponsorDb
      .from("contracts")
      .update({ status: "active" })
      .eq("application_id", application_id);

    await sponsorDb
      .from("applications")
      .update({ dispute_freeze: false })
      .eq("id", application_id);

    return jsonResponse(
      { success: true, data: { action: "admin_resolve_dispute" } },
      200,
      req,
    );
  }

  // Should never reach here given VALID_ACTIONS guard above
  return jsonResponse(errorBody("BAD_REQUEST", "Unknown action"), 400, req);
});
