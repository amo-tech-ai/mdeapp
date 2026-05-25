import {
  adkGroundingInvokeRequestSchema,
  adkGroundingInvokeResponseSchema,
  type AdkGroundingInvokeResponse,
} from "./adk-grounding-types";

const DEFAULT_URL = "http://localhost:8000";
const TIMEOUT_MS = 30_000;

export type AdkGroundingInvokeInput = {
  query: string;
  pageSize?: number;
  locationBias?: { latitude: number; longitude: number };
  requestId?: string;
};

export async function invokeAdkGrounding(
  input: AdkGroundingInvokeInput,
): Promise<AdkGroundingInvokeResponse> {
  const base = process.env.ADK_GROUNDING_URL?.trim() || DEFAULT_URL;
  const body = adkGroundingInvokeRequestSchema.parse({
    tool: "search_grounded_places",
    query: input.query,
    pageSize: input.pageSize ?? 5,
    locationBias: input.locationBias,
    requestId: input.requestId,
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${base}/v1/grounding/invoke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      return adkGroundingInvokeResponseSchema.parse({
        metadata: { reason: "adk_unavailable", status: res.status },
      });
    }
    const json: unknown = await res.json();
    return adkGroundingInvokeResponseSchema.parse(json);
  } catch {
    return adkGroundingInvokeResponseSchema.parse({
      metadata: { reason: "adk_unavailable" },
    });
  } finally {
    clearTimeout(timer);
  }
}
