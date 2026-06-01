import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { RentalCard } from "../rental-card";

const RENTAL_CARD_PATH = resolve(__dirname, "../rental-card.tsx");

describe("UX-027 rental card copy leaks (UX-T-027 / CU-P0-07)", () => {
  it("source has no internal SCREEN ticket IDs or dev photo placeholder", () => {
    const src = readFileSync(RENTAL_CARD_PATH, "utf8");
    expect(src).not.toMatch(/SCREEN-\d+/);
    expect(src).not.toMatch(/Photo soon/i);
  });

  it("rendered Save CTA uses user-facing tooltip, not internal ticket copy", () => {
    const html = renderToStaticMarkup(
      <RentalCard
        id="rental-1"
        listingId="apt-1"
        title="1BR Laureles"
        neighborhood="Laureles"
        nightly_price={75}
        bedrooms={1}
        onSelect={() => undefined}
      />,
    );
    expect(html).toContain('title="Save for later (coming soon)"');
    expect(html).not.toMatch(/SCREEN-/);
    expect(html).not.toMatch(/Photo soon/i);
  });

  it("UX-021 exposes data-result-kind and aria-label on interactive card", () => {
    const html = renderToStaticMarkup(
      <RentalCard
        id="rental-1"
        listingId="apt-1"
        title="1BR Laureles"
        neighborhood="Laureles"
        nightly_price={75}
        bedrooms={1}
        onSelect={() => undefined}
      />,
    );
    expect(html).toContain('data-result-kind="rental"');
    expect(html).toContain('aria-label="Rental: 1BR Laureles, Laureles"');
    expect(html).toContain('data-result-kind="rental"');
  });
});
