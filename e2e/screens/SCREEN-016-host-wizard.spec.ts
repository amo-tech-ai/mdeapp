import { test, expect } from "@playwright/test";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

const SCREEN_ID = "SCREEN-016";

test.describe(`${SCREEN_ID} host event wizard`, () => {
  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("wizard shell renders form and preview", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await page.goto("/host/event/new", { waitUntil: "domcontentloaded" });

      await expect(page.locator('[data-testid="host-event-wizard"]')).toBeVisible();
      await expect(page.locator('[data-testid="host-event-workflow-strip"]')).toBeVisible();
      await expect(page.locator('[data-testid="host-event-preview-card"]')).toBeVisible();
      await expect(page.locator('[data-testid="host-event-form"]')).toBeVisible();
      await expect(page.locator('[data-testid="host-copilot-chat-region"]')).toBeVisible();

      await page.locator('[data-testid="host-event-field-title"]').fill("Test Mixer");
      await page.locator('[data-testid="host-event-field-neighborhood"]').fill("El Poblado");
      await expect(page.locator('[data-testid="host-event-preview-card"]')).toContainText(
        "Test Mixer",
      );

      await captureScreenEvidence(page, SCREEN_ID, "desktop-wizard-shell.png");
      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("mobile wizard form visible", async ({ page }) => {
      await page.goto("/host/event/new", { waitUntil: "domcontentloaded" });
      await expect(page.locator('[data-testid="host-event-form"]')).toBeVisible();
      await captureScreenEvidence(page, SCREEN_ID, "mobile-wizard-shell.png");
    });
  });
});
