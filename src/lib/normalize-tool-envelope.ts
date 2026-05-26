/** CopilotKit / AG-UI may pass tool output as object or JSON string. */
export type WebGroundingEnvelope = {
  citations?: Array<{ title: string; url: string; snippet?: string | null }>;
  metadata?: Record<string, unknown>;
};

export function normalizeToolEnvelope(result: unknown): {
  results?: unknown[];
  total?: number;
  source?: string;
  webGrounding?: WebGroundingEnvelope;
} {
  let value = result;
  if (typeof value === "string") {
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
    webGrounding?: WebGroundingEnvelope;
  };
  return {
    results: Array.isArray(envelope.results) ? envelope.results : [],
    total: envelope.total,
    source: envelope.source,
    webGrounding: envelope.webGrounding,
  };
}
