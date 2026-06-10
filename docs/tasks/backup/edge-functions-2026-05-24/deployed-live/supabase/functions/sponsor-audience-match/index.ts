/**
 * sponsor-audience-match — Gemini + Google Search audience alignment for sponsors.
 *
 * POST /functions/v1/sponsor-audience-match
 * Auth: Bearer JWT (admin or sponsor)
 * Body: { organization_id, brand_description, brand_keywords }
 * Returns: { success: true, data: { top_events, top_segments, estimated_reach } }
 *
 * Uses googleSearch grounding to anchor recommendations in real Medellín event data.
 */

import { z } from "npm:zod@3.23.8";
import { getCorsHeaders, errorBody, jsonResponse } from "../_shared/http.ts";
import { getServiceClient, getUserId } from "../_shared/supabase-clients.ts";
import { sponsorOrganizationAccessible } from "../_shared/sponsor-access.ts";
import { callGeminiStructured, withRetry } from "../_shared/gemini.ts";
import { insertAiRun } from "../_shared/ai-runs.ts";

const AGENT_NAME = "sponsor-audience-match";
const MODEL = "gemini-3.1-pro-preview" as const;

const requestSchema = z.object({
  organization_id:   z.string().uuid(),
  brand_description: z.string().min(10).max(800),
  brand_keywords:    z.array(z.string().max(50)).min(1).max(10),
});

const responseSchema = {
  type: "object",
  required: ["top_events", "top_segments", "estimated_reach"],
  properties: {
    top_events: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["event_name", "match_score", "rationale"],
        properties: {
          event_id:    { type: "string" },
          event_name:  { type: "string" },
          match_score: { type: "number", description: "0.0–1.0 audience fit score" },
          rationale:   { type: "string", description: "Why this event matches, in English" },
        },
      },
    },
    top_segments: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["segment", "size_estimate", "fit_rationale"],
        properties: {
          segment:       { type: "string", description: "Audience segment label" },
          size_estimate: { type: "number", description: "Estimated reach in Medellín" },
          fit_rationale: { type: "string", description: "Why this segment fits, in English" },
        },
      },
    },
    estimated_reach: {
      type: "number",
      description: "Total estimated unique reach across recommended events and surfaces",
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

  const { organization_id, brand_description, brand_keywords } = body;

  if (!(await sponsorOrganizationAccessible(authHeader, organization_id))) {
    return jsonResponse(errorBody("FORBIDDEN", "Organization not accessible"), 403, req);
  }

  // Fetch upcoming events for context
  const { data: events } = await svc
    .from("events")
    .select("id, name, event_type, city, description, expected_attendance")
    .gte("event_start_time", new Date().toISOString())
    .order("event_start_time", { ascending: true })
    .limit(20);

  const eventList = (events ?? [])
    .map((e) => `- ${e.name} (${e.event_type ?? "general"}, ${e.city ?? "Medellín"}, esperado: ${e.expected_attendance ?? "?"} asistentes)`)
    .join("\n");

  const prompt = `You are an audience marketing specialist for mdeai.co, a premium events platform in Medellín, Colombia.

A brand wants to sponsor events in Medellín:
Description: ${brand_description}
Keywords: ${brand_keywords.join(", ")}
Organization ID: ${organization_id}

Upcoming events available on mdeai.co:
${eventList || "No upcoming events in the database"}

Use your knowledge of the Colombian market and Google Search results to:
1. Identify which events have the best audience alignment for this brand
2. Describe the most relevant audience segments in Medellín
3. Estimate a realistic total reach

Respond in ENGLISH. Base recommendations on real Colombian market data.
For mdeai.co events, use the exact IDs from the list. For other events, use event_name without event_id.`;

  const start = Date.now();
  try {
    const geminiResult = await withRetry(() =>
      callGeminiStructured<{
        top_events: Array<{ event_id?: string; event_name: string; match_score: number; rationale: string }>;
        top_segments: Array<{ segment: string; size_estimate: number; fit_rationale: string }>;
        estimated_reach: number;
      }>({
        model: MODEL,
        prompt,
        responseJsonSchema: responseSchema,
        thinkingLevel: "medium",
        tools: [{ googleSearch: {} }],
        timeoutMs: 30_000,
        agentName: AGENT_NAME,
      })
    );

    const data = geminiResult.data;

    await insertAiRun(svc, {
      user_id: userId,
      agent_name: AGENT_NAME,
      agent_type: "general_concierge",
      input_data: { organization_id, brand_keywords },
      output_data: { top_events_count: data.top_events.length, estimated_reach: data.estimated_reach },
      status: "success",
      input_tokens: geminiResult.usage.input_tokens,
      output_tokens: geminiResult.usage.output_tokens,
      duration_ms: Date.now() - start,
      model_name: MODEL,
    });

    return jsonResponse({ success: true, data, citations: geminiResult.citations }, 200, req);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await insertAiRun(svc, {
      user_id: userId,
      agent_name: AGENT_NAME,
      agent_type: "general_concierge",
      input_data: { organization_id },
      output_data: { error: message },
      status: message === "GEMINI_TIMEOUT" ? "timeout" : "error",
      input_tokens: 0,
      output_tokens: 0,
      duration_ms: Date.now() - start,
      model_name: MODEL,
    });
    return jsonResponse(errorBody("AUDIENCE_MATCH_ERROR", message), 500, req);
  }
});
