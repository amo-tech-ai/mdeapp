import { Agent } from "@mastra/core/agent";
import { EventDraftStateSchema } from "../../lib/types/event-draft";
import { createHostEventThreadMemory } from "../lib/agent-memory";
import { FLASH_MODEL } from "../lib/models";
import { HOST_EVENT_INSTRUCTIONS } from "./host-event-prompt";

export const hostEventAgent = new Agent({
  id: "host-event-agent",
  name: "Host Event Agent",
  tools: {},
  workspace: () => undefined, // SAN-903 · opt out of global filesystem tools
  model: FLASH_MODEL,
  instructions: HOST_EVENT_INSTRUCTIONS,
  // @ts-expect-error beta drift — same as pingAgent / F02
  memory: createHostEventThreadMemory(EventDraftStateSchema),
});
