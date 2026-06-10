import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { EventProposalForm } from "../event-proposal-shell";
import { emptyEventProposalForm } from "@/components/sheets/event-proposal-shell-core";

describe("EventProposalForm", () => {
  it("renders the proposal fields with an enabled submit at idle", () => {
    const html = renderToStaticMarkup(
      <EventProposalForm
        form={emptyEventProposalForm}
        status="idle"
        message={null}
        onField={() => () => {}}
        onSubmit={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(html).toContain('id="ep-event-type"');
    expect(html).toContain('id="ep-party-size"');
    expect(html).toContain('id="ep-email"');
    expect(html).toContain('data-testid="event-proposal-submit-btn"');
    expect(html).toContain("Submit proposal");
    // Submit is no longer the inert placeholder — nothing is disabled at idle.
    // (Tailwind `disabled:` utility classes don't carry the `="` of an attribute.)
    expect(html).not.toContain('disabled=""');
  });

  it("disables submit and shows a sending label while submitting", () => {
    const html = renderToStaticMarkup(
      <EventProposalForm
        form={emptyEventProposalForm}
        status="submitting"
        message={null}
        onField={() => () => {}}
        onSubmit={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(html).toContain("Sending…");
    expect(html).toContain('disabled=""');
  });

  it("renders a validation error when status is error", () => {
    const html = renderToStaticMarkup(
      <EventProposalForm
        form={emptyEventProposalForm}
        status="error"
        message="Guest count: number must be greater than or equal to 20"
        onField={() => () => {}}
        onSubmit={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(html).toContain('data-testid="event-proposal-error"');
    expect(html).toContain("Guest count");
  });
});
