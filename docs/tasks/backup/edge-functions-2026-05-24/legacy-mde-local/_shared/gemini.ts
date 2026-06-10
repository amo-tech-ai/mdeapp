/**
 * Shared Gemini API helpers.
 *
 * Two paths live here:
 *   1. `fetchGemini` / `fetchGeminiStream` -- OpenAI-compatible endpoint
 *      (chat completions, streaming, tool-calling). Used by the chat surface
 *      (`ai-chat`, `ai-search`, `ai-router`, `ai-trip-planner`, `rentals`, ...).
 *   2. `callGeminiStructured` -- Gemini **native** `v1beta:generateContent`
 *      endpoint with `responseSchema` + optional `googleSearch` grounding.
 *      Used by P3 sponsor agents that need typed JSON output.
 */

const GEMINI_OAI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const GEMINI_NATIVE_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models";

/** Retry transient failures / rate limits */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts?: { retries?: number; baseDelayMs?: number },
): Promise<T> {
  const attempts = Math.max(1, opts?.retries ?? 3);
  const baseDelayMs = opts?.baseDelayMs ?? 400;
  let last: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseDelayMs * (i + 1)));
      }
    }
  }
  throw last instanceof Error ? last : new Error(String(last ?? "withRetry: exhausted retries"));
}

export async function fetchGemini(
  body: Record<string, unknown>,
  timeoutMs = 30_000,
): Promise<Response> {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) throw new Error("GEMINI_API_KEY environment variable not set");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(GEMINI_OAI_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchGeminiStream(
  body: Record<string, unknown>,
  timeoutMs = 30_000,
): Promise<Response> {
  return fetchGemini({ ...body, stream: true }, timeoutMs);
}

// ----------------------------------------------------------------------------
// Structured-output helper (Gemini native API)
// ----------------------------------------------------------------------------

export type ThinkingLevel = "minimal" | "low" | "medium" | "high";

/**
 * Subset of Gemini hosted tools exposed to callers.
 *
 * The TypeScript surface keeps idiomatic camelCase (matches `@google/genai` JS SDK).
 * The helper transforms these to REST snake_case (`google_search`, `url_context`,
 * `google_maps`) before sending to v1beta:generateContent.
 */
export type GeminiTool =
  | { googleSearch: Record<string, unknown> }
  | { googleMaps: Record<string, unknown> }
  | { urlContext: Record<string, unknown> };

/** Minimal Zod-like validator surface (we only need .safeParse). */
export interface ZodLikeSchema<T> {
  safeParse: (input: unknown) => { success: true; data: T } | { success: false; error: unknown };
}

export interface CallGeminiStructuredOptions<T = unknown> {
  /** e.g. "gemini-3-flash-preview", "gemini-3.1-pro-preview". */
  model: string;
  /** Single-turn prompt. Use `messages` for multi-turn. */
  prompt?: string;
  /** Multi-turn history -- each entry is a user/model turn. */
  messages?: Array<{ role: "user" | "model"; text: string }>;
  /** JSON Schema (Gemini-supported subset). Used by Gemini to constrain output. */
  responseJsonSchema: Record<string, unknown>;
  /** Optional Zod schema for strict runtime validation after parse. */
  zodSchema?: ZodLikeSchema<T>;
  /** Optional system instruction. */
  systemInstruction?: string;
  /** Gemini 3 thinking level. Defaults to model default. */
  thinkingLevel?: ThinkingLevel;
  /** Hosted tools (e.g. googleSearch grounding). */
  tools?: GeminiTool[];
  /** Request timeout. Default 30s. */
  timeoutMs?: number;
  /** Logged via callers -- not sent to Gemini. */
  agentName?: string;
}

export interface GeminiCitation {
  uri: string;
  title?: string;
}

export interface CallGeminiStructuredResult<T> {
  data: T;
  usage: { input_tokens: number; output_tokens: number };
  citations?: GeminiCitation[];
}

interface GeminiPart {
  text?: string;
  thought?: boolean;
}

interface GeminiCandidate {
  content?: { parts?: GeminiPart[] };
  groundingMetadata?: {
    groundingChunks?: Array<{ web?: { uri?: string; title?: string } }>;
  };
}

interface GeminiResponseBody {
  candidates?: GeminiCandidate[];
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
  };
  error?: { code?: number; message?: string; status?: string };
}

