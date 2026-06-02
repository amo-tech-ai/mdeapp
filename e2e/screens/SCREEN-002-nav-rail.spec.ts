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
      const rail = page.locator('[data-testid="nav-rail"]');
      await expect(rail).toBeVisible();

      // Loading skeleton disappears within 5s
      await expect(
        page.locator('[data-testid="nav-rail"] .animate-pulse').first(),
      ).not.toBeVisible({ timeout: 5000 });

      // Either thread items or the empty state must be present
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
      // After click user stays on "/" — nav remains visible
      await expect(page.locator('[data-testid="nav-rail"]')).toBeVisible();
      assertConsoleClean(errors);
    });

    test("saved and trips links are disabled (Phase 4)", async ({ page }) => {
      await gotoHome(page);
      await expect(page.locator('[data-testid="nav-saved-link"][aria-disabled="true"]')).toBeAttached();
      await expect(page.locator('[data-testid="nav-trips-link"][aria-disabled="true"]')).toBeAttached();
    });

    test("unauthenticated session shows empty thread state", async ({ page }) => {
      await gotoHome(page);
      // Wait for load to settle
      await expect(
        page.locator('[data-testid="nav-rail"] .animate-pulse').first(),
      ).not.toBeVisible({ timeout: 5000 });

      // Unauthenticated → /api/threads returns [] → "No chats yet"
      await expect(page.locator('[data-testid="nav-threads-empty"]')).toBeVisible();
    });
  });
});
