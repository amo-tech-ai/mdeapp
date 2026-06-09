/**
 * postiz-schedule-posts — 063
 *
 * Schedules approved campaign posts to Postiz for social publishing.
 * Also inserts rows into posts_outbox for dispatch tracking.
 *
 * Auth: Bearer JWT (organizer) OR service_role (called by postiz-approval-webhook / 16A)
 * verify_jwt: false — auth checked manually so service_role can call it too
 *
 * Flow:
 *   1. Verify campaign_approvals.status = 'approved' — hard 400 if not
 *   2. Fetch approved social posts (ig/fb/tiktok/twitter/youtube/linkedin)
 *   3. For each: POST /public/v1/posts to Postiz
 *   4. Insert row into posts_outbox (idempotent)
 *   5. Update marketing.campaign_posts: postiz_post_id + status='scheduled'
 *   6. Log to ai_runs
 *
 * WhatsApp/email posts are skipped here — they go to 064 (openclaw-outreach).
 */

import { getCorsHeaders, jsonResponse, errorBody } from "../_shared/http.ts";
import { getServiceClient, getUserId } from "../_shared/supabase-clients.ts";

const SOCIAL_CHANNELS = new Set([
  "instagram", "facebook", "tiktok", "twitter", "youtube", "linkedin",
]);

interface PostizPostResponse {
  id: string;
  status: string;
}

async function postToPostiz(
  baseUrl: string,
  apiKey: string,
  integrationIds: Record<string, string>,
  post: { id: string; channel: string; content: string; scheduled_at: string; media_urls?: string[] },
): Promise<PostizPostResponse> {
  const integrationId = integrationIds[post.channel];
  if (!integrationId) throw new Error(`No Postiz integration for channel: ${post.channel}`);

  const body: Record<string, unknown> = {
    integration_id: integrationId,
    content: post.content,
    scheduled_at: post.scheduled_at,
  };
  if (post.media_urls?.length) {
    body.media = post.media_urls.map((url) => ({ url }));
  }

  const res = await fetch(`${baseUrl}/public/v1/posts`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Postiz API ${res.status}: ${text}`);
  }
  return res.json() as Promise<PostizPostResponse>;
}

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

  const postizBase = Deno.env.get("POSTIZ_BASE_URL");
  const postizKey = Deno.env.get("POSTIZ_API_KEY");
  const integrationRaw = Deno.env.get("POSTIZ_INTEGRATION_IDS") ?? "{}";
  if (!postizBase || !postizKey) {
    return jsonResponse(errorBody("CONFIG_ERROR", "Postiz credentials not configured"), 500, req);
  }
  let integrationIds: Record<string, string> = {};
  try {
    integrationIds = JSON.parse(integrationRaw);
  } catch {
    return jsonResponse(errorBody("CONFIG_ERROR", "POSTIZ_INTEGRATION_IDS is not valid JSON"), 500, req);
  }

  const { data: posts, error: postsErr } = await db
    .schema("marketing")
    .from("campaign_posts")
    .select("id, channel, content, scheduled_at, media_urls, postiz_post_id, status")
    .eq("campaign_id", campaign_id)
    .eq("status", "approved")
    .in("channel", [...SOCIAL_CHANNELS]);

  if (postsErr) {
    return jsonResponse(errorBody("DB_ERROR", postsErr.message), 500, req);
  }
  if (!posts?.length) {
    return jsonResponse({ success: true, data: { scheduled: 0, skipped: 0, message: "No approved social posts" } }, 200, req);
  }

  const { data: run } = await db
    .from("agent_runs")
    .insert({
      agent_kind: "postiz",
      agent_name: "postiz-schedule-posts",
      routine: "063",
      input: { campaign_id, approval_id, post_count: posts.length },
      status: "running",
    })
    .select("id")
    .single();
  const agentRunId = run?.id ?? null;

  let scheduled = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const post of posts) {
    if (post.postiz_post_id) { skipped++; continue; }

    const idempotencyKey = `063-${post.id}`;

    try {
      const result = await postToPostiz(postizBase, postizKey, integrationIds, {
        id: post.id,
        channel: post.channel,
        content: post.content,
        scheduled_at: post.scheduled_at,
        media_urls: post.media_urls ?? [],
      });

      await db
        .schema("marketing")
        .from("campaign_posts")
        .update({ postiz_post_id: result.id, status: "scheduled" })
        .eq("id", post.id);

      await db
        .from("posts_outbox")
        .upsert({
          agent_run_id: agentRunId,
          campaign_id,
          post_id: post.id,
          approval_id,
          provider: "postiz",
          channel: post.channel,
          status: "sent",
          external_id: result.id,
          payload: { idempotency_key: idempotencyKey, postiz_post_id: result.id },
          sent_at: new Date().toISOString(),
        }, { onConflict: "payload->>'idempotency_key',provider", ignoreDuplicates: true });

      scheduled++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`post ${post.id}: ${msg}`);

      await db
        .from("posts_outbox")
        .upsert({
          agent_run_id: agentRunId,
          campaign_id,
          post_id: post.id,
          approval_id,
          provider: "postiz",
          channel: post.channel,
          status: "failed",
          payload: { idempotency_key: idempotencyKey },
          last_error: msg,
          next_attempt_at: new Date(Date.now() + 60_000).toISOString(),
        }, { onConflict: "payload->>'idempotency_key',provider", ignoreDuplicates: true });
    }
  }

  const duration = Date.now() - t0;
  const finalStatus = errors.length === 0 ? "success" : scheduled > 0 ? "partial" : "error";

  if (agentRunId) {
    await db
      .from("agent_runs")
      .update({
        status: finalStatus,
        output: { scheduled, skipped, errors },
        finished_at: new Date().toISOString(),
        duration_ms: duration,
      })
      .eq("id", agentRunId);
  }

  return jsonResponse({
    success: true,
    data: { scheduled, skipped, errors: errors.length > 0 ? errors : undefined, duration_ms: duration },
  }, 200, req);
});
