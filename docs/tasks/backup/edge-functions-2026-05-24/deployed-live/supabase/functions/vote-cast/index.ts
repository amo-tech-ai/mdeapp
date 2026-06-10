/**
 * vote-cast — POST /vote-cast
 *
 * 5-layer fraud defense:
 *   L1 Turnstile  — verifyTurnstile()
 *   L2 Nonce JWT  — verifyNonce()
 *   L3 DB UNIQUE  — idempotency_key + daily dedup (Postgres)
 *   L4 Sync rules — IP burst, device reuse, daily quota
 *   L5 Async scan — fraud-scan cron reads fraud_signals
 */
import { z } from "npm:zod@3.23.8";
import { getCorsHeaders, jsonResponse, errorBody } from "../_shared/http.ts";
import { allowRateDurable, clientIp } from "../_shared/rate-limit.ts";
import { getServiceClient, getUserId } from "../_shared/supabase-clients.ts";
import { verifyTurnstile } from "../_shared/turnstile.ts";
import { verifyNonce } from "../_shared/nonce.ts";

const BodySchema = z.object({
  contest_id:      z.string().uuid(),
  entity_id:       z.string().uuid(),
  nonce:           z.string().optional(),
  turnstile_token: z.string().optional(),
  fingerprint:     z.string().max(128).optional(),
  idempotency_key: z.string().uuid(),
  voter_anon_id:   z.string().max(64).optional(),
});

type Body = z.infer<typeof BodySchema>;

function ok(data: Record<string, unknown>, req: Request) {
  return jsonResponse({ success: true, data }, 200, req);
}
function err(status: number, code: string, message: string, req: Request) {
  return jsonResponse(errorBody(code, message), status, req);
}

