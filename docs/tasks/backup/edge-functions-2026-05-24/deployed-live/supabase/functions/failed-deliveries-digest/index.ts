/**
 * failed-deliveries-digest — 18B
 *
 * Triggered by pg_cron daily at 07:00 UTC.
 * Aggregates dead/failed outbox rows from the last 24h.
 * Sends digest via Resend if configured; logs to agent_runs always.
 *
 * Auth: DIGEST_SECRET header (cron caller pattern)
 * verify_jwt: false
 */

import { getCorsHeaders, jsonResponse, errorBody } from "../_shared/http.ts";
import { getServiceClient } from "../_shared/supabase-clients.ts";

interface OutboxSummary {
  table: string;
  dead_count: number;
  failed_count: number;
  sample_errors: string[];
}

async function queryOutbox(
  db: ReturnType<typeof getServiceClient>,
  table: string,
  since: string,
): Promise<OutboxSummary> {
  const [{ data: dead }, { data: failed }] = await Promise.all([
    db.from(table).select("id, last_error, updated_at").eq("status", "dead").gte("updated_at", since).limit(5),
    db.from(table).select("id, last_error, updated_at").eq("status", "failed").gte("next_attempt_at", since).limit(5),
  ]);
  const sampleErrors = [
    ...(dead ?? []).map((r: { last_error?: string }) => r.last_error ?? "unknown").slice(0, 3),
    ...(failed ?? []).map((r: { last_error?: string }) => r.last_error ?? "unknown").slice(0, 2),
  ].filter(Boolean).slice(0, 5);
  return { table, dead_count: (dead ?? []).length, failed_count: (failed ?? []).length, sample_errors: sampleErrors };
}

async function sendDigestEmail(to: string, summaries: OutboxSummary[], since: string): Promise<boolean> {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return false;
  const totalDead = summaries.reduce((n, s) => n + s.dead_count, 0);
  const totalFailed = summaries.reduce((n, s) => n + s.failed_count, 0);
  const tableRows = summaries.map((s) => `  ${s.table}: ${s.dead_count} dead, ${s.failed_count} failed`).join("\n");
  const sampleBlock = summaries.flatMap((s) => s.sample_errors.map((e) => `[${s.table}] ${e}`)).slice(0, 8).join("\n");
  const body = [
    `Delivery digest — ${new Date().toISOString()}`,
    `Period: ${since} → now`,
    "",
    "Outbox summary:",
    tableRows,
    "",
    `Totals: ${totalDead} dead, ${totalFailed} still failing`,
    "",
    sampleBlock ? `Sample errors:\n${sampleBlock}` : "No sample errors.",
    "",
    "Action: check Supabase outbox tables, re-queue or escalate dead rows.",
  ].join("\n");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "ops@mdeai.co",
      to: [to],
      subject: `[mdeai] Delivery digest — ${totalDead} dead, ${totalFailed} failing`,
      text: body,
    }),
  });
  return res.ok;
}

Deno.serve(async (req: Request) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { status: 204, headers: cors });

  const secret = Deno.env.get("DIGEST_SECRET");
  const incoming = req.headers.get("x-digest-secret");
  if (!secret || !incoming || incoming !== secret) {
    return jsonResponse(errorBody("UNAUTHORIZED", "Invalid digest secret"), 401, req);
  }

  const t0 = Date.now();
  const db = getServiceClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: run } = await db.from("agent_runs").insert({
    agent_kind: "openclaw",
    agent_name: "failed-deliveries-digest",
    routine: "18B",
    input: { since },
    status: "running",
  }).select("id").single();
  const agentRunId = run?.id ?? null;

  const summaries = await Promise.all([
    queryOutbox(db, "posts_outbox", since),
    queryOutbox(db, "wa_outbox", since),
    queryOutbox(db, "email_outbox", since),
  ]);

  const totalDead = summaries.reduce((n, s) => n + s.dead_count, 0);
  const totalFailed = summaries.reduce((n, s) => n + s.failed_count, 0);

  let emailSent = false;
  const digestTo = Deno.env.get("DIGEST_EMAIL_TO");
  if (digestTo && (totalDead > 0 || totalFailed > 0)) {
    emailSent = await sendDigestEmail(digestTo, summaries, since);
  }

  const duration = Date.now() - t0;

  if (agentRunId) {
    await db.from("agent_runs").update({
      status: "success",
      output: { summaries, total_dead: totalDead, total_failed: totalFailed, email_sent: emailSent },
      finished_at: new Date().toISOString(),
      duration_ms: duration,
    }).eq("id", agentRunId);
  }

  return jsonResponse({
    success: true,
    data: { summaries, total_dead: totalDead, total_failed: totalFailed, email_sent: emailSent, duration_ms: duration },
  }, 200, req);
});
