/**
 * sponsor-moderate — Gemini vision moderation for sponsor assets.
 *
 * POST /functions/v1/sponsor-moderate
 * Auth: Bearer JWT (admin or service_role — called after asset upload)
 * Body: { asset_id, storage_url, kind: 'logo'|'video'|'image'|'copy'|'color' }
 * Returns: { success: true, data: { verdict, flags, reasons, score } }
 *
 * Updates sponsor.assets.ai_moderation_status on clean/flagged/rejected.
 */

import { z } from "npm:zod@3.23.8";
import { getCorsHeaders, errorBody, jsonResponse } from "../_shared/http.ts";
import { getServiceClient, getUserId } from "../_shared/supabase-clients.ts";
import { sponsorAssetAccessible } from "../_shared/sponsor-access.ts";
import { callGeminiStructured, withRetry } from "../_shared/gemini.ts";
import { insertAiRun } from "../_shared/ai-runs.ts";

const AGENT_NAME = "sponsor-moderate";
const MODEL = "gemini-3-flash-preview" as const;

const requestSchema = z.object({
  asset_id:    z.string().uuid(),
  storage_url: z.string().url().max(2000),
  kind:        z.enum(["logo", "video", "image", "copy", "color"]),
});

const SYSTEM_PROMPTS: Record<string, string> = {
  logo: `You are a content moderator for mdeai.co, a Medellín-based events platform.
Review this sponsor brand logo. Logos are stylized brand marks — approve clean, professional marks.
Reject for: explicit imagery, offensive symbols, hate speech, or alcohol/tobacco brand marks conflicting with event policies.
Text-heavy brand logos, wordmarks, abstract art, and stylization are all acceptable.`,

  image: `You are a content moderator for mdeai.co, a Medellín events platform.
Review this sponsor promotional image. Approve standard brand imagery.
Reject for: nudity, graphic violence, illegal-substance glorification, or content inappropriate for a public events platform.
Promotional text overlays are acceptable.`,

  video: `You are a content moderator for mdeai.co, a Medellín events platform.
Review this sponsor video thumbnail or still frame. Approve professional marketing content.
Reject for: explicit nudity, graphic violence, illegal-substance glorification.`,

  copy: `You are a content moderator for mdeai.co, a Medellín events platform.
Review this sponsor marketing copy text. Approve standard promotional language.
Reject for: hate speech, explicit sexual content, illegal offers, or content that violates Colombian advertising regulations.`,

  color: `You are a content moderator for mdeai.co, a Medellín events platform.
Review this brand color palette or swatch. Approve all standard color schemes.
Only flag if the submitted content is not a color palette at all.`,
};

const moderationSchema = {
  type: "object",
  required: ["verdict", "flags", "reasons", "score"],
  properties: {
    verdict: {
      type: "string",
      enum: ["clean", "flagged", "rejected"],
      description: "clean = approved; flagged = manual review needed; rejected = blocked",
    },
    flags: {
      type: "array",
      items: { type: "string" },
      description: "Short flag codes, e.g. ['explicit_content', 'low_quality']",
    },
    reasons: {
      type: "array",
      items: { type: "string" },
      description: "Human-readable explanations for each flag",
    },
    score: {
      type: "number",
      description: "0.0–1.0 safety score (1.0 = completely safe)",
    },
  },
};

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

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

  const { asset_id, storage_url, kind } = body;

  if (!(await sponsorAssetAccessible(authHeader, asset_id))) {
    return jsonResponse(errorBody("FORBIDDEN", "Asset not accessible"), 403, req);
  }

  const systemInstruction = SYSTEM_PROMPTS[kind];
  const prompt = `Moderate this sponsor asset (kind: ${kind}). URL: ${storage_url}

Evaluate based on platform guidelines. Return verdict, any flags, reasons, and a safety score.`;

  const start = Date.now();
  let result: { verdict: string; flags: string[]; reasons: string[]; score: number };

  try {
    const geminiResult = await withRetry(() =>
      callGeminiStructured<typeof result>({
        model: MODEL,
        prompt,
        systemInstruction,
        responseJsonSchema: moderationSchema,
        thinkingLevel: "low",
        tools: [{ urlContext: {} }],
        timeoutMs: 15_000,
        agentName: AGENT_NAME,
      })
    );
    result = geminiResult.data;

    await svc
      .schema("sponsor")
      .from("assets")
      .update({ ai_moderation_status: result.verdict })
      .eq("id", asset_id);

    await insertAiRun(svc, {
      user_id: userId,
      agent_name: AGENT_NAME,
      agent_type: "general_concierge",
      input_data: { asset_id, kind },
      output_data: { verdict: result.verdict, flags: result.flags },
      status: "success",
      input_tokens: 0,
      output_tokens: 0,
      duration_ms: Date.now() - start,
      model_name: MODEL,
    });

    return jsonResponse({ success: true, data: { ...result, model: MODEL, duration_ms: Date.now() - start } }, 200, req);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await insertAiRun(svc, {
      user_id: userId,
      agent_name: AGENT_NAME,
      agent_type: "general_concierge",
      input_data: { asset_id, kind },
      output_data: { error: message },
      status: message === "GEMINI_TIMEOUT" ? "timeout" : "error",
      input_tokens: 0,
      output_tokens: 0,
      duration_ms: Date.now() - start,
      model_name: MODEL,
    });
    return jsonResponse(errorBody("MODERATION_ERROR", message), 500, req);
  }
});
