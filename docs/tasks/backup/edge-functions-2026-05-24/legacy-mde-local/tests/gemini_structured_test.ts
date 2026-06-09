import { assertEquals, assertRejects, assertExists } from "jsr:@std/assert@1";
import { callGeminiStructured } from "../_shared/gemini.ts";

const ORIG_FETCH = globalThis.fetch;
const ORIG_KEY = Deno.env.get("GEMINI_API_KEY");

function withFetch(stub: typeof fetch, fn: () => Promise<void>): Promise<void> {
  return (async () => {
    Deno.env.set("GEMINI_API_KEY", "test-key");
    (globalThis as { fetch: typeof fetch }).fetch = stub;
    try {
      await fn();
    } finally {
      (globalThis as { fetch: typeof fetch }).fetch = ORIG_FETCH;
      if (ORIG_KEY) Deno.env.set("GEMINI_API_KEY", ORIG_KEY);
      else Deno.env.delete("GEMINI_API_KEY");
    }
  })();
}

const SCHEMA = {
  type: "object",
  required: ["title", "score"],
  properties: {
    title: { type: "string" },
    score: { type: "number" },
  },
};

function makeNativeResponse(text: string, extra: Record<string, unknown> = {}): Response {
  return new Response(
    JSON.stringify({
      candidates: [{ content: { parts: [{ text }] }, ...extra }],
      usageMetadata: { promptTokenCount: 42, candidatesTokenCount: 17 },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

Deno.test("callGeminiStructured — happy path returns typed data + usage", async () => {
  await withFetch(
    () => Promise.resolve(makeNativeResponse('{"title":"hello","score":0.92}')),
    async () => {
      const r = await callGeminiStructured<{ title: string; score: number }>({
        model: "gemini-3-flash-preview",
        prompt: "say hi",
        responseJsonSchema: SCHEMA,
      });
      assertEquals(r.data.title, "hello");
      assertEquals(r.data.score, 0.92);
      assertEquals(r.usage.input_tokens, 42);
      assertEquals(r.usage.output_tokens, 17);
    },
  );
});

Deno.test("callGeminiStructured — sends responseFormat + thinkingLevel + snake_case tools", async () => {
  let captured: Record<string, unknown> = {};
  await withFetch(
    (_url, init) => {
      captured = JSON.parse(String((init as RequestInit).body));
      return Promise.resolve(makeNativeResponse('{"title":"x","score":1}'));
    },
    async () => {
      await callGeminiStructured({
        model: "gemini-3-flash-preview",
        prompt: "p",
        responseJsonSchema: SCHEMA,
        thinkingLevel: "low",
        tools: [{ googleSearch: {} }, { urlContext: {} }],
      });
    },
  );
  const gen = captured.generationConfig as Record<string, unknown>;
  const responseFormat = gen.responseFormat as { text?: Record<string, unknown> };
  assertExists(responseFormat.text);
  assertEquals(responseFormat.text!.mimeType, "application/json");
  assertExists(responseFormat.text!.schema);
  assertEquals(
    (gen.thinkingConfig as Record<string, unknown>).thinkingLevel,
    "low",
  );
  const tools = captured.tools as Array<Record<string, unknown>>;
  assertEquals(Array.isArray(tools), true);
  // Caller passes camelCase; helper must transform to REST snake_case.
  assertExists(tools[0].google_search);
  assertExists(tools[1].url_context);
});

Deno.test("callGeminiStructured — zodSchema validation runs after parse", async () => {
  // Minimal Zod-like stub: returns success if title is non-empty, else failure.
  const zodLike = {
    safeParse(input: unknown) {
      const obj = input as { title?: string; score?: number };
      if (!obj.title) return { success: false as const, error: new Error("title required") };
      return { success: true as const, data: obj };
    },
  };

  await withFetch(
    () => Promise.resolve(makeNativeResponse('{"title":"","score":1}')),
    async () => {
      const err = await assertRejects(() =>
        callGeminiStructured({
          model: "gemini-3-flash-preview",
          prompt: "p",
          responseJsonSchema: SCHEMA,
          zodSchema: zodLike,
        })
      );
      assertEquals((err as { code?: string }).code, "GEMINI_SCHEMA_VIOLATION");
      assertEquals((err as Error).name, "GEMINI_SCHEMA_VIOLATION");
    },
  );
});

Deno.test("callGeminiStructured — GEMINI_SCHEMA_VIOLATION when required key missing", async () => {
  await withFetch(
    () => Promise.resolve(makeNativeResponse('{"title":"only-title"}')),
    async () => {
      const err = await assertRejects(() =>
        callGeminiStructured({
          model: "gemini-3-flash-preview",
          prompt: "p",
          responseJsonSchema: SCHEMA,
        })
      );
      assertEquals((err as Error).name, "GEMINI_SCHEMA_VIOLATION");
      assertEquals((err as { code?: string }).code, "GEMINI_SCHEMA_VIOLATION");
    },
  );
});

Deno.test("callGeminiStructured — GEMINI_PARSE_ERROR on non-JSON candidate text", async () => {
  await withFetch(
    () => Promise.resolve(makeNativeResponse("not json at all")),
    async () => {
      const err = await assertRejects(() =>
        callGeminiStructured({
          model: "gemini-3-flash-preview",
          prompt: "p",
          responseJsonSchema: SCHEMA,
        })
      );
      assertEquals((err as Error).name, "GEMINI_PARSE_ERROR");
    },
  );
});

Deno.test("callGeminiStructured — GEMINI_RATE_LIMITED on 429", async () => {
  await withFetch(
    () => Promise.resolve(new Response("rate limited", { status: 429 })),
    async () => {
      const err = await assertRejects(() =>
        callGeminiStructured({
          model: "gemini-3-flash-preview",
          prompt: "p",
          responseJsonSchema: SCHEMA,
        })
      );
      assertEquals((err as Error).name, "GEMINI_RATE_LIMITED");
    },
  );
});

Deno.test("callGeminiStructured — citations passed through from groundingMetadata", async () => {
  await withFetch(
    () =>
      Promise.resolve(
        makeNativeResponse('{"title":"t","score":1}', {
          groundingMetadata: {
            groundingChunks: [
              { web: { uri: "https://example.com/a", title: "A" } },
              { web: { uri: "https://example.com/b" } },
            ],
          },
        }),
      ),
    async () => {
      const r = await callGeminiStructured({
        model: "gemini-3-flash-preview",
        prompt: "p",
        responseJsonSchema: SCHEMA,
        tools: [{ googleSearch: {} }],
      });
      assertExists(r.citations);
      assertEquals(r.citations!.length, 2);
      assertEquals(r.citations![0].uri, "https://example.com/a");
      assertEquals(r.citations![0].title, "A");
    },
  );
});

Deno.test("callGeminiStructured — GEMINI_TIMEOUT on abort", async () => {
  await withFetch(
    (_url, init) =>
      new Promise<Response>((_resolve, reject) => {
        const signal = (init as RequestInit).signal;
        signal?.addEventListener("abort", () => {
          const e = new Error("aborted");
          e.name = "AbortError";
          reject(e);
        });
      }),
    async () => {
      const err = await assertRejects(() =>
        callGeminiStructured({
          model: "gemini-3-flash-preview",
          prompt: "p",
          responseJsonSchema: SCHEMA,
          timeoutMs: 50,
        })
      );
      assertEquals((err as Error).name, "GEMINI_TIMEOUT");
    },
  );
});