Deno.serve(async (req: Request) => {
  const cors = getCorsHeaders(req);

  // ── CORS preflight ────────────────────────────────────────────────────────
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 204, headers: cors });
  }
  if (req.method !== "POST") {
    return jsonResponse(errorBody("METHOD_NOT_ALLOWED", "POST only"), 405, req);
  }

  const t0 = Date.now();
  const ip = clientIp(req);
  const country = req.headers.get("cf-ipcountry") ?? "XX";
  const authHeader = req.headers.get("authorization") ?? "";
  const service = getServiceClient();

  // ── Auth (optional — phone OTP user or anonymous) ─────────────────────────
  const userId = authHeader ? await getUserId(authHeader) : null;

  // ── Parse + validate body ──────────────────────────────────────────────────
  let body: Body;
  try {
    body = BodySchema.parse(await req.json());
  } catch (e) {
    return err(400, "INVALID_BODY", e instanceof Error ? e.message : "bad request", req);
  }

  const { contest_id, entity_id, nonce, turnstile_token, fingerprint, idempotency_key, voter_anon_id } = body;

  // ── L1: Turnstile ──────────────────────────────────────────────────────────
  const turnstileOk = await verifyTurnstile(turnstile_token, ip);
  if (!turnstileOk) {
    return err(403, "TURNSTILE_FAILED", "Bot challenge failed", req);
  }

  // ── L2: Nonce JWT ──────────────────────────────────────────────────────────
  const nonceResult = await verifyNonce(nonce, contest_id);
  if (!nonceResult.valid) {
    return err(403, "NONCE_INVALID", nonceResult.reason ?? "invalid nonce", req);
  }

  // ── Load contest ───────────────────────────────────────────────────────────
  const { data: contest, error: contestErr } = await service
    .from("contests")
    .select("id, status, free_votes_per_user_per_day")
    .eq("id", contest_id)
    .schema("vote")
    .single();

  if (contestErr || !contest) {
    return err(404, "CONTEST_NOT_FOUND", "Contest not found", req);
  }
  if (contest.status === "draft") {
    return err(404, "CONTEST_NOT_FOUND", "Contest not found", req);
  }
  if (contest.status !== "live") {
    return err(410, "CONTEST_CLOSED", "This contest is no longer accepting votes", req);
  }

  // ── L4 rate limit — IP burst ───────────────────────────────────────────────
  const rl = await allowRateDurable(service, `vote-cast-ip:${ip}`, 10, 60);
  if (!rl.allowed) {
    const headers = { ...cors, "Retry-After": String(rl.retry_after_seconds) };
    return new Response(
      JSON.stringify(errorBody("RATE_LIMITED", "Too many votes from this IP")),
      { status: 429, headers: { ...headers, "Content-Type": "application/json" } },
    );
  }

  // ── L4 rate limit — per user/anon ─────────────────────────────────────────
  const userBucket = userId ? `vote-cast-user:${userId}` : `vote-cast-anon:${voter_anon_id ?? ip}`;
  const rlUser = await allowRateDurable(service, userBucket, 20, 60);
  if (!rlUser.allowed) {
    return err(429, "RATE_LIMITED", "Slow down", req);
  }

  // ── L4 daily quota check ───────────────────────────────────────────────────
  if (userId) {
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const { count, error: quotaErr } = await service
      .from("votes")
      .select("id", { count: "exact", head: true })
      .eq("contest_id", contest_id)
      .eq("voter_user_id", userId)
      .eq("source", "audience")
      .gte("created_at", todayStart.toISOString())
      .schema("vote");

    if (!quotaErr && (count ?? 0) >= contest.free_votes_per_user_per_day) {
      return err(409, "DAILY_QUOTA_EXCEEDED", "You've used your vote for today", req);
    }
  }

  // ── L4 device fingerprint reuse ────────────────────────────────────────────
  const fraudRules: string[] = [];
  if (fingerprint) {
    const yesterday = new Date(Date.now() - 86_400_000).toISOString();
    const { count: deviceCount } = await service
      .from("votes")
      .select("voter_user_id", { count: "exact", head: true })
      .eq("device_hash", fingerprint)
      .eq("contest_id", contest_id)
      .neq("voter_user_id", userId ?? "")
      .gte("created_at", yesterday)
      .schema("vote");

    if ((deviceCount ?? 0) >= 3) {
      fraudRules.push("device_reuse");
    }
  }

  // ── L3 + L5: INSERT vote ───────────────────────────────────────────────────
  const ipHash = await sha256(`${ip}:${dailySalt()}`);
  const fraudStatus = fraudRules.length > 0 ? "suspicious" : "pending";

  const { error: insertErr } = await service.from("votes").insert({
    contest_id,
    entity_id,
    voter_user_id: userId,
    voter_anon_id: voter_anon_id ?? null,
    weight: fraudRules.length > 0 ? 0 : 1.0,
    source: "audience",
    ip_hash: ipHash,
    device_hash: fingerprint ?? null,
    user_agent: req.headers.get("user-agent")?.slice(0, 256) ?? null,
    country,
    fraud_status: fraudStatus,
    idempotency_key,
  }).schema("vote");

  // ── Handle idempotency replay ──────────────────────────────────────────────
  if (insertErr) {
    if (insertErr.code === "23505") {
      // UNIQUE violation on idempotency_key — safe replay
      const tally = await getTally(service, entity_id);
      return ok({ already_counted: true, tally }, req);
    }
    console.error("vote INSERT error:", insertErr);
    return err(500, "INSERT_FAILED", "Failed to record vote", req);
  }

  // ── L5: queue fraud signal if suspicious ──────────────────────────────────
  if (fraudRules.length > 0) {
    // Best-effort — don't fail the vote if this errors
    const { data: voteRow } = await service
      .from("votes")
      .select("id")
      .eq("idempotency_key", idempotency_key)
      .schema("vote")
      .single();

    if (voteRow?.id) {
      await service.from("fraud_signals").insert({
        vote_id: voteRow.id,
        rules_hit: fraudRules,
      }).schema("vote");
    }
  }

  // ── Fetch updated tally for optimistic update ──────────────────────────────
  const tally = await getTally(service, entity_id);

  // ── Log to ai_runs for auditability ───────────────────────────────────────
  const duration = Date.now() - t0;
  await service.from("ai_runs").insert({
    agent_name: "vote-cast",
    input_tokens: 0,
    output_tokens: 0,
    duration_ms: duration,
    status: "success",
    metadata: { contest_id, entity_id, fraud_status: fraudStatus, duration_ms: duration },
  });

  return ok({ tally, fraud_status: fraudStatus }, req);
});

// ── Helpers ────────────────────────────────────────────────────────────────

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Daily salt rotates at UTC midnight — privacy-preserving IP fingerprint. */
function dailySalt(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

async function getTally(service: ReturnType<typeof getServiceClient>, entityId: string) {
  const { data } = await service
    .from("entity_tally")
    .select("audience_votes, paid_votes, judge_score, weighted_total, rank, trend_24h")
    .eq("entity_id", entityId)
    .schema("vote")
    .maybeSingle();
  return data ?? null;
}
