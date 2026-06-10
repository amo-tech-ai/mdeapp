/**
 * ticket-validate — Phase 1 events, QR scan endpoint.
 *
 * Door staff at the venue scan a ticket holder's QR code from their PWA
 * (task 007). The scanner POSTs:
 *   - Authorization: Bearer <staff_jwt>      (signed by 034 with STAFF_LINK_SECRET)
 *   - Body: { qr_token, scanner_event_id }   (qr_token signed by 004 with QR_SIGNING_SECRET)
 *
 * We validate both JWTs, cross-check event_id, check staff_link_version
 * against the events row (revocation gate), then call the atomic
 * `ticket_validate_consume` RPC which marks qr_used_at race-safely.
 *
 * Auth: `verify_jwt = false` in supabase/config.toml — the staff JWT is a
 * CUSTOM HS256 token (not a Supabase user JWT). Supabase's gateway
 * verify_jwt=true would reject it. We validate it in-function (audit B4).
 *
 * Audit fixes implemented:
 *   B4 — verify_jwt = false; staff token validated in-function with
 *        STAFF_LINK_SECRET (separate from Supabase JWT_SECRET).
 *   M2 — STAFF_LINK_SECRET is its own env var; leak doesn't compromise
 *        platform auth.
 *   medium — UNKNOWN_TOKEN distinguished from INVALID_SIGNATURE so
 *            operators can tell counterfeit from stale token.
 *
 * Audit log: every scan attempt (success or failure) is recorded in
 * `event_check_ins` for forensic review and oversell post-mortems.
 */
