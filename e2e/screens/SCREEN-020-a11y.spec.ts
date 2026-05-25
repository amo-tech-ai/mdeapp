import { test, expect } from "@playwright/test";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";
import { gotoHome } from "../helpers/maps-layout";

const SCREEN_ID = "SCREEN-020";
const KNOWN_SLUG = "reina-de-antioquia-2026-finals";

test.describe.configure({ mode: "serial" });

test.describe(`${SCREEN_ID} accessibility pass`, () => {
  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("skip link targets main content", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);

      await page.keyboard.press("Tab");
      const skip = page.locator('a[href="#main-content"]');
      await expect(skip).toBeFocused();

      await skip.click();
      await expect(page.locator("#main-content")).toBeVisible();

      await captureScreenEvidence(page, SCREEN_ID, "desktop-skip-link.png");
      assertConsoleClean(errors);
    });

    test("nav rail and chat regions have labels", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);

      await expect(page.locator('[data-testid="nav-rail"]:visible')).toHaveAttribute(
        "aria-label",
        "Concierge navigation",
      );
      await expect(page.locator('[data-testid="center-chat-panel"]')).toHaveAttribute(
        "aria-label",
        "Concierge chat",
      );
      await expect(page.locator("#copilot-chat-region")).toHaveAttribute(
        "aria-live",
        "polite",
      );
      await expect(page.locator('[data-testid="map-panel"]')).toHaveAttribute(
        "aria-label",
        "Medellín map",
      );

      assertConsoleClean(errors);
    });

    test("checkout modal closes with Escape", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await page.goto(`/events/${KNOWN_SLUG}`, { waitUntil: "domcontentloaded" });
      await page.locator('[data-testid="event-detail-buy-cta"]').first().click();
      await expect(page.locator('[role="dialog"][aria-labelledby="booking-checkout-title"]')).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(page.locator('[data-testid="booking-checkout-modal"]')).toHaveCount(0);

      await captureScreenEvidence(page, SCREEN_ID, "desktop-modal-esc.png");
      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("map FAB has accessible name", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);

      const trigger = page.locator('[data-testid="map-sheet-trigger"]');
      await expect(trigger).toBeVisible();
      const label = await trigger.getAttribute("aria-label");
      expect(label).toBeTruthy();
      expect(label!.length).toBeGreaterThan(3);

      await captureScreenEvidence(page, SCREEN_ID, "mobile-map-fab-a11y.png");
      assertConsoleClean(errors);
    });
  });
});
