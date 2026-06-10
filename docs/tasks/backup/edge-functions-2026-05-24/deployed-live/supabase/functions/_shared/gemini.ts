/**
 * Shared Gemini API helpers: OpenAI-compat chat (with timeout) and retry.
 *
 * Centralizes the fetch call to Gemini's OpenAI-compatible endpoint
 * so every edge function gets consistent timeout, auth, and error handling.
 */

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

/** Retry transient failures / rate limits */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts?: { retries?: number; baseDelayMs?: number },
): Promise<T> {
  const retries = opts?.retries ?? 3;
  const baseDelayMs = opts?.baseDelayMs ?? 400;
  let last: unknown;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (i < retries - 1) {
        await new Promise((r) => setTimeout(r, baseDelayMs * (i + 1)));
      }
    }
  }
  throw last;
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
    return await fetch(GEMINI_ENDPOINT, {
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
