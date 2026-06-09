/**
 * sponsor-roi-explain  -  Gemini daily ROI narrative for sponsor applications.
 *
 * POST /functions/v1/sponsor-roi-explain
 * Auth: Bearer JWT (scoped to application; resolved via `_shared/auth-request.requireAuthenticatedUser`)
 *   OR Bearer SPONSOR_ROI_CRON_SECRET (cron bypasses user lookup).
 * Body: { application_id: string }
 * Returns: { success: true, data: { insight, recommendation, action? } }
 *
 * Stores insight to sponsor.applications.campaign_goals->>'ai_insight'.
 * Called on-demand by sponsor dashboard + daily pg_cron batch.
 */

import { z } from "npm:zod@3.23.8";
import { requireAuthenticatedUser } from "../_shared/auth-request.ts";
import { getCorsHeaders, errorBody, jsonResponse } from "../_shared/http.ts";
import { getServiceClient } from "../_shared/supabase-clients.ts";
import { timingSafeEqual } from "../_shared/crypto.ts";
import { sponsorApplicationAccessible } from "../_shared/sponsor-access.ts";
import { callGeminiStructured, withRetry } from "../_shared/gemini.ts";
import { insertAiRun } from "../_shared/ai-runs.ts";

const AGENT_NAME = "sponsor-roi-explain";
const MODEL = "gemini-3-flash-preview" as const;

const requestSchema = z.object({
  application_id: z.string().uuid(),
});

// Industry CTR benchmarks (surface -> baseline %)
const BENCHMARKS: Record<string, number> = {
  contest_header:     3.2,
  leaderboard_footer: 1.8,
  digital_banner:     2.1,
  category_header:    2.5,
  contestant_profile: 4.0,
  qr_station:         6.5,
};

