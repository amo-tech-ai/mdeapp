/**
 * sponsor-optimize — Gemini campaign optimizer for sponsor applications.
 *
 * POST /functions/v1/sponsor-optimize
 * Auth: Bearer JWT (admin or sponsor)
 * Body: { application_id }
 * Returns: { success: true, data: { recommendations } }
 *
 * Analyzes 30-day roi_daily + placements + campaign goals.
 * Returns proposals only — never auto-applies changes.
 */

import { z } from "npm:zod@3.23.8";
import { getCorsHeaders, errorBody, jsonResponse } from "../_shared/http.ts";
import { getServiceClient, getUserId } from "../_shared/supabase-clients.ts";
import { sponsorApplicationAccessible } from "../_shared/sponsor-access.ts";
import { callGeminiStructured, withRetry } from "../_shared/gemini.ts";
import { insertAiRun } from "../_shared/ai-runs.ts";

const AGENT_NAME = "sponsor-optimize";
const MODEL = "gemini-3.1-pro-preview" as const;

const requestSchema = z.object({
  application_id: z.string().uuid(),
});

const responseSchema = {
  type: "object",
  required: ["recommendations"],
  properties: {
    recommendations: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["action", "expected_lift_pct", "why"],
        properties: {
          action: {
            type: "string",
            enum: [
              "increase_weight",
              "decrease_weight",
              "add_surface",
              "replace_creative",
              "change_schedule",
            ],
          },
          surface: { type: "string" },
          placement_id: { type: "string" },
          new_value: {},
          expected_lift_pct: {
            type: "number",
            description: "Expected CTR or conversion lift as a percentage (e.g. 12.5)",
          },
          why: {
            type: "string",
            description: "One sentence rationale in English",
          },
        },
      },
    },
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: getCorsHeaders(req) });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse(errorBody("UNAUTHORIZED", "Missing Authorization header"), 401, req);
  }

  const svc = getServiceClient();
  const userId = await getUserId(authHeader);
  if (!userId) {
    return jsonResponse(errorBody("UNAUTHORIZED", "Invalid token"), 401, req);
  }

  let body: z.infer<typeof requestSchema>;
  try {
    body = requestSchema.parse(await req.json());
  } catch (e) {
    return jsonResponse(errorBody("BAD_REQUEST", String(e)), 400, req);
  }

  const { application_id } = body;

  if (!(await sponsorApplicationAccessible(authHeader, application_id))) {
    return jsonResponse(errorBody("FORBIDDEN", "Application not accessible"), 403, req);
  }

  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [appResult, roiResult, placementsResult] = await Promise.all([
    svc
      .schema("sponsor")
      .from("applications")
      .select("id, tier, activation_type, campaign_goals, events(name, event_type)")
      .eq("id", application_id)
      .single(),
    svc
      .schema("sponsor")
      .from("roi_daily")
      .select(`
        day, impressions, clicks, conversions,
        placements!inner(id, surface, weight, application_id)
      `)
      .eq("placements.application_id", application_id)
      .gte("day", cutoff)
      .order("day", { ascending: true }),
    svc
      .schema("sponsor")
      .from("placements")
      .select("id, surface, weight, start_at, end_at")
      .eq("application_id", application_id),
  ]);

  if (appResult.error || !appResult.data) {
    return jsonResponse(errorBody("NOT_FOUND", "Application not found"), 404, req);
  }

  const roiRows = roiResult.data ?? [];
  const placements = placementsResult.data ?? [];

  // Aggregate by surface
  type SurfaceStats = { impressions: number; clicks: number; conversions: number; placement_id: string; weight: number };
  const byPlacement = roiRows.reduce((acc: Record<string, SurfaceStats>, r) => {
    const p = r.placements as { id?: string; surface?: string; weight?: number };
    const pid = p?.id ?? "unknown";
    if (!acc[pid]) {
      acc[pid] = {
        impressions: 0, clicks: 0, conversions: 0,
        placement_id: pid,
        weight: p?.weight ?? 100,
      };
    }
    acc[pid].impressions += r.impressions ?? 0;
    acc[pid].clicks += r.clicks ?? 0;
    acc[pid].conversions += r.conversions ?? 0;
    return acc;
  }, {});

  const surfaceLines = Object.entries(byPlacement)
    .map(([pid, s]) => {
      const ctr = s.impressions > 0 ? ((s.clicks / s.impressions) * 100).toFixed(2) : "0";
      const placement = placements.find((p) => p.id === pid);
      return `- placement_id ${pid} (${placement?.surface ?? "?"}): ${s.impressions} imp, ${s.clicks} clicks, CTR ${ctr}%, ${s.conversions} conversions, weight ${s.weight}`;
    })
    .join("\n");

  const event = appResult.data.events as { name?: string; event_type?: string } | null;
  const goals = JSON.stringify(appResult.data.campaign_goals ?? {});

  const prompt = `You are an expert in advertising campaign optimization for mdeai.co, a premium events platform in Medellín, Colombia.

Sponsor: ${appResult.data.tier} tier, ${appResult.data.activation_type ?? "digital"} activation
Event: ${event?.name ?? "event"} (${event?.event_type ?? "general"})
Campaign goals: ${goals}

Last 30-day performance by surface:
${surfaceLines || "No data available yet"}

Available surfaces: contest_header, leaderboard_footer, digital_banner, category_header, contestant_profile, qr_station

Generate concrete optimization recommendations.
- If there is insufficient data, recommend adding surfaces.
- Reason in terms of CTR, placement weight, and sponsor objectives.
- All recommendations in ENGLISH.
- Proposals only — the system requires human approval before applying.`;

  const start = Date.now();
  try {
    const geminiResult = await withRetry(() =>
      callGeminiStructured<{ recommendations: Array<Record<string, unknown>> }>({
        model: MODEL,
        prompt,
        responseJsonSchema: responseSchema,
        thinkingLevel: "high",
        timeoutMs: 30_000,
        agentName: AGENT_NAME,
      })
    );

    const { recommendations } = geminiResult.data;

    await insertAiRun(svc, {
      user_id: userId,
      agent_name: AGENT_NAME,
      agent_type: "general_concierge",
      input_data: { application_id },
      output_data: { recommendations_count: recommendations.length },
      status: "success",
      input_tokens: geminiResult.usage.input_tokens,
      output_tokens: geminiResult.usage.output_tokens,
      duration_ms: Date.now() - start,
      model_name: MODEL,
    });

    return jsonResponse({ success: true, data: { recommendations } }, 200, req);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await insertAiRun(svc, {
      user_id: userId,
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
    return jsonResponse(errorBody("OPTIMIZE_ERROR", message), 500, req);
  }
});
