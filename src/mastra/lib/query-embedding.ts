const EMBED_MODEL = "gemini-embedding-001";
const EMBED_DIM = 768;

export type EmbedFailureReason =
  | "missing_key"
  | "empty_text"
  | "http_error"
  | "empty_response"
  | "network_error";

export type EmbedQueryResult =
  | { ok: true; values: number[] }
  | { ok: false; reason: EmbedFailureReason; status?: number };

function resolveEmbedApiKey(): string | undefined {
  const primary = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  if (primary) return primary;
  return undefined;
}

/** Detailed embed attempt — use for telemetry; never log key values. */
export async function embedQueryTextDetailed(text: string): Promise<EmbedQueryResult> {
  const key = resolveEmbedApiKey();
  if (!key) {
    return { ok: false, reason: "missing_key" };
  }
  if (!text.trim()) {
    return { ok: false, reason: "empty_text" };
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: `models/${EMBED_MODEL}`,
          content: { parts: [{ text: text.trim() }] },
          outputDimensionality: EMBED_DIM,
        }),
      },
    );

    if (!res.ok) {
      const status = res.status;
      console.warn(
        `[query-embedding] embed API failed: HTTP ${status} — hybrid search will use keyword fallback`,
      );
      return { ok: false, reason: "http_error", status };
    }

    const json = (await res.json()) as { embedding?: { values?: number[] } };
    const values = json.embedding?.values;
    if (!values?.length) {
      console.warn(
        "[query-embedding] empty embedding response — hybrid search will use keyword fallback",
      );
      return { ok: false, reason: "empty_response" };
    }
    return { ok: true, values };
  } catch (err) {
    console.warn(
      "[query-embedding] fetch error:",
      err instanceof Error ? err.message : err,
      "— hybrid search will use keyword fallback",
    );
    return { ok: false, reason: "network_error" };
  }
}

/** Embed search query text for hybrid pgvector RPC (768-dim gemini-embedding-001). */
export async function embedQueryText(text: string): Promise<number[] | null> {
  const result = await embedQueryTextDetailed(text);
  return result.ok ? result.values : null;
}

/** pgvector literal: `[0.1,0.2,...]` */
export function vectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}
