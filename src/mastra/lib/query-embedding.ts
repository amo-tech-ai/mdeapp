const EMBED_MODEL = "gemini-embedding-001";
const EMBED_DIM = 768;

/** Embed search query text for hybrid pgvector RPC (768-dim gemini-embedding-001). */
export async function embedQueryText(text: string): Promise<number[] | null> {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!key?.trim() || !text.trim()) return null;

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
      console.warn("[query-embedding] embed API failed:", res.status);
      return null;
    }

    const json = (await res.json()) as { embedding?: { values?: number[] } };
    const values = json.embedding?.values;
    if (!values?.length) return null;
    return values;
  } catch (err) {
    console.warn("[query-embedding] fetch error:", err instanceof Error ? err.message : err);
    return null;
  }
}

/** pgvector literal: `[0.1,0.2,...]` */
export function vectorLiteral(values: number[]): string {
  return `[${values.join(",")}]`;
}
