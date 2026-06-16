/**
 * COST-001 — per-turn token accumulator carried via AsyncLocalStorage.
 *
 * Why ALS and not the RequestContext: the AG-UI bridge (`@ag-ui/mastra`) produces
 * token usage on the Mastra `fullStream` "finish" chunk but discards it, and the
 * AI-SDK model middleware (where usage is observable) has no handle on the Mastra
 * RequestContext. ALS bridges the two: `LoggingMastraAgent.run()` opens a sink for
 * the turn; the model middleware ({@link ./token-usage-middleware}) writes into
 * whatever sink is current when the model executes. Reads happen from the closure
 * reference in `run()`, not from ALS, so they are deterministic.
 *
 * Multi-step turns (tool calls, retries) call the model more than once — each call
 * adds to the same sink, so the turn total is cumulative.
 */
import { AsyncLocalStorage } from "node:async_hooks";

export interface TokenSink {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  /** Number of model calls observed this turn (0 ⇒ usage was never captured). */
  calls: number;
}

const store = new AsyncLocalStorage<TokenSink>();

export function createTokenSink(): TokenSink {
  return { inputTokens: 0, outputTokens: 0, totalTokens: 0, calls: 0 };
}

/** Run `fn` with `sink` as the active token sink for the async context. */
export function runWithTokenSink<T>(sink: TokenSink, fn: () => T): T {
  return store.run(sink, fn);
}

/** The sink for the current async context, or undefined outside a turn. */
export function getActiveTokenSink(): TokenSink | undefined {
  return store.getStore();
}

/**
 * Add one model call's usage to the active sink. No-op outside a turn (e.g. a
 * background/script model call with no sink open) so it can never throw.
 */
export function addModelUsage(usage: {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}): void {
  const sink = store.getStore();
  if (!sink) return;
  const input = finite(usage.inputTokens);
  const output = finite(usage.outputTokens);
  const total = usage.totalTokens !== undefined ? finite(usage.totalTokens) : input + output;
  if (input === 0 && output === 0 && total === 0) return;
  sink.inputTokens += input;
  sink.outputTokens += output;
  sink.totalTokens += total;
  sink.calls += 1;
}

function finite(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}
