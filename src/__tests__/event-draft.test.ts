import { describe, expect, it } from "vitest";
import {
  EventDraftStateSchema,
  EMPTY_EVENT_DRAFT,
  activeHostWizardStep,
  isDraftReadyForPublish,
  mergeEventDraft,
} from "@/lib/types";

describe("EventDraftStateSchema", () => {
  it("parses empty draft with defaults", () => {
    const parsed = EventDraftStateSchema.parse({});
    expect(parsed.title).toBe("");
    expect(parsed.status).toBe("draft");
    expect(parsed.ticketTiers).toEqual([]);
  });

  it("rejects invalid status enum", () => {
    expect(() =>
      EventDraftStateSchema.parse({ status: "nonsense" }),
    ).toThrow();
  });

  it("mergeEventDraft applies patches", () => {
    const next = mergeEventDraft(EMPTY_EVENT_DRAFT, {
      title: "Salsa Night",
      neighborhood: "Laureles",
    });
    expect(next.title).toBe("Salsa Night");
    expect(next.neighborhood).toBe("Laureles");
  });

  it("activeHostWizardStep advances with fields", () => {
    let draft = mergeEventDraft(EMPTY_EVENT_DRAFT, { title: "Mixer" });
    expect(activeHostWizardStep(draft)).toBe("venue");
    draft = mergeEventDraft(draft, { venue: "Roof", capacity: 100 });
    expect(activeHostWizardStep(draft)).toBe("tickets");
    draft = mergeEventDraft(draft, { priceMinCop: 50000 });
    expect(activeHostWizardStep(draft)).toBe("preview");
  });

  it("isDraftReadyForPublish requires core fields", () => {
    expect(isDraftReadyForPublish(EMPTY_EVENT_DRAFT)).toBe(false);
    const ready = EventDraftStateSchema.parse({
      title: "Mixer",
      neighborhood: "Poblado",
      dateIso: "2026-03-15T19:00:00-05:00",
      venue: "Roof",
      capacity: 200,
      priceMinCop: 40000,
    });
    expect(isDraftReadyForPublish(ready)).toBe(true);
  });
});
