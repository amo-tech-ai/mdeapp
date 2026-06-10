/**
 * listing-moderate — Landlord V1 D6.
 *
 * Founder-side admin moderation via signed magic-link in email. No UI,
 * no logged-in user — the URL itself carries the proof.
 *
 * Flow:
 *   listing-create writes a needs_review listing
 *   → fires founder email with two links (approve / reject)
 *   → founder clicks one
 *   → this function verifies the HMAC token + flips moderation_status
 *
 * Auth: verify_jwt: false (set in supabase/config.toml). Authorization
 * is the signed token, not a JWT.
 *
 * Method: GET (so an email link works without a form submit).
 *
 * Idempotency: if the listing is already in the target state, return
 * 200 with `changed: false`. Re-clicking the same link is safe.
 */

import {
  getCorsHeaders,
  jsonResponse,
  errorBody,
} from "../_shared/http.ts";
import { getServiceClient } from "../_shared/supabase-clients.ts";
import {
  verifyModerationToken,
} from "../_shared/moderation-token.ts";
import type { ModerationAction, ModerationOutcome } from "./types.ts";

function actionPastTense(action: ModerationAction): "approved" | "rejected" {
  return action === "approve" ? "approved" : "rejected";
}

const SUCCESS_HTML = (listingId: string, action: ModerationAction) => {
  const pt = actionPastTense(action);
  const color = action === "approve" ? "#15803d" : "#b91c1c";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>mdeai · listing ${pt}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 480px; margin: 80px auto; padding: 0 24px; color: #1f2937; }
  h1 { font-size: 24px; }
  .ok { color: ${color}; }
  code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
</style>
</head>
<body>
  <h1 class="ok">Listing ${pt}</h1>
  <p>Listing <code>${listingId}</code> is now <strong>${pt}</strong>.</p>
  <p style="color: #6b7280; font-size: 14px;">You can close this tab.</p>
</body>
</html>`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }
  if (req.method !== "GET") {
    return jsonResponse(
      errorBody("METHOD_NOT_ALLOWED", "Use GET"),
      405,
      req,
    );
  }

  // 1. Extract token from query string.
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return jsonResponse(
      errorBody("MISSING_TOKEN", "Magic link is missing the token parameter"),
      400,
      req,
    );
  }

  // 2. Verify HMAC + expiry.
  const secret = Deno.env.get("FOUNDER_MODERATION_SECRET");
  if (!secret) {
    console.error("listing-moderate: FOUNDER_MODERATION_SECRET unset");
    return jsonResponse(
      errorBody("SECRET_UNCONFIGURED", "Server-side moderation secret missing"),
      500,
      req,
    );
  }
  const verify = await verifyModerationToken(token, secret);
  if (!verify.ok) {
    const status = verify.reason === "EXPIRED" ? 410 : 401;
    return jsonResponse(
      errorBody(`TOKEN_${verify.reason}`, "Token rejected"),
      status,
      req,
    );
  }
  const { lid: listingId, act: action } = verify.payload;

  // 3. Look up + update the apartments row. Service role because the
  // caller is unauthenticated by design (token IS the auth).
  const service = getServiceClient();
  const { data: row, error: lookupErr } = await service
    .from("apartments")
    .select("id, moderation_status, status")
    .eq("id", listingId)
    .maybeSingle();
  if (lookupErr) {
    console.error("listing-moderate lookup error:", lookupErr);
    return jsonResponse(
      errorBody("LOOKUP_FAILED", lookupErr.message),
      500,
      req,
    );
  }
  if (!row) {
    return jsonResponse(
      errorBody("LISTING_NOT_FOUND", "Listing was deleted or never existed"),
      404,
      req,
    );
  }

  const targetStatus = action === "approve" ? "approved" : "rejected";

  // 4. Idempotent fast path — if already in target state, no UPDATE.
  if (row.moderation_status === targetStatus) {
    return new Response(SUCCESS_HTML(listingId, action), {
      status: 200,
      headers: {
        ...getCorsHeaders(req),
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }

  // 5. Apply the moderation. We also flip apartments.status: rejected
  // listings are pulled from public discovery (`status='hidden'`).
  // updated_at bumps automatically via the apartments_updated_at trigger.
  const updates: Record<string, unknown> = {
    moderation_status: targetStatus,
  };
  if (action === "reject") {
    // CHECK constraint on apartments.status: active|inactive|booked|pending
    updates.status = "inactive";
    updates.rejection_reason = "Rejected by founder review";
  }

  const { error: updateErr } = await service
    .from("apartments")
    .update(updates)
    .eq("id", listingId);
  if (updateErr) {
    console.error("listing-moderate update error:", updateErr);
    return jsonResponse(
      errorBody("UPDATE_FAILED", updateErr.message),
      500,
      req,
    );
  }

  console.log(
    `[listing-moderate] listing=${listingId} action=${action} → ${targetStatus}`,
  );

  const outcome: ModerationOutcome = {
    listing_id: listingId,
    moderation_status: targetStatus,
    changed: true,
  };
  // For machine consumers (curl --include) we still set a useful header.
  // The HTML body is what email clicks render to.
  const headers = {
    ...getCorsHeaders(req),
    "Content-Type": "text/html; charset=utf-8",
    "X-Moderation-Outcome": JSON.stringify(outcome),
  };
  return new Response(SUCCESS_HTML(listingId, action), {
    status: 200,
    headers,
  });
});