import { z } from "https://esm.sh/zod@3.23.8";
import { errorBody, getCorsHeaders, jsonResponse } from "../_shared/http.ts";
import { getServiceClient } from "../_shared/supabase-clients.ts";
import { verifyJwtHs256 } from "../_shared/jwt.ts";
const RequestSchema = z.object({
  qr_token: z.string().min(20).max(2000),
  scanner_event_id: z.string().uuid(),
  /** Optional device fingerprint for audit log. */ scanner_device: z.string()
    .max(200).optional(),
});
const HUMAN_REASONS = {
  consumed: "Welcome!",
  unknown_token: "No ticket on file with that code (refunded or cancelled?)",
  already_used: "Ticket was already scanned",
  refunded: "Ticket was refunded",
  cancelled: "Ticket was cancelled",
  pending_payment: "Payment not yet confirmed — wait 30 seconds",
  event_ended: "Event has already ended",
};
// We always return HTTP 200 for these app-level outcomes so the scanner can
// branch on the JSON body's error.code without conflating with transport errors.
const APP_LEVEL_HTTP = 200;
function getClientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ?? null;
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: getCorsHeaders(req),
    });
  }
  if (req.method !== "POST") {
    return jsonResponse(errorBody("METHOD_NOT_ALLOWED", "Use POST"), 405, req);
  }
  // 1. Verify the staff JWT in-function (audit B4 — verify_jwt=false).
  const staffSecret = Deno.env.get("STAFF_LINK_SECRET");
  const qrSecret = Deno.env.get("QR_SIGNING_SECRET");
  if (!staffSecret || !qrSecret) {
    console.error(
      "ticket-validate: missing STAFF_LINK_SECRET or QR_SIGNING_SECRET",
    );
    return jsonResponse(
      errorBody("CONFIG_ERROR", "Server is missing required secrets"),
      500,
      req,
    );
  }
  const authHeader = req.headers.get("Authorization");
  const staffToken = authHeader?.replace("Bearer ", "") ?? "";
  if (!staffToken) {
    return jsonResponse(
      errorBody("STAFF_TOKEN_INVALID", "Missing staff token"),
      401,
      req,
    );
  }
  const staffResult = await verifyJwtHs256(staffToken, staffSecret);
  if (!staffResult.valid) {
    const code = staffResult.reason === "EXPIRED"
      ? "STAFF_TOKEN_EXPIRED"
      : "STAFF_TOKEN_INVALID";
    return jsonResponse(
      errorBody(code, `Staff token ${staffResult.reason.toLowerCase()}`),
      401,
      req,
    );
  }
  const staffPayload = staffResult.payload;
  if (staffPayload.role !== "door_staff") {
    return jsonResponse(
      errorBody("STAFF_TOKEN_INVALID", "Token is not a door-staff token"),
      403,
      req,
    );
  }
  // 2. Parse + validate body.
  let body;
  try {
    body = RequestSchema.parse(await req.json());
  } catch (err) {
    return jsonResponse(
      errorBody(
        "BAD_REQUEST",
        "Request payload didn't validate",
        err instanceof z.ZodError ? err.flatten() : String(err),
      ),
      400,
      req,
    );
  }
  // 3. Cross-check the staff token's event_id matches the scanner's claimed event.
  if (staffPayload.event_id !== body.scanner_event_id) {
    return jsonResponse(
      errorBody(
        "STAFF_TOKEN_INVALID",
        "Staff token does not authorise this event",
      ),
      403,
      req,
    );
  }
  // 4. Verify the QR JWT signature.
  const qrResult = await verifyJwtHs256(body.qr_token, qrSecret);
  const service = getServiceClient();
  const clientIp = getClientIp(req);
  if (!qrResult.valid) {
    // Audit log even invalid scans — counterfeit attempts are forensic gold.
    await safeLogScan(service, {
      event_id: body.scanner_event_id,
      qr_token: body.qr_token,
      result: "invalid_signature",
      scanner_device: body.scanner_device ?? null,
      ip_address: clientIp,
      details: {
        reason: qrResult.reason,
      },
    });
    return jsonResponse(
      {
        success: false,
        error: {
          code: "INVALID_SIGNATURE",
          message: "QR signature does not verify — likely counterfeit",
        },
      },
      APP_LEVEL_HTTP,
      req,
    );
  }
  const qrPayload = qrResult.payload;
  // 5. Cross-check QR's event_id against scanner's event_id (defence in depth).
  if (qrPayload.event_id !== body.scanner_event_id) {
    await safeLogScan(service, {
      event_id: body.scanner_event_id,
      qr_token: body.qr_token,
      result: "wrong_event",
      scanner_device: body.scanner_device ?? null,
      ip_address: clientIp,
      details: {
        qr_event_id: qrPayload.event_id,
        scanner_event_id: body.scanner_event_id,
      },
    });
    return jsonResponse(
      {
        success: false,
        error: {
          code: "WRONG_EVENT",
          message: "QR is for a different event",
        },
      },
      APP_LEVEL_HTTP,
      req,
    );
  }
  // 6. Check staff_link_version revocation: jwt claim must match current events row.
  const { data: ev, error: evErr } = await service.from("events").select(
    "staff_link_version, event_end_time",
  ).eq("id", staffPayload.event_id).maybeSingle();
  if (evErr) {
    console.error("ticket-validate: events lookup failed", evErr);
    return jsonResponse(
      errorBody("DB_ERROR", "Failed to verify event state", evErr.message),
      500,
      req,
    );
  }
  if (!ev) {
    return jsonResponse(
      errorBody("EVENT_NOT_FOUND", "Event no longer exists"),
      404,
      req,
    );
  }
  if (ev.staff_link_version !== staffPayload.staff_link_version) {
    await safeLogScan(service, {
      event_id: body.scanner_event_id,
      qr_token: body.qr_token,
      result: "staff_token_revoked",
      scanner_device: body.scanner_device ?? null,
      ip_address: clientIp,
      details: {
        jwt_version: staffPayload.staff_link_version,
        current_version: ev.staff_link_version,
      },
    });
    return jsonResponse(
      errorBody(
        "STAFF_TOKEN_REVOKED",
        "Organizer revoked this staff link — request a new one",
      ),
      401,
      req,
    );
  }
  // 7. Atomic consume via RPC.
  const { data: rpcDataRaw, error: rpcErr } = await service.rpc(
    "ticket_validate_consume",
    {
      p_qr_token: body.qr_token,
    },
  );
  if (rpcErr) {
    console.error("ticket-validate: ticket_validate_consume failed", rpcErr);
    return jsonResponse(
      errorBody("DB_ERROR", "Failed to consume QR", rpcErr.message),
      500,
      req,
    );
  }
  const rpcData = rpcDataRaw;
  const attendeeId = qrPayload.attendee_id ?? null;
  // 8. Audit log every outcome (forensic + oversell post-mortem).
  await safeLogScan(service, {
    event_id: body.scanner_event_id,
    qr_token: body.qr_token,
    attendee_id: attendeeId,
    scanned_by: staffPayload.organizer_id ?? null,
    scanner_device: body.scanner_device ?? null,
    ip_address: clientIp,
    result: rpcData.result,
    details: rpcData.details ?? null,
  });
  // 9. Build response — green ✓ on consumed, red ✗ everywhere else.
  if (rpcData.result === "consumed") {
    return jsonResponse(
      {
        success: true,
        data: {
          attendee_name: rpcData.details?.attendee_name ?? null,
          ticket_tier: rpcData.details?.ticket_tier ?? null,
          short_id: rpcData.details?.short_id ?? null,
        },
      },
      APP_LEVEL_HTTP,
      req,
    );
  }
  return jsonResponse(
    {
      success: false,
      error: {
        code: rpcData.result.toUpperCase(),
        message: HUMAN_REASONS[rpcData.result],
        details: rpcData.details,
      },
    },
    APP_LEVEL_HTTP,
    req,
  );
});
async function safeLogScan(service, row) {
  try {
    const { error } = await service.from("event_check_ins").insert(row);
    if (error) {
      console.error("ticket-validate: audit log insert failed", error.message);
    }
  } catch (err) {
    console.error("ticket-validate: audit log threw", err);
  }
}
