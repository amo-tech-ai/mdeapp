import { describe, it, expect } from "vitest";
import { RequestContext } from "@mastra/core/request-context";
import { getHostContext, HOST_SUPABASE_KEY } from "@/mastra/tools/hostops-read-tools";
import { MDEAI_USER_ID_KEY } from "@/mastra/lib/tool-audit-context";

/**
 * SAN-762 · AIE-006 — tool-wrapper context reader.
 * Verifies the wrapper reads userId + user-scoped client from the SAME RequestContext
 * the route carries (the getAuditUserId carrier), and refuses when either is missing.
 */
describe("getHostContext — unauthorized / missing-context guards", () => {
  it("throws when there is no context at all", () => {
    expect(() => getHostContext(undefined)).toThrow(/sign in/i);
  });

  it("throws when userId is present but the client is not (signed in, route didn't inject client)", () => {
    const rc = new RequestContext();
    rc.set(MDEAI_USER_ID_KEY, "user-1");
    expect(() => getHostContext({ requestContext: rc })).toThrow(/sign in/i);
  });

  it("throws when the client is present but userId is not (anonymous)", () => {
    const rc = new RequestContext();
    rc.set(HOST_SUPABASE_KEY, { from: () => ({}) });
    expect(() => getHostContext({ requestContext: rc })).toThrow(/sign in/i);
  });

  it("returns {supabase,userId} when both are on the RequestContext", () => {
    const rc = new RequestContext();
    const fakeClient = { from: () => ({}) };
    rc.set(MDEAI_USER_ID_KEY, "user-1");
    rc.set(HOST_SUPABASE_KEY, fakeClient);
    const ctx = getHostContext({ requestContext: rc });
    expect(ctx.userId).toBe("user-1");
    expect(ctx.supabase).toBe(fakeClient);
  });
});
