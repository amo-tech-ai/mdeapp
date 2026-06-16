/**
 * COST-001 — single source of truth for Gemini token pricing.
 *
 * No price literals anywhere else in the codebase. Rates are USD per 1M tokens
 * and intentionally conservative defaults; update here when Google changes
 * pricing. Unknown models fall back to the Flash rate and are flagged so a new
 * model never silently logs $0.
 *
 * @see https://ai.google.dev/gemini-api/docs/pricing
 */

export interface ModelRate {
  /** USD per 1,000,000 input (prompt) tokens. */
  inputPerMillion: number;
  /** USD per 1,000,000 output (completion) tokens. */
  outputPerMillion: number;
}

/** Keyed by the model id reported by the AI SDK (`google("<id>")`). */
const MODEL_RATES: Record<string, ModelRate> = {
  "gemini-3.5-flash": { inputPerMillion: 0.3, outputPerMillion: 2.5 },
  "gemini-3.1-flash-lite": { inputPerMillion: 0.1, outputPerMillion: 0.4 },
  "gemini-3.1-pro-preview": { inputPerMillion: 1.25, outputPerMillion: 10 },
};

/** Used when a model id is not in {@link MODEL_RATES} — never returns 0 silently. */
const FALLBACK_RATE: ModelRate = MODEL_RATES["gemini-3.5-flash"]!;

export interface ModelCostInput {
  modelName: string | null | undefined;
  inputTokens: number | null | undefined;
  outputTokens: number | null | undefined;
}

export interface ModelCostResult {
  estimatedCostUsd: number;
  /** True when the model id was unknown and FALLBACK_RATE was used. */
  rateFallback: boolean;
}

function nonNegative(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : 0;
}

/**
 * Compute the estimated USD cost of one model call. Rounded to 6 decimals so a
 * cheap turn never rounds to exactly 0 (Flash input ≈ $0.0000003/token).
 */
export function calculateModelCost(input: ModelCostInput): ModelCostResult {
  const id = (input.modelName ?? "").trim();
  const rate = MODEL_RATES[id];
  const resolved = rate ?? FALLBACK_RATE;
  const inputTokens = nonNegative(input.inputTokens);
  const outputTokens = nonNegative(input.outputTokens);
  const raw =
    (inputTokens / 1_000_000) * resolved.inputPerMillion +
    (outputTokens / 1_000_000) * resolved.outputPerMillion;
  return {
    estimatedCostUsd: Math.round(raw * 1_000_000) / 1_000_000,
    rateFallback: !rate,
  };
}

/** Exposed for tests / dashboards that need the raw rate table. */
export function getModelRate(modelName: string | null | undefined): ModelRate {
  return MODEL_RATES[(modelName ?? "").trim()] ?? FALLBACK_RATE;
}
