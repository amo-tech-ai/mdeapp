import { RequestContext } from "@mastra/core/request-context";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/mastra/tools/audit-wrapper", () => ({
  withAudit: (_name: string, _risk: unknown, fn: (input: unknown) => Promise<unknown>) =>
    fn,
}));

import { getToolSpans } from "./tool-audit-context";
import { runAuditedSearch, runAuditedTool } from "./run-audited-search";

function ctx() {
  const requestContext = new RequestContext();
  return { requestContext, context: { requestContext } };
}

describe("runAuditedTool (AGT-00C)", () => {
  it("records ok span with duration", async () => {
    const { context } = ctx();
    const result = await runAuditedTool(
      "search-grounded-places",
      async () => ({ ok: true }),
      context,
    );
    expect(result).toEqual({ ok: true });
    const spans = getToolSpans(context);
    expect(spans).toHaveLength(1);
    expect(spans[0]).toMatchObject({
      tool: "search-grounded-places",
      status: "ok",
    });
    expect(spans[0].ms).toBeGreaterThanOrEqual(0);
  });

  it("records error span then rethrows", async () => {
    const { context } = ctx();
    await expect(
      runAuditedTool(
        "search-grounded-places",
        async () => {
          throw new Error("boom");
        },
        context,
      ),
    ).rejects.toThrow("boom");
    expect(getToolSpans(context)[0]).toMatchObject({ status: "error" });
  });
});

describe("runAuditedSearch (AGT-00C)", () => {
  it("delegates to runAuditedTool and passes input through audit wrapper", async () => {
    const { context } = ctx();
    const fn = vi.fn(async (input: { q: string }) => ({ echo: input.q }));
    const out = await runAuditedSearch("search-restaurants", fn, { q: "rooftop" }, context);
    expect(out).toEqual({ echo: "rooftop" });
    expect(fn).toHaveBeenCalledWith({ q: "rooftop" }, { user_id: null });
    expect(getToolSpans(context)[0].tool).toBe("search-restaurants");
  });
});
