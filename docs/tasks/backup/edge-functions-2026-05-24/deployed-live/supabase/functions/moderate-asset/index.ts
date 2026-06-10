/**
 * moderate-asset — Supabase Edge Function
 *
 * Moderates contestant photos uploaded during the intake wizard using
 * Gemini Flash multimodal analysis. Returns a label (clean | flagged | rejected)
 * with categories, confidence, and a plain-English reason.
 *
 * Auth:    Bearer JWT required
 * Input:   { storage_path: string, entity_id?: string, bio?: string }
 * Output:  { success: true, data: { label, categories_flagged, confidence, reason } }
 * Fallback: if Gemini is unavailable, returns clean/0-confidence so uploads are not blocked
 */

import { callGeminiStructured, withRetry } from "../_shared/gemini.ts";
import { getCorsHeaders, jsonResponse, errorBody } from "../_shared/http.ts";
import { getUserId, getServiceClient } from "../_shared/supabase-clients.ts";

type ModerationLabel = "clean" | "flagged" | "rejected";

interface ModerationResult {
  label: ModerationLabel;
  categories_flagged: string[];
  confidence: number;
  reason: string;
}

interface RequestBody {
  storage_path: string;
  entity_id?: string;
  bio?: string;
}

const BUCKET = "listing_photos";

const SYSTEM_INSTRUCTION = `You are a content moderation assistant for mdeai.co, a Medellín beauty pageant platform. Review the provided image for policy violations.

Policy rules:
- REJECT: explicit nudity, sexual content, minors in inappropriate situations, illegal content
- FLAG: borderline nudity (swimsuit ok for pageant context but flag for admin), multiple faces in hero shot, heavy text overlay, low image quality
- CLEAN: professional photos, headshots, swimsuit (pageant context), evening gown photos, casual portraits

Important:
- Beauty pageants include swimsuit categories — flag but don't auto-reject swimsuit photos
- Multiple faces should be flagged (hero shot should be solo)
- Brand logos/text in photo = flag for brand_conflict review
- Never fabricate. Rate only what you can see.`;

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    label: { type: "string", description: "clean | flagged | rejected" },
    categories_flagged: { type: "array", items: { type: "string" } },
    confidence: { type: "number", description: "0.0 to 1.0" },
    reason: { type: "string", description: "Plain-English reason for the label" },
  },
  required: ["label", "categories_flagged", "confidence", "reason"],
};

const CONFIDENCE_THRESHOLD_REJECTED = 0.85;
const CONFIDENCE_THRESHOLD_FLAGGED = 0.60;

const FALLBACK_RESULT: ModerationResult = {
  label: "clean",
  categories_flagged: [],
  confidence: 0,
  reason: "moderation_unavailable",
};

function applyThresholds(raw: ModerationResult): ModerationResult {
  const { confidence } = raw;
  let label: ModerationLabel;
  if (confidence >= CONFIDENCE_THRESHOLD_REJECTED) label = "rejected";
  else if (confidence >= CONFIDENCE_THRESHOLD_FLAGGED) label = "flagged";
  else label = "clean";
  return { ...raw, label };
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  const authHeader = req.headers.get("Authorization");
  const userId = await getUserId(authHeader, undefined);
  if (!userId) {
    return jsonResponse(errorBody("UNAUTHORIZED", "Missing or invalid auth token"), 401, req);
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return jsonResponse(errorBody("BAD_REQUEST", "Request body must be valid JSON"), 400, req);
  }

  const { storage_path, entity_id, bio } = body;

  if (!storage_path || typeof storage_path !== "string") {
    return jsonResponse(errorBody("BAD_REQUEST", "storage_path is required"), 400, req);
  }

  const serviceClient = getServiceClient();

  const { data: signedUrlData, error: signedUrlError } = await serviceClient.storage
    .from(BUCKET)
    .createSignedUrl(storage_path, 300);

  if (signedUrlError || !signedUrlData?.signedUrl) {
    return jsonResponse(
      errorBody("STORAGE_ERROR", signedUrlError?.message ?? "Could not generate signed URL"),
      500,
      req,
    );
  }

  const signedUrl = signedUrlData.signedUrl;
  const moderationStart = Date.now();
  let moderationResult: ModerationResult;
  let geminiStatus: "success" | "failed" = "success";

  try {
    const geminiResult = await withRetry(() =>
      callGeminiStructured<ModerationResult>({
        agentName: "moderate-asset",
        model: "gemini-3-flash-preview",
        prompt: `Review this photo for a beauty pageant application. Image URL: ${signedUrl}${bio ? `. Contestant bio: "${bio}"` : ""}`,
        systemInstruction: SYSTEM_INSTRUCTION,
        responseJsonSchema: OUTPUT_SCHEMA,
        thinkingLevel: "low",
        timeoutMs: 20_000,
        tools: [{ urlContext: {} }],
      })
    );
    moderationResult = applyThresholds(geminiResult.data);
  } catch (_err) {
    geminiStatus = "failed";
    moderationResult = FALLBACK_RESULT;
  }

  const duration_ms = Date.now() - moderationStart;

  if (entity_id && typeof entity_id === "string") {
    await serviceClient
      .schema("vote")
      .from("entities")
      .update({
        ai_moderation_status: moderationResult.label,
        ai_moderation_categories: moderationResult.categories_flagged,
        ai_moderation_at: new Date().toISOString(),
      })
      .eq("id", entity_id);
  }

  await serviceClient.from("ai_runs").insert({
    agent_name: "moderate-asset",
    duration_ms,
    status: geminiStatus,
    input_tokens: 0,
    output_tokens: 0,
  });

  return jsonResponse({ success: true, data: moderationResult }, 200, req);
});
