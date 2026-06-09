/**
 * sponsor-impression — Public beacon for recording ad impressions.
 *
 * Called fire-and-forget from SponsoredSurface component whenever a
 * placement is rendered. No auth required (public surface).
 *
 * Auth:   None (verify_jwt = false)
 * Input:  { placement_id: string (UUID), surface: string (max 50), viewer_anon_id?: string (max 36) }
 * Output: { success: true }
 *
 * NEVER returns 5xx — impression loss is acceptable; never block the caller.
 */

import { getCorsHeaders, jsonResponse, errorBody } from "../_shared/http.ts";
import { getServiceClient } from "../_shared/supabase-clients.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function hashIp(ip: string): Promise<string> {
  // Daily salt — rotates every 24h for privacy compliance
  const salt = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const data = new TextEncoder().encode(ip + salt);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  // ── viewer_user_id — intentionally not extracted on this public beacon ──────
  // This is a fire-and-forget beacon; adding a Supabase Auth round-trip would
  // add ~100ms of latency on every ad render. More importantly, decoding the JWT
  // payload with atob() (without verifying the signature) lets any caller forge
  // an arbitrary user_id, poisoning sponsor ROI analytics.
  // If per-user impression attribution matters later, pass it through a verified
  // server-side call rather than a client beacon.
  const viewer_user_id: string | null = null;

  // ── Parse body ─────────────────────────────────────────────────────────────
  let placement_id: string;
  let surface: string;
  let viewer_anon_id: string | undefined;

  try {
    const body = (await req.json()) as Record<string, unknown>;
    placement_id = typeof body.placement_id === "string" ? body.placement_id : "";
    surface = typeof body.surface === "string" ? body.surface : "";
    viewer_anon_id =
      typeof body.viewer_anon_id === "string" ? body.viewer_anon_id : undefined;
  } catch {
    return jsonResponse(
      errorBody("BAD_REQUEST", "Request body must be valid JSON"),
      400,
      req,
    );
  }

  // ── Validate ───────────────────────────────────────────────────────────────
  if (!placement_id || !UUID_RE.test(placement_id)) {
    return jsonResponse(
      errorBody("BAD_REQUEST", "placement_id must be a valid UUID"),
      400,
      req,
    );
  }
  if (!surface || surface.length > 50) {
    return jsonResponse(
      errorBody("BAD_REQUEST", "surface is required and must be ≤ 50 characters"),
      400,
      req,
    );
  }
  if (viewer_anon_id && viewer_anon_id.length > 36) {
    viewer_anon_id = viewer_anon_id.slice(0, 36);
  }

  // ── Record impression ──────────────────────────────────────────────────────
  // Wrap in try/catch — NEVER return 5xx on DB error (impression loss is acceptable)
  try {
    const db = getServiceClient();
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
    const ip_hash = ip ? await hashIp(ip) : null;

    await (db as unknown as { schema: (s: string) => typeof db })
      .schema("sponsor" as never)
      .from("impressions")
      .insert({
        placement_id,
        surface,
        viewer_user_id: viewer_user_id ?? null,
        viewer_anon_id: viewer_anon_id ?? null,
        ip_hash,
        user_agent: req.headers.get("user-agent")?.slice(0, 255) ?? null,
        created_at: new Date().toISOString(),
      });
  } catch (err) {
    // Log but swallow — caller must not see 5xx
    console.error("[sponsor-impression] DB insert failed:", err);
  }

  return jsonResponse({ success: true }, 200, req);
});
