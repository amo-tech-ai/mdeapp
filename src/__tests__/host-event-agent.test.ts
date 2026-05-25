import { describe, expect, it } from "vitest";
import { mastra } from "@/mastra";
import { hostEventAgent } from "@/mastra/agents/host-event";
import { HOST_EVENT_INSTRUCTIONS } from "@/mastra/agents/host-event-prompt";

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
});
