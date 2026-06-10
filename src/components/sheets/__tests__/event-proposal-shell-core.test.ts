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
  partySize: "25",
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
    });
    // blank optionals become undefined, not empty strings
    expect(body.contactPhone).toBeUndefined();
    expect(body.notes).toBeUndefined();
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
});
