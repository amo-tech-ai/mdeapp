/**
 * sponsor-application-create — Multi-step wizard persistence for sponsor onboarding.
 *
 * Steps 1–3: anonymous-friendly draft upserts (userId optional).
 * Step 4:    requires authenticated user; flips application.status → 'submitted'.
 *
 * Auth:    Bearer JWT (optional on steps 1–3; required on step 4).
 * Input:   { step, organization, application, assets?, draft_application_id? }
 * Output:  { success: true, data: { application_id, organization_id } }
 */

import { getCorsHeaders, jsonResponse, errorBody } from "../_shared/http.ts";
import { getUserId, getServiceClient } from "../_shared/supabase-clients.ts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OrganizationInput {
  legal_name?: string;
  display_name?: string;
  website?: string;
  industry?: string;
  tax_id?: string;
  contact_full_name?: string;
  contact_email?: string;
  contact_whatsapp?: string;
}

interface ApplicationInput {
  event_id?: string;
  event_title?: string;
  activation_type?: string;
  tier?: string;
  pricing_model?: string;
  flat_price_cents?: number;
  campaign_goals?: Record<string, unknown>;
}

interface AssetInput {
  logo_path?: string;
  video_path?: string;
  tagline?: string;
  utm_destination?: string;
  brand_color?: string;
}

interface RequestBody {
  step: number;
  organization: OrganizationInput;
  application: ApplicationInput;
  assets?: AssetInput;
  draft_application_id?: string;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  const start = Date.now();

  // ── Auth ──────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get("Authorization");
  const userId = await getUserId(authHeader, undefined);

