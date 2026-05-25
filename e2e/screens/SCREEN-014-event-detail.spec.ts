import { test, expect } from "@playwright/test";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

const SCREEN_ID = "SCREEN-014";
const KNOWN_SLUG = "reina-de-antioquia-2026-finals";
const KNOWN_ID = "22222222-2222-2222-2222-000000000001";
const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3001";

test.describe.configure({ mode: "serial" });

test.describe(`${SCREEN_ID} event detail page`, () => {
  test("curl published slug returns 200", async ({ request }) => {
    const res = await request.get(`${BASE}/events/${KNOWN_SLUG}`);
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain("event-detail-page");
  });

  test("curl draft/unknown slug returns 404", async ({ request }) => {
    const res = await request.get(`${BASE}/events/not-a-real-event-slug-404`);
    expect(res.status()).toBe(404);
  });

  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("slug route shows tiers and opens checkout modal", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await page.goto(`/events/${KNOWN_SLUG}`, { waitUntil: "domcontentloaded" });

      await expect(page.locator('[data-testid="event-detail-page"]')).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        "Reina de Antioquia",
      );
      await expect(page.locator('[data-testid="event-tier-row"]').first()).toBeVisible();
      await expect(page.locator('[data-testid="event-tier-row"]')).toHaveCount(4);

      await page.locator('[data-testid="event-detail-buy-cta"]').first().click();
      await expect(page.locator('[data-testid="booking-checkout-modal"]')).toBeVisible();
      await page.getByRole("button", { name: "Cancel" }).click();
      await expect(page.locator('[data-testid="booking-checkout-modal"]')).toHaveCount(0);

      await captureScreenEvidence(page, SCREEN_ID, "desktop-event-detail.png");
      assertConsoleClean(errors);
    });

    test("UUID route resolves same event", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await page.goto(`/events/${KNOWN_ID}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator('[data-testid="event-detail-page"]')).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        "Reina de Antioquia",
      );
      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("sticky buy bar opens checkout modal", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await page.goto(`/events/${KNOWN_SLUG}`, { waitUntil: "domcontentloaded" });

      await expect(page.locator('[data-testid="event-detail-mobile-buy-bar"]')).toBeVisible();
      await page.locator('[data-testid="event-detail-mobile-buy-cta"]').click();
      await expect(page.locator('[data-testid="booking-checkout-modal"]')).toBeVisible();

      await captureScreenEvidence(page, SCREEN_ID, "mobile-event-detail.png");
      assertConsoleClean(errors);
    });
  });
});
