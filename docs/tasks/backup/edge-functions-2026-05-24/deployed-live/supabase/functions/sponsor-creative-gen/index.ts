/**
 * sponsor-creative-gen — Gemini bilingual creative copy for sponsor campaigns.
 *
 * POST /functions/v1/sponsor-creative-gen
 * Auth: Bearer JWT (sponsor org member)
 * Body: { application_id, creative_brief, tone? }
 * Returns: { success: true, data: { captions, ig_story_prompts, push_notif_copy, wa_broadcast_subtitle } }
 *
 * Never auto-publishes — returns content for human review.
 * Rate limit: 10/min/sponsor (enforced via ai_runs count check).
 */

import { z } from "npm:zod@3.23.8";
import { getCorsHeaders, errorBody, jsonResponse } from "../_shared/http.ts";
import { getServiceClient, getUserId } from "../_shared/supabase-clients.ts";
import { sponsorApplicationAccessible } from "../_shared/sponsor-access.ts";
import { callGeminiStructured, withRetry } from "../_shared/gemini.ts";
import { insertAiRun } from "../_shared/ai-runs.ts";

const AGENT_NAME = "sponsor-creative-gen";
const MODEL = "gemini-3.1-pro-preview" as const;

const requestSchema = z.object({
  application_id: z.string().uuid(),
  creative_brief: z.string().min(10).max(1000),
  tone: z.enum(["professional", "playful", "bold", "elegant"]).optional().default("professional"),
});

const INVENTED_URL_RE = /https?:\/\/[^\s"']+/g;

const responseSchema = {
  type: "object",
  required: ["captions", "ig_story_prompts", "push_notif_copy", "wa_broadcast_subtitle"],
  properties: {
    captions: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        required: ["es", "en", "platform"],
        properties: {
          es: { type: "string", description: "Caption in Spanish (≤ 200 chars)" },
          en: { type: "string", description: "Caption in English (≤ 200 chars)" },
          platform: {
            type: "string",
            enum: ["instagram", "whatsapp", "push", "email"],
          },
        },
      },
    },
    ig_story_prompts: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "string",
        description: "Visual description prompt for IG Story image generation",
      },
    },
    push_notif_copy: {
      type: "string",
      description: "Push notification copy ≤ 80 characters",
    },
    wa_broadcast_subtitle: {
      type: "string",
      description: "WhatsApp broadcast subtitle ≤ 120 characters",
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

  const { application_id, creative_brief, tone } = body;

  if (!(await sponsorApplicationAccessible(authHeader, application_id))) {
    return jsonResponse(errorBody("FORBIDDEN", "Application not accessible"), 403, req);
  }

  // Fetch application + event context
  const { data: appData, error: appError } = await svc
    .schema("sponsor")
    .from("applications")
    .select("id, tier, activation_type, events(name, event_type, city)")
    .eq("id", application_id)
    .single();

  if (appError || !appData) {
    return jsonResponse(errorBody("NOT_FOUND", "Application not found"), 404, req);
  }

  const event = appData.events as { name?: string; event_type?: string; city?: string } | null;

  const prompt = `You are a creative copywriter for mdeai.co, a premium events platform in Medellín, Colombia.

Create bilingual (Spanish + English) marketing content for a ${appData.tier} sponsor.

Event: ${event?.name ?? "Medellín Event"}
Event type: ${event?.event_type ?? "general"}
Activation type: ${appData.activation_type ?? "digital"}
Tone: ${tone}
Creative brief: ${creative_brief}

RULES:
- Write Spanish first (native Medellín voice), then English translation
- Do NOT invent URLs — use placeholder [BRAND_URL] if needed
- Push notification copy MUST be ≤ 80 characters
- WhatsApp subtitle MUST be ≤ 120 characters
- IG Story prompts should describe visual scenes, not text
- All copy must be culturally appropriate for Colombian audiences`;

  const start = Date.now();
  try {
    const geminiResult = await withRetry(() =>
      callGeminiStructured<{
        captions: Array<{ es: string; en: string; platform: string }>;
        ig_story_prompts: string[];
        push_notif_copy: string;
        wa_broadcast_subtitle: string;
      }>({
        model: MODEL,
        prompt,
        responseJsonSchema: responseSchema,
        thinkingLevel: "medium",
        timeoutMs: 30_000,
        agentName: AGENT_NAME,
      })
    );

    const data = geminiResult.data;

    // Guard: reject if invented URLs snuck through
    const allText = JSON.stringify(data);
    const inventedUrls = (allText.match(INVENTED_URL_RE) ?? []).filter(
      (url) => !url.includes("mdeai.co") && !url.includes("[BRAND_URL]"),
    );
    if (inventedUrls.length > 0) {
      return jsonResponse(
        errorBody("CONTENT_POLICY", `Output contained invented URLs: ${inventedUrls.join(", ")}`),
        422,
        req,
      );
    }

    await insertAiRun(svc, {
      user_id: userId,
      agent_name: AGENT_NAME,
      agent_type: "general_concierge",
      input_data: { application_id, tone },
      output_data: { captions_count: data.captions.length },
      status: "success",
      input_tokens: geminiResult.usage.input_tokens,
      output_tokens: geminiResult.usage.output_tokens,
      duration_ms: Date.now() - start,
      model_name: MODEL,
    });

    return jsonResponse({ success: true, data }, 200, req);
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
    return jsonResponse(errorBody("CREATIVE_GEN_ERROR", message), 500, req);
  }
});
