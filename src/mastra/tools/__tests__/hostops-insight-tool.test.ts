import { describe, it, expect, vi } from "vitest";
import { RequestContext } from "@mastra/core/request-context";
import { HOST_SUPABASE_KEY } from "@/mastra/tools/hostops-read-tools";
import { MDEAI_USER_ID_KEY } from "@/mastra/lib/tool-audit-context";
import * as core from "@/lib/events/sales-insights-core";
import { getSalesInsightsTool } from "@/mastra/tools/hostops-insight-tool";

/**
 * SAN-760 · AIE-005 — get_sales_insights tool.
 * The guardrail in tests: numbers come from the deterministic workflow result; the
 * tool only wires gather → workflow. Unauthorized context fails safe.
 */

// Minimal callable for the tool's execute (createTool typing wraps it).
const execute = getSalesInsightsTool.execute as unknown as (
  input: { eventId?: string },
  context?: unknown,
) => Promise<{ narrative: string; eventCount: number }>;

function authedContext(extra: Record<string, unknown> = {}) {
  const rc = new RequestContext();
  rc.set(MDEAI_USER_ID_KEY, "host-1");
  rc.set(HOST_SUPABASE_KEY, { from: () => ({}) });
  return { requestContext: rc, ...extra };
}

function workflowStub(result: unknown) {
  const start = vi.fn().mockResolvedValue(result);
  const createRun = vi.fn().mockResolvedValue({ start });
  const getWorkflow = vi.fn().mockReturnValue({ createRun });
  return { ctxExtra: { mastra: { getWorkflow } }, start, getWorkflow };
}

describe("get_sales_insights tool", () => {
  it("fails safe when the host is not signed in (no context)", async () => {
    await expect(execute({}, undefined)).rejects.toThrow(/sign in/i);
  });

  it("returns an empty-state insight WITHOUT running the workflow when there are no sales", async () => {
    vi.spyOn(core, "gatherSalesSummaries").mockResolvedValue([]);
    const { ctxExtra, getWorkflow } = workflowStub({ status: "success", result: {} });

    const out = await execute({}, authedContext(ctxExtra));

    expect(out.eventCount).toBe(0);
    expect(out.narrative).toMatch(/don't have any/i);
    expect(getWorkflow).not.toHaveBeenCalled(); // never narrate an empty host
    vi.restoreAllMocks();
  });

  it("runs salesInsightWorkflow and returns its deterministic result on the happy path", async () => {
    const summaries = [{ eventId: "e1" }, { eventId: "e2" }] as never;
    vi.spyOn(core, "gatherSalesSummaries").mockResolvedValue(summaries);
    const result = {
      eventCount: 2,
      currency: "COP",
      totalRevenueCents: 500_000,
      totalTicketsSold: 80,
      paidOrders: 20,
      bestEvent: null,
      weakestEvent: null,
      recommendedActions: [],
      narrative: "Two events, COP 5,000 in sales.",
    };
    const { ctxExtra, start, getWorkflow } = workflowStub({ status: "success", result });

    const out = await execute({}, authedContext(ctxExtra));

    expect(getWorkflow).toHaveBeenCalledWith("salesInsightWorkflow");
    expect(start).toHaveBeenCalledWith({ inputData: { summaries } }); // gathered numbers, untouched
    expect(out).toEqual(result);
    vi.restoreAllMocks();
  });

  it("throws when the workflow does not complete successfully", async () => {
    vi.spyOn(core, "gatherSalesSummaries").mockResolvedValue([{ eventId: "e1" }] as never);
    const { ctxExtra } = workflowStub({ status: "failed" });
    await expect(execute({}, authedContext(ctxExtra))).rejects.toThrow(/did not complete/i);
    vi.restoreAllMocks();
  });
});
