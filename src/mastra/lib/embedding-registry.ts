/** VEC-003 — canonical embedding contract (query + document must match). */
export const EMBEDDING_PROVIDER = "google-gemini" as const;
export const EMBEDDING_MODEL = "gemini-embedding-001";
export const EMBEDDING_DIM = 768;
export const EMBEDDING_DISTANCE = "cosine" as const;

/** Normalize user query text before embed + cache key. */
export function normalizeQueryText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s$./-áéíóúñü]/gi, "");
}

/** Stable cache key: model + dim + normalized query. */
export function queryEmbeddingCacheKey(text: string): string {
  const normalized = normalizeQueryText(text);
  return `${EMBEDDING_MODEL}:${EMBEDDING_DIM}:${normalized}`;
}

export function assertEmbeddingDimensions(values: number[]): void {
  if (values.length !== EMBEDDING_DIM) {
    throw new Error(
      `Embedding dimension mismatch: expected ${EMBEDDING_DIM}, got ${values.length}`,
    );
  }
}

/** Document-side text for entity embed jobs (must use same model). */
export function formatEntityEmbedText(parts: {
  title: string;
  description?: string | null;
  neighborhood?: string | null;
  tags?: string[] | null;
}): string {
  const chunks = [
    parts.title,
    parts.description ?? "",
    parts.neighborhood ? `Neighborhood: ${parts.neighborhood}` : "",
    parts.tags?.length ? `Tags: ${parts.tags.join(", ")}` : "",
  ].filter(Boolean);
  return chunks.join("\n").slice(0, 8000);
}
