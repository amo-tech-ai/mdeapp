import { describe, it, expect } from "vitest";
import * as agentExports from "../../agents";

/**
 * These strings must stay in sync across three places:
 *   1. Keys in `new Mastra({ agents: { conciergeAgent, hostEventAgent, ... } })` — src/mastra/index.ts
 *   2. CopilotAgentName type — src/lib/copilotkit-client-props.ts
 *   3. getCopilotKitClientProps("conciergeAgent") calls in components
 *
 * getLocalAgentsWithLogging() uses the Mastra agents-map key (the JS property name)
 * as the agentId it exposes to CopilotKit — NOT the Agent({ id }) field.
 * A mismatch here produces "Agent <name> not found" in the browser at runtime.
 */
const COPILOTKIT_AGENT_NAMES = ["conciergeAgent", "hostEventAgent"] as const;

describe("Mastra agent registration", () => {
  it("agents wired into CopilotKit are exported from @/mastra/agents", () => {
    for (const name of COPILOTKIT_AGENT_NAMES) {
      expect(
        agentExports,
        `"${name}" must be exported from src/mastra/agents/index.ts — it is used as the Mastra agents map key and must match the string passed to getCopilotKitClientProps()`,
      ).toHaveProperty(name);
    }
  });

  it("conciergeAgent export is an Agent instance", () => {
    expect(typeof agentExports.conciergeAgent.generate).toBe("function");
  });

  it("hostEventAgent export is an Agent instance", () => {
    expect(typeof agentExports.hostEventAgent.generate).toBe("function");
  });
});
