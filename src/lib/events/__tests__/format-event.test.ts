import { describe, expect, it } from "vitest";
import { isEventLookupUuid } from "@/lib/events/event-lookup";
import {
  formatEventSchedule,
  formatTicketPrice,
  ticketsRemaining,
} from "@/lib/events/format-event";

describe("isEventLookupUuid", () => {
  it("accepts canonical UUIDs", () => {
    expect(isEventLookupUuid("22222222-2222-2222-2222-000000000001")).toBe(true);
  });

  it("rejects slugs", () => {
    expect(isEventLookupUuid("reina-de-antioquia-2026-finals")).toBe(false);
  });
});

describe("formatTicketPrice", () => {
  it("formats COP centavos", () => {
    expect(formatTicketPrice(4_000_000, "COP")).toBe("$40,000 COP");
  });
});

describe("formatEventSchedule", () => {
  it("shows end time on same day", () => {
    const label = formatEventSchedule(
      "2027-02-24T01:00:00.000Z",
      "2027-02-24T05:30:00.000Z",
    );
    expect(label).toMatch(/–/);
  });
});

describe("ticketsRemaining", () => {
  it("never goes below zero", () => {
    expect(ticketsRemaining(10, 12)).toBe(0);
    expect(ticketsRemaining(100, 7)).toBe(93);
  });
});
