/**
 * postiz-approval-webhook — 16A — Board approve → Postiz publish.
 *
 * Trigger `tg_campaign_approval_publish` calls this when
 * `campaign_approvals.status` flips to `approved`. We:
 *
 *   1. Verify HMAC over `${ts}.${rawBody}` using BRIDGE_SECRET (5 min window)
 *   2. Re-check that the approval is still `approved` (handles revocation race)
 *   3. Idempotency: if any posts_outbox row exists for approval_id+postiz, return 200 noop
 *   4. Invoke `postiz-schedule-posts` for the campaign
 *   5. On success → insert one posts_outbox row per scheduled post (status='scheduled')
 *   6. On failure → insert posts_outbox rows with status='failed' + escalate via campaign_events
 *   7. Always log a row to agent_runs with status + duration_ms
 *
 * No LLM, no user JWT — service-role only, called by trusted internal source.
 */

import { verifyBridgeRequest } from "../_shared/bridge-hmac.ts";
import { getServiceClient } from "../_shared/supabase-clients.ts";

const VERSION = "1.0.0";

interface RequestBody {
  approval_id: string;
  campaign_id: string;
}

interface CampaignApprovalRow {
  id: string;
  campaign_id: string;
  status: string;
}

interface SchedulePostsResult {
  ok: boolean;
  scheduled?: Array<{ post_id: string; external_id: string }>;
  error_code?: string;
  error_message?: string;
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function errorResponse(status: number, code: string, message: string): Response {
  return jsonResponse({ success: false, error: { code, message } }, status);
}

function isUuid(s: unknown): s is string {
  return typeof s === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

async function readRawBody(req: Request): Promise<{ raw: Uint8Array; parsed: unknown }> {
  const buf = new Uint8Array(await req.arrayBuffer());
  if (buf.length === 0) return { raw: buf, parsed: {} };
  const text = new TextDecoder().decode(buf);
  let parsed: unknown = {};
  try { parsed = JSON.parse(text); } catch { parsed = null; }
  return { raw: buf, parsed };
}

async function callSchedulePosts(campaignId: string): Promise<SchedulePostsResult> {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    return { ok: false, error_code: "ENV_MISSING", error_message: "SUPABASE_URL or SERVICE_ROLE_KEY missing" };
  }
  try {
    const r = await fetch(`${url}/functions/v1/postiz-schedule-posts`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ campaign_id: campaignId }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      return {
        ok: false,
        error_code: `SCHEDULE_${r.status}`,
        error_message: typeof data === "object" && data && "error" in data ? JSON.stringify((data as { error: unknown }).error) : `HTTP ${r.status}`,
      };
    }
    const scheduled = Array.isArray((data as { scheduled?: unknown }).scheduled)
      ? ((data as { scheduled: Array<{ post_id: string; external_id: string }> }).scheduled)
      : [];
    return { ok: true, scheduled };
  } catch (err) {
    return { ok: false, error_code: "SCHEDULE_THROW", error_message: (err as Error).message };
  }
}

