import { describe, expect, it } from "vitest";
import {
  addModelUsage,
  createTokenSink,
  getActiveTokenSink,
  runWithTokenSink,
} from "./token-usage-als";

describe("token-usage-als (COST-001)", () => {
  it("accumulates usage into the active sink", () => {
    const sink = createTokenSink();
    runWithTokenSink(sink, () => {
      addModelUsage({ inputTokens: 100, outputTokens: 20, totalTokens: 120 });
      addModelUsage({ inputTokens: 50, outputTokens: 10, totalTokens: 60 });
    });
    expect(sink.inputTokens).toBe(150);
    expect(sink.outputTokens).toBe(30);
    expect(sink.totalTokens).toBe(180);
    expect(sink.calls).toBe(2);
  });

  it("derives total when only input/output provided", () => {
    const sink = createTokenSink();
    runWithTokenSink(sink, () => addModelUsage({ inputTokens: 7, outputTokens: 3 }));
    expect(sink.totalTokens).toBe(10);
  });

  it("is a no-op outside a sink (background/script calls never throw)", () => {
    expect(getActiveTokenSink()).toBeUndefined();
    expect(() => addModelUsage({ inputTokens: 99, outputTokens: 1 })).not.toThrow();
  });

  it("ignores empty usage and negatives (does not bump call count)", () => {
    const sink = createTokenSink();
    runWithTokenSink(sink, () => {
      addModelUsage({ inputTokens: 0, outputTokens: 0, totalTokens: 0 });
      addModelUsage({ inputTokens: -5, outputTokens: -2 });
    });
    expect(sink.calls).toBe(0);
    expect(sink.totalTokens).toBe(0);
  });

  it("propagates the sink across awaits (async context)", async () => {
    const sink = createTokenSink();
    await runWithTokenSink(sink, async () => {
      await Promise.resolve();
      addModelUsage({ inputTokens: 5, outputTokens: 5, totalTokens: 10 });
    });
    expect(sink.totalTokens).toBe(10);
  });
});
