import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EmptyState } from "@/components/empty/empty-state";

describe("EmptyState", () => {
  it("renders title and suggestion testids", () => {
    const html = renderToStaticMarkup(
      <EmptyState
        testId="rentals-empty"
        title="No rentals found"
        description="Try widening your search."
        suggestions={[{ label: "Laureles", testId: "suggest-laureles" }]}
      />,
    );
    expect(html).toContain('data-testid="rentals-empty"');
    expect(html).toContain("No rentals found");
    expect(html).toContain('data-testid="suggest-laureles"');
  });
});