  // ── Parse + validate body ──────────────────────────────────────────────────
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return jsonResponse(
      errorBody("BAD_REQUEST", "Request body must be valid JSON"),
      400,
      req,
    );
  }

  const { step, organization, application, assets, draft_application_id } = body;

  if (!step || typeof step !== "number" || step < 1 || step > 4) {
    return jsonResponse(
      errorBody("BAD_REQUEST", "step must be 1–4"),
      400,
      req,
    );
  }

  // Step 4 requires auth
  if (step === 4 && !userId) {
    return jsonResponse(
      errorBody("UNAUTHORIZED", "Authentication required to submit application"),
      401,
      req,
    );
  }

  if (!organization || typeof organization !== "object") {
    return jsonResponse(
      errorBody("BAD_REQUEST", "organization is required"),
      400,
      req,
    );
  }

  const db = getServiceClient();

  // ── Upsert organization ────────────────────────────────────────────────────
  let orgId: string | null = null;

  // If we have an existing draft application, load its org_id
  if (draft_application_id) {
    const { data: existingApp } = await db
      .schema("sponsor" as never)
      .from("applications")
      .select("organization_id")
      .eq("id", draft_application_id)
      .maybeSingle() as { data: { organization_id: string } | null; error: unknown };

    if (existingApp) {
      orgId = existingApp.organization_id;
    }
  }

  const orgPayload: Record<string, unknown> = {
    legal_name:    organization.legal_name    ?? "Draft Organization",
    display_name:  organization.display_name  ?? "Draft Organization",
    website:       organization.website       ?? null,
    industry:      organization.industry      ?? null,
    tax_id:        organization.tax_id        ?? null,
    ...(userId ? { primary_contact_user_id: userId } : {}),
  };

  if (orgId) {
    // UPDATE existing org
    const { data: updatedOrg, error: orgErr } = await db
      .schema("sponsor" as never)
      .from("organizations")
      .update(orgPayload)
      .eq("id", orgId)
      .select("id")
      .single() as { data: { id: string } | null; error: unknown };

    if (orgErr || !updatedOrg) {
      return jsonResponse(
        errorBody("DB_ERROR", "Failed to update organization"),
        500,
        req,
      );
    }
    orgId = updatedOrg.id;
  } else if (userId) {
    // Upsert by primary_contact_user_id
    const { data: upsertedOrg, error: orgErr } = await db
      .schema("sponsor" as never)
      .from("organizations")
      .upsert(
        { ...orgPayload, primary_contact_user_id: userId },
        { onConflict: "primary_contact_user_id", ignoreDuplicates: false },
      )
      .select("id")
      .single() as { data: { id: string } | null; error: unknown };

    if (orgErr || !upsertedOrg) {
      // Fallback: try INSERT without upsert (conflict key may not exist)
      const { data: insertedOrg, error: insertErr } = await db
        .schema("sponsor" as never)
        .from("organizations")
        .insert(orgPayload)
        .select("id")
        .single() as { data: { id: string } | null; error: unknown };

      if (insertErr || !insertedOrg) {
        return jsonResponse(
          errorBody("DB_ERROR", "Failed to create organization"),
          500,
          req,
        );
      }
      orgId = insertedOrg.id;
    } else {
      orgId = upsertedOrg.id;
    }
  } else {
    // Anonymous: always INSERT new org
    const { data: newOrg, error: orgErr } = await db
      .schema("sponsor" as never)
      .from("organizations")
      .insert(orgPayload)
      .select("id")
      .single() as { data: { id: string } | null; error: unknown };

    if (orgErr || !newOrg) {
      return jsonResponse(
        errorBody("DB_ERROR", "Failed to create organization"),
        500,
        req,
      );
    }
    orgId = newOrg.id;
  }

  // ── Upsert application ─────────────────────────────────────────────────────
  const appPayload: Record<string, unknown> = {
    organization_id:  orgId,
    event_id:         application.event_id        ?? null,
    activation_type:  application.activation_type ?? "digital",
    tier:             application.tier             ?? "bronze",
    pricing_model:    application.pricing_model    ?? "flat",
    flat_price_cents: application.flat_price_cents ?? 0,
    campaign_goals:   application.campaign_goals   ?? {},
    ...(step === 4
      ? { status: "submitted", submitted_at: new Date().toISOString() }
      : { status: "draft" }),
  };

  let appId: string;

  if (draft_application_id) {
    // UPDATE existing application
    const { data: updatedApp, error: appErr } = await db
      .schema("sponsor" as never)
      .from("applications")
      .update(appPayload)
      .eq("id", draft_application_id)
      .select("id")
      .single() as { data: { id: string } | null; error: unknown };

    if (appErr || !updatedApp) {
      return jsonResponse(
        errorBody("DB_ERROR", "Failed to update application"),
        500,
        req,
      );
    }
    appId = updatedApp.id;
  } else {
    // INSERT new application
    const { data: newApp, error: appErr } = await db
      .schema("sponsor" as never)
      .from("applications")
      .insert(appPayload)
      .select("id")
      .single() as { data: { id: string } | null; error: unknown };

    if (appErr || !newApp) {
      return jsonResponse(
        errorBody("DB_ERROR", "Failed to create application"),
        500,
        req,
      );
    }
    appId = newApp.id;
  }

  // ── Assets (step 3) ────────────────────────────────────────────────────────
  if (step === 3 && assets?.logo_path) {
    await db
      .schema("sponsor" as never)
      .from("assets")
      .insert({
        application_id: appId,
        kind: "logo",
        storage_path: assets.logo_path,
        meta: {
          ...(assets.tagline      ? { tagline: assets.tagline }          : {}),
          ...(assets.brand_color  ? { brand_color: assets.brand_color }  : {}),
          ...(assets.utm_destination ? { utm_destination: assets.utm_destination } : {}),
        },
      });

    if (assets.video_path) {
      await db
        .schema("sponsor" as never)
        .from("assets")
        .insert({
          application_id: appId,
          kind: "video",
          storage_path: assets.video_path,
          meta: {},
        });
    }
  }

  // ── Log to ai_runs ─────────────────────────────────────────────────────────
  const duration_ms = Date.now() - start;
  await db.from("ai_runs").insert({
    agent_name:    "sponsor-application-create",
    duration_ms,
    status:        "success",
    input_tokens:  0,
    output_tokens: 0,
  });

  return jsonResponse(
    {
      success: true,
      data: {
        application_id:  appId,
        organization_id: orgId,
      },
    },
    200,
    req,
  );
});
