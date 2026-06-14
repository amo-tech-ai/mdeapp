import { describe, expect, it } from "vitest";
import type { Mastra } from "@mastra/core/mastra";
import {
  getLocalAgentsWithLogging,
  RUNTIME_AGENT_ALLOWLIST,
} from "./logging-mastra-agent";

describe("getLocalAgentsWithLogging — runtime allowlist (SAN-591)", () => {
  it("filters 8 registered agents down to the Phase-1 allowlist", () => {
    const allKeys = [
      "pingAgent",
      "routerAgent",
      "rentalAgent",
      "conciergeAgent",
      "eventAgent",
      "evaluationAgent",
      "hostEventAgent",
      "hostOpsAgent",
    ] as const;
    const agents = Object.fromEntries(allKeys.map((key) => [key, { id: key }]));
    const mastra = { listAgents: () => agents } as unknown as Mastra;

    const mapped = getLocalAgentsWithLogging({ mastra, resourceId: "test-user" });

    expect(Object.keys(mapped).sort()).toEqual([...RUNTIME_AGENT_ALLOWLIST].sort());
    expect(Object.keys(mapped)).not.toContain("routerAgent");
    expect(Object.keys(mapped)).not.toContain("rentalAgent");
    expect(Object.keys(mapped)).not.toContain("evaluationAgent");
  });
});
