import { describe, expect, it, vi } from "vitest";

vi.mock("./ai-runs", () => ({
  recordMastraRun: vi.fn().mockResolvedValue(undefined),
}));

import { recordMastraRun } from "./ai-runs";
import { logAgentRunForTurn, resolveAgentLoggingMeta } from "./log-agent-run";

describe("log-agent-run", () => {
  it("maps pingAgent to general_concierge", () => {
    expect(resolveAgentLoggingMeta("pingAgent")).toEqual({
      agentName: "ping-agent",
      agentType: "general_concierge",
    });
  });

  it("maps routerAgent to concierge", () => {
    expect(resolveAgentLoggingMeta("routerAgent")).toEqual({
      agentName: "router-agent",
      agentType: "concierge",
    });
  });

  it("logAgentRunForTurn allows null user_id", async () => {
    await logAgentRunForTurn({
      agentMapKey: "pingAgent",
      userId: null,
      status: "success",
      durationMs: 42,
    });

    expect(recordMastraRun).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: null,
        agent_name: "ping-agent",
        agent_type: "general_concierge",
        status: "success",
        duration_ms: 42,
      }),
    );
  });

  it("logAgentRunForTurn propagates authenticated user_id", async () => {
    await logAgentRunForTurn({
      agentMapKey: "conciergeAgent",
      userId: "camila-uuid-123",
      status: "success",
      durationMs: 120,
    });

    expect(recordMastraRun).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "camila-uuid-123",
        agent_name: "concierge-agent",
        agent_type: "general_concierge",
      }),
    );
  });
});
