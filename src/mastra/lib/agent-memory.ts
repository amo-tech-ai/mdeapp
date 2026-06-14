import { Memory } from "@mastra/memory";
import type { ZodObject, ZodRawShape } from "zod";
import { getMastraStorage } from "./storage";

export function createThreadMemory<T extends ZodRawShape>(schema: ZodObject<T>) {
  return new Memory({
    storage: getMastraStorage(),
    options: {
      workingMemory: {
        enabled: true,
        scope: "thread",
        schema,
      },
      lastMessages: 20,
    },
  });
}

/** Host wizard draft lives in CopilotKit state — read-only WM avoids updateWorkingMemory tool (SAN-905). */
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
