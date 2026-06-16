/** CopilotKit / AG-UI may pass tool output as object or JSON string. */
export type WebGroundingEnvelope = {
  citations?: Array<{ title: string; url: string; snippet?: string | null }>;
  metadata?: Record<string, unknown>;
};

/** Unwrap CopilotKit v2 tool payloads that may be JSON-string encoded one or more times. */
export function decodeToolJson(result: unknown): unknown {
  let value = result;
  while (typeof value === "string") {
    try {
      value = JSON.parse(value) as unknown;
    } catch {
      return undefined;
    }
  }
  return value;
}

type AgUiToolResultPart = {
  type?: string;
  result?: unknown;
};

/** CopilotKit v2 passes `toolMessage.content` — often AG-UI `[{ type: "tool-result", result }]`. */
function unwrapAgUiToolPayload(result: unknown): unknown {
  let value = decodeToolJson(result);
  if (value == null) return value;

  if (Array.isArray(value)) {
    const part = value.find(
      (item): item is AgUiToolResultPart =>
        Boolean(item) &&
        typeof item === "object" &&
        (item as AgUiToolResultPart).type === "tool-result" &&
        "result" in (item as object),
    );
    if (part) value = decodeToolJson(part.result);
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    if (
      "result" in obj &&
      !("results" in obj) &&
      !("total" in obj) &&
      !("citations" in obj)
    ) {
      const inner = decodeToolJson(obj.result);
      if (inner && typeof inner === "object") value = inner;
    }
  }

  return value;
}

export function normalizeToolEnvelope(result: unknown): {
  results?: unknown[];
  total?: number;
  source?: string;
  hybridUsed?: boolean;
  rankExplanation?: Array<{ factor: string; score: number; note: string }>;
  webGrounding?: WebGroundingEnvelope;
} {
  const value = unwrapAgUiToolPayload(result);
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