function buildContents(
  opts: CallGeminiStructuredOptions,
): Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> {
  if (opts.messages && opts.messages.length > 0) {
    return opts.messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));
  }
  if (typeof opts.prompt !== "string" || opts.prompt.length === 0) {
    throw new Error("callGeminiStructured: prompt or messages required");
  }
  return [{ role: "user", parts: [{ text: opts.prompt }] }];
}

function extractRequiredKeys(schema: Record<string, unknown>): string[] {
  const req = schema["required"];
  if (Array.isArray(req)) return req.filter((k): k is string => typeof k === "string");
  return [];
}

function pickTextParts(candidates: GeminiCandidate[] | undefined): string {
  const parts = candidates?.[0]?.content?.parts ?? [];
  return parts
    .filter((p) => !p.thought && typeof p.text === "string")
    .map((p) => p.text as string)
    .join("");
}

function pickCitations(
  candidates: GeminiCandidate[] | undefined,
): GeminiCitation[] | undefined {
  const chunks = candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!chunks || chunks.length === 0) return undefined;
  const out: GeminiCitation[] = [];
  for (const c of chunks) {
    const uri = c.web?.uri;
    if (typeof uri === "string" && uri.length > 0) {
      out.push({ uri, title: c.web?.title });
    }
  }
  return out.length > 0 ? out : undefined;
}

export type GeminiErrorCode =
  | "GEMINI_TIMEOUT"
  | "GEMINI_RATE_LIMITED"
  | "GEMINI_HTTP_ERROR"
  | "GEMINI_NETWORK_ERROR"
  | "GEMINI_PARSE_ERROR"
  | "GEMINI_SCHEMA_VIOLATION";

/**
 * Stable error class for callGeminiStructured failures.
 * Branch on `.code` (preferred). `.name` mirrors `.code` for back-compat with
 * pre-existing callers that switched on `error.name`.
 */
export class GeminiStructuredError extends Error {
  readonly code: GeminiErrorCode;
  constructor(code: GeminiErrorCode, detail?: string, cause?: unknown) {
    super(detail ? `${code}: ${detail}` : code);
    this.name = code;
    this.code = code;
    if (cause !== undefined) (this as { cause?: unknown }).cause = cause;
  }
}

// REST key mapping for Gemini native generateContent tools.
// NOTE: google_search uses snake_case per the REST API spec.
//       googleMaps uses camelCase per the REST API spec (verified 2026-05-15 against
//       ai.google.dev/gemini-api/docs/maps-grounding — the curl example sends
//       "tools": [{"googleMaps": {}}], NOT {"google_maps": {}}).
//       url_context uses snake_case (same pattern as google_search).
const REST_TOOL_KEY_MAP: Record<string, string> = {
  googleSearch: "google_search",
  googleMaps: "googleMaps",    // camelCase — REST API uses "googleMaps" not "google_maps"
  urlContext: "url_context",
};

function toRestTools(tools: GeminiTool[]): Array<Record<string, unknown>> {
  return tools.map((t) => {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(t)) {
      out[REST_TOOL_KEY_MAP[k] ?? k] = v;
    }
    return out;
  });
}

/**
 * Single, typed call to Gemini native `generateContent` with JSON schema.
 *
 * Failure modes (throws `GeminiStructuredError`; branch on `.code`):
 *   - GEMINI_TIMEOUT          -- abort fired before response arrived
 *   - GEMINI_RATE_LIMITED     -- 429 from Gemini
 *   - GEMINI_HTTP_ERROR       -- other non-2xx (status appended to message)
 *   - GEMINI_PARSE_ERROR      -- response body wasn't valid JSON or had no text
 *   - GEMINI_SCHEMA_VIOLATION -- parsed JSON missing a top-level required key
 *                                or failed caller-supplied Zod validation
 */
