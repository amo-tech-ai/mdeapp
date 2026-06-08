import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/components/chat/rental-ui-context", () => ({
  useRentalUi: vi.fn(),
}));

import { useRentalUi } from "@/components/chat/rental-ui-context";
import { LeadConfirmationBanner } from "@/components/chat/lead-confirmation-banner";

describe("LeadConfirmationBanner (SAN-716 / SCREEN-008)", () => {
  it("renders nothing when leadConfirmation is null", () => {
    vi.mocked(useRentalUi).mockReturnValue({
      leadConfirmation: null,
      clearLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    const html = renderToStaticMarkup(React.createElement(LeadConfirmationBanner));
    expect(html).toBe("");
  });

  it("renders confirmation card with testid when leadConfirmation is set", () => {
    vi.mocked(useRentalUi).mockReturnValue({
      leadConfirmation: {
        leadId: "abc12345-dead-beef-0000-000000000000",
        message: "Viewing request received — we will reach out within 24h.",
        listingTitle: "2BR Laureles Apartment",
      },
      clearLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    const html = renderToStaticMarkup(React.createElement(LeadConfirmationBanner));
    expect(html).toContain('data-testid="lead-confirmation-card"');
  });

  it("shows 'Viewing scheduled' heading", () => {
    vi.mocked(useRentalUi).mockReturnValue({
      leadConfirmation: {
        leadId: "abc12345-dead-beef-0000-000000000001",
        message: "We will reach out within 24h.",
        listingTitle: "Poblado Studio",
      },
      clearLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    const html = renderToStaticMarkup(React.createElement(LeadConfirmationBanner));
    expect(html).toContain("Viewing scheduled");
  });

  it("displays the listing title and truncated lead ref", () => {
    vi.mocked(useRentalUi).mockReturnValue({
      leadConfirmation: {
        leadId: "ref99999-dead-beef-0000-000000000099",
        message: "We will reach out within 24h.",
        listingTitle: "Envigado Studio",
      },
      clearLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    const html = renderToStaticMarkup(React.createElement(LeadConfirmationBanner));
    expect(html).toContain("Envigado Studio");
    expect(html).toContain("Ref ref99999");
  });

  it("displays the confirmation message", () => {
    const message = "Viewing request received — we will reach out within 24h.";
    vi.mocked(useRentalUi).mockReturnValue({
      leadConfirmation: {
        leadId: "msgtest0-dead-beef-0000-000000000000",
        message,
        listingTitle: "Laureles 2BR",
      },
      clearLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    const html = renderToStaticMarkup(React.createElement(LeadConfirmationBanner));
    expect(html).toContain(message);
  });

  it("renders a Dismiss button", () => {
    vi.mocked(useRentalUi).mockReturnValue({
      leadConfirmation: {
        leadId: "dismiss1-dead-beef-0000-000000000000",
        message: "We will reach out.",
        listingTitle: "Test Rental",
      },
      clearLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    const html = renderToStaticMarkup(React.createElement(LeadConfirmationBanner));
    expect(html).toContain("Dismiss");
    expect(html).toContain('type="button"');
  });

  it("has role=status for a11y — screen readers announce confirmation", () => {
    vi.mocked(useRentalUi).mockReturnValue({
      leadConfirmation: {
        leadId: "a11y0000-dead-beef-0000-000000000000",
        message: "We will reach out.",
        listingTitle: "Test Rental",
      },
      clearLeadConfirmation: vi.fn(),
    } as unknown as ReturnType<typeof useRentalUi>);

    const html = renderToStaticMarkup(React.createElement(LeadConfirmationBanner));
    expect(html).toContain('role="status"');
  });
});
