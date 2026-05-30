import { createTool } from "@mastra/core/tools";
import {
  intentSlotExtractionSchema,
} from "@/lib/intent-slots";

/**
 * INT-001 — Mastra tool mirror for Gemini structured output.
 * The agent fills intent/confidence/action/slots; execute validates and returns.
 */
export const extractIntentSlotsTool = createTool({
  id: "extract-intent-slots",
  description:
    "Extract intent, confidence, routing action, and shared slots from the user message. Call before routing to rental/event/café/restaurant tools.",
  inputSchema: intentSlotExtractionSchema,
  outputSchema: intentSlotExtractionSchema,
  execute: async (inputData) => intentSlotExtractionSchema.parse(inputData),
});
