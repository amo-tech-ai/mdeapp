import type { AdkGroundingInvokeResponse } from "../../lib/adk-grounding-types";

/** Minimal ADK-unavailable shape for grounded-places tool tests. */
export function adkUnavailableMock(
  metadata: Record<string, unknown> = { reason: "adk_unavailable" },
): AdkGroundingInvokeResponse {
  return {
    places: [],
    pins: [],
    attribution: [],
    citations: [],
    confidence: 0,
    metadata,
  };
}
