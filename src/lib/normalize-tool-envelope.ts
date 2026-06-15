/** CopilotKit / AG-UI may pass tool output as object or JSON string. */
export type WebGroundingEnvelope = {
  citations?: Array<{ title: string; url: string; snippet?: string | null }>;
  metadata?: Record<string, unknown>;
};

export function normalizeToolEnvelope(result: unknown): {
  results?: unknown[];
  total?: number;
  source?: string;
  hybridUsed?: boolean;
  rankExplanation?: Array<{ factor: string; score: number; note: string }>;
  webGrounding?: WebGroundingEnvelope;
} {
  let value = result;
  while (typeof value === "string") {
    try {
      value = JSON.parse(value) as unknown;
    } catch {
      return {};
    }
  }
  if (!value || typeof value !== "object") return {};
  const envelope = value as {
    results?: unknown[];
    total?: number;
    source?: string;
    hybridUsed?: boolean;
    rankExplanation?: Array<{ factor: string; score: number; note: string }>;
    webGrounding?: WebGroundingEnvelope;
  };
  return {
    results: Array.isArray(envelope.results) ? envelope.results : [],
    total: envelope.total,
    source: envelope.source,
    hybridUsed: envelope.hybridUsed,
    rankExplanation: envelope.rankExplanation,
    webGrounding: envelope.webGrounding,
  };
}
