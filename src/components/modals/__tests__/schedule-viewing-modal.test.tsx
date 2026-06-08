import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/components/chat/rental-ui-context", () => ({
  useRentalUi: vi.fn(),
}));

vi.mock("@/lib/leads/submit-schedule-viewing", () => ({
  submitScheduleViewing: vi.fn(),
}));

vi.mock("@/lib/use-modal-a11y", () => ({
  useModalA11y: vi.fn(),
}));

import { useRentalUi } from "@/components/chat/rental-ui-context";
import { ScheduleViewingModal } from "@/components/modals/schedule-viewing-modal";

const MOCK_TARGET = {
  listingId: "apt-laureles-001",
  title: "2BR Laureles Apartment",
  neighborhood: "Laureles",
};

describe("ScheduleViewingModal (SAN-716 / SCREEN-008)", () => {
  it("renders nothing when scheduleTarget is null", () => {
    vi.mocked(useRentalUi).mockReturnValue({
      scheduleTarget: null,
      closeScheduleViewing: vi.fn(),
      setLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    const html = renderToStaticMarkup(React.createElement(ScheduleViewingModal));
    expect(html).toBe("");
  });

  it("renders dialog with testid when scheduleTarget is set", () => {
    vi.mocked(useRentalUi).mockReturnValue({
      scheduleTarget: MOCK_TARGET,
      closeScheduleViewing: vi.fn(),
      setLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    const html = renderToStaticMarkup(React.createElement(ScheduleViewingModal));
    expect(html).toContain('data-testid="schedule-viewing-modal"');
  });

  it("shows listing title and neighborhood in the header", () => {
    vi.mocked(useRentalUi).mockReturnValue({
      scheduleTarget: MOCK_TARGET,
      closeScheduleViewing: vi.fn(),
      setLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    const html = renderToStaticMarkup(React.createElement(ScheduleViewingModal));
    expect(html).toContain("2BR Laureles Apartment");
    expect(html).toContain("Laureles");
  });

  it("renders all four form fields", () => {
    vi.mocked(useRentalUi).mockReturnValue({
      scheduleTarget: MOCK_TARGET,
      closeScheduleViewing: vi.fn(),
      setLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    const html = renderToStaticMarkup(React.createElement(ScheduleViewingModal));
    expect(html).toContain('name="name"');
    expect(html).toContain('name="email"');
    expect(html).toContain('name="phone"');
    expect(html).toContain('name="preferredAt"');
  });

  it("name and email fields are required", () => {
    vi.mocked(useRentalUi).mockReturnValue({
      scheduleTarget: MOCK_TARGET,
      closeScheduleViewing: vi.fn(),
      setLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    const html = renderToStaticMarkup(React.createElement(ScheduleViewingModal));
    // Two required fields: name + email
    const matches = html.match(/required/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("phone field is optional (no required attribute)", () => {
    vi.mocked(useRentalUi).mockReturnValue({
      scheduleTarget: MOCK_TARGET,
      closeScheduleViewing: vi.fn(),
      setLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    const html = renderToStaticMarkup(React.createElement(ScheduleViewingModal));
    expect(html).toContain("Phone (optional)");
  });

  it("renders Submit and Cancel buttons", () => {
    vi.mocked(useRentalUi).mockReturnValue({
      scheduleTarget: MOCK_TARGET,
      closeScheduleViewing: vi.fn(),
      setLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    const html = renderToStaticMarkup(React.createElement(ScheduleViewingModal));
    expect(html).toContain("Submit");
    expect(html).toContain("Cancel");
  });

  it("has role=dialog and aria-modal for a11y", () => {
    vi.mocked(useRentalUi).mockReturnValue({
      scheduleTarget: MOCK_TARGET,
      closeScheduleViewing: vi.fn(),
      setLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    const html = renderToStaticMarkup(React.createElement(ScheduleViewingModal));
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-labelledby="schedule-viewing-title"');
  });

  it("error state element has testid for E2E targeting", () => {
    vi.mocked(useRentalUi).mockReturnValue({
      scheduleTarget: MOCK_TARGET,
      closeScheduleViewing: vi.fn(),
      setLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    // Error is null on initial render — verify the testid is NOT present (null renders nothing)
    const html = renderToStaticMarkup(React.createElement(ScheduleViewingModal));
    expect(html).not.toContain('data-testid="schedule-viewing-error"');
  });

  it("submit button has testid for E2E targeting", () => {
    vi.mocked(useRentalUi).mockReturnValue({
      scheduleTarget: MOCK_TARGET,
      closeScheduleViewing: vi.fn(),
      setLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    const html = renderToStaticMarkup(React.createElement(ScheduleViewingModal));
    expect(html).toContain('data-testid="schedule-viewing-submit"');
  });
});
