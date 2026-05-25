import { test, expect } from "@playwright/test";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";
import { gotoHome } from "../helpers/maps-layout";

const SCREEN_ID = "SCREEN-019";
const KNOWN_SLUG = "reina-de-antioquia-2026-finals";

test.describe.configure({ mode: "serial" });

test.describe(`${SCREEN_ID} empty and error states`, () => {
  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("home shows map and results empty before search", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);

      await expect(page.locator('[data-testid="map-empty-state"]')).toBeVisible();
      await expect(page.locator('[data-testid="results-empty"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-threads-empty"]')).toBeVisible();

      await captureScreenEvidence(page, SCREEN_ID, "desktop-home-empty.png");
      assertConsoleClean(errors);
    });

    test("event not found page", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      const res = await page.goto("/events/does-not-exist-slug-019", {
        waitUntil: "domcontentloaded",
      });
      expect(res?.status()).toBe(404);
      await expect(page.locator('[data-testid="event-not-found"]')).toBeVisible();

      await captureScreenEvidence(page, SCREEN_ID, "desktop-event-not-found.png");
      assertConsoleClean(errors);
    });

    test("checkout modal shows inline error on API failure", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await page.route("**/api/tickets/checkout", async (route) => {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({
            success: false,
            error: { message: "Checkout unavailable" },
          }),
        });
      });

      await page.goto(`/events/${KNOWN_SLUG}`, { waitUntil: "domcontentloaded" });
      await page.locator('[data-testid="event-detail-buy-cta"]').first().click();
      await expect(page.locator('[data-testid="booking-checkout-modal"]')).toBeVisible();

      await page.locator('[data-testid="booking-checkout-modal"] input[name="buyerName"]').fill("Andres Test");
      await page.locator('[data-testid="booking-checkout-modal"] input[name="email"]').fill("andres.test@mdeai.co");
      await page.locator('[data-testid="booking-checkout-submit"]').click();

      await expect(page.locator('[data-testid="booking-checkout-error"]')).toContainText(
        "Checkout unavailable",
      );
      await expect(page.locator('[data-testid="booking-checkout-modal"]')).toBeVisible();

      await captureScreenEvidence(page, SCREEN_ID, "desktop-checkout-error.png");
      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("mobile map empty overlay and open map control", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);

      await expect(page.locator('[data-testid="map-sheet-trigger"]')).toBeVisible();
      await page.locator('[data-testid="map-sheet-trigger"]').click();
      await expect(page.locator('[data-testid="map-sheet-content"]')).toBeVisible();
      await expect(page.locator('[data-testid="map-mobile-empty-state"]')).toBeVisible();

      await captureScreenEvidence(page, SCREEN_ID, "mobile-map-sheet.png");
      assertConsoleClean(errors);
    });
  });
});
