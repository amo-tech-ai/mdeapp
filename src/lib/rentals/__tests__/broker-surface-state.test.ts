import { describe, expect, it } from "vitest";
import {
  brokerSurfaceEmpty,
  brokerSurfaceError,
  brokerSurfaceLoading,
  brokerSurfaceResult,
  formatPublishAuditValue,
} from "../broker-surface-state";
import { DATA_PENDING_LABEL, formatBrokerMetric } from "../data-pending";

describe("broker surface state contracts", () => {
  it("models loading | empty | result | error", () => {
    expect(brokerSurfaceLoading("broker_listings")).toEqual({
      kind: "broker_listings",
      state: "loading",
    });
    expect(brokerSurfaceEmpty("broker_leads").state).toBe("empty");
    expect(brokerSurfaceError("broker_showings", "Network error").retryable).toBe(true);
    expect(brokerSurfaceResult("publish_transition", { ok: true }).state).toBe("result");
  });

  it("returns Data pending. for unknown metrics", () => {
    expect(formatBrokerMetric(null)).toBe(DATA_PENDING_LABEL);
    expect(formatBrokerMetric()).toBe(DATA_PENDING_LABEL);
    expect(formatBrokerMetric("")).toBe(DATA_PENDING_LABEL);
    expect(formatBrokerMetric(42)).toBe("42");
    expect(formatPublishAuditValue(null)).toBe(DATA_PENDING_LABEL);
    expect(formatPublishAuditValue("")).toBe(DATA_PENDING_LABEL);
    expect(formatPublishAuditValue("   ")).toBe(DATA_PENDING_LABEL);
  });
});
