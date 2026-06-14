import { describe, it, expect } from "vitest";
import {
  parseInsightResult,
  parseEventsResult,
  applyAgentState,
  toolRenderSignature,
} from "@/lib/events/host-dashboard-result";
import { EMPTY_HOST_DASHBOARD, type HostDashboardState } from "@/lib/types/host-dashboard";

const validInsight = {
  eventCount: 2,
  currency: "COP",
  totalRevenueCents: 500_000,
  totalTicketsSold: 80,
  paidOrders: 20,
  bestEvent: { eventId: "00000000-0000-4000-8000-000000000001", name: "Gala", revenueCents: 400_000 },
  weakestEvent: { eventId: "00000000-0000-4000-8000-000000000002", name: "Quiet", sellThrough: 0.15 },
  recommendedActions: [
    { eventId: "00000000-0000-4000-8000-000000000002", eventName: "Quiet", severity: "watch" as const, action: "Promote it." },
  ],
  narrative: "Two events, COP 5,000 in sales.",
};

describe("parseInsightResult — tool-result parsing (every payload shape)", () => {
  it("valid OBJECT payload → ok, KPI cards + recommendations + narrative", () => {
    const r = parseInsightResult(validInsight);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.patch.workflowStatus).toBe("ready");
    expect(r.patch.kpiCards.length).toBeGreaterThan(0);
    expect(r.patch.recommendations).toHaveLength(1);
    expect(r.patch.lastNarrative).toMatch(/5,000/);
    expect(r.patch.insights.totalRevenueCents).toBe(500_000); // deterministic, untouched
  });

  it("valid JSON STRING payload → ok (AG-UI sometimes serializes results)", () => {
    const r = parseInsightResult(JSON.stringify(validInsight));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.patch.insights.totalTicketsSold).toBe(80);
  });

  it("MISSING narrative → still ok, numbers preserved (never discard real data)", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { narrative: _omit, ...noNarrative } = validInsight;
    const r = parseInsightResult(noNarrative);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.patch.lastNarrative).toBeUndefined();
      expect(r.patch.kpiCards.length).toBeGreaterThan(0);
    }
  });

  it("EMPTY sales result (zeros, no best/weakest) → ok, neutral KPIs", () => {
    const r = parseInsightResult({
      eventCount: 0, currency: "COP", totalRevenueCents: 0, totalTicketsSold: 0,
      paidOrders: 0, bestEvent: null, weakestEvent: null, recommendedActions: [],
      narrative: "No sales yet.",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.patch.recommendations).toEqual([]);
      expect(r.patch.workflowStatus).toBe("ready");
    }
  });

  it("MALFORMED JSON string → ok:false (graceful, no throw)", () => {
    expect(parseInsightResult("{not json")).toEqual({ ok: false });
  });

  it("MALFORMED object (wrong shape) → ok:false", () => {
    expect(parseInsightResult({ foo: "bar" })).toEqual({ ok: false });
  });

  it("null / undefined / number payloads → ok:false, never throw", () => {
    expect(parseInsightResult(null)).toEqual({ ok: false });
    expect(parseInsightResult(undefined)).toEqual({ ok: false });
    expect(parseInsightResult(42)).toEqual({ ok: false });
  });
});

describe("toolRenderSignature — dedupe key (prevents the render loop)", () => {
  it("same data via a DIFFERENT object ref → same signature", () => {
    const a = { eventCount: 2, currency: "COP" };
    const b = { eventCount: 2, currency: "COP" }; // new ref, same value
    expect(a).not.toBe(b);
    expect(toolRenderSignature("complete", a)).toBe(toolRenderSignature("complete", b));
  });
  it("object and its JSON string form share a signature", () => {
    const o = { eventCount: 2 };
    expect(toolRenderSignature("complete", o)).toBe(toolRenderSignature("complete", JSON.stringify(o)));
  });
  it("different status or different data → different signature", () => {
    expect(toolRenderSignature("complete", { a: 1 })).not.toBe(toolRenderSignature("executing", { a: 1 }));
    expect(toolRenderSignature("complete", { a: 1 })).not.toBe(toolRenderSignature("complete", { a: 2 }));
  });
  it("never throws on null/undefined/unserializable", () => {
    expect(() => toolRenderSignature("complete", null)).not.toThrow();
    expect(() => toolRenderSignature("complete", undefined)).not.toThrow();
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    expect(() => toolRenderSignature("complete", cyclic)).not.toThrow();
  });
});

describe("parseEventsResult", () => {
  it("parses an events object payload", () => {
    const r = parseEventsResult({
      events: [{ id: "00000000-0000-4000-8000-000000000009", name: "X", slug: null, status: "published", eventStartTime: null }],
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.events).toHaveLength(1);
  });
  it("parses a JSON string events payload", () => {
    const r = parseEventsResult(JSON.stringify({ events: [] }));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.events).toEqual([]);
  });
  it("malformed → ok:false", () => {
    expect(parseEventsResult("nope")).toEqual({ ok: false });
    expect(parseEventsResult({ events: "x" })).toEqual({ ok: false });
  });
});

describe("applyAgentState — clobber-proof shared state (state safety)", () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { narrative: _n, ...insightNoNarrative } = validInsight;
  const populated: HostDashboardState = {
    ...EMPTY_HOST_DASHBOARD,
    insights: insightNoNarrative,
    kpiCards: [{ id: "revenue", label: "Revenue", value: "COP 5,000", intent: "good" as const }],
    salesSummaries: [],
    recommendations: insightNoNarrative.recommendedActions,
    workflowStatus: "ready" as const,
  };

  it("the agent CANNOT overwrite kpiCards / insights / salesSummaries / recommendations", () => {
    const next = applyAgentState(populated, {
      kpiCards: [],
      insights: undefined,
      salesSummaries: [],
      recommendations: [],
      workflowStatus: "idle",
    } as never);
    expect(next.kpiCards).toBe(populated.kpiCards); // untouched (same ref)
    expect(next.insights).toBe(populated.insights);
    expect(next.salesSummaries).toBe(populated.salesSummaries);
    expect(next.recommendations).toBe(populated.recommendations);
    expect(next.workflowStatus).toBe("ready");
  });

  it("the agent CAN set focusedEventId (its one legitimate field)", () => {
    const next = applyAgentState(populated, { focusedEventId: "00000000-0000-4000-8000-0000000000aa" });
    expect(next.focusedEventId).toBe("00000000-0000-4000-8000-0000000000aa");
    expect(next.kpiCards).toBe(populated.kpiCards); // numbers still safe
  });

  it("round-trips: empty agent payload is a no-op", () => {
    expect(applyAgentState(populated, {})).toBe(populated);
    expect(applyAgentState(populated, null as never)).toBe(populated);
  });
});
