#!/usr/bin/env node
/**
 * Browser smoke: send Laureles rental query, expect rental card + 	62 map pins.
 * Requires: dev on :3001, GOOGLE_GENERATIVE_AI_API_KEY, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
 *
 * Usage: node --env-file=.env.local scripts/smoke-map-chat-pins.mjs
 */
import { chromium } from "playwright";
import {
  assertSmokeEnv,
  logChatExcerptOnFailure,
  sendConciergeMessage,
  smokeFail,
  SMOKE_RENTAL_QUERY,
  waitForHome,
  waitForRentalCards,
} from "./smoke-chat-helpers.mjs";

async function main() {
  assertSmokeEnv();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  try {
    await waitForHome(page);
    await sendConciergeMessage(page, SMOKE_RENTAL_QUERY);

    try {
      await waitForRentalCards(page);
    } catch {
      await logChatExcerptOnFailure(page);
      smokeFail("Expected ≥1 [data-testid=rental-card] from searchRentalsTool generative UI");
    }

    await page.waitForTimeout(3000);

    const rentalCards = await page.locator('[data-testid="rental-card"]').count();
    const pins = await page.locator('[data-testid="map-pin"]').count();
    const pinLabels = await page.locator("[data-pin-id]").evaluateAll((els) =>
      els.map((el) => el.getAttribute("aria-label")),
    );

    console.log(`✅ Chat response visible`);
    console.log(`   rental-card count: ${rentalCards}`);
    console.log(`   map-pin count: ${pins}`);
    console.log(`   pin labels: ${pinLabels.join(" | ")}`);

    if (rentalCards < 1) {
      await logChatExcerptOnFailure(page);
      smokeFail("Expected ≥1 [data-testid=rental-card] from searchRentalsTool generative UI");
    }
    if (pins < 2) {
      smokeFail(
        `Expected ≥2 map pins (mock + rental), got ${pins}. Pin labels: ${pinLabels.join(", ")}`,
      );
    }

    const hasRentalPin = pinLabels.some(
      (l) => l && !l.includes("map ready") && l.includes("rental:"),
    );
    if (!hasRentalPin) {
      smokeFail("No rental listing pin on map (only mock pin?)");
    }

    const rentalGlyphs = await page
      .locator('[data-marker-glyph="rental"]')
      .count();
    console.log(`   rental-marker-glyph count: ${rentalGlyphs}`);
    if (rentalGlyphs < 1) {
      smokeFail(
        `MAP-030: expected ≥1 rental marker (data-marker-glyph=rental), got ${rentalGlyphs}`,
      );
    }

    console.log("\n✅ Browser smoke: map + rental cards + pins");
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
