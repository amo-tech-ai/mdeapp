/**
 * outbox-dispatch — triggered by pg_cron every minute
 *
 * Claims up to 50 rows from each outbox (posts_outbox, wa_outbox, email_outbox),
 * dispatches to provider, records receipts, handles exponential backoff.
 *
 * Auth: OUTBOX_DISPATCH_SECRET header (cron caller pattern)
 * verify_jwt: false — cron, not user traffic
 *
 * Backoff: next_attempt_at = now() + 2^attempts seconds (max 1h = 3600s)
 * Dead: after 7 attempts
 */

import { getCorsHeaders, jsonResponse, errorBody } from "../_shared/http.ts";
import { getServiceClient } from "../_shared/supabase-clients.ts";

const MAX_ATTEMPTS = 7;
const MAX_BACKOFF_SEC = 3600;
const BATCH_SIZE = 50;

function backoffSecs(attempts: number): number {
  return Math.min(2 ** attempts, MAX_BACKOFF_SEC);
}

async function dispatchPostizPost(
  payload: Record<string, unknown>,
  externalId: string | null,
): Promise<{ external_id: string }> {
  const base = Deno.env.get("POSTIZ_BASE_URL");
  const key = Deno.env.get("POSTIZ_API_KEY");
  if (!base || !key) throw new Error("Postiz not configured");

  if (externalId) return { external_id: externalId };

  const res = await fetch(`${base}/public/v1/posts`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Postiz ${res.status}: ${await res.text()}`);
  const data = await res.json() as { id: string };
  return { external_id: data.id };
}

async function dispatchWhatsApp(
  toE164: string,
  payload: Record<string, unknown>,
): Promise<{ external_id: string }> {
  const gateway = Deno.env.get("OPENCLAW_GATEWAY_URL");
  const token = Deno.env.get("OPENCLAW_GATEWAY_TOKEN");
  if (!gateway || !token) throw new Error("OpenClaw gateway not configured");

  const res = await fetch(`${gateway}/api/sendText`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatId: `${toE164}@c.us`,
      text: String(payload.text ?? ""),
    }),
  });
  if (!res.ok) throw new Error(`OpenClaw ${res.status}: ${await res.text()}`);
  const data = await res.json() as { id?: { id: string } };
  return { external_id: data.id?.id ?? crypto.randomUUID() };
}

Deno.serve(async (req: Request) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { status: 204, headers: cors });

  const secret = Deno.env.get("OUTBOX_DISPATCH_SECRET");
  const incoming = req.headers.get("x-outbox-dispatch-secret");
  if (!secret || !incoming || incoming !== secret) {
    return jsonResponse(errorBody("UNAUTHORIZED", "Invalid dispatch secret"), 401, req);
  }

  const db = getServiceClient();
  const t0 = Date.now();
  const stats = { posts: 0, wa: 0, email: 0, errors: 0 };

  const { data: postRows } = await db
    .from("posts_outbox")
    .select("id, payload, external_id, attempts, channel, campaign_id, post_id, approval_id, agent_run_id")
    .in("status", ["queued", "failed"])
    .lte("next_attempt_at", new Date().toISOString())
    .limit(BATCH_SIZE);

  for (const row of postRows ?? []) {
    await db.from("posts_outbox").update({ status: "dispatching" }).eq("id", row.id);
    try {
      const result = await dispatchPostizPost(
        row.payload as Record<string, unknown>,
        row.external_id,
      );
      await db.from("posts_outbox").update({
        status: "sent",
        external_id: result.external_id,
        sent_at: new Date().toISOString(),
        attempts: row.attempts + 1,
      }).eq("id", row.id);
      stats.posts++;
    } catch (e) {
      const newAttempts = row.attempts + 1;
      await db.from("posts_outbox").update({
        status: newAttempts >= MAX_ATTEMPTS ? "dead" : "failed",
        attempts: newAttempts,
        last_error: e instanceof Error ? e.message : String(e),
        next_attempt_at: new Date(Date.now() + backoffSecs(newAttempts) * 1000).toISOString(),
      }).eq("id", row.id);
      stats.errors++;
    }
  }

  const { data: waRows } = await db
    .from("wa_outbox")
    .select("id, payload, to_e164, external_id, attempts")
    .in("status", ["queued", "failed"])
    .lte("next_attempt_at", new Date().toISOString())
    .limit(BATCH_SIZE);

  for (const row of waRows ?? []) {
    await db.from("wa_outbox").update({ status: "dispatching" }).eq("id", row.id);
    try {
      const result = await dispatchWhatsApp(
        row.to_e164,
        row.payload as Record<string, unknown>,
      );
      await db.from("wa_outbox").update({
        status: "sent",
        external_id: result.external_id,
        sent_at: new Date().toISOString(),
        attempts: row.attempts + 1,
      }).eq("id", row.id);
      stats.wa++;
    } catch (e) {
      const newAttempts = row.attempts + 1;
      await db.from("wa_outbox").update({
        status: newAttempts >= MAX_ATTEMPTS ? "dead" : "failed",
        attempts: newAttempts,
        last_error: e instanceof Error ? e.message : String(e),
        next_attempt_at: new Date(Date.now() + backoffSecs(newAttempts) * 1000).toISOString(),
      }).eq("id", row.id);
      stats.errors++;
    }
  }

  return jsonResponse({
    success: true,
    data: { ...stats, duration_ms: Date.now() - t0 },
  }, 200, req);
});
