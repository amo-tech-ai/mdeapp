import { describe, it, expect } from "vitest";
import {
  hostDashboardStateSchema,
  hostOpsMemorySchema,
  EMPTY_HOST_DASHBOARD,
} from "@/lib/types/host-dashboard";
import { resolveAgentLoggingMeta } from "@/mastra/lib/log-agent-run";

describe("HostDashboardState — the AI-native dashboard contract", () => {
  it("parses to safe empty defaults (cards render nothing, not crash)", () => {
    expect(EMPTY_HOST_DASHBOARD.events).toEqual([]);
    expect(EMPTY_HOST_DASHBOARD.salesSummaries).toEqual([]);
    expect(EMPTY_HOST_DASHBOARD.kpiCards).toEqual([]);
    expect(EMPTY_HOST_DASHBOARD.recommendations).toEqual([]);
    expect(EMPTY_HOST_DASHBOARD.workflowStatus).toBe("idle");
    expect(EMPTY_HOST_DASHBOARD.insights).toBeUndefined();
  });

  it("round-trips a populated dashboard state", () => {
    const parsed = hostDashboardStateSchema.parse({
      focusedEventId: "00000000-0000-4000-8000-000000000001",
      kpiCards: [{ id: "revenue", label: "Revenue", value: "COP 5,000", intent: "good" }],
      workflowStatus: "ready",
      lastNarrative: "Two events sold well.",
    });
    expect(parsed.kpiCards[0].intent).toBe("good");
    expect(parsed.workflowStatus).toBe("ready");
  });

  it("keeps the lean working-memory schema a strict subset of the contract (no numbers)", () => {
    const keys = Object.keys(hostOpsMemorySchema.shape).sort();
    expect(keys).toEqual(["focusedEventId", "lastNarrative", "lastUpdatedIso"]);
    // numeric fields must NOT be in working memory — the guardrail
    expect(keys).not.toContain("insights");
    expect(keys).not.toContain("kpiCards");
    expect(keys).not.toContain("salesSummaries");
  });
});

describe("hostOpsAgent observability mapping", () => {
  it("maps hostOpsAgent to a valid Postgres agent_type enum value", () => {
    const meta = resolveAgentLoggingMeta("hostOpsAgent");
    expect(meta.agentName).toBe("host-ops-agent");
    expect(meta.agentType).toBe("general_concierge"); // existing enum value; no migration
  });
});
