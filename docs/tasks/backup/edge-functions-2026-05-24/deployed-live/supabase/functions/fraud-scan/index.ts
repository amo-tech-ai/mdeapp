/**
 * fraud-scan — pg_cron edge function (every 60 s)
 *
 * Auth: x-fraud-scan-secret header (not a user JWT — called by pg_cron).
 * Reads the last 5 minutes of votes, builds per-IP feature vectors,
 * calls Gemini Flash for anomaly classification, and updates
 * vote.fraud_signals with ai_label + ai_reason.
 */

import { callGeminiStructured, withRetry } from "../_shared/gemini.ts";
import { errorBody, getCorsHeaders, jsonResponse } from "../_shared/http.ts";
import { getServiceClient } from "../_shared/supabase-clients.ts";

interface VoteRow {
  id: string; contest_id: string; entity_id: string;
  voter_user_id: string | null; voter_anon_id: string | null;
  weight: number; source: string | null; ip_hash: string | null;
  device_hash: string | null; user_agent: string | null;
  country: string | null; fraud_score: number | null;
  fraud_status: string | null; idempotency_key: string | null; created_at: string;
}

interface FeatureVector {
  ip_hash: string; vote_count: number; unique_entities: number;
  unique_voter_ids: number; country_values: string[]; sources: string[]; votes_per_minute: number;
}

interface GeminiCluster { ip_hash: string; label: "bot" | "collusion" | "clean"; confidence: number; reason: string; }
interface GeminiResult { clusters: GeminiCluster[]; }

const FRAUD_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    clusters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          ip_hash: { type: "string" },
          label: { type: "string", enum: ["bot", "collusion", "clean"] },
          confidence: { type: "number" },
          reason: { type: "string" },
        },
        required: ["ip_hash", "label", "confidence", "reason"],
      },
    },
  },
  required: ["clusters"],
};

const SYSTEM_INSTRUCTION = `You are a fraud detection analyst for mdeai.co, a live voting platform for beauty pageants.

Analyze the provided vote cluster data and classify each IP cluster as:
- "bot": automated voting from scripts (same IP, high velocity, identical targets, sequential timing)
- "collusion": coordinated voting across multiple IPs targeting same entity in same burst
- "clean": organic voting pattern (reasonable rate, diverse targets, natural timing)

Feature interpretation:
- votes_per_minute > 10 from single IP → strong bot signal
- unique_entities / vote_count < 0.1 → all votes targeting one entity → suspicious
- unique_voter_ids = 0 (all anon) AND high velocity → very suspicious
- Multiple IPs all voting for same entity within 5 min window → possible collusion

Return a label and confidence for EACH cluster provided. Be conservative — classify clean if unsure.`;

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: getCorsHeaders(req) });

  const secret = Deno.env.get("FRAUD_SCAN_SECRET");
  const incomingSecret = req.headers.get("x-fraud-scan-secret");
  if (!secret || !incomingSecret || incomingSecret !== secret) {
    return jsonResponse(errorBody("UNAUTHORIZED", "Invalid or missing fraud scan secret"), 401, req);
  }

  const db = getServiceClient();
  const scanStart = Date.now();

  try {
    const { data: votes, error: votesErr } = await db
      .schema("vote").from("votes").select("*")
      .gt("created_at", new Date(Date.now() - 5 * 60 * 1_000).toISOString());

    if (votesErr) {
      console.error("[fraud-scan] DB error:", votesErr);
      return jsonResponse(errorBody("DB_ERROR", votesErr.message), 500, req);
    }

    const voteRows = (votes ?? []) as VoteRow[];
    if (voteRows.length === 0) return jsonResponse({ success: true, data: { processed: 0, skipped: "no_votes" } }, 200, req);
    if (voteRows.length < 3) return jsonResponse({ success: true, data: { processed: voteRows.length, skipped: "below_threshold" } }, 200, req);

    const grouped = new Map<string, VoteRow[]>();
    for (const vote of voteRows) {
      const key = vote.ip_hash ?? "__unknown__";
      const bucket = grouped.get(key) ?? [];
      bucket.push(vote);
      grouped.set(key, bucket);
    }

    const featureVectors: FeatureVector[] = [];
    for (const [ip_hash, bucket] of grouped.entries()) {
      featureVectors.push({
        ip_hash,
        vote_count: bucket.length,
        unique_entities: new Set(bucket.map((v) => v.entity_id)).size,
        unique_voter_ids: new Set(bucket.map((v) => v.voter_user_id ?? v.voter_anon_id).filter(Boolean)).size,
        country_values: [...new Set(bucket.map((v) => v.country).filter((c): c is string => c !== null))],
        sources: [...new Set(bucket.map((v) => v.source).filter((s): s is string => s !== null))],
        votes_per_minute: bucket.length / 5,
      });
    }

    const prompt = `Analyze the following IP vote clusters from the last 5 minutes of voting activity on mdeai.co.\n\nVote clusters (JSON):\n${JSON.stringify(featureVectors, null, 2)}\n\nClassify each cluster and return results for ALL ${featureVectors.length} clusters.`;

    const geminiResult = await withRetry(() =>
      callGeminiStructured<GeminiResult>({
        model: "gemini-3-flash-preview",
        prompt,
        systemInstruction: SYSTEM_INSTRUCTION,
        responseJsonSchema: FRAUD_RESPONSE_SCHEMA,
        thinkingLevel: "minimal",
        agentName: "fraud-scan",
        timeoutMs: 30_000,
      })
    );

    const clusters = geminiResult.data.clusters ?? [];
    const flaggedClusters = clusters.filter((c) => c.label !== "clean");
    let flaggedCount = 0;
    let highConfidenceBots = 0;

    for (const cluster of flaggedClusters) {
      const bucket = grouped.get(cluster.ip_hash);
      if (!bucket || bucket.length === 0) continue;
      const voteIds = bucket.map((v) => v.id);
      flaggedCount += voteIds.length;
      const { error: updateErr } = await db.schema("vote").from("fraud_signals")
        .update({ ai_label: cluster.label, ai_reason: cluster.reason }).in("vote_id", voteIds);
      if (updateErr) console.error(`[fraud-scan] fraud_signals update error for ${cluster.ip_hash}:`, updateErr);
      if (cluster.confidence > 0.8 && cluster.label === "bot") {
        highConfidenceBots += voteIds.length;
        console.warn(`[fraud-scan] HIGH-CONFIDENCE BOT: ip_hash=${cluster.ip_hash} confidence=${cluster.confidence.toFixed(3)} votes=${voteIds.length} reason="${cluster.reason}"`);
      }
    }

    const duration_ms = Date.now() - scanStart;
    await db.from("ai_runs").insert({ agent_name: "fraud-scan", duration_ms, status: "success", input_tokens: 0, output_tokens: 0 });
    return jsonResponse({ success: true, data: { processed: voteRows.length, flagged: flaggedCount, high_confidence_bots: highConfidenceBots } }, 200, req);

  } catch (err) {
    const duration_ms = Date.now() - scanStart;
    const message = err instanceof Error ? err.message : String(err);
    console.error("[fraud-scan] Unhandled error:", message);
    try { await db.from("ai_runs").insert({ agent_name: "fraud-scan", duration_ms, status: "error", input_tokens: 0, output_tokens: 0 }); } catch { /* ignore */ }
    return jsonResponse(errorBody("INTERNAL_ERROR", message), 500, req);
  }
});
