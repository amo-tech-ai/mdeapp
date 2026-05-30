import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ConciergeThinkingIndicator } from "@/components/chat/concierge-thinking-indicator";

describe("ConciergeThinkingIndicator (UX-005)", () => {
  it("renders with the correct testid", () => {
    const html = renderToStaticMarkup(React.createElement(ConciergeThinkingIndicator));
    expect(html).toContain('data-testid="concierge-thinking"');
  });

  it("includes the 'Searching Medellín…' label", () => {
    const html = renderToStaticMarkup(React.createElement(ConciergeThinkingIndicator));
    expect(html).toContain("Searching Medellín…");
  });

  it("has an accessible status role", () => {
    const html = renderToStaticMarkup(React.createElement(ConciergeThinkingIndicator));
    expect(html).toContain('role="status"');
  });

  it("wraps in copilotKit assistant message classes", () => {
    const html = renderToStaticMarkup(React.createElement(ConciergeThinkingIndicator));
    expect(html).toContain("copilotKitMessage");
    expect(html).toContain("copilotKitAssistantMessage");
  });
});
