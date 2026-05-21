import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { z } from "zod";

export const MdeState = z.object({
  lastQuery: z.string().default(""),
  hint: z.string().default(""),
});

export const pingAgent = new Agent({
  id: "ping-agent",
  name: "Ping Agent",
  tools: {},
  model: google("gemini-3.5-flash"),
  instructions:
    "You are mdeai's day-1 ping agent. Respond briefly in the same language the user wrote in. Confirm the wiring is alive. Do not call any tools.",
  // @ts-expect-error beta drift: @mastra/memory@beta Memory.recall() return shape differs from @mastra/core@beta MastraMemory expectation. Runtime verified in F02/F05. Remove when both packages align.
  memory: new Memory({
    storage: new LibSQLStore({ id: "ping-agent-memory", url: "file::memory:" }),
    options: {
      workingMemory: {
        enabled: true,
        schema: MdeState,
        scope: "thread",
      },
    },
  }),
});
