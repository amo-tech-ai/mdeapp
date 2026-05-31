import { describe, expect, it } from "vitest";
import {
  EMBEDDING_DIM,
  EMBEDDING_MODEL,
  assertEmbeddingDimensions,
  formatEntityEmbedText,
  normalizeQueryText,
  queryEmbeddingCacheKey,
} from "../embedding-registry";

describe("embedding-registry — VEC-003", () => {
  it("locks gemini-embedding-001 at 768 dimensions", () => {
    expect(EMBEDDING_MODEL).toBe("gemini-embedding-001");
    expect(EMBEDDING_DIM).toBe(768);
  });

  it("normalizes query text for cache keys", () => {
    expect(normalizeQueryText("  Quiet Rooftop   Provenza! ")).toBe(
      "quiet rooftop provenza",
    );
  });

  it("builds stable cache keys", () => {
    const a = queryEmbeddingCacheKey("Salsa This Weekend");
    const b = queryEmbeddingCacheKey("salsa this weekend");
    expect(a).toBe(b);
    expect(a).toContain("768");
  });

  it("asserts 768-dim vectors", () => {
    expect(() => assertEmbeddingDimensions(new Array(768).fill(0))).not.toThrow();
    expect(() => assertEmbeddingDimensions([0.1, 0.2])).toThrow(/768/);
  });

  it("formats entity embed text", () => {
    const text = formatEntityEmbedText({
      title: "Loft Laureles",
      description: "Quiet nomad-friendly",
      neighborhood: "Laureles",
      tags: ["wifi", "workspace"],
    });
    expect(text).toContain("Loft Laureles");
    expect(text).toContain("Laureles");
  });
});
