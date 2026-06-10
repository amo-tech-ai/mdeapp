/**
 * sponsor-click — Public beacon for recording ad clicks + returning redirect URL.
 *
 * Called fire-and-forget from SponsoredSurface onClick. No auth required.
 * Validates that the placement is still active, records the click, and
 * returns a UTM-decorated redirect URL for the caller to navigate to.
 *
 * Auth:   None (verify_jwt = false)
 * Input:  { placement_id: string (UUID), viewer_anon_id?: string, utm_full?: string }
 * Output: { success: true, data: { redirect_url: string } }
 *         { success: false, error: { code, message } } on validation errors
 */

import { getCorsHeaders, jsonResponse, errorBody } from "../_shared/http.ts";
import { getServiceClient, getUserId } from "../_shared/supabase-clients.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function hashIp(ip: string): Promise<string> {
  const salt = new Date().toISOString().slice(0, 10); // YYYY-MM-DD — daily salt
  const data = new TextEncoder().encode(ip + salt);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

function buildUtmUrl(
  destination: string,
  placementId: string,
  surface: string,
): string {
  try {
    const url = new URL(destination);
    url.searchParams.set("utm_source", "mdeai");
    url.searchParams.set("utm_medium", surface);
    url.searchParams.set("utm_campaign", "mdeai-sponsor");
    url.searchParams.set("utm_content", placementId);
    return url.toString();
  } catch {
    return destination;
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PlacementRow {
  id: string;
  utm_destination: string;
  surface: string;
  active: boolean;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  // ── Parse body ─────────────────────────────────────────────────────────────
  let placement_id: string;
  let viewer_anon_id: string | undefined;
  let utm_full: string | undefined;

  try {
    const body = (await req.json()) as Record<string, unknown>;
    placement_id = typeof body.placement_id === "string" ? body.placement_id : "";
    viewer_anon_id =
      typeof body.viewer_anon_id === "string" ? body.viewer_anon_id : undefined;
    utm_full =
      typeof body.utm_full === "string" ? body.utm_full : undefined;
  } catch {
    return jsonResponse(
      errorBody("BAD_REQUEST", "Request body must be valid JSON"),
      400,
      req,
    );
  }

  // ── Validate placement_id ──────────────────────────────────────────────────
  if (!placement_id || !UUID_RE.test(placement_id)) {
    return jsonResponse(
      errorBody("BAD_REQUEST", "placement_id must be a valid UUID"),
      400,
      req,
    );
  }
  if (viewer_anon_id && viewer_anon_id.length > 36) {
    viewer_anon_id = viewer_anon_id.slice(0, 36);
  }

  const db = getServiceClient();
  const sponsorDb = (db as unknown as { schema: (s: string) => typeof db }).schema(
    "sponsor" as never,
  );

  // ── Load placement — must be active ───────────────────────────────────────
  const { data: placement, error: placementErr } = await sponsorDb
    .from("placements")
    .select("id, utm_destination, surface, active")
    .eq("id", placement_id)
    .eq("active", true)
    .maybeSingle() as { data: PlacementRow | null; error: unknown };

  if (placementErr || !placement) {
    return jsonResponse(
      errorBody("NOT_FOUND", "Placement not found or inactive"),
      404,
      req,
    );
  }

  // ── Resolve auth user id (optional — enables user-to-user attribution) ──────
  const authHeader = req.headers.get("Authorization");
  const viewerUserId = authHeader ? await getUserId(authHeader) : null;

  // ── Record click — swallow errors ──────────────────────────────────────────
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
    const ip_hash = ip ? await hashIp(ip) : null;

    await sponsorDb.from("clicks").insert({
      placement_id,
      viewer_user_id: viewerUserId ?? null,
      viewer_anon_id: viewer_anon_id ?? null,
      utm_full: utm_full ?? null,
      ip_hash,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[sponsor-click] DB insert failed:", err);
    // Swallow — click loss is acceptable; still return redirect_url
  }

  // ── Build redirect URL ─────────────────────────────────────────────────────
  const redirect_url = buildUtmUrl(
    placement.utm_destination,
    placement.id,
    placement.surface,
  );

  return jsonResponse({ success: true, data: { redirect_url } }, 200, req);
});
