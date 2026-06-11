import { describe, expect, it } from "vitest";
import {
  buildEventProposalRequest,
  validateEventProposal,
  emptyEventProposalForm,
  type EventProposalFormState,
} from "@/components/sheets/event-proposal-shell-core";
import type { EventProposalShellTarget } from "@/components/chat/rental-ui-context";

const target: EventProposalShellTarget = {
  venueTitle: "Mamacita Provenza",
  placeId: "ChIJSAN493MAMACITA01",
  partnerId: "00000000-0000-4001-8101-000000000001",
  partnerLocationId: "00000000-0000-4001-8201-000000000001",
};

const validForm: EventProposalFormState = {
  eventType: "  Birthday  ",
  startDate: "2026-06-14",
  startTime: "19:00",
  partySize: "25",
  budget: "5000000",
  requirements: "AV, catering , ",
  contactName: "  Tourist  ",
  contactEmail: " tourist@example.com ",
  contactPhone: "  ",
  notes: "",
};

describe("buildEventProposalRequest", () => {
  it("maps form + target to the request body, trimming and coercing", () => {
    const body = buildEventProposalRequest(validForm, target);
    expect(body).toMatchObject({
      partnerLocationId: target.partnerLocationId,
      partnerId: target.partnerId,
      eventType: "Birthday",
      startDate: "2026-06-14",
      partySize: 25,
      contactName: "Tourist",
      contactEmail: "tourist@example.com",
      venueTitle: target.venueTitle,
      startTime: "19:00",
      budgetCents: 500000000, // 5,000,000 COP → cents
    });
    // requirements split, trimmed, blanks dropped
    expect(body.requirements).toEqual(["AV", "catering"]);
    // blank optionals become undefined, not empty strings
    expect(body.contactPhone).toBeUndefined();
    expect(body.notes).toBeUndefined();
  });

  it("omits optional time/budget/requirements when blank", () => {
    const body = buildEventProposalRequest(
      { ...validForm, startTime: "", budget: "", requirements: " , " },
      target,
    );
    expect(body.startTime).toBeUndefined();
    expect(body.budgetCents).toBeUndefined();
    expect(body.requirements).toBeUndefined();
  });
});

describe("validateEventProposal", () => {
  it("returns ok + parsed body for a valid form", () => {
    const result = validateEventProposal(validForm, target);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.body.partySize).toBe(25);
      expect(result.body.eventType).toBe("Birthday");
    }
  });

  it("rejects a party size below the event minimum with a friendly field name", () => {
    const result = validateEventProposal(
      { ...validForm, partySize: "4" },
      target,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("Guest count");
  });

  it("rejects a missing event type", () => {
    const result = validateEventProposal(
      { ...validForm, eventType: "   " },
      target,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("Event type");
  });

  it("rejects an empty form", () => {
    const result = validateEventProposal(emptyEventProposalForm, target);
    expect(result.ok).toBe(false);
  });

  it("rejects missing date", () => {
    const result = validateEventProposal({ ...validForm, startDate: "" }, target);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("Date");
  });

  it("rejects missing email", () => {
    const result = validateEventProposal({ ...validForm, contactEmail: "" }, target);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toMatch(/email/i);
  });

  it("rejects missing guest count", () => {
    const result = validateEventProposal({ ...validForm, partySize: "" }, target);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("Guest count");
  });

  it("rejects guest count above business max (500)", () => {
    const result = validateEventProposal({ ...validForm, partySize: "5000" }, target);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("Guest count");
  });

  it("rejects malformed partnerLocationId", () => {
    const result = validateEventProposal(validForm, {
      ...target,
      partnerLocationId: "not-a-uuid",
    });
    expect(result.ok).toBe(false);
  });
});
