import { test, expect } from "@playwright/test";
import {
  collectCriticalConsoleErrors,
  gotoHome,
  RENTAL_QUERY,
  sendConciergeMessage,
  waitForRentalCards,
} from "../helpers/maps-layout";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

const SCREEN_ID = "SCREEN-001";

test.describe.configure({ mode: "serial" });

test.describe(`${SCREEN_ID} home chat chrome`, () => {
  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("Mindtrip 3-panel shell at 1280px", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);

      await expect(page.locator('[data-testid="chat-canvas"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-rail"]:visible')).toHaveCount(1);
      await expect(page.locator('[data-testid="center-chat-panel"]')).toBeVisible();
      await expect(page.locator('[data-testid="chat-query-bar"]')).toBeVisible();
      await expect(page.locator('[data-testid="workflow-progress-strip"]')).toBeAttached();
      await expect(page.locator('[data-testid="copilot-chat-region"]')).toBeVisible();
      await expect(page.locator('[data-testid="map-panel"]')).toBeVisible();
      await expect(page.locator('[data-testid="chat-map"]')).toBeVisible();
      await expect(page.locator(".copilotKitSidebar")).toHaveCount(0);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 2,
      );
      expect(overflow).toBe(false);

      await captureScreenEvidence(page, SCREEN_ID, "desktop-1280.png");
      assertConsoleClean(errors);
    });

    test("rental turn keeps chrome regions visible", async ({ page }) => {
      await gotoHome(page);
      await sendConciergeMessage(page, RENTAL_QUERY);
      await waitForRentalCards(page);

      await expect(page.locator('[data-testid="center-chat-panel"]')).toBeVisible();
      await expect(page.locator('[data-testid="chat-map"]')).toBeVisible();
      await expect(page.locator('[data-testid="rental-card"]').first()).toBeVisible();
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("chat canvas + center panel at 390px", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);

      await expect(page.locator('[data-testid="chat-canvas"]')).toBeVisible();
      await expect(page.locator('[data-testid="center-chat-panel"]')).toBeVisible();
      await expect(page.locator('[data-testid="chat-query-bar"]')).toBeVisible();
      await expect(page.locator('[data-testid="map-sheet-trigger"]')).toBeVisible();

      await captureScreenEvidence(page, SCREEN_ID, "mobile-390.png");
      assertConsoleClean(errors);
    });
  });
});

test.describe(`${SCREEN_ID} console hygiene`, () => {
  test("no critical page errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await gotoHome(page);
    expect(collectCriticalConsoleErrors(errors)).toEqual([]);
  });
});
