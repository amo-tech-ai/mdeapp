import { describe, expect, it } from "vitest";
import {
  isPartnerType,
  parsePartnerSignupSearchParams,
} from "@/lib/partners/parse-partner-signup-params";

describe("parsePartnerSignupSearchParams", () => {
  it("parses valid type and draft id", () => {
    const result = parsePartnerSignupSearchParams({
      type: "host",
      draft: "33333333-3333-4333-a333-333333333333",
    });
    expect(result.type).toBe("host");
    expect(result.draftId).toBe("33333333-3333-4333-a333-333333333333");
  });

  it("rejects invalid type and malformed draft", () => {
    const result = parsePartnerSignupSearchParams({
      type: "hacker",
      draft: "not-a-uuid",
    });
    expect(result.type).toBeNull();
    expect(result.typeParam).toBe("hacker");
    expect(result.draftId).toBeUndefined();
  });

  it("isPartnerType guard matches enum", () => {
    expect(isPartnerType("broker")).toBe(true);
    expect(isPartnerType("invalid")).toBe(false);
  });

  it("uses first value when query params are repeated", () => {
    const result = parsePartnerSignupSearchParams({
      type: ["host", "venue"],
      draft: ["33333333-3333-4333-a333-333333333333", "not-a-uuid"],
    });
    expect(result.type).toBe("host");
    expect(result.draftId).toBe("33333333-3333-4333-a333-333333333333");
  });
});
