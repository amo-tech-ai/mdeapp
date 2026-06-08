import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import {
  gotoHome,
  sendConciergeMessage,
  waitForCopilotIdle,
  waitForRentalCards,
  RENTAL_QUERY,
  GROUNDING_QUERY,
} from "../helpers/maps-layout";

const isProd = Boolean(process.env.PROD_SMOKE_BASE_URL?.trim());
const outDir =
  process.env.PROD_SMOKE_OUT_DIR ??
  path.join(process.cwd(), "tmp", "san-546-j14-j15");

test.describe("SAN-546 · OPS-JOURNEY — J14/J15 prod", () => {
  test.skip(!isProd, "Set PROD_SMOKE_BASE_URL");

  test("J14 — rental follow-up stays in rental context", async ({ page }) => {
    test.setTimeout(300_000);
    fs.mkdirSync(outDir, { recursive: true });

    await gotoHome(page);
    await sendConciergeMessage(page, RENTAL_QUERY);
    await waitForRentalCards(page);
    await waitForCopilotIdle(page, 120_000);
    await page.screenshot({ path: path.join(outDir, "j14-turn1-rentals.png"), fullPage: true });

    await sendConciergeMessage(page, "when can I view?");
    await waitForCopilotIdle(page, 120_000);
    await page.screenshot({ path: path.join(outDir, "j14-turn2-followup.png"), fullPage: true });

    const rentalCards = await page.locator('[data-testid="rental-card"]').count();
    const clarifyReset = page.getByText(/what can i help you with/i);
    expect(rentalCards).toBeGreaterThan(0);
    await expect(clarifyReset).toHaveCount(0);
  });

  test("J15 — back-to-back searches clear stale pins", async ({ page }) => {
    test.setTimeout(300_000);
    fs.mkdirSync(outDir, { recursive: true });

    await gotoHome(page);
    await sendConciergeMessage(page, RENTAL_QUERY);
    await waitForRentalCards(page);
    await waitForCopilotIdle(page, 120_000);
    const pinsAfterRentals = await page.locator('[data-testid="map-pin"]').count();

    await sendConciergeMessage(page, GROUNDING_QUERY);
    await waitForCopilotIdle(page, 120_000);
    await page.screenshot({ path: path.join(outDir, "j15-after-cafe.png"), fullPage: true });

    const cafeCards = await page.locator(
      '[data-testid="grounded-card"][data-result-kind="cafe"]',
    ).count();
    const pinsAfterCafe = await page.locator('[data-testid="map-pin"]').count();

    expect(cafeCards).toBeGreaterThan(0);
    expect(pinsAfterCafe).toBeLessThanOrEqual(Math.max(pinsAfterRentals, 12));
  });
});
