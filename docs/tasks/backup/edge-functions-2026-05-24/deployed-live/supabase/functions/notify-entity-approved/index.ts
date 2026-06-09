/**
 * notify-entity-approved — Admin-triggered contestant notification.
 *
 * Called by the admin moderation page when Daniela approves or rejects
 * a contestant application. Sends a WhatsApp message via Infobip to the
 * contestant's verified phone (from auth.users, set during OTP task 016).
 *
 * Auth:    Bearer JWT — must have role admin or super_admin in user_roles.
 * Input:   { entity_id: string, action: "approved" | "rejected", rejection_reason?: string }
 * Output:  { success: true, data: { notified: boolean, channel: "whatsapp" | null, reason?: string } }
 * Fallback: if phone missing → returns notified=false, never blocks the admin action.
 */

import { getCorsHeaders, jsonResponse, errorBody } from "../_shared/http.ts";
import { getUserId, getServiceClient } from "../_shared/supabase-clients.ts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RequestBody {
  entity_id: string;
  action: "approved" | "rejected";
  rejection_reason?: string;
}

interface EntityRow {
  display_name: string;
  contest_id: string;
  created_by_user_id: string | null;
  vote_contests: {
    title: string;
    slug: string;
  } | null;
}

// ---------------------------------------------------------------------------
// Infobip WhatsApp helper
// ---------------------------------------------------------------------------

async function sendWhatsApp(
  to: string,
  text: string,
): Promise<{ ok: boolean; status: number }> {
  const baseUrl = Deno.env.get("INFOBIP_BASE_URL") ?? "";
  const apiKey  = Deno.env.get("INFOBIP_API_KEY")  ?? "";
  const from    = Deno.env.get("INFOBIP_PHONE_NUMBER") ?? "";

  if (!baseUrl || !apiKey || !from) {
    console.warn("[notify-entity-approved] Infobip env vars missing — skipping WhatsApp");
    return { ok: false, status: 0 };
  }

  const res = await fetch(`${baseUrl}/whatsapp/2/message/text`, {
    method: "POST",
    headers: {
      "Authorization": `App ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      content: { text },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(
      `[notify-entity-approved] Infobip error ${res.status}: ${body}`,
    );
  }

  return { ok: res.ok, status: res.status };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  // ── Auth ─────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get("Authorization");
  const userId = await getUserId(authHeader, undefined);
  if (!userId) {
    return jsonResponse(
      errorBody("UNAUTHORIZED", "Missing or invalid auth token"),
      401,
      req,
    );
  }

  const db = getServiceClient();

  // Verify admin role
  const { data: roleRow, error: roleErr } = await db
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "super_admin"])
    .or("expires_at.is.null,expires_at.gt.now()")
    .maybeSingle();

  if (roleErr || !roleRow) {
    return jsonResponse(
      errorBody("FORBIDDEN", "Admin role required"),
      403,
      req,
    );
  }

  // ── Parse + validate body ─────────────────────────────────────────────────
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

  const { entity_id, action, rejection_reason } = body;

  if (!entity_id || typeof entity_id !== "string") {
    return jsonResponse(
      errorBody("BAD_REQUEST", "entity_id is required"),
      400,
      req,
    );
  }
  if (action !== "approved" && action !== "rejected") {
    return jsonResponse(
      errorBody("BAD_REQUEST", "action must be 'approved' or 'rejected'"),
      400,
      req,
    );
  }
  if (action === "rejected" && !rejection_reason) {
    return jsonResponse(
      errorBody("BAD_REQUEST", "rejection_reason is required for rejected action"),
      400,
      req,
    );
  }

  const start = Date.now();

  // ── Fetch entity + contest ────────────────────────────────────────────────
  const { data: entity, error: entityErr } = await db
    .schema("vote" as never)
    .from("entities")
    .select("display_name, contest_id, created_by_user_id, vote_contests:contests!contest_id(title,slug)")
    .eq("id", entity_id)
    .single() as { data: EntityRow | null; error: unknown };

  if (entityErr || !entity) {
    return jsonResponse(
      errorBody("NOT_FOUND", "Entity not found"),
      404,
      req,
    );
  }

  // ── Fetch contestant phone from auth.users ────────────────────────────────
  let phone: string | null = null;

  if (entity.created_by_user_id) {
    const { data: authUser } = await db.auth.admin.getUserById(
      entity.created_by_user_id,
    );
    phone = authUser?.user?.phone ?? null;
  }

  // ── Send WhatsApp ─────────────────────────────────────────────────────────
  const contestTitle = entity.vote_contests?.title ?? "the contest";
  const contestSlug  = entity.vote_contests?.slug  ?? "";

  let notified = false;
  let notifyReason: string | undefined;

  if (phone) {
    const messageText = action === "approved"
      ? `¡Felicitaciones ${entity.display_name}! Tu perfil para ${contestTitle} ya está activo. ` +
        `Comparte tu link de votación: mdeai.co/vote/${contestSlug} 🏆`
      : `Hola ${entity.display_name}, necesitamos que actualices tu solicitud para ${contestTitle}. ` +
        `Motivo: ${rejection_reason}. Ingresa en mdeai.co/vote/${contestSlug}/apply para reenviar.`;

    const result = await sendWhatsApp(phone, messageText);
    notified = result.ok;
    if (!result.ok && result.status !== 0) {
      notifyReason = `infobip_error_${result.status}`;
    }
  } else {
    notifyReason = "no_phone_registered";
    console.warn(
      `[notify-entity-approved] No phone for user ${entity.created_by_user_id} — skipping WhatsApp`,
    );
  }

  // ── Log to ai_runs ────────────────────────────────────────────────────────
  const duration_ms = Date.now() - start;
  await db.from("ai_runs").insert({
    agent_name: "notify-entity-approved",
    duration_ms,
    status: notified ? "success" : "partial",
    input_tokens: 0,
    output_tokens: 0,
  });

  return jsonResponse(
    {
      success: true,
      data: {
        notified,
        channel: notified ? "whatsapp" : null,
        ...(notifyReason ? { reason: notifyReason } : {}),
      },
    },
    200,
    req,
  );
});
