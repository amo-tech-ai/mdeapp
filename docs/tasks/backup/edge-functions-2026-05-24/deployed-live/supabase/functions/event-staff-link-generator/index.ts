/**
 * event-staff-link-generator — Phase 1 events.
 *
 * Mints a 24h door-staff JWT for a specific event, returning a URL like
 * `https://mdeai.co/staff/check-in/<event_id>?token=<jwt>` that the
 * organizer (Sofía) WhatsApps to door staff (Andrés). The PWA at
 * `/staff/check-in/:event_id` (task 007) reads the token from the query
 * string, and `ticket-validate` (task 006) verifies it on every QR scan.
 *
 * Auth model:
 * - `verify_jwt = true` in supabase/config.toml — caller MUST be a logged-in
 *   user (the platform Supabase JWT).
 * - In-function check: caller must be the organizer of the requested event.
 *
 * Secret separation (audit M2):
 * - Door-staff JWTs are signed with `STAFF_LINK_SECRET` — NOT the Supabase
 *   `JWT_SECRET`. A leaked staff link can never be replayed against platform
 *   auth. Verifier (task 006) uses the same dedicated secret.
 *
 * Revocation: a separate companion endpoint (or this fn with `?action=revoke`)
 * bumps `events.staff_link_version`. Task 006 rejects any JWT whose
 * `staff_link_version` claim doesn't match the current row value, so the
 * existing 24h lifetime becomes irrelevant the moment the organizer revokes.
 */

import { z } from "https://esm.sh/zod@3.23.8";
import {
  errorBody,
  getCorsHeaders,
  jsonResponse,
} from "../_shared/http.ts";
import { getServiceClient, getUserClient, getUserId } from "../_shared/supabase-clients.ts";
import { signJwtHs256 } from "../_shared/jwt.ts";

const APP_BASE_URL = Deno.env.get("APP_BASE_URL") ?? "https://mdeai.co";

const RequestSchema = z.object({
  event_id: z.string().uuid(),
  /** Default 24h, max 168h (7 days). Out-of-range → 400. */
  ttl_hours: z.number().int().min(1).max(168).optional(),
  /** When true, bumps staff_link_version (revokes outstanding tokens) and returns the new version. */
  revoke: z.boolean().optional(),
});

type RequestBody = z.infer<typeof RequestSchema>;

interface EventRow {
  id: string;
  organizer_id: string;
  staff_link_version: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }
  if (req.method !== "POST") {
    return jsonResponse(
      errorBody("METHOD_NOT_ALLOWED", "Use POST"),
      405,
      req,
    );
  }

  // 1. Auth — must be a logged-in user. verify_jwt=true would also catch this,
  //    but defending in-function as well lets us return a structured error body.
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
        "Request payload didn't validate",
        err instanceof z.ZodError ? err.flatten() : String(err),
      ),
      400,
      req,
    );
  }

  // 3. Verify caller owns the event. Use a user-scoped client so RLS applies —
  //    the events SELECT policy already restricts visibility for unpublished
  //    events to organizers/admins, but we double-check `organizer_id` for
  //    published events too (anyone can SELECT a published event).
  const userClient = getUserClient(authHeader);
  const { data: event, error: eventErr } = await userClient
    .from("events")
    .select("id, organizer_id, staff_link_version")
    .eq("id", body.event_id)
    .maybeSingle<EventRow>();

  if (eventErr) {
    console.error("event-staff-link-generator: events lookup failed", eventErr);
    return jsonResponse(
      errorBody("DB_ERROR", "Failed to load event", eventErr.message),
      500,
      req,
    );
  }
  if (!event) {
    return jsonResponse(
      errorBody("EVENT_NOT_FOUND", "No event found with that id"),
      404,
      req,
    );
  }
  if (event.organizer_id !== userId) {
    return jsonResponse(
      errorBody(
        "NOT_ORGANIZER",
        "Only the event's organizer can generate a staff link",
      ),
      403,
      req,
    );
  }

  // 4. Branch on `revoke` — invalidate outstanding JWTs for this event.
  if (body.revoke === true) {
    const service = getServiceClient();
    const { data: bumped, error: bumpErr } = await service.rpc<number>(
      "bump_staff_link_version",
      { p_event_id: body.event_id },
    );
    if (bumpErr) {
      console.error("bump_staff_link_version failed", bumpErr);
      return jsonResponse(
        errorBody("DB_ERROR", "Failed to revoke staff link", bumpErr.message),
        500,
        req,
      );
    }
    return jsonResponse(
      {
        success: true,
        data: {
          revoked: true,
          staff_link_version: bumped ?? event.staff_link_version + 1,
        },
      },
      200,
      req,
    );
  }

  // 5. Sign the JWT with the dedicated STAFF_LINK_SECRET (audit M2).
  const secret = Deno.env.get("STAFF_LINK_SECRET");
  if (!secret) {
    console.error("STAFF_LINK_SECRET is not configured");
    return jsonResponse(
      errorBody("CONFIG_ERROR", "Server is missing required secret"),
      500,
      req,
    );
  }

  const ttl = body.ttl_hours ?? 24; // hours
  const nowSec = Math.floor(Date.now() / 1000);
  const expSec = nowSec + ttl * 3600;

  const jwt = await signJwtHs256(
    {
      event_id: event.id,
      organizer_id: event.organizer_id,
      staff_link_version: event.staff_link_version,
      role: "door_staff",
      iat: nowSec,
      exp: expSec,
    },
    secret,
  );

  return jsonResponse(
    {
      success: true,
      data: {
        staff_link_url: `${APP_BASE_URL}/staff/check-in/${event.id}?token=${jwt}`,
        jwt,
        expires_at: new Date(expSec * 1000).toISOString(),
        staff_link_version: event.staff_link_version,
      },
    },
    200,
    req,
  );
});