export async function callGeminiStructured<T>(
  opts: CallGeminiStructuredOptions<T>,
): Promise<CallGeminiStructuredResult<T>> {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) throw new Error("GEMINI_API_KEY environment variable not set");

  const contents = buildContents(opts);
  // Gemini 3 canonical structured-output shape (v1beta REST):
  //   generationConfig.responseFormat.text.{mimeType, schema}
  const generationConfig: Record<string, unknown> = {
    responseFormat: {
      text: {
        mimeType: "application/json",
        schema: opts.responseJsonSchema,
      },
    },
  };
  if (opts.thinkingLevel) {
    generationConfig.thinkingConfig = { thinkingLevel: opts.thinkingLevel };
  }

  const body: Record<string, unknown> = { contents, generationConfig };
  if (opts.systemInstruction) {
    body.systemInstruction = { parts: [{ text: opts.systemInstruction }] };
  }
  if (opts.tools && opts.tools.length > 0) {
    body.tools = toRestTools(opts.tools);
  }

  const url = `${GEMINI_NATIVE_ENDPOINT}/${encodeURIComponent(opts.model)}:generateContent?key=${encodeURIComponent(key)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), opts.timeoutMs ?? 30_000);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new GeminiStructuredError("GEMINI_TIMEOUT");
    }
    const msg = e instanceof Error ? e.message : String(e);
    throw new GeminiStructuredError("GEMINI_NETWORK_ERROR", msg, e);
  } finally {
    clearTimeout(timeoutId);
  }

  if (res.status === 429) {
    if (opts.agentName) {
      console.info(`[gemini] ${opts.agentName} 429 rate_limited`);
    }
    throw new GeminiStructuredError("GEMINI_RATE_LIMITED");
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(
      `[gemini] ${opts.agentName ?? "callGeminiStructured"} HTTP ${res.status} body=${text.slice(0, 500)}`,
    );
    throw new GeminiStructuredError("GEMINI_HTTP_ERROR", `${res.status} ${text.slice(0, 200)}`);
  }

  let parsed: GeminiResponseBody;
  try {
    parsed = (await res.json()) as GeminiResponseBody;
  } catch (cause) {
    throw new GeminiStructuredError("GEMINI_PARSE_ERROR", "response body was not JSON", cause);
  }

  if (parsed.error) {
    throw new GeminiStructuredError("GEMINI_HTTP_ERROR", parsed.error.message ?? "unknown error");
  }

  const text = pickTextParts(parsed.candidates);
  if (!text) {
    throw new GeminiStructuredError("GEMINI_PARSE_ERROR", "no text in response candidates");
  }

  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch (cause) {
    throw new GeminiStructuredError("GEMINI_PARSE_ERROR", "candidate text was not JSON", cause);
  }

  // Caller-supplied Zod schema wins over JSON-Schema required-key check.
  if (opts.zodSchema) {
    const result = opts.zodSchema.safeParse(data);
    if (!result.success) {
      throw new GeminiStructuredError(
        "GEMINI_SCHEMA_VIOLATION",
        "zod validation failed",
        result.error,
      );
    }
    data = result.data;
  } else {
    const requiredKeys = extractRequiredKeys(opts.responseJsonSchema);
    if (requiredKeys.length > 0) {
      if (typeof data !== "object" || data === null || Array.isArray(data)) {
        throw new GeminiStructuredError(
          "GEMINI_SCHEMA_VIOLATION",
          "response JSON must be an object",
        );
      }
      const obj = data as Record<string, unknown>;
      const missing = requiredKeys.filter((k) => !(k in obj));
      if (missing.length > 0) {
        throw new GeminiStructuredError(
          "GEMINI_SCHEMA_VIOLATION",
          `missing required keys: ${missing.join(", ")}`,
        );
      }
    }
  }

  return {
    data,
    usage: {
      input_tokens: parsed.usageMetadata?.promptTokenCount ?? 0,
      output_tokens: parsed.usageMetadata?.candidatesTokenCount ?? 0,
    },
    citations: pickCitations(parsed.candidates),
  };
}
