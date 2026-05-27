import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CenterPanelMapResultsSlot } from "@/components/chat/center-panel-map-results-slot";

vi.mock("@/components/chat/event-search-results-context", () => ({
  useEventSearchResults: vi.fn(),
}));

vi.mock("@/components/chat/chat-results-column", () => ({
  ChatResultsColumn: () =>
    React.createElement("div", { "data-testid": "results-column" }, "Map results"),
}));

import { useEventSearchResults } from "@/components/chat/event-search-results-context";

describe("CenterPanelMapResultsSlot", () => {
  it("hides map pin list when event rows exist", () => {
    vi.mocked(useEventSearchResults).mockReturnValue({
      rows: [
        {
          id: "e1",
          title: "Salsa Night",
          venue: "Lido",
          neighborhood: "Poblado",
          startsAt: "2026-05-16",
          pricePerTicket: 15,
        },
      ],
      setRows: vi.fn(),
      clearRows: vi.fn(),
      webCitations: [],
      setWebCitations: vi.fn(),
      clearWebCitations: vi.fn(),
    });
    const html = renderToStaticMarkup(React.createElement(CenterPanelMapResultsSlot));
    expect(html).not.toContain('data-testid="results-column"');
  });

  it("shows map pin list when no event rows", () => {
    vi.mocked(useEventSearchResults).mockReturnValue({
      rows: [],
      setRows: vi.fn(),
      clearRows: vi.fn(),
      webCitations: [],
      setWebCitations: vi.fn(),
      clearWebCitations: vi.fn(),
    });
    const html = renderToStaticMarkup(React.createElement(CenterPanelMapResultsSlot));
    expect(html).toContain('data-testid="results-column"');
  });
});
