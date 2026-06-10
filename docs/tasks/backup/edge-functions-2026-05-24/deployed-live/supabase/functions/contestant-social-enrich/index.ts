/**
 * contestant-social-enrich — Gemini URL Context enrichment for social profiles.
 *
 * POST /functions/v1/contestant-social-enrich
 *
 * Auth: Bearer JWT required (authenticated contestants only).
 * Model: gemini-3-flash-preview + urlContext tool.
 *
 * Given an Instagram/TikTok/Facebook/LinkedIn profile URL, fetches the page
 * and extracts structured contestant data (name, bio, follower count, avatar).
 * Falls back gracefully when the page is private or bot-blocked.
 *
 * Response: { success: true, data: { accessible, display_name, bio, platform, avatar_url, followers } }
 */

import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { getCorsHeaders, errorBody, jsonResponse } from "../_shared/http.ts";
import { getUserId } from "../_shared/supabase-clients.ts";
import { callGeminiStructured, withRetry } from "../_shared/gemini.ts";

const AGENT_NAME = "contestant-social-enrich";
const MODEL = "gemini-3-flash-preview" as const;

const requestSchema = z.object({
  social_url: z.string().url().max(500),
});

// Output schema — G1: always pair responseJsonSchema with responseMimeType
const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    accessible: {
      type: "boolean",
      description: "true if the profile page was reachable and had readable content",
    },
    platform: {
      type: "string",
      description: "instagram | tiktok | facebook | linkedin | other",
    },
    display_name: {
      type: "string",
      description: "The person's display name or account name. Empty string if not found.",
    },
    bio: {
      type: "string",
      description: "The profile bio/description text. Empty string if not found.",
    },
    avatar_url: {
      type: "string",
      description: "URL of the profile photo (og:image or similar). Empty string if not found.",
    },
    followers: {
      type: "string",
      description: "Follower count as a string e.g. '12.4K' or '1,200'. Empty string if not found.",
    },
    inaccessible_reason: {
      type: "string",
      description: "If accessible=false, why: 'private', 'login_wall', 'bot_block', 'not_found', 'unknown'",
    },
  },
  required: ["accessible", "platform", "display_name", "bio", "avatar_url", "followers"],
};

const SYSTEM_INSTRUCTION = `You are a data extraction assistant for mdeai.co, a Medellín events platform.

Your job: fetch a social media profile URL and extract the person's public information.

Rules:
- Extract display_name from og:title, the account @handle label, or the page <title>. Clean off suffixes like "• Instagram photos and videos" or "| TikTok".
- Extract bio from og:description, the meta description, or any visible profile bio text. Do NOT include generic platform descriptions.
- Extract avatar_url from og:image or twitter:image meta tags.
- Extract follower count if visible in meta or page content.
- Set accessible=false only if the page explicitly requires login, shows a 404, or returns no usable content.
- Many social pages are partially accessible even without login — extract what you can.
- Never fabricate information. If a field is unknown, return empty string.
- Detect the platform from the URL domain.`;

// Detect platform name from URL for logging
function detectPlatform(url: string): string {
  try {
    const host = new URL(url).hostname.replace("www.", "");
    if (host.includes("instagram")) return "instagram";
    if (host.includes("tiktok")) return "tiktok";
    if (host.includes("facebook") || host.includes("fb.com")) return "facebook";
    if (host.includes("linkedin")) return "linkedin";
    return "other";
  } catch {
    return "other";
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  if (req.method !== "POST") {
    return jsonResponse(errorBody("METHOD_NOT_ALLOWED", "POST required"), 405, req);
  }

  // Auth — contestants must be logged in
  const authHeader = req.headers.get("Authorization") ?? "";
  const userId = await getUserId(authHeader).catch(() => null);
  if (!userId) {
    return jsonResponse(errorBody("UNAUTHORIZED", "Login required"), 401, req);
  }

  // Parse + validate input
  let input: z.infer<typeof requestSchema>;
  try {
    input = requestSchema.parse(await req.json());
  } catch (err) {
    return jsonResponse(errorBody("INVALID_INPUT", String(err)), 400, req);
  }

  const platform = detectPlatform(input.social_url);

  try {
    const result = await withRetry(() =>
      callGeminiStructured({
        agentName: AGENT_NAME,
        model: MODEL,
        prompt: `Fetch and extract profile information from this social media URL: ${input.social_url}`,
        systemInstruction: SYSTEM_INSTRUCTION,
        responseJsonSchema: OUTPUT_SCHEMA, // G1
        tools: [{ urlContext: {} }],       // URL Context — fetches the page
        thinkingLevel: "low",              // Fast extraction, no deep reasoning needed
        timeoutMs: 25_000,
      })
    );

    return jsonResponse({ success: true, data: result.data }, 200, req);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";

    // Graceful degradation — caller shows "couldn't read profile" instead of crashing
    if (msg === "GEMINI_TIMEOUT" || msg.includes("urlContext")) {
      return jsonResponse({
        success: true,
        data: {
          accessible: false,
          platform,
          display_name: "",
          bio: "",
          avatar_url: "",
          followers: "",
          inaccessible_reason: "unknown",
        },
      }, 200, req);
    }

    return jsonResponse(errorBody("ENRICH_FAILED", msg), 500, req);
  }
});
