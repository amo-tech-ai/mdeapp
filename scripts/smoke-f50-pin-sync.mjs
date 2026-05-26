#!/usr/bin/env node
/**
 * F50 smoke: rental card click ↔ map pin selection.
 * Requires UI :3001 + GOOGLE_GENERATIVE_AI_API_KEY.
 */
import { chromium } from "playwright";
import {
  SMOKE_RENTAL_QUERY,
  assertSmokeEnv,
  logChatExcerptOnFailure,
  sendConciergeMessage,
  smokeFail,
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
    } catch (err) {
      await logChatExcerptOnFailure(page);
      smokeFail(
        `rental-card timeout — agent did not return cards (${err instanceof Error ? err.message : err})`,
      );
    }

    await page.waitForTimeout(1500);

    const cards = page.locator('[data-testid="rental-card"]');
    const cardCount = await cards.count();
    if (cardCount < 2) {
      smokeFail(`Need ≥2 rental cards for pin sync, got ${cardCount}`);
    }

    const secondCard = cards.nth(1);
    const pinId = await secondCard.getAttribute("data-pin-id");
    if (!pinId) smokeFail("rental card missing data-pin-id");

    await secondCard.click();
    await page.waitForTimeout(1500);

    const cardSelected = await secondCard.getAttribute("data-selected");
    if (cardSelected !== "true") {
      smokeFail(`Expected data-selected=true on card ${pinId}, got ${cardSelected}`);
    }

    const pin = page.locator(`[data-pin-id="${pinId}"][data-testid="map-pin"]`);
    const pinCount = await pin.count();
    if (pinCount < 1) smokeFail(`No map pin with data-pin-id=${pinId}`);

    console.log(`✅ Card click → selected card (${pinId})`);

    await pin.first().click({ force: true });
    await page.waitForTimeout(1000);

    const stillSelected = await secondCard.getAttribute("data-selected");
    if (stillSelected !== "true") {
      smokeFail("Pin click should keep matching card selected");
    }

    console.log("✅ Pin click → card stays selected (F50 pin ↔ card sync)");
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
