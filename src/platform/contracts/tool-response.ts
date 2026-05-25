import { z } from "zod";
import { mapPinSchema } from "./map-pin";

/** Envelope for tool output that may include map pins (coords must come from tools/DB). */
export const toolResponseSchema = z.object({
  text: z.string().optional(),
  pins: z.array(mapPinSchema).optional(),
  metadata: z
    .object({
      source: z.enum(["sql", "places", "grounding", "mock", "tool"]),
      toolId: z.string().optional(),
    })
    .optional(),
  traceId: z.string().optional(),
});

export type ToolResponse = z.infer<typeof toolResponseSchema>;

/** Reject payloads that look like raw LLM geo without tool provenance. */
export function assertToolProvenance(
  payload: { metadata?: { source?: string } },
): boolean {
  const source = payload.metadata?.source;
  return (
    source === "sql" ||
    source === "places" ||
    source === "grounding" ||
    source === "mock" ||
    source === "tool"
  );
}
