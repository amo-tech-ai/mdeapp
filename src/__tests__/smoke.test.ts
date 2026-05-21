import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { mastra } from "@/mastra";
import { pingAgent, MdeState } from "@/mastra/agents";

const root = resolve(import.meta.dirname, "../..");

describe("mdeapp smoke", () => {
  it("mastra instance has pingAgent registered", () => {
    expect(mastra.getAgentById("ping-agent")).toBeDefined();
  });

  it('pingAgent id is "ping-agent"', () => {
    expect(pingAgent.id).toBe("ping-agent");
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
