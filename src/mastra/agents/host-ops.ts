import { Agent } from "@mastra/core/agent";
import { hostOpsMemorySchema } from "@/lib/types/host-dashboard";
import { createThreadMemory } from "@/mastra/lib/agent-memory";
import { FLASH_MODEL } from "@/mastra/lib/models";
import { HOST_OPS_INSTRUCTIONS } from "./host-ops-prompt";
import {
  listHostEventsTool,
  getSalesSummaryTool,
} from "@/mastra/tools/hostops-read-tools";
import { getSalesInsightsTool } from "@/mastra/tools/hostops-insight-tool";

/**
 * SAN-760 · AIE-005 — hostOpsAgent + HostDashboardState.
 * Answers an event host's "how are my sales?" by running the deterministic read
 * tools + SAN-759 · AIE-007 — salesInsightWorkflow; it relays numbers, never computes
 * them. Its thread working memory is the lean `hostOpsMemorySchema` (focus + narration
 * only) — the full render-ready `HostDashboardState` is the UI state contract for
 * SAN-729 · AIE-008 — Host Analytics Page + HostOpsCopilotBridge.
 */
export const hostOpsAgent = new Agent({
  id: "host-ops-agent",
  name: "Host Ops Agent",
  tools: { listHostEventsTool, getSalesSummaryTool, getSalesInsightsTool },
  model: FLASH_MODEL,
  instructions: HOST_OPS_INSTRUCTIONS,
  // @ts-expect-error beta drift — same as pingAgent / hostEventAgent
  memory: createThreadMemory(hostOpsMemorySchema),
});
