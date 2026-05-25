import { describe, expect, it } from "vitest";
import { RequestContext } from "@mastra/core/request-context";
import {
  getAuditUserId,
  MDEAI_USER_ID_KEY,
  setAuditUserId,
} from "../tool-audit-context";

describe("tool-audit-context", () => {
  it("round-trips user id through request context", () => {
    const requestContext = new RequestContext();
    setAuditUserId(requestContext, "user-abc");
    expect(requestContext.get(MDEAI_USER_ID_KEY)).toBe("user-abc");
    expect(
      getAuditUserId({ requestContext }),
    ).toBe("user-abc");
  });

  it("returns null when context missing", () => {
    expect(getAuditUserId(undefined)).toBeNull();
  });
});
