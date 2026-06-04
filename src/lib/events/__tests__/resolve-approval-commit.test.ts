import { describe, it, expect } from "vitest";
import { resolveApprovalCommit } from "../resolve-approval-commit";

describe("resolveApprovalCommit", () => {
  it("approved + eventId + slug → published (respond/onPublished proceed)", () => {
    const out = resolveApprovalCommit("approved", true, {
      success: true,
      eventId: "evt-1",
      slug: "salsa-night",
      approvalRequestId: "req-1",
    });
    expect(out).toEqual({
      kind: "published",
      eventId: "evt-1",
      slug: "salsa-night",
      approvalRequestId: "req-1",
    });
  });

  it("approved success WITHOUT eventId/slug → error (do NOT respond approved; allow retry)", () => {
    const out = resolveApprovalCommit("approved", true, { success: true });
    expect(out.kind).toBe("error");
    if (out.kind === "error") expect(out.message).toMatch(/no event reference/i);
  });

  it("approved success with eventId but missing slug → error", () => {
    const out = resolveApprovalCommit("approved", true, {
      success: true,
      eventId: "evt-1",
    });
    expect(out.kind).toBe("error");
  });

  it("edit / rejected success → decided (no publish payload required)", () => {
    expect(resolveApprovalCommit("edit", true, { success: true })).toEqual({
      kind: "decided",
    });
    expect(
      resolveApprovalCommit("rejected", true, { success: true }),
    ).toEqual({ kind: "decided" });
  });

  it("non-ok response → error with server message", () => {
    const out = resolveApprovalCommit("approved", false, {
      error: { message: "VALIDATION_ERROR" },
    });
    expect(out).toEqual({ kind: "error", message: "VALIDATION_ERROR" });
  });

  it("success=false → error with fallback message", () => {
    const out = resolveApprovalCommit("approved", true, { success: false });
    expect(out).toEqual({ kind: "error", message: "Approval commit failed" });
  });
});