const responseSchema = {
  type: "object",
  required: ["insight", "recommendation"],
  properties: {
    insight: {
      type: "string",
      description: "<= 3 sentences explaining the performance trend in English",
    },
    recommendation: {
      type: "string",
      description: "1 concrete next action in English",
    },
    action: {
      type: "object",
      description: "Optional machine-readable action",
      properties: {
        type: { type: "string" },
        payload: { type: "object" },
      },
    },
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: getCorsHeaders(req) });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !/^Bearer\s+/i.test(authHeader.trim())) {
    return jsonResponse(errorBody("UNAUTHORIZED", "Missing Authorization header"), 401, req);
  }

  let body: z.infer<typeof requestSchema>;
  try {
    body = requestSchema.parse(await req.json());
  } catch (e) {
    return jsonResponse(errorBody("BAD_REQUEST", String(e)), 400, req);
  }

  const { application_id } = body;

  const bearer = authHeader.replace(/^Bearer\s+/i, "").trim();
  const cronSecret = Deno.env.get("SPONSOR_ROI_CRON_SECRET");

  let logUserId: string | null = null;

  const svc = getServiceClient();

  if (cronSecret && timingSafeEqual(bearer, cronSecret)) {
    logUserId = Deno.env.get("SPONSOR_CRON_AI_RUN_USER_ID") ?? null;
  } else {
    const userAuth = await requireAuthenticatedUser(req);
    if (!userAuth.ok) {
      return jsonResponse(errorBody("UNAUTHORIZED", userAuth.message), 401, req);
    }
    if (!(await sponsorApplicationAccessible(userAuth.authorization, application_id))) {
      return jsonResponse(errorBody("FORBIDDEN", "Application not accessible"), 403, req);
    }
    logUserId = userAuth.userId;
  }

  // Fetch application + 7-day roi_daily joined with placement surface
  const [appResult, roiResult] = await Promise.all([
    svc
      .schema("sponsor")
      .from("applications")
      .select("id, tier, campaign_goals, event_id, events(name)")
      .eq("id", application_id)
      .single(),
    svc
      .schema("sponsor")
      .from("roi_daily")
      .select(`
        day, impressions, clicks, conversions, spend_cents,
        placements!inner(surface, application_id)
      `)
      .eq("placements.application_id", application_id)
      .gte("day", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
      .order("day", { ascending: false }),
  ]);

  if (appResult.error || !appResult.data) {
    return jsonResponse(errorBody("NOT_FOUND", "Application not found"), 404, req);
  }

  if (roiResult.error) {
    return jsonResponse(errorBody("ROI_EXPLAIN_ERROR", roiResult.error.message), 500, req);
  }

  const roiRows = roiResult.data ?? [];
  const totalImpressions = roiRows.reduce((s, r) => s + (r.impressions ?? 0), 0);
  const totalClicks = roiRows.reduce((s, r) => s + (r.clicks ?? 0), 0);
  const totalConversions = roiRows.reduce((s, r) => s + (r.conversions ?? 0), 0);
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0";

  const surfaceSummary = roiRows
    .reduce((acc: Record<string, { impressions: number; clicks: number }>, r) => {
      const surface = (r.placements as { surface?: string })?.surface ?? "unknown";
      if (!acc[surface]) acc[surface] = { impressions: 0, clicks: 0 };
      acc[surface].impressions += r.impressions ?? 0;
      acc[surface].clicks += r.clicks ?? 0;
      return acc;
    }, {});

  const benchmarkLines = Object.entries(surfaceSummary)
    .map(([surface, stats]) => {
      const baseline = BENCHMARKS[surface] ?? 2.0;
      const actualCtr = stats.impressions > 0 ? ((stats.clicks / stats.impressions) * 100).toFixed(2) : "0";
      return `${surface}: CTR ${actualCtr}% (benchmark ${baseline}%)`;
    })
    .join("\n");

  // PostgREST returns the FK join as an array even when 1:1.
  const eventJoin = appResult.data.events as unknown as { name?: string } | { name?: string }[] | null;
  const eventName = Array.isArray(eventJoin) ? eventJoin[0]?.name : eventJoin?.name;

  const prompt = `You are a marketing analyst for mdeai.co, a premium events platform in Medellin, Colombia.
The sponsor for "${eventName ?? "this event"}" has the following results over the last 7 days:

Total impressions: ${totalImpressions.toLocaleString()}
Total clicks: ${totalClicks.toLocaleString()}
Overall CTR: ${ctr}%
Attributed conversions: ${totalConversions}

Performance by surface vs industry benchmarks:
${benchmarkLines || "No surface data available yet"}

Write in ENGLISH. Be concise, specific, and actionable. Maximum 3 sentences of insight + 1 recommendation.`;

  const start = Date.now();
  try {
    const geminiResult = await withRetry(() =>
      callGeminiStructured<{ insight: string; recommendation: string; action?: Record<string, unknown> }>({
        model: MODEL,
        prompt,
        responseJsonSchema: responseSchema,
        thinkingLevel: "low",
        timeoutMs: 20_000,
        agentName: AGENT_NAME,
      })
    );

    const { insight, recommendation, action } = geminiResult.data;

    // Persist to campaign_goals->ai_insight
    const existingGoals = (appResult.data.campaign_goals as Record<string, unknown>) ?? {};
    const { error: updateError } = await svc
      .schema("sponsor")
      .from("applications")
      .update({
        campaign_goals: {
          ...existingGoals,
          ai_insight: { insight, recommendation, generated_at: new Date().toISOString() },
        },
      })
      .eq("id", application_id);

    if (updateError) {
      console.error("[sponsor-roi-explain] ai_insight persist failed:", updateError.message);
    }

    if (logUserId) {
      await insertAiRun(svc, {
        user_id: logUserId,
        agent_name: AGENT_NAME,
        agent_type: "general_concierge",
        input_data: { application_id, totalImpressions, totalClicks, ctr },
        output_data: { insight, recommendation },
        status: "success",
        input_tokens: geminiResult.usage.input_tokens,
        output_tokens: geminiResult.usage.output_tokens,
        duration_ms: Date.now() - start,
        model_name: MODEL,
      });
    }

    return jsonResponse({ success: true, data: { insight, recommendation, action } }, 200, req);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (logUserId) {
      await insertAiRun(svc, {
        user_id: logUserId,
        agent_name: AGENT_NAME,
        agent_type: "general_concierge",
        input_data: { application_id },
        output_data: { error: message },
        status: message === "GEMINI_TIMEOUT" ? "timeout" : "error",
        input_tokens: 0,
        output_tokens: 0,
        duration_ms: Date.now() - start,
        model_name: MODEL,
      });
    }
    return jsonResponse(errorBody("ROI_EXPLAIN_ERROR", message), 500, req);
  }
});
