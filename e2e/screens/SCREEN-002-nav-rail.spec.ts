import { test, expect } from "@playwright/test";
import {
  captureScreenEvidence,
  watchCriticalConsoleErrors,
  assertConsoleClean,
  DESKTOP_VIEWPORT,
} from "../helpers/screen-evidence";
import { gotoHome } from "../helpers/maps-layout";

const SCREEN_ID = "SCREEN-002";

test.describe.configure({ mode: "serial" });

test.describe(`${SCREEN_ID} chat nav rail`, () => {
  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("nav rail renders with required regions", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);

      await expect(page.locator('[data-testid="nav-rail"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-new-chat"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-saved-link"]')).toBeAttached();
      await expect(page.locator('[data-testid="nav-trips-link"]')).toBeAttached();

      await captureScreenEvidence(page, SCREEN_ID, "nav-rail-desktop.png");
      assertConsoleClean(errors);
    });

    test("thread list resolves from loading state", async ({ page }) => {
      await gotoHome(page);
      await expect(page.locator('[data-testid="nav-rail"]')).toBeVisible();

      // Wait for skeleton to be removed from DOM (avoids .not.toBeVisible race)
      await page.waitForFunction(
        () => document.querySelector('[data-testid="nav-rail"] .animate-pulse') === null,
        { timeout: 5000 },
      );

      // Either thread items or the empty/error state must be present
      const threadCount = await page.locator('[data-testid="nav-thread-item"]').count();
      const emptyState = page.locator('[data-testid="nav-threads-empty"]');
      if (threadCount === 0) {
        await expect(emptyState).toBeVisible();
      } else {
        await expect(page.locator('[data-testid="nav-thread-item"]').first()).toBeVisible();
      }
    });

    test("new chat button is interactive", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);
      await expect(page.locator('[data-testid="nav-new-chat"]')).toBeVisible();
      await page.locator('[data-testid="nav-new-chat"]').click();
      await expect(page).toHaveURL("/");
      await expect(page.locator('[data-testid="nav-rail"]')).toBeVisible();
      assertConsoleClean(errors);
    });

    test("saved is a live link and trips is disabled", async ({ page }) => {
      await gotoHome(page);
      // Saved is LIVE per sitemap — not aria-disabled
      await expect(page.locator('[data-testid="nav-saved-link"]')).toBeAttached();
      await expect(
        page.locator('[data-testid="nav-saved-link"][aria-disabled]'),
      ).not.toBeAttached();
      // Trips is coming-soon — aria-disabled="true"
      await expect(
        page.locator('[data-testid="nav-trips-link"][aria-disabled="true"]'),
      ).toBeAttached();
    });

    test("unauthenticated session shows empty thread state", async ({ page, context }) => {
      await context.clearCookies();
      await gotoHome(page);

      // Wait for skeleton to clear before asserting final state
      await page.waitForFunction(
        () => document.querySelector('[data-testid="nav-rail"] .animate-pulse') === null,
        { timeout: 5000 },
      );

      // Unauthenticated → /api/threads returns [] → "No chats yet"
      await expect(page.locator('[data-testid="nav-threads-empty"]')).toBeVisible();
    });
  });
});
