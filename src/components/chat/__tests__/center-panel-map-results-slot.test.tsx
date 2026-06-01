import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CenterPanelMapResultsSlot } from "@/components/chat/center-panel-map-results-slot";

vi.mock("@/components/chat/rich-card-results-context", () => ({
  useRichCardResults: vi.fn(),
}));

vi.mock("@/platform/maps/map-context", () => ({
  useMapContext: vi.fn(),
}));

vi.mock("@/components/chat/chat-results-column", () => ({
  ChatResultsColumn: () =>
    React.createElement("div", { "data-testid": "results-column" }, "Map results"),
}));

import { useRichCardResults } from "@/components/chat/rich-card-results-context";
import { useMapContext } from "@/platform/maps/map-context";

describe("CenterPanelMapResultsSlot", () => {
  it("hides map pin list when rich cards own the active vertical", () => {
    vi.mocked(useRichCardResults).mockReturnValue({
      counts: { event: 2 },
      setRichCardCount: vi.fn(),
      clearRichCardCounts: vi.fn(),
      hasRichCards: (c) => c === "event",
      shouldSuppressGenericMapResults: (c) => c === "event",
    });
    vi.mocked(useMapContext).mockReturnValue({
      activeMapCategory: "event",
    } as ReturnType<typeof useMapContext>);
    const html = renderToStaticMarkup(React.createElement(CenterPanelMapResultsSlot));
    expect(html).not.toContain('data-testid="results-column"');
  });

  it("hides for grounded café cards", () => {
    vi.mocked(useRichCardResults).mockReturnValue({
      counts: { grounded: 2 },
      setRichCardCount: vi.fn(),
      clearRichCardCounts: vi.fn(),
      hasRichCards: (c) => c === "grounded",
      shouldSuppressGenericMapResults: (c) => c === "grounded",
    });
    vi.mocked(useMapContext).mockReturnValue({
      activeMapCategory: "grounded",
    } as ReturnType<typeof useMapContext>);
    const html = renderToStaticMarkup(React.createElement(CenterPanelMapResultsSlot));
    expect(html).not.toContain('data-testid="results-column"');
  });

  it("shows map pin list when no rich cards for active category", () => {
    vi.mocked(useRichCardResults).mockReturnValue({
      counts: {},
      setRichCardCount: vi.fn(),
      clearRichCardCounts: vi.fn(),
      hasRichCards: () => false,
      shouldSuppressGenericMapResults: () => false,
    });
    vi.mocked(useMapContext).mockReturnValue({
      activeMapCategory: null,
    } as ReturnType<typeof useMapContext>);
    const html = renderToStaticMarkup(React.createElement(CenterPanelMapResultsSlot));
    expect(html).toContain('data-testid="results-column"');
  });
});
