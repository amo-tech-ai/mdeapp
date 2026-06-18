import { Memory } from "@mastra/memory";
import type { ZodObject, ZodRawShape } from "zod";
import { getMastraStorage } from "./storage";

export function createThreadMemory<T extends ZodRawShape>(
  schema: ZodObject<T>,
  // PERF-002: lastMessages is the largest input-token driver on busy threads —
  // replayed tool-result payloads inflate every Gemini call. Callers that don't
  // need deep raw history pass a smaller window to cut input size (and latency)
  // without losing follow-up context, which lives in working memory. Default 20.
  options?: { lastMessages?: number },
) {
  return new Memory({
    storage: getMastraStorage(),
    options: {
      workingMemory: {
        enabled: true,
        scope: "thread",
        schema,
      },
      lastMessages: options?.lastMessages ?? 20,
    },
  });
}

/** Host wizard draft lives in CopilotKit state — read-only WM avoids updateWorkingMemory tool ([SAN-905 · CK-V2-007d — Console clean on hostEventAgent stream](https://linear.app/sanjiovani/issue/SAN-905/ck-v2-007d-console-clean-on-hosteventagent-stream)). */
export function createHostEventThreadMemory<T extends ZodRawShape>(schema: ZodObject<T>) {
  return new Memory({
    storage: getMastraStorage(),
    options: {
      readOnly: true,
      workingMemory: {
        enabled: true,
        scope: "thread",
        schema,
      },
      lastMessages: 20,
    },
  });
}
