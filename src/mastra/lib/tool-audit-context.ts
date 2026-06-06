import type { RequestContext } from "@mastra/core/request-context";

export const MDEAI_USER_ID_KEY = "mdeaiUserId";
/** Per-turn tool-timing spans, accumulated on the shared RequestContext (AGT-00C). */
export const MDEAI_TOOL_SPANS_KEY = "mdeaiToolSpans";
/** Optional cumulative token usage for the turn (when upstream exposes it). */
export const MDEAI_TOKEN_USAGE_KEY = "mdeaiTokenUsage";

export interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}

export function setAuditUserId(
  requestContext: RequestContext,
  userId: string | null,
): void {
  if (userId) requestContext.set(MDEAI_USER_ID_KEY, userId);
}

export function getAuditUserId(context?: unknown): string | null {
  const ctx = context as { requestContext?: RequestContext } | undefined;
  const id = ctx?.requestContext?.get(MDEAI_USER_ID_KEY);
  return typeof id === "string" ? id : null;
}

/**
 * AGT-00C — production-safe AI tracing without `@mastra/observability`.
 * A tool-timing span recorded into `ai_runs.metadata` so Patricia can see which
 * tool was slow on a turn. The shared RequestContext (same instance the
 * LoggingMastraAgent holds and that `getAuditUserId` reads) is the carrier.
 */
export interface ToolSpan {
  /** Tool id, e.g. "search_rentals". */
  tool: string;
  /** Wall-clock duration of the tool call in ms. */
  ms: number;
  status: "ok" | "error";
  /** Epoch ms when the call started (orders sequential/concurrent spans). */
  ts: number;
}

function resolveRequestContext(context?: unknown): RequestContext | undefined {
  return (context as { requestContext?: RequestContext } | undefined)
    ?.requestContext;
}

/** Append a tool-timing span to the current turn. No-op if no RequestContext. */
export function recordToolSpan(context: unknown, span: ToolSpan): void {
  const requestContext = resolveRequestContext(context);
  if (!requestContext) return;
  const existing = requestContext.get(MDEAI_TOOL_SPANS_KEY);
  const spans: ToolSpan[] = Array.isArray(existing)
    ? (existing as ToolSpan[])
    : [];
  spans.push(span);
  requestContext.set(MDEAI_TOOL_SPANS_KEY, spans);
}

/** Read the tool spans accumulated for the current turn (empty if none). */
export function getToolSpans(context: unknown): ToolSpan[] {
  const requestContext = resolveRequestContext(context);
  const existing = requestContext?.get(MDEAI_TOOL_SPANS_KEY);
  return Array.isArray(existing) ? (existing as ToolSpan[]) : [];
}

export interface ToolSpanSummary {
  tool_spans: ToolSpan[];
  tool_count: number;
  tool_ms_total: number;
  /** Tool id with the largest single duration this turn, or null when no spans. */
  slowest_tool: string | null;
  slowest_tool_ms: number;
  /** Count of tool spans that ended in error this turn. */
  tool_error_count: number;
  /** Distinct tool ids that failed at least once this turn. */
  failed_tools: string[];
}

/** Merge token usage into the shared RequestContext (additive). */
export function recordTokenUsage(
  context: unknown,
  usage: Partial<TokenUsage>,
): void {
  const requestContext = resolveRequestContext(context);
  if (!requestContext) return;
  const existing = requestContext.get(MDEAI_TOKEN_USAGE_KEY);
  const prior: TokenUsage =
    existing &&
    typeof existing === "object" &&
    "input_tokens" in existing &&
    "output_tokens" in existing
      ? (existing as TokenUsage)
      : { input_tokens: 0, output_tokens: 0, total_tokens: 0 };
  const next: TokenUsage = {
    input_tokens: prior.input_tokens + (usage.input_tokens ?? 0),
    output_tokens: prior.output_tokens + (usage.output_tokens ?? 0),
    total_tokens:
      prior.total_tokens +
      (usage.total_tokens ??
        (usage.input_tokens ?? 0) + (usage.output_tokens ?? 0)),
  };
  requestContext.set(MDEAI_TOKEN_USAGE_KEY, next);
}

export function getTokenUsage(context: unknown): TokenUsage | null {
  const requestContext = resolveRequestContext(context);
  const existing = requestContext?.get(MDEAI_TOKEN_USAGE_KEY);
  if (
    !existing ||
    typeof existing !== "object" ||
    !("input_tokens" in existing) ||
    !("output_tokens" in existing)
  ) {
    return null;
  }
  return existing as TokenUsage;
}

/** Pure aggregation for `ai_runs.metadata` — unit-tested independently. */
export function summarizeToolSpans(spans: ToolSpan[]): ToolSpanSummary {
  let total = 0;
  let slowest: ToolSpan | null = null;
  const failed = new Set<string>();
  let errorCount = 0;
  for (const span of spans) {
    total += span.ms;
    if (span.status === "error") {
      errorCount += 1;
      failed.add(span.tool);
    }
    if (!slowest || span.ms > slowest.ms) slowest = span;
  }
  return {
    tool_spans: spans,
    tool_count: spans.length,
    tool_ms_total: total,
    slowest_tool: slowest?.tool ?? null,
    slowest_tool_ms: slowest?.ms ?? 0,
    tool_error_count: errorCount,
    failed_tools: [...failed],
  };
}
