import { test, expect } from "@playwright/test";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

const SCREEN_ID = "SCREEN-009";
const KNOWN_SLUG = "reina-de-antioquia-2026-finals";
const MOCK_STRIPE_URL = "https://checkout.stripe.com/c/pay/cs_test_mock";

test.describe.configure({ mode: "serial" });

test.describe(`${SCREEN_ID} booking checkout modal`, () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/tickets/checkout", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          stripeSessionUrl: MOCK_STRIPE_URL,
          orderId: "44444444-4444-4444-4444-000000000004",
          shortId: "ORD-TEST",
          walletAccessToken: "mock-wallet-token-uuid",
        }),
      });
    });
  });

  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("buy flow POSTs checkout API then redirects", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await page.goto(`/events/${KNOWN_SLUG}`, { waitUntil: "domcontentloaded" });

      await page.locator('[data-testid="event-detail-buy-cta"]').first().click();
      await expect(page.locator('[data-testid="booking-checkout-modal"]')).toBeVisible();

      await page.locator('[data-testid="booking-checkout-modal"] input[name="buyerName"]').fill("Andres Test");
      await page.locator('[data-testid="booking-checkout-modal"] input[name="email"]').fill("andres.test@mdeai.co");

      const redirectPromise = page.waitForURL(MOCK_STRIPE_URL, { timeout: 10_000 });
      await page.locator('[data-testid="booking-checkout-submit"]').click();
      await redirectPromise;

      await captureScreenEvidence(page, SCREEN_ID, "desktop-stripe-redirect.png");
      assertConsoleClean(errors);
    });

    test("checkout success notice renders", async ({ page }) => {
      await page.goto(`/events/${KNOWN_SLUG}?checkout=success`, {
        waitUntil: "domcontentloaded",
      });
      await expect(page.locator('[data-testid="checkout-success-notice"]')).toBeVisible();
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("mobile buy bar opens checkout modal", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await page.goto(`/events/${KNOWN_SLUG}`, { waitUntil: "domcontentloaded" });
      await page.locator('[data-testid="event-detail-mobile-buy-cta"]').click();
      await expect(page.locator('[data-testid="booking-checkout-modal"]')).toBeVisible();
      await captureScreenEvidence(page, SCREEN_ID, "mobile-checkout-modal.png");
      assertConsoleClean(errors);
    });
  });
});
