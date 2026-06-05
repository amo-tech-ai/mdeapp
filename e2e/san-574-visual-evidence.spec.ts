import { test, expect } from "@playwright/test";
import {
  gotoHome,
  sendConciergeMessage,
  waitForCafeGroundedCards,
  waitForRentalCards,
  waitForRestaurantCards,
  RESTAURANT_FAST_PATH_QUERY,
  GROUNDING_QUERY,
  RENTAL_QUERY,
} from "./helpers/maps-layout";

const VIEWPORTS = [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1360, height: 900 },
] as const;

const OUT_DIR =
  process.env.SAN574_EVIDENCE_DIR ??
  "../tasks/testing/evidence/2026-06-05/san-574";

test.describe.configure({ mode: "serial" });

for (const vp of VIEWPORTS) {
  test.describe(`SAN-574 visual @ ${vp.name}px`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("restaurants browse", async ({ page }) => {
      await page.goto("/restaurants");
      await expect(page.getByTestId("restaurants-browse")).toBeVisible();
      await page.screenshot({
        path: `${OUT_DIR}/${vp.name}-restaurants.png`,
        fullPage: true,
      });
    });

    test("nightlife browse", async ({ page }) => {
      await page.goto("/nightlife");
      await expect(page.getByTestId("nightlife-page")).toBeVisible();
      await page.screenshot({
        path: `${OUT_DIR}/${vp.name}-nightlife.png`,
        fullPage: true,
      });
    });
  });
}

test.describe("SAN-574 chat cards (desktop)", () => {
  test.use({ viewport: { width: 1360, height: 900 } });

  test("restaurant card in chat", async ({ page }) => {
    test.setTimeout(180_000);
    await gotoHome(page);
    await page.waitForTimeout(8_000);
    await sendConciergeMessage(page, RESTAURANT_FAST_PATH_QUERY);
    await waitForRestaurantCards(page);
    await page.screenshot({
      path: `${OUT_DIR}/1280-chat-restaurant.png`,
      fullPage: true,
    });
  });

  test("cafe card in chat", async ({ page }) => {
    test.setTimeout(180_000);
    await page.route("**/v1/grounding/invoke**", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          pins: [],
          metadata: { reason: "adk_unavailable" },
        }),
      }),
    );
    await gotoHome(page);
    await sendConciergeMessage(page, GROUNDING_QUERY);
    await waitForCafeGroundedCards(page);
    await page.screenshot({
      path: `${OUT_DIR}/1280-chat-cafe.png`,
      fullPage: true,
    });
  });

  test("rental card in chat", async ({ page }) => {
    test.setTimeout(180_000);
    await gotoHome(page);
    await sendConciergeMessage(page, RENTAL_QUERY);
    await waitForRentalCards(page);
    await page.screenshot({
      path: `${OUT_DIR}/1280-chat-rental.png`,
      fullPage: true,
    });
  });
});
