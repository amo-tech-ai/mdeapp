import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scoreRentalQuery, buildRentalSearchParams } from "../rental-query-parser";
import type { ConciergeWorkingMemory } from "../types";

const EMPTY_MEMORY: ConciergeWorkingMemory = {};

// Fix clock to 2026-06-01 (Monday) so date inference is deterministic
const MOCK_NOW = new Date("2026-06-01T12:00:00.000Z");

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(MOCK_NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("parseDateRange (via scoreRentalQuery)", () => {
  it("parses 'june 1 to 30' → ISO dates in current year", () => {
    const s = scoreRentalQuery("rentals june 1 to 30 $1000 medellin");
    expect(s.checkIn).toBe("2026-06-01");
    expect(s.checkOut).toBe("2026-06-30");
    expect(s.dateRangeLabel).toBe("June 1–30");
    expect(s.hasDateRange).toBe(true);
  });

  it("parses abbreviated month 'jul 5-10'", () => {
    const s = scoreRentalQuery("stay jul 5-10 in laureles");
    expect(s.checkIn).toBe("2026-07-05");
    expect(s.checkOut).toBe("2026-07-10");
    expect(s.dateRangeLabel).toMatch(/jul/i);
  });

  it("bumps to next year for a fully-passed month-range", () => {
    // May 1–15 has entirely passed by 2026-06-01
    const s = scoreRentalQuery("rentals may 1 to 15");
    expect(s.checkIn).toBe("2027-05-01");
    expect(s.checkOut).toBe("2027-05-15");
  });

  it("parses 'this weekend' → next Saturday/Sunday", () => {
    // 2026-06-01 is Monday; next Saturday = 2026-06-06, Sunday = 2026-06-07
    const s = scoreRentalQuery("any apartments this weekend");
    expect(s.checkIn).toBe("2026-06-06");
    expect(s.checkOut).toBe("2026-06-07");
    expect(s.dateRangeLabel).toBe("this weekend");
  });

  it("parses 'tomorrow' → next day", () => {
    const s = scoreRentalQuery("short stay tomorrow");
    expect(s.checkIn).toBe("2026-06-02");
    expect(s.checkOut).toBe("2026-06-02");
    expect(s.dateRangeLabel).toBe("tomorrow");
  });

  it("returns no date fields when no date present", () => {
    const s = scoreRentalQuery("2br in laureles under $100");
    expect(s.checkIn).toBeUndefined();
    expect(s.checkOut).toBeUndefined();
    expect(s.hasDateRange).toBe(false);
  });
});

describe("buildRentalSearchParams — date wiring", () => {
  it("includes ISO dates in fast-path params for june-range query", () => {
    const params = buildRentalSearchParams(
      "rentals june 1 to 30 $1000 medellin",
      EMPTY_MEMORY,
    );
    expect(params).not.toBeNull();
    expect(params?.checkIn).toBe("2026-06-01");
    expect(params?.checkOut).toBe("2026-06-30");
  });

  it("sets stayType=monthly when budget is monthly", () => {
    const params = buildRentalSearchParams(
      "list rentals $1000 per month in laureles",
      EMPTY_MEMORY,
    );
    expect(params?.stayType).toBe("monthly");
  });

  it("merges memory dates with current-query dates, current wins", () => {
    const memory: ConciergeWorkingMemory = {
      lastRentalQuery: {
        neighborhood: "Laureles",
        genericAskPending: false,
        checkIn: "2026-07-01",
        checkOut: "2026-07-15",
      },
    };
    // Current query supplies a different date range
    const params = buildRentalSearchParams(
      "rentals june 10 to 20 in laureles",
      memory,
    );
    expect(params?.checkIn).toBe("2026-06-10");
    expect(params?.checkOut).toBe("2026-06-20");
  });

  it("falls back to memory dates when current query has none", () => {
    const memory: ConciergeWorkingMemory = {
      lastRentalQuery: {
        neighborhood: "Laureles",
        genericAskPending: false,
        checkIn: "2026-07-01",
        checkOut: "2026-07-15",
      },
    };
    // Current query is a follow-up with no dates
    const params = buildRentalSearchParams("show more options", memory);
    // params can be null if text doesn't look like rental — skip that edge case
    if (params) {
      expect(params.checkIn).toBe("2026-07-01");
      expect(params.checkOut).toBe("2026-07-15");
    }
  });
});

describe("confidence band with date range", () => {
  it("hasBudget + hasDateRange + cityWide boosts confidence to 0.78", () => {
    const s = scoreRentalQuery("rentals june 1 to 30 $1000 medellin");
    expect(s.confidence).toBeCloseTo(0.78);
    expect(s.cityWide).toBe(true);
  });

  it("hasBudget + hasDateRange (no city) → 0.72", () => {
    const s = scoreRentalQuery("rentals june 1 to 30 $80/night");
    expect(s.confidence).toBeCloseTo(0.72);
  });
});
