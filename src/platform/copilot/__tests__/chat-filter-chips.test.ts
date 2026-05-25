import { describe, it, expect } from "vitest";
import {
  applyChipToggle,
  CHAT_FILTER_CHIPS,
  EVENT_SUB_CHIPS,
  isChipActive,
} from "@/platform/copilot/chat-filter-chips";

describe("chat-filter-chips", () => {
  const laureles = CHAT_FILTER_CHIPS.find((c) => c.id === "laureles")!;

  it("activates Laureles neighborhood in working memory", () => {
    const next = applyChipToggle(undefined, laureles, true);
    expect(next.lastRentalQuery?.neighborhood).toBe("Laureles");
    expect(next.lastIntent).toBe("rental_search");
    expect(isChipActive(next, laureles)).toBe(true);
  });

  it("deactivates neighborhood when toggled off", () => {
    const active = applyChipToggle(undefined, laureles, true);
    const off = applyChipToggle(active, laureles, false);
    expect(off.lastRentalQuery?.neighborhood).toBeUndefined();
    expect(isChipActive(off, laureles)).toBe(false);
  });

  it("events chip sets lastIntent", () => {
    const events = CHAT_FILTER_CHIPS.find((c) => c.id === "events")!;
    const next = applyChipToggle(undefined, events, true);
    expect(next.lastIntent).toBe("event_discovery");
    expect(isChipActive(next, events)).toBe(true);
  });

  it("event sub-chip sets category and clears genericAskPending", () => {
    const nightlife = EVENT_SUB_CHIPS.find((c) => c.id === "ev-nightlife")!;
    const next = applyChipToggle(
      { lastEventQuery: { genericAskPending: true } },
      nightlife,
      true,
    );
    expect(next.lastEventQuery?.category).toBe("nightlife");
    expect(next.lastEventQuery?.genericAskPending).toBe(false);
    expect(isChipActive(next, nightlife)).toBe(true);
  });

  it("show-all sub-chip sets broad dateWindow", () => {
    const showAll = EVENT_SUB_CHIPS.find((c) => c.id === "ev-all")!;
    const next = applyChipToggle(undefined, showAll, true);
    expect(next.lastEventQuery?.dateWindow).toBe("any");
    expect(isChipActive(next, showAll)).toBe(true);
  });
});
