import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { VenueCardShell } from "../venue-card-shell";

describe("VenueCardShell", () => {
  it("renders standard layout with footer and selection attrs", () => {
    const html = renderToStaticMarkup(
      <VenueCardShell
        testId="restaurant-card"
        resultKind="restaurant"
        pinId="restaurant-r1"
        selected
        ariaLabel="Restaurant: Test"
        media={<div data-testid="media">img</div>}
        footer={
          <div className="border-t px-3 py-2" data-testid="footer">
            actions
          </div>
        }
      >
        <h3>Test</h3>
      </VenueCardShell>,
    );

    expect(html).toContain('data-testid="restaurant-card"');
    expect(html).toContain('data-result-kind="restaurant"');
    expect(html).toContain('data-pin-id="restaurant-r1"');
    expect(html).toContain('data-selected="true"');
    expect(html).toContain('data-testid="footer"');
    expect(html).toContain("border-primary ring-2");
  });

  it("renders rental layout with featured styling and no footer", () => {
    const html = renderToStaticMarkup(
      <VenueCardShell
        testId="rental-card"
        resultKind="rental"
        pinId="listing-1"
        featured
        layout="rental"
        media={<div data-testid="rental-media">photo</div>}
      >
        <p>Body</p>
      </VenueCardShell>,
    );

    expect(html).toContain('data-testid="rental-card"');
    expect(html).toContain('data-result-kind="rental"');
    expect(html).toContain("bg-primary/[0.02]");
    expect(html).toContain('data-testid="rental-media"');
    expect(html).not.toContain('data-testid="footer"');
  });

  it("renders nova Card composition when requested", () => {
    const html = renderToStaticMarkup(
      <VenueCardShell
        testId="restaurant-card"
        resultKind="restaurant"
        composition="nova"
        media={<span />}
        footer={<span data-testid="footer">actions</span>}
      >
        <h3>Test</h3>
      </VenueCardShell>,
    );

    expect(html).toContain('data-slot="card"');
    expect(html).toContain('data-testid="footer"');
  });

  it("renders cover media above body for nova browse layout", () => {
    const html = renderToStaticMarkup(
      <VenueCardShell
        testId="restaurant-card"
        resultKind="restaurant"
        composition="nova"
        mediaLayout="cover"
        media={<div data-testid="hero">hero</div>}
        footer={<span>actions</span>}
      >
        <h3>Test</h3>
      </VenueCardShell>,
    );

    expect(html.indexOf('data-testid="hero"')).toBeLessThan(html.indexOf("<h3>"));
  });

  it("supports interactive body button role", () => {
    const html = renderToStaticMarkup(
      <VenueCardShell
        testId="card"
        resultKind="restaurant"
        bodyRole="button"
        bodyTabIndex={0}
        bodyAriaLabel="Open details"
        onBodyClick={vi.fn()}
        media={<span />}
      >
        content
      </VenueCardShell>,
    );

    expect(html).toContain('role="button"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('aria-label="Open details"');
  });
});
