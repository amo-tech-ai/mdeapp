import { describe, expect, it } from "vitest";
import { mastra } from "@/mastra";
import { conciergeAgent } from "@/mastra/agents/concierge";
import { hostEventAgent } from "@/mastra/agents/host-event";
import { HOST_EVENT_INSTRUCTIONS } from "@/mastra/agents/host-event-prompt";

function workspaceToolIds(tools: Awaited<ReturnType<typeof hostEventAgent.listTools>>) {
  return Object.keys(tools).filter(
    (id) => id.includes("workspace") || id.startsWith("mastra_workspace"),
  );
}

describe("hostEventAgent", () => {
  it("has stable agent id", () => {
    expect(hostEventAgent.id).toBe("host-event-agent");
  });

  it("includes host persona instructions", () => {
    expect(HOST_EVENT_INSTRUCTIONS).toMatch(/Roberto/i);
    expect(HOST_EVENT_INSTRUCTIONS).toMatch(/preview_and_publish/);
  });

  it("registers in Mastra agents map", () => {
    expect(mastra.getAgentById("host-event-agent")).toBeDefined();
  });

  it("SAN-903 · opts out of global workspace tools", async () => {
    const tools = await hostEventAgent.listTools();
    expect(workspaceToolIds(tools)).toEqual([]);
    expect(await hostEventAgent.getWorkspace()).toBeUndefined();
  });

  it("SAN-903 B2a · global workspace unchanged for conciergeAgent", async () => {
    expect(mastra.getWorkspace()).toBeDefined();
    expect(await conciergeAgent.getWorkspace()).toBeDefined();
  });
});
