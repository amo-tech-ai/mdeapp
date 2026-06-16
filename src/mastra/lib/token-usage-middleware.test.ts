import type {
  LanguageModelV2,
  LanguageModelV2StreamPart,
} from "@ai-sdk/provider";
import { describe, expect, it } from "vitest";
import { createTokenSink, runWithTokenSink } from "./token-usage-als";
import { withTokenUsageTracking } from "./token-usage-middleware";

function streamOf(parts: LanguageModelV2StreamPart[]): ReadableStream<LanguageModelV2StreamPart> {
  return new ReadableStream({
    start(controller) {
      for (const p of parts) controller.enqueue(p);
      controller.close();
    },
  });
}

async function drain(stream: ReadableStream<LanguageModelV2StreamPart>): Promise<LanguageModelV2StreamPart[]> {
  const out: LanguageModelV2StreamPart[] = [];
  const reader = stream.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    out.push(value);
  }
  return out;
}

/** Minimal fake AI-SDK v2 model — only the bits the Proxy touches. */
function fakeModel(opts: {
  generateUsage?: { inputTokens: number; outputTokens: number; totalTokens: number };
  streamParts?: LanguageModelV2StreamPart[];
}): LanguageModelV2 {
  return {
    specificationVersion: "v2",
    provider: "google",
    modelId: "gemini-3.5-flash",
    supportedUrls: {},
    async doGenerate() {
      return { usage: opts.generateUsage } as Awaited<ReturnType<LanguageModelV2["doGenerate"]>>;
    },
    async doStream() {
      return { stream: streamOf(opts.streamParts ?? []) } as Awaited<ReturnType<LanguageModelV2["doStream"]>>;
    },
  } as unknown as LanguageModelV2;
}

describe("withTokenUsageTracking (COST-001)", () => {
  it("forwards untouched members (transparent proxy)", () => {
    const wrapped = withTokenUsageTracking(fakeModel({}));
    expect(wrapped.modelId).toBe("gemini-3.5-flash");
    expect(wrapped.specificationVersion).toBe("v2");
  });

  it("records usage from a non-streaming generate call", async () => {
    const wrapped = withTokenUsageTracking(
      fakeModel({ generateUsage: { inputTokens: 80, outputTokens: 20, totalTokens: 100 } }),
    );
    const sink = createTokenSink();
    await runWithTokenSink(sink, () => wrapped.doGenerate({} as never));
    expect(sink.totalTokens).toBe(100);
    expect(sink.calls).toBe(1);
  });

  it("records usage from the stream finish part and passes parts through", async () => {
    const parts: LanguageModelV2StreamPart[] = [
      { type: "text-delta", id: "1", delta: "hi" } as LanguageModelV2StreamPart,
      {
        type: "finish",
        finishReason: "stop",
        usage: { inputTokens: 200, outputTokens: 50, totalTokens: 250 },
      } as LanguageModelV2StreamPart,
    ];
    const wrapped = withTokenUsageTracking(fakeModel({ streamParts: parts }));
    const sink = createTokenSink();
    const seen = await runWithTokenSink(sink, async () => {
      const { stream } = await wrapped.doStream({} as never);
      return drain(stream);
    });
    expect(seen).toHaveLength(2); // nothing dropped
    expect(sink.totalTokens).toBe(250);
    expect(sink.inputTokens).toBe(200);
  });

  it("captures nothing on an aborted stream that never emits finish", async () => {
    const parts: LanguageModelV2StreamPart[] = [
      { type: "text-delta", id: "1", delta: "partial" } as LanguageModelV2StreamPart,
    ];
    const wrapped = withTokenUsageTracking(fakeModel({ streamParts: parts }));
    const sink = createTokenSink();
    await runWithTokenSink(sink, async () => {
      const { stream } = await wrapped.doStream({} as never);
      return drain(stream);
    });
    expect(sink.calls).toBe(0);
    expect(sink.totalTokens).toBe(0);
  });
});
