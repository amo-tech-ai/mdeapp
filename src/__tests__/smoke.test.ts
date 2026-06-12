import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { mastra } from "@/mastra";
import {
  pingAgent,
  routerAgent,
  rentalAgent,
  conciergeAgent,
  eventAgent,
  evaluationAgent,
  MdeState,
} from "@/mastra/agents";
import { hostEventAgent } from "@/mastra/agents/host-event";
import { hostOpsAgent } from "@/mastra/agents/host-ops";

const root = resolve(import.meta.dirname, "../..");

describe("mdeapp smoke", () => {
  it("mastra instance registers legacy port agents", () => {
    const keys = Object.keys(mastra.listAgents() ?? {});
    expect(keys).toEqual(
      expect.arrayContaining([
        "pingAgent",
        "routerAgent",
        "rentalAgent",
        "conciergeAgent",
        "eventAgent",
        "evaluationAgent",
        "hostEventAgent",
        "hostOpsAgent",
      ]),
    );
    expect(keys).toHaveLength(8);
  });

  it("hostEventAgent is registered", () => {
    expect(hostEventAgent.id).toBe("host-event-agent");
    expect(mastra.getAgentById("host-event-agent")).toBeDefined();
  });

  it("mastra instance has pingAgent registered", () => {
    expect(mastra.getAgentById("ping-agent")).toBeDefined();
  });

  it("mastra instance registers read-only workspace with skills", () => {
    const ws = mastra.getWorkspace();
    expect(ws).toBeDefined();
    expect(ws?.skills).toBeDefined();
  });

  it('pingAgent id is "ping-agent"', () => {
    expect(pingAgent.id).toBe("ping-agent");
  });

  it("all product agents use gemini-3.5-flash", () => {
    const agents = [
      pingAgent,
      routerAgent,
      rentalAgent,
      conciergeAgent,
      eventAgent,
      evaluationAgent,
      hostOpsAgent,
    ];
    for (const agent of agents) {
      expect(JSON.stringify(agent.model)).toMatch(/gemini-3\.5-flash/);
    }
  });

  it("MdeState schema accepts the canonical shape", () => {
    const parsed = MdeState.parse({ lastQuery: "", hint: "" });
    expect(parsed.lastQuery).toBe("");
    expect(parsed.hint).toBe("");
  });

  it("MdeState schema rejects non-object input", () => {
    expect(() => MdeState.parse(null)).toThrow();
  });

  it("F08 supabase auth files exist", () => {
    const files = [
      "src/lib/supabase/client.ts",
      "src/lib/supabase/server.ts",
      "src/lib/supabase/middleware.ts",
      "src/middleware.ts",
      "src/app/login/page.tsx",
      "src/app/signup/page.tsx",
      "src/app/auth/callback/route.ts",
      "src/app/auth/signout/route.ts",
    ];
    for (const file of files) {
      expect(existsSync(resolve(root, file))).toBe(true);
    }
  });
});
