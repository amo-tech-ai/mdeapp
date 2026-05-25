/** CopilotKit / AG-UI may pass tool output as object or JSON string. */
export function normalizeToolEnvelope(result: unknown): {
  results?: unknown[];
  total?: number;
  source?: string;
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
  const envelope = value as { results?: unknown[]; total?: number; source?: string };
  return {
    results: Array.isArray(envelope.results) ? envelope.results : [],
    total: envelope.total,
    source: envelope.source,
  };
}
