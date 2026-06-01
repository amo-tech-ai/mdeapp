import { test, expect } from "@playwright/test";
import path from "node:path";
import {
  EVENT_QUERY,
  GROUNDING_QUERY,
  RENTAL_QUERY,
  RESTAURANT_FAST_PATH_QUERY,
  gotoHome,
  sendConciergeMessage,
  sendEventQuery,
  waitForCafeGroundedCards,
  waitForEventCards,
  waitForRentalCards,
  waitForRestaurantCards,
} from "./helpers/maps-layout";
import { DESKTOP_VIEWPORT } from "./helpers/screen-evidence";

const EVIDENCE_DIR = path.join(
  process.cwd(),
  "..",
  "tasks/testing/evidence/visual-cards",
);

async function shot(page: import("@playwright/test").Page, name: string) {
  await page.screenshot({
    path: path.join(EVIDENCE_DIR, `${name}.png`),
    fullPage: true,
  });
}

/** Manual / CI visual smoke — restaurants, cafés, events, rentals on /. */
test.describe.configure({ mode: "serial" });
test.use({ viewport: DESKTOP_VIEWPORT });

test.describe("Visual — all result card verticals", () => {
  test.beforeAll(async () => {
    const fs = await import("node:fs/promises");
    await fs.mkdir(EVIDENCE_DIR, { recursive: true });
  });

  test("restaurants — rich restaurant-card panel", async ({ page }) => {
    test.setTimeout(180_000);
    await gotoHome(page);
    await sendConciergeMessage(page, RESTAURANT_FAST_PATH_QUERY);
    await waitForRestaurantCards(page);
    const n = await page.locator('[data-testid="restaurant-card"]').count();
    expect(n).toBeGreaterThan(0);
    await shot(page, "01-restaurants");
  });

  test("cafés — grounded cafe cards", async ({ page }) => {
    test.setTimeout(180_000);
    await gotoHome(page);
    await sendConciergeMessage(page, GROUNDING_QUERY);
    await waitForCafeGroundedCards(page);
    const n = await page
      .locator('[data-testid="grounded-card"][data-result-kind="cafe"]')
      .count();
    expect(n).toBeGreaterThan(0);
    await shot(page, "02-cafes");
  });

  test("events — event-card in chat", async ({ page }) => {
    test.setTimeout(180_000);
    await gotoHome(page);
    await sendEventQuery(page, EVENT_QUERY);
    await waitForEventCards(page);
    const n = await page.locator('[data-testid="event-card"]').count();
    expect(n).toBeGreaterThan(0);
    await shot(page, "03-events");
  });

  test("rentals — rental-card in chat", async ({ page }) => {
    test.setTimeout(180_000);
    await gotoHome(page);
    await sendConciergeMessage(page, RENTAL_QUERY);
    await waitForRentalCards(page);
    const n = await page.locator('[data-testid="rental-card"]').count();
    expect(n).toBeGreaterThan(0);
    await shot(page, "04-rentals");
  });
});
