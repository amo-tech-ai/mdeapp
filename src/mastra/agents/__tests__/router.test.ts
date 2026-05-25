import { describe, it, expect } from "vitest";
import { routerAgent } from "../router";

describe("routerAgent", () => {
  it('has id "router-agent"', () => {
    expect(routerAgent.id).toBe("router-agent");
  });

  it("registers classify-intent tool", async () => {
    const tools = await routerAgent.listTools();
    expect(tools.classifyIntentTool).toBeDefined();
  });

  it("registers rental and event dispatch workflows", async () => {
    const workflows = await routerAgent.listWorkflows();
    expect(workflows.rentalSearchWorkflow).toBeDefined();
    expect(workflows.eventDiscoveryWorkflow).toBeDefined();
  });

  it("instructions preserve follow-up rental intent", async () => {
    const instructions = await routerAgent.getInstructions();
    expect(instructions).toContain("show cheaper options");
    expect(instructions).toContain("Never call both workflows in one turn");
  });
});
