import { test, expect } from "@playwright/test";
import { gotoHome } from "../helpers/maps-layout";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

const SCREEN_ID = "SCREEN-018";

const NAV_TRIGGER = '[data-testid="nav-drawer-trigger"]';
const NAV_CONTENT = '[data-testid="nav-drawer-content"]';
const NAV_RAIL_DRAWER = '[data-testid="nav-rail-drawer"]';
const FAB = '[data-testid="map-sheet-trigger"]';
const MAP_CONTENT = '[data-testid="map-sheet-content"]';

test.describe(`${SCREEN_ID} mobile responsive shell`, () => {
  test.describe("mobile 390x844", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("FAB + hamburger visible, desktop rail hidden, no horizontal overflow", async ({
      page,
    }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);

      await expect(page.locator(FAB)).toBeVisible();
      await expect(page.locator(NAV_TRIGGER)).toBeVisible();
      await expect(page.locator('[data-testid="chat-query-bar"]')).toBeVisible();
      // Desktop left rail collapses behind the drawer on mobile.
      await expect(page.locator('aside [data-testid="nav-rail"]')).toBeHidden();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 2,
      );
      expect(overflow).toBe(false);

      await captureScreenEvidence(page, SCREEN_ID, "mobile-shell-390.png");
      assertConsoleClean(errors);
    });

    test("nav drawer opens with hamburger and shows nav rail", async ({ page }) => {
      await gotoHome(page);

      await page.locator(NAV_TRIGGER).click();
      await expect(page.locator(NAV_CONTENT)).toBeVisible();
      await expect(page.locator(NAV_RAIL_DRAWER)).toBeVisible();

      await captureScreenEvidence(page, SCREEN_ID, "nav-drawer-open.png");
    });

    test("nav drawer closes with Escape and restores focus to hamburger", async ({
      page,
    }) => {
      await gotoHome(page);

      await page.locator(NAV_TRIGGER).click();
      await expect(page.locator(NAV_CONTENT)).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(page.locator(NAV_CONTENT)).toBeHidden();
      await expect(page.locator(NAV_TRIGGER)).toBeFocused();
    });

    test("nav drawer closes on outside (backdrop) click", async ({ page }) => {
      await gotoHome(page);

      await page.locator(NAV_TRIGGER).click();
      await expect(page.locator(NAV_CONTENT)).toBeVisible();

      // Drawer is the left 280px; click clear of it to hit the backdrop.
      await page.mouse.click(360, 420);
      await expect(page.locator(NAV_CONTENT)).toBeHidden();
    });

    test("map FAB opens sheet; closing restores focus + leaves chat usable", async ({
      page,
    }) => {
      await gotoHome(page);

      await page.locator(FAB).click();
      await expect(page.locator(MAP_CONTENT)).toBeVisible();

      await captureScreenEvidence(page, SCREEN_ID, "map-sheet-open.png");

      await page.keyboard.press("Escape");
      await expect(page.locator(MAP_CONTENT)).toBeHidden();
      await expect(page.locator(FAB)).toBeFocused();
      await expect(page.locator('[data-testid="chat-query-bar"]')).toBeVisible();
    });

    test("chat input clickable after a map sheet open/close cycle", async ({
      page,
    }) => {
      await gotoHome(page);

      await page.locator(FAB).click();
      await expect(page.locator(MAP_CONTENT)).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.locator(MAP_CONTENT)).toBeHidden();

      // No lingering overlay should intercept the CopilotKit composer.
      const input = page.locator(".copilotKitInput textarea").first();
      await input.click({ timeout: 5_000 });
      await expect(input).toBeFocused();
    });

    test("FAB tap target is at least 44x44px", async ({ page }) => {
      await gotoHome(page);

      const box = await page.locator(FAB).boundingBox();
      expect(box).not.toBeNull();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    });
  });

  test.describe("desktop 1280x900", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("desktop: rail visible, hamburger + FAB hidden, map panel visible", async ({
      page,
    }) => {
      await gotoHome(page);

      await expect(page.locator('aside [data-testid="nav-rail"]')).toBeVisible();
      await expect(page.locator('[data-testid="map-panel"]')).toBeVisible();
      await expect(page.locator(NAV_TRIGGER)).toBeHidden();
      await expect(page.locator(FAB)).toBeHidden();
    });
  });
});

test.describe(`${SCREEN_ID} console hygiene`, () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test("no critical page errors on mobile load", async ({ page }) => {
    const errors = watchCriticalConsoleErrors(page);
    await gotoHome(page);
    assertConsoleClean(errors);
  });
});
