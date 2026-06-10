/**
 * sponsor-contract-generate — Generate a bilingual HTML sponsorship contract.
 *
 * Auth:    Service-role internal call only (Authorization header required).
 *          verify_jwt = false in config.toml; auth check is manual.
 * Input:   { application_id: uuid }
 * Output:  { success: true, data: { contract_id, html_url: null } }
 *
 * Idempotent: if a contract already exists for application_id, returns
 * the existing contract_id without creating a duplicate.
 *
 * Flow:
 *   1. Validate input (UUID regex)
 *   2. Idempotency check — return early if contract exists
 *   3. Load application + organization + event via service client joins
 *   4. Render bilingual HTML template
 *   5. Upload HTML to `contracts` storage bucket
 *   6. INSERT sponsor.contracts row
 *   7. Log to ai_runs
 */

import { getCorsHeaders, jsonResponse, errorBody } from "../_shared/http.ts";
import { getServiceClient } from "../_shared/supabase-clients.ts";

// ---------------------------------------------------------------------------
// UUID validation
// ---------------------------------------------------------------------------

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUuid(v: unknown): v is string {
  return typeof v === "string" && UUID_REGEX.test(v);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ApplicationRow {
  id: string;
  organization_id: string;
  event_id: string;
  activation_type: string;
  pricing_model: string;
  flat_price_cents: number | null;
  approved_by: string | null;
}

interface OrganizationRow {
  id: string;
  legal_name: string;
  primary_contact_user_id: string | null;
}

interface EventRow {
  id: string;
  title: string;
}

interface ContractRow {
  id: string;
}

// ---------------------------------------------------------------------------
// HTML template renderer
// ---------------------------------------------------------------------------

function renderContract(params: {
  contractId: string;
  date: string;
  legalName: string;
  eventTitle: string;
  activationType: string;
  amountFormatted: string;
  pricingModel: string;
}): string {
  const {
    contractId,
    date,
    legalName,
    eventTitle,
    activationType,
    amountFormatted,
    pricingModel,
  } = params;

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Contrato de Patrocinio</title>
<style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6}
h1{color:#1a1a1a}table{width:100%;border-collapse:collapse;margin:20px 0}
td,th{padding:8px;border:1px solid #ddd;text-align:left}.sig-line{border-top:1px solid #000;margin-top:40px;padding-top:8px}</style>
</head><body>
<h1>CONTRATO DE PATROCINIO / SPONSORSHIP AGREEMENT</h1>
<table><tr><th>Fecha / Date</th><td>${date}</td></tr>
<tr><th>Patrocinador / Sponsor</th><td>${legalName}</td></tr>
<tr><th>Evento / Event</th><td>${eventTitle}</td></tr>
<tr><th>Activación / Activation</th><td>${activationType}</td></tr>
<tr><th>Monto / Amount</th><td>COP ${amountFormatted}</td></tr>
<tr><th>Modelo de precio / Pricing</th><td>${pricingModel}</td></tr>
<tr><th>Vigencia / Term</th><td>90 días / days</td></tr>
<tr><th>Ventana de cancelación / Cancellation window</th><td>7 días / days</td></tr>
</table>
<h2>1. Objeto / Subject</h2>
<p>[ES] El patrocinador aporta COP ${amountFormatted} para la activación tipo <em>${activationType}</em> durante el evento "<strong>${eventTitle}</strong>".</p>
<p>[EN] The sponsor contributes COP ${amountFormatted} for a <em>${activationType}</em> activation during "<strong>${eventTitle}</strong>".</p>
<h2>2. Ley aplicable / Governing Law</h2>
<p>República de Colombia. Arbitraje / Arbitration: Cámara de Comercio de Medellín.</p>
<h2>3. Firma electrónica / Electronic Signature</h2>
<p>Accepted per Colombia Ley 527/1999 (click-wrap). Sponsor types full name + checks agreement box at <strong>mdeai.co/sponsor/contract/${contractId}</strong>.</p>
<div class="sig-line"><p>Sponsor: _________________________ Date: _____________</p></div>
</body></html>`;
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  const start = Date.now();

  // ── Auth: require Authorization header (internal/service-role calls only) ──
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse(errorBody("FORBIDDEN", "Missing Authorization header"), 403, req);
  }

  // ── Parse body ─────────────────────────────────────────────────────────────
  let body: { application_id?: unknown };
  try {
    body = (await req.json()) as { application_id?: unknown };
  } catch {
    return jsonResponse(
      errorBody("BAD_REQUEST", "Request body must be valid JSON"),
      400,
      req,
    );
  }

  // ── Validate input ─────────────────────────────────────────────────────────
  if (!isValidUuid(body.application_id)) {
    return jsonResponse(
      errorBody("BAD_REQUEST", "application_id must be a valid UUID"),
      400,
      req,
    );
  }

  const applicationId = body.application_id;

  const db = getServiceClient();

  try {
    // ── Idempotency: return early if contract already exists ─────────────────
    const { data: existing } = await (db as unknown as {
      schema: (s: string) => typeof db;
    })
      .schema("sponsor" as never)
      .from("contracts")
      .select("id")
      .eq("application_id", applicationId)
      .maybeSingle() as { data: ContractRow | null; error: unknown };

    if (existing) {
      return jsonResponse(
        {
          success: true,
          data: {
            contract_id: existing.id,
            html_url: null,
          },
        },
        200,
        req,
      );
    }

    // ── Load application ───────────────────────────────────────────────────
    const { data: app, error: appErr } = await (db as unknown as {
      schema: (s: string) => typeof db;
    })
      .schema("sponsor" as never)
      .from("applications")
      .select(
        "id, organization_id, event_id, activation_type, pricing_model, flat_price_cents, approved_by",
      )
      .eq("id", applicationId)
      .single() as { data: ApplicationRow | null; error: unknown };

    if (appErr || !app) {
      return jsonResponse(
        errorBody("NOT_FOUND", "Application not found"),
        404,
        req,
      );
    }

    // ── Load organization ──────────────────────────────────────────────────
    const { data: org, error: orgErr } = await (db as unknown as {
      schema: (s: string) => typeof db;
    })
      .schema("sponsor" as never)
      .from("organizations")
      .select("id, legal_name, primary_contact_user_id")
      .eq("id", app.organization_id)
      .single() as { data: OrganizationRow | null; error: unknown };

    if (orgErr || !org) {
      return jsonResponse(
        errorBody("NOT_FOUND", "Organization not found"),
        404,
        req,
      );
    }

    // ── Load event ─────────────────────────────────────────────────────────
    const { data: event, error: eventErr } = await db
      .from("events")
      .select("id, title")
      .eq("id", app.event_id)
      .single() as { data: EventRow | null; error: unknown };

    if (eventErr || !event) {
      return jsonResponse(
        errorBody("NOT_FOUND", "Event not found"),
        404,
        req,
      );
    }

    // ── Render HTML ─────────────────────────────────────────────────────────
    const contractId = crypto.randomUUID();
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const amountCents = app.flat_price_cents ?? 0;
    const amountFormatted = new Intl.NumberFormat("es-CO").format(
      Math.round(amountCents / 100),
    );

    const html = renderContract({
      contractId,
      date: dateStr,
      legalName: org.legal_name,
      eventTitle: event.title,
      activationType: app.activation_type,
      amountFormatted,
      pricingModel: app.pricing_model,
    });

    // ── Upload HTML to storage ─────────────────────────────────────────────
    const htmlBytes = new TextEncoder().encode(html);

    const { error: uploadErr } = await db.storage
      .from("contracts")
      .upload(`${contractId}.html`, htmlBytes, {
        contentType: "text/html",
        upsert: false,
      });

    if (uploadErr) {
      // If bucket doesn't exist, the error message will contain "bucket not found"
      // We surface the underlying message to aid debugging.
      return jsonResponse(
        errorBody("STORAGE_ERROR", `Failed to upload contract: ${uploadErr.message}`),
        500,
        req,
      );
    }

    // ── INSERT sponsor.contracts row ────────────────────────────────────────
    const contractStart = now.toISOString();
    const contractEnd = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();

    const { data: inserted, error: insertErr } = await (db as unknown as {
      schema: (s: string) => typeof db;
    })
      .schema("sponsor" as never)
      .from("contracts")
      .insert({
        id: contractId,
        application_id: applicationId,
        template_version: "v1.0",
        organizer_user_id: app.approved_by,
        sponsor_user_id: org.primary_contact_user_id,
        agreed_amount_cents: amountCents,
        agreed_currency: "COP",
        agreed_pricing_model: app.pricing_model,
        agreed_deliverables: [],
        contract_start_at: contractStart,
        contract_end_at: contractEnd,
        organizer_signed_at: now.toISOString(),
        pdf_storage_path: `${contractId}.html`,
        status: "sent_for_signature",
      })
      .select("id")
      .single() as { data: ContractRow | null; error: unknown };

    if (insertErr || !inserted) {
      const errMsg = insertErr instanceof Error
        ? insertErr.message
        : JSON.stringify(insertErr);
      return jsonResponse(
        errorBody("DB_ERROR", `Failed to insert contract: ${errMsg}`),
        500,
        req,
      );
    }

    // ── Log to ai_runs ──────────────────────────────────────────────────────
    const duration_ms = Date.now() - start;
    await db.from("ai_runs").insert({
      agent_name: "sponsor-contract-generate",
      status: "success",
      duration_ms,
      input_tokens: 0,
      output_tokens: 0,
    });

    return jsonResponse(
      {
        success: true,
        data: {
          contract_id: inserted.id,
          html_url: null,
        },
      },
      200,
      req,
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    // Log failure
    await db.from("ai_runs").insert({
      agent_name: "sponsor-contract-generate",
      status: "error",
      duration_ms: Date.now() - start,
      input_tokens: 0,
      output_tokens: 0,
    }).catch(() => { /* best-effort logging */ });

    return jsonResponse(
      errorBody("INTERNAL", message),
      500,
      req,
    );
  }
});
