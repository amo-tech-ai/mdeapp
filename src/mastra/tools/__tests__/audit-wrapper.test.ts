import { describe, expect, it, vi } from "vitest";
import { withAudit } from "../audit-wrapper";
import { RiskLevel } from "../risk-levels";

describe("withAudit", () => {
  it("logs pre/post and passes user_id", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const fn = vi.fn().mockResolvedValue({ ok: true });
    const audited = withAudit("search-events", RiskLevel.low, fn);

    const result = await audited({ q: "salsa" }, { user_id: "user-1" });

    expect(result).toEqual({ ok: true });
    expect(fn).toHaveBeenCalledWith({ q: "salsa" });
    expect(info).toHaveBeenCalledWith("[audit:pre]", "search-events", {
      risk: RiskLevel.low,
    });
    info.mockRestore();
  });
});
