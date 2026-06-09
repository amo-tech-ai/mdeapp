/**
 * sponsor-checkout — creates a Stripe Checkout session for an approved sponsor application.
 *
 * Auth: Bearer JWT required (caller must be org's primary_contact_user_id)
 * Body: { application_id: string }
 * Returns: { success: true, data: { checkout_url: string } }
 *
 * Idempotent: returns existing Stripe session URL if invoice already exists with an
 * unpaid stripe_session_id (avoids creating duplicate sessions on re-submit).
 * Logs to ai_runs.
 */

import Stripe from "https://esm.sh/stripe@14.21.0?target=denonext";
import { z } from "https://esm.sh/zod@3.23.8";
import {
  errorBody,
  getCorsHeaders,
  jsonResponse,
} from "../_shared/http.ts";
import { getServiceClient, getUserId } from "../_shared/supabase-clients.ts";

// ---------------------------------------------------------------------------
// Stripe — lazy init so a missing key surfaces as 500 CONFIG_ERROR rather
// than crashing the function on cold-start before headers are sent.
// ---------------------------------------------------------------------------

let _stripe: Stripe | null = null;
function getStripe(): Stripe | null {
  if (_stripe) return _stripe;
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (!key) return null;
  _stripe = new Stripe(key, {
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient(),
  });
  return _stripe;
}

// ---------------------------------------------------------------------------
// Request schema
// ---------------------------------------------------------------------------

const RequestSchema = z.object({
  application_id: z.string().uuid(),
});

type RequestBody = z.infer<typeof RequestSchema>;

// ---------------------------------------------------------------------------
// DB row shapes (service-client queries return unknown rows)
// ---------------------------------------------------------------------------

interface ApplicationRow {
  id: string;
  organization_id: string;
  tier: string;
  event_id: string;
  flat_price_cents: number;
  status: string;
}

interface OrganizationRow {
  id: string;
  primary_contact_user_id: string;
}

interface InvoiceRow {
  id: string;
  stripe_session_id: string;
  status: string;
}

// ---------------------------------------------------------------------------
// Helper: schema-aware query wrapper
// The Supabase JS client v2 doesn't expose a typed `.schema()` method, so we
// cast through `unknown` to access the underlying `schema` call that the
// generated client supports at runtime.
// ---------------------------------------------------------------------------

type AnyClient = ReturnType<typeof getServiceClient>;

function sponsorSchema(client: AnyClient) {
  // At runtime, Supabase JS v2 SupabaseClient has `.schema()` available.
  // TypeScript's generated types don't reflect it, so we cast narrowly.
  return (client as unknown as { schema: (s: string) => AnyClient }).schema(
    "sponsor",
  );
}

// ---------------------------------------------------------------------------
// Helper: log to ai_runs (best-effort — failure must not break the response)
// ---------------------------------------------------------------------------

