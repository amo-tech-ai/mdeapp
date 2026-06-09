/**
 * sponsor-contract-sign — Sponsor signs their contract electronically.
 *
 * Auth:    Bearer JWT (required — verify_jwt = true in config.toml).
 * Input:   { contract_id: UUID, display_name: string (>=3 chars) }
 * Output:  { success: true, data: { contract_id, placements_activated: number } }
 *
 * Flow:
 *  1. Validate JWT + body.
 *  2. Load contract; verify ownership + status = 'sent_for_signature'.
 *  3. Hash the request IP with a daily salt (SHA-256, non-reversible).
 *  4. UPDATE contract → signed.
 *  5. Calls activate_placements_if_ready(application_id) — activates placements
 *     ONLY if a paid invoice also exists (dual-gate, audit B2 fix).
 *  6. Log to ai_runs.
 */

import { getCorsHeaders, jsonResponse, errorBody } from "../_shared/http.ts";
import { getUserClient, getServiceClient } from "../_shared/supabase-clients.ts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RequestBody {
  contract_id: string;
  display_name: string;
}

interface ContractRow {
  id: string;
  sponsor_user_id: string;
  status: string;
  application_id: string;
}


// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * SHA-256 of "<IP>:<YYYY-MM-DD>" using the Web Crypto API available in Deno.
 * The daily salt means the hash cannot be reversed across days.
 */
async function hashIpDaily(ip: string): Promise<string> {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const raw = `${ip}:${today}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Extract the most reliable IP from request headers (Supabase edge runs behind Fly.io). */
function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
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
  if (!authHeader) {
    return jsonResponse(errorBody("UNAUTHORIZED", "Missing Authorization header"), 401, req);
  }

  const userClient = getUserClient(authHeader);
  const token = authHeader.replace("Bearer ", "");
  const { data: authData, error: authError } = await userClient.auth.getUser(token);

  if (authError || !authData.user) {
    return jsonResponse(errorBody("UNAUTHORIZED", "Invalid or expired token"), 401, req);
  }

  const userId = authData.user.id;

  // ── Parse + validate body ──────────────────────────────────────────────────
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return jsonResponse(errorBody("BAD_REQUEST", "Request body must be valid JSON"), 400, req);
  }

  const { contract_id, display_name } = body;

  if (!contract_id || typeof contract_id !== "string" || contract_id.trim() === "") {
    return jsonResponse(errorBody("BAD_REQUEST", "contract_id is required (UUID)"), 400, req);
  }

  // Basic UUID format check
  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(contract_id.trim())) {
    return jsonResponse(errorBody("BAD_REQUEST", "contract_id must be a valid UUID"), 400, req);
  }

  if (
    !display_name ||
    typeof display_name !== "string" ||
    display_name.trim().length < 3
  ) {
    return jsonResponse(
      errorBody("BAD_REQUEST", "display_name must be at least 3 characters"),
      400,
      req,
    );
  }

  const db = getServiceClient();

  // ── Load contract ──────────────────────────────────────────────────────────
  // `.schema("sponsor" as never)` is the established pattern in this codebase
  // for accessing non-public schemas without type-casting to `any`.
  const { data: contractRaw, error: contractErr } = await db
    .schema("sponsor" as never)
    .from("contracts")
    .select("id, sponsor_user_id, status, application_id")
    .eq("id", contract_id.trim())
    .maybeSingle() as {
    data: ContractRow | null;
    error: { message: string } | null;
  };

  if (contractErr) {
    return jsonResponse(errorBody("DB_ERROR", "Failed to load contract"), 500, req);
  }

  if (!contractRaw) {
    return jsonResponse(errorBody("NOT_FOUND", "Contract not found"), 404, req);
  }

  // ── Ownership check ────────────────────────────────────────────────────────
  if (contractRaw.sponsor_user_id !== userId) {
    return jsonResponse(errorBody("FORBIDDEN", "You do not own this contract"), 403, req);
  }

  // ── Status check ──────────────────────────────────────────────────────────
  if (contractRaw.status !== "sent_for_signature") {
    return jsonResponse(
      errorBody("CONTRACT_ALREADY_SIGNED", "Contract is not in a signable state"),
      400,
      req,
    );
  }

  // ── Hash client IP ────────────────────────────────────────────────────────
  const clientIp = getClientIp(req);
  const signedIpHash = await hashIpDaily(clientIp);

  // ── UPDATE contract → signed ───────────────────────────────────────────────
  const { error: updateErr } = await db
    .schema("sponsor" as never)
    .from("contracts")
    .update({
      sponsor_signed_at: new Date().toISOString(),
      signed_ip_hash: signedIpHash,
      sponsor_display_name: display_name.trim(),
      status: "signed",
    })
    .eq("id", contract_id.trim()) as { error: { message: string } | null };

  if (updateErr) {
    return jsonResponse(errorBody("DB_ERROR", "Failed to update contract"), 500, req);
  }

  // ── Activate placements via the dual-gate RPC ─────────────────────────────
  // activate_placements_if_ready() checks BOTH:
  //   • sponsor.contracts.status IN ('signed','active')  (just set above)
  //   • sponsor.invoices.status = 'paid'
  // If the invoice hasn't been paid yet it returns 0 — placements will
  // activate when sponsor-payment-webhook calls the same RPC after payment.
  const { data: activatedCount, error: activateErr } = await db
    .rpc("activate_placements_if_ready", {
      p_application_id: contractRaw.application_id,
    }) as { data: number | null; error: { message: string } | null };

  const placementsActivated = activatedCount ?? 0;

  if (activateErr) {
    // Non-fatal — contract is signed; webhook will retry activation on payment.
    console.error(
      "sponsor-contract-sign: activate_placements_if_ready failed",
      activateErr.message,
    );
  }

  // ── Log to ai_runs ────────────────────────────────────────────────────────
  const duration_ms = Date.now() - start;
  await db.from("ai_runs").insert({
    agent_name: "sponsor-contract-sign",
    duration_ms,
    status: "success",
    input_tokens: 0,
    output_tokens: 0,
  });

  return jsonResponse(
    {
      success: true,
      data: {
        contract_id: contractRaw.id,
        placements_activated: placementsActivated,
      },
    },
    200,
    req,
  );
});
