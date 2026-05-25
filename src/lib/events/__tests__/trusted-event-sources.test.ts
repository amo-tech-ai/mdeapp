import { describe, expect, it } from "vitest";
import {
  TRUSTED_EVENT_SOURCES,
  sourcePriorityForCategory,
} from "../trusted-event-sources";

describe("trusted-event-sources", () => {
  it("lists at least 20 https sources", () => {
    expect(TRUSTED_EVENT_SOURCES.length).toBeGreaterThanOrEqual(20);
    for (const s of TRUSTED_EVENT_SOURCES) {
      expect(s.url).toMatch(/^https:\/\//);
    }
  });

  it("prioritizes RA and Eventbrite for nightlife", () => {
    const ids = sourcePriorityForCategory("nightlife").map((s) => s.id);
    expect(ids).toContain("ra-med");
    expect(ids).toContain("eventbrite-med");
  });

  it("prioritizes Meetup for tech", () => {
    const ids = sourcePriorityForCategory("tech").map((s) => s.id);
    expect(ids).toContain("meetup");
    expect(ids).toContain("luma");
  });
});