Deno.serve(async (req) => {
  const t0 = Date.now();
  if (req.method !== "POST") return errorResponse(405, "METHOD_NOT_ALLOWED", "POST only");

  const { raw, parsed } = await readRawBody(req);

  // 1. HMAC verify
  const auth = await verifyBridgeRequest(req, raw);
  if (!auth.ok) {
    const status = auth.code === "BRIDGE_SECRET_MISSING" ? 503 : 401;
    return errorResponse(status, auth.code, "bridge auth failed");
  }

  // 2. Validate body
  if (!parsed || typeof parsed !== "object") {
    return errorResponse(400, "BAD_REQUEST", "body must be JSON object");
  }
  const body = parsed as Partial<RequestBody>;
  if (!isUuid(body.approval_id) || !isUuid(body.campaign_id)) {
    return errorResponse(400, "BAD_REQUEST", "approval_id and campaign_id must be uuids");
  }

  const approvalId = body.approval_id;
  const campaignId = body.campaign_id;
  const supa = getServiceClient();
  let outcomeStatus: "ok" | "failed" | "noop" = "ok";
  let outcomeCode: string | undefined;

  try {
    // 3. Re-check approval status (handles revocation race)
    const { data: approval, error: approvalErr } = await supa
      .from("campaign_approvals")
      .select("id, campaign_id, status")
      .eq("id", approvalId)
      .single<CampaignApprovalRow>();

    if (approvalErr || !approval) {
      outcomeStatus = "failed";
      outcomeCode = "APPROVAL_NOT_FOUND";
      return errorResponse(404, "APPROVAL_NOT_FOUND", approvalErr?.message ?? "row missing");
    }
    if (approval.status !== "approved") {
      outcomeStatus = "failed";
      outcomeCode = "APPROVAL_NOT_APPROVED";
      return errorResponse(409, "APPROVAL_NOT_APPROVED", `status=${approval.status}`);
    }
    if (approval.campaign_id !== campaignId) {
      outcomeStatus = "failed";
      outcomeCode = "CAMPAIGN_MISMATCH";
      return errorResponse(400, "CAMPAIGN_MISMATCH", "campaign_id does not match approval");
    }

    // 4. Idempotency: any prior outbox row for this approval+postiz means we already ran.
    const { count: existingCount } = await supa
      .from("posts_outbox")
      .select("id", { count: "exact", head: true })
      .eq("approval_id", approvalId)
      .eq("provider", "postiz");

    if ((existingCount ?? 0) > 0) {
      outcomeStatus = "noop";
      return jsonResponse({ success: true, idempotent: true, count: existingCount }, 200);
    }

    // 5. Schedule posts
    const result = await callSchedulePosts(campaignId);

    if (result.ok && result.scheduled) {
      const rows = result.scheduled.map((s) => ({
        campaign_id: campaignId,
        post_id: s.post_id,
        provider: "postiz" as const,
        external_id: s.external_id,
        status: "scheduled" as const,
        approval_id: approvalId,
        attempts: 1,
      }));
      if (rows.length > 0) {
        const { error: insertErr } = await supa.from("posts_outbox").insert(rows);
        if (insertErr) {
          outcomeStatus = "failed";
          outcomeCode = "OUTBOX_INSERT_FAILED";
          return errorResponse(500, "OUTBOX_INSERT_FAILED", insertErr.message);
        }
      }
      return jsonResponse({ success: true, scheduled: rows.length }, 200);
    }

    // 6. Failure path — record + escalate
    outcomeStatus = "failed";
    outcomeCode = result.error_code ?? "SCHEDULE_FAILED";
    await supa.from("posts_outbox").insert({
      campaign_id: campaignId,
      post_id: approvalId,
      provider: "postiz",
      status: "failed",
      approval_id: approvalId,
      error_code: outcomeCode,
      error_message: result.error_message ?? null,
      attempts: 1,
    });
    await supa.from("campaign_events").insert({
      campaign_id: campaignId,
      event_type: "post_failed",
      payload: { approval_id: approvalId, error_code: outcomeCode, error_message: result.error_message },
    });
    return errorResponse(502, "SCHEDULE_FAILED", result.error_message ?? "upstream failed");
  } finally {
    const duration_ms = Date.now() - t0;
    try {
      await supa.from("agent_runs").insert({
        agent_name: "postiz-approval-webhook",
        target: "postiz",
        status: outcomeStatus === "noop" ? "ok" : outcomeStatus,
        duration_ms,
        input_tokens: 0,
        output_tokens: 0,
        error_code: outcomeCode ?? null,
        metadata: { approval_id: approvalId, campaign_id: campaignId, version: VERSION, idempotent: outcomeStatus === "noop" },
      });
    } catch (_) { /* best-effort */ }
  }
});
