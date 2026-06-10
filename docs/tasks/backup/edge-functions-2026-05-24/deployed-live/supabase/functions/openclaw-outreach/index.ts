/**
 * openclaw-outreach — 064
 *
 * Queues approved campaign WhatsApp/email posts to wa_outbox / email_outbox.
 * Mirrors postiz-schedule-posts (063) but for OpenClaw + email channels.
 *
 * Auth: Bearer JWT (organizer) OR service_role (called by approval webhook)
 * verify_jwt: false — auth checked manually so service_role can call it too
 */

import { getCorsHeaders, jsonResponse, errorBody } from "../_shared/http.ts";
import { getServiceClient, getUserId } from "../_shared/supabase-clients.ts";

const WA_CHANNELS = new Set(["whatsapp"]);
const EMAIL_CHANNELS = new Set(["email"]);

Deno.serve(async (req: Request) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { status: 204, headers: cors });

  const t0 = Date.now();
  const db = getServiceClient();

  const authHeader = req.headers.get("Authorization") ?? "";
  const userId = authHeader ? await getUserId(authHeader) : null;
  const isServiceRole = authHeader.includes(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "NONE");
  if (!userId && !isServiceRole) {
    return jsonResponse(errorBody("UNAUTHORIZED", "Missing or invalid auth"), 401, req);
  }

  let body: { campaign_id: string; approval_id: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse(errorBody("BAD_REQUEST", "Invalid JSON"), 400, req);
  }
  const { campaign_id, approval_id } = body;
  if (!campaign_id || !approval_id) {
    return jsonResponse(errorBody("BAD_REQUEST", "campaign_id and approval_id required"), 400, req);
  }

  const { data: approval, error: approvalErr } = await db
    .schema("marketing")
    .from("campaign_approvals")
    .select("id, status, campaign_id")
    .eq("id", approval_id)
    .eq("campaign_id", campaign_id)
    .single();

  if (approvalErr || !approval) {
    return jsonResponse(errorBody("NOT_FOUND", "Approval not found"), 404, req);
  }
  if (approval.status !== "approved") {
    return jsonResponse(
      errorBody("APPROVAL_REQUIRED", `Campaign approval status is '${approval.status}', expected 'approved'`),
      400, req,
    );
  }

  const { data: posts, error: postsErr } = await db
    .schema("marketing")
    .from("campaign_posts")
    .select("id, channel, content, scheduled_at, media_urls, status, metadata")
    .eq("campaign_id", campaign_id)
    .eq("status", "approved")
    .in("channel", ["whatsapp", "email"]);

  if (postsErr) {
    return jsonResponse(errorBody("DB_ERROR", postsErr.message), 500, req);
  }
  if (!posts?.length) {
    return jsonResponse({
      success: true,
      data: { queued: 0, skipped: 0, message: "No approved WA/email posts" },
    }, 200, req);
  }

  const { data: run } = await db
    .from("agent_runs")
    .insert({
      agent_kind: "openclaw",
      agent_name: "openclaw-outreach",
      routine: "064",
      input: { campaign_id, approval_id, post_count: posts.length },
      status: "running",
    })
    .select("id")
    .single();
  const agentRunId = run?.id ?? null;

  let queued = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const post of posts) {
    const idempotencyKey = `064-${post.id}`;
    try {
      if (WA_CHANNELS.has(post.channel)) {
        const toE164: string | null =
          (post.metadata as Record<string, unknown> | null)?.to_e164 as string ?? null;
        if (!toE164) {
          errors.push(`post ${post.id}: missing to_e164 in metadata`);
          continue;
        }
        await db.from("wa_outbox").upsert({
          agent_run_id: agentRunId,
          to_e164: toE164,
          payload: { idempotency_key: idempotencyKey, text: post.content, campaign_id, post_id: post.id },
          status: "queued",
          next_attempt_at: post.scheduled_at ?? new Date().toISOString(),
        }, { onConflict: "payload->>'idempotency_key',provider", ignoreDuplicates: true });
        await db.schema("marketing").from("campaign_posts").update({ status: "scheduled" }).eq("id", post.id);
        queued++;
      } else if (EMAIL_CHANNELS.has(post.channel)) {
        const toEmail: string | null =
          (post.metadata as Record<string, unknown> | null)?.to_email as string ?? null;
        if (!toEmail) {
          errors.push(`post ${post.id}: missing to_email in metadata`);
          continue;
        }
        await db.from("email_outbox").upsert({
          agent_run_id: agentRunId,
          to_email: toEmail,
          payload: {
            idempotency_key: idempotencyKey,
            subject: (post.metadata as Record<string, unknown> | null)?.subject ?? "Campaign Update",
            body: post.content,
            campaign_id,
            post_id: post.id,
          },
          status: "queued",
          next_attempt_at: post.scheduled_at ?? new Date().toISOString(),
        }, { onConflict: "payload->>'idempotency_key',provider", ignoreDuplicates: true });
        await db.schema("marketing").from("campaign_posts").update({ status: "scheduled" }).eq("id", post.id);
        queued++;
      } else {
        skipped++;
      }
    } catch (e) {
      errors.push(`post ${post.id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const duration = Date.now() - t0;
  const finalStatus = errors.length === 0 ? "success" : queued > 0 ? "partial" : "error";

  if (agentRunId) {
    await db.from("agent_runs").update({
      status: finalStatus,
      output: { queued, skipped, errors },
      finished_at: new Date().toISOString(),
      duration_ms: duration,
    }).eq("id", agentRunId);
  }

  return jsonResponse({
    success: true,
    data: { queued, skipped, errors: errors.length > 0 ? errors : undefined, duration_ms: duration },
  }, 200, req);
});
