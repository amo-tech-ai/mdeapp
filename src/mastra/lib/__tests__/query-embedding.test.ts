import { describe, it, expect, vi, afterEach } from "vitest";
import { embedQueryText, embedQueryTextDetailed, vectorLiteral } from "../query-embedding";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("embedQueryText", () => {
  it("returns null when GOOGLE_GENERATIVE_AI_API_KEY is absent", async () => {
    const orig = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const result = await embedQueryText("quiet rooftop Provenza");
    expect(result).toBeNull();
    if (orig !== undefined) process.env.GOOGLE_GENERATIVE_AI_API_KEY = orig;
  });

  it("returns null when text is empty", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-key";
    const result = await embedQueryText("   ");
    expect(result).toBeNull();
  });

  it("returns null on HTTP error response", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 429 }),
    );
    const result = await embedQueryText("hello");
    expect(result).toBeNull();
  });

  it("embedQueryTextDetailed reports HTTP 403 as http_error", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 403 }),
    );
    const result = await embedQueryTextDetailed("2BR near Estadio");
    expect(result).toEqual({ ok: false, reason: "http_error", status: 403 });
  });

  it("returns null when fetch throws (network failure)", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network error")),
    );
    const result = await embedQueryText("hello");
    expect(result).toBeNull();
  });

  it("returns null when embedding values are missing from response", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ embedding: {} }),
      }),
    );
    const result = await embedQueryText("hello");
    expect(result).toBeNull();
  });

  it("returns values array on success", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-key";
    const fakeValues = Array.from({ length: 768 }, (_, i) => i / 1000);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ embedding: { values: fakeValues } }),
      }),
    );
    const result = await embedQueryText("hello");
    expect(result).toHaveLength(768);
    expect(result?.[0]).toBeCloseTo(0);
  });
});

describe("vectorLiteral", () => {
  it("formats array as pgvector literal", () => {
    expect(vectorLiteral([0.1, 0.2, 0.3])).toBe("[0.1,0.2,0.3]");
  });
});
