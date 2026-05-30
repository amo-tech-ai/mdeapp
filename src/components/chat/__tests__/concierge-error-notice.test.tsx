import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ConciergeErrorNotice } from "@/components/chat/concierge-error-notice";

describe("ConciergeErrorNotice (UX-002)", () => {
  it("renders with the correct testid", () => {
    const html = renderToStaticMarkup(
      React.createElement(ConciergeErrorNotice, { onRetry: vi.fn() }),
    );
    expect(html).toContain('data-testid="concierge-error-notice"');
  });

  it("shows generic user-facing copy — no raw error codes", () => {
    const html = renderToStaticMarkup(
      React.createElement(ConciergeErrorNotice, { onRetry: vi.fn() }),
    );
    expect(html).toContain("Something went wrong");
    expect(html).toContain("The concierge timed out");
    expect(html).not.toContain("EAUTHTIMEOUT");
    expect(html).not.toContain("INCOMPLETE_STREAM");
    expect(html).not.toContain("RUN_ERROR");
  });

  it("renders the Try again button", () => {
    const html = renderToStaticMarkup(
      React.createElement(ConciergeErrorNotice, { onRetry: vi.fn() }),
    );
    expect(html).toContain("Try again");
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="Try again"');
  });

  it("wraps in copilotKit assistant message classes", () => {
    const html = renderToStaticMarkup(
      React.createElement(ConciergeErrorNotice, { onRetry: vi.fn() }),
    );
    expect(html).toContain("copilotKitMessage");
    expect(html).toContain("copilotKitAssistantMessage");
  });
});