async function logAiRun(
  service: AnyClient,
  status: "success" | "error",
  durationMs: number,
  errorMessage?: string,
): Promise<void> {
  try {
    await service.from("ai_runs").insert({
      agent_name: "sponsor-checkout",
      input_tokens: 0,
      output_tokens: 0,
      duration_ms: durationMs,
      status,
      ...(errorMessage ? { error_message: errorMessage } : {}),
    });
  } catch (logErr) {
    console.error("sponsor-checkout: ai_runs log failed", logErr);
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }
  if (req.method !== "POST") {
    return jsonResponse(errorBody("METHOD_NOT_ALLOWED", "Use POST"), 405, req);
  }

  const startMs = Date.now();

  // 1. Auth — require valid JWT.
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse(
      errorBody("UNAUTHORIZED", "Missing Authorization header"),
      401,
      req,
    );
  }

  const userId = await getUserId(authHeader);
  if (!userId) {
    return jsonResponse(
      errorBody("UNAUTHORIZED", "Invalid or expired token"),
      401,
      req,
    );
  }

  // 2. Parse + validate body.
  let body: RequestBody;
  try {
    body = RequestSchema.parse(await req.json());
  } catch (err) {
    return jsonResponse(
      errorBody(
        "INVALID_PAYLOAD",
        "Request payload did not validate",
        err instanceof z.ZodError ? err.flatten() : String(err),
      ),
      400,
      req,
    );
  }

  const { application_id } = body;
  const service = getServiceClient();
  const db = sponsorSchema(service);

  // 3. Load the application from sponsor.applications.
  const { data: appRaw, error: appErr } = await db
    .from("applications")
    .select("id, organization_id, tier, event_id, flat_price_cents, status")
    .eq("id", application_id)
    .maybeSingle();

  if (appErr) {
    console.error("sponsor-checkout: application lookup failed", appErr);
    return jsonResponse(
      errorBody("DB_ERROR", "Failed to load application", appErr.message),
      500,
      req,
    );
  }

  if (!appRaw) {
    return jsonResponse(
      errorBody("NOT_FOUND", "Application not found"),
      404,
      req,
    );
  }

  const application = appRaw as ApplicationRow;

  if (application.status !== "approved") {
    return jsonResponse(
      errorBody(
        "APPLICATION_NOT_APPROVED",
        `Application status is '${application.status}'; only 'approved' applications can proceed to payment`,
      ),
      409,
      req,
    );
  }

  if (!application.flat_price_cents || application.flat_price_cents <= 0) {
    return jsonResponse(
      errorBody(
        "PRICE_NOT_SET",
        "Application has no flat_price_cents set; contact admin",
      ),
      409,
      req,
    );
  }

  // 4. Load organization and verify caller owns it.
  const { data: orgRaw, error: orgErr } = await db
    .from("organizations")
    .select("id, primary_contact_user_id")
    .eq("id", application.organization_id)
    .maybeSingle();

  if (orgErr) {
    console.error("sponsor-checkout: organization lookup failed", orgErr);
    return jsonResponse(
      errorBody("DB_ERROR", "Failed to load organization", orgErr.message),
      500,
      req,
    );
  }

  if (!orgRaw) {
    return jsonResponse(
      errorBody("NOT_FOUND", "Organization not found"),
      404,
      req,
    );
  }

  const organization = orgRaw as OrganizationRow;

  if (organization.primary_contact_user_id !== userId) {
    return jsonResponse(
      errorBody(
        "FORBIDDEN",
        "You are not the primary contact for this organization",
      ),
      403,
      req,
    );
  }

  // 5. Idempotency — check for an existing pending invoice with a Stripe session.
  const { data: existingInvoiceRaw, error: invLookupErr } = await db
    .from("invoices")
    .select("id, stripe_session_id, status")
    .eq("application_id", application_id)
    .eq("status", "pending")
    .not("stripe_session_id", "is", null)
    .maybeSingle();

  if (invLookupErr) {
    console.error("sponsor-checkout: invoice lookup failed", invLookupErr);
    return jsonResponse(
      errorBody("DB_ERROR", "Failed to check existing invoices", invLookupErr.message),
      500,
      req,
    );
  }

  if (existingInvoiceRaw) {
    const existingInvoice = existingInvoiceRaw as InvoiceRow;
    const stripe = getStripe();
    if (!stripe) {
      return jsonResponse(
        errorBody("CONFIG_ERROR", "Server is missing Stripe credentials"),
        500,
        req,
      );
    }

    try {
      const existingSession = await stripe.checkout.sessions.retrieve(
        existingInvoice.stripe_session_id,
      );
      if (existingSession.url) {
        // Return cached checkout URL — idempotent path.
        await logAiRun(service, "success", Date.now() - startMs);
        return jsonResponse(
          { success: true, data: { checkout_url: existingSession.url } },
          200,
          req,
        );
      }
    } catch (stripeErr) {
      // Session may have expired; fall through to create a new one.
      console.warn(
        "sponsor-checkout: failed to retrieve existing Stripe session; creating new one",
        stripeErr instanceof Error ? stripeErr.message : stripeErr,
      );
    }
  }

  // 6. Init Stripe.
  const stripe = getStripe();
  if (!stripe) {
    console.error("sponsor-checkout: STRIPE_SECRET_KEY is not configured");
    return jsonResponse(
      errorBody("CONFIG_ERROR", "Server is missing Stripe credentials"),
      500,
      req,
    );
  }

  const frontendUrl =
    Deno.env.get("FRONTEND_URL") ?? "https://www.mdeai.co";

  // 7. Create Stripe Checkout session.
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "cop",
            unit_amount: application.flat_price_cents,
            product_data: {
              name: `Sponsorship: ${application.tier} tier`,
              description: `Event sponsorship for application ${application_id}`,
            },
          },
          quantity: 1,
        },
      ],
      // invoice_id will be filled after INSERT and patched via session.update
      metadata: { application_id, invoice_id: "" },
      success_url: `${frontendUrl}/sponsor/dashboard/${application_id}?payment=success`,
      cancel_url: `${frontendUrl}/sponsor/apply?draft=${application_id}`,
    });
  } catch (stripeErr) {
    console.error("sponsor-checkout: Stripe session create failed", stripeErr);
    await logAiRun(
      service,
      "error",
      Date.now() - startMs,
      stripeErr instanceof Error ? stripeErr.message : String(stripeErr),
    );
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

  // 8. INSERT invoice row.
  const { data: insertedInvoice, error: insertErr } = await db
    .from("invoices")
    .insert({
      application_id,
      amount_cents: application.flat_price_cents,
      currency: "COP",
      status: "pending",
      stripe_session_id: session.id,
    })
    .select("id")
    .single();

  if (insertErr || !insertedInvoice) {
    console.error("sponsor-checkout: invoice INSERT failed", insertErr);
    await logAiRun(
      service,
      "error",
      Date.now() - startMs,
      insertErr?.message ?? "Invoice insert returned no data",
    );
    return jsonResponse(
      errorBody(
        "DB_ERROR",
        "Failed to create invoice record",
        insertErr?.message,
      ),
      500,
      req,
    );
  }

  const invoiceId = (insertedInvoice as { id: string }).id;

  // 9. Patch session metadata with the real invoice_id (best-effort).
  try {
    await stripe.checkout.sessions.update(session.id, {
      metadata: { application_id, invoice_id: invoiceId },
    });
  } catch (updateErr) {
    // Non-fatal — the webhook can resolve application_id from session metadata.
    console.warn(
      "sponsor-checkout: metadata patch failed; webhook will use application_id fallback",
      updateErr instanceof Error ? updateErr.message : updateErr,
    );
  }

  // 10. Log to ai_runs.
  await logAiRun(service, "success", Date.now() - startMs);

  return jsonResponse(
    { success: true, data: { checkout_url: session.url ?? "" } },
    200,
    req,
  );
});
