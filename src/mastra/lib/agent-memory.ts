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
