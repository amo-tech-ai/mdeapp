import { test, expect } from "@playwright/test";
import {
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

const SCREEN_ID = "SCREEN-007";

test.describe.configure({ mode: "serial" });

test.describe(`${SCREEN_ID} venue detail sheet`, () => {
  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("card → sheet → map focus → schedule modal → close", async ({
      page,
    }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);
      await sendConciergeMessage(page, RENTAL_QUERY);
      await waitForRentalCards(page);
      await page.waitForTimeout(1500);

      const card = page.locator('[data-testid="rental-card"]').first();
      const pinId = await card.getAttribute("data-pin-id");
      expect(pinId).toBeTruthy();

      await page.locator('[data-testid="rental-details-cta"]').first().click();
      const sheet = page.locator('[data-testid="venue-detail-sheet"]');
      await expect(sheet).toBeVisible();
      await expect(sheet.locator('[data-slot="sheet-title"]')).not.toBeEmpty();

      await expect(card).toHaveAttribute("data-selected", "true");
      await expect(
        page.locator(`[data-testid="map-pin"][data-pin-id="${pinId}"]`).first(),
      ).toBeVisible();

      await captureScreenEvidence(page, SCREEN_ID, "desktop-venue-sheet.png");

      await page.keyboard.press("Escape");
      await expect(sheet).toBeHidden();
      await expect(page.locator('[data-testid="chat-canvas"]')).toBeVisible();
      await expect(page.getByText(RENTAL_QUERY, { exact: true })).toBeVisible();

      await page.locator('[data-testid="rental-details-cta"]').first().click();
      await expect(sheet).toBeVisible();
      await page.locator('[data-testid="venue-detail-schedule-cta"]').click();
      await expect(page.locator('[data-testid="schedule-viewing-modal"]')).toBeVisible();
      await page.getByRole("button", { name: /^cancel$/i }).click();
      await expect(page.locator('[data-testid="schedule-viewing-modal"]')).toBeHidden();

      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("full-width venue sheet on mobile", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);
      await sendConciergeMessage(page, RENTAL_QUERY);
      await waitForRentalCards(page);

      await page.locator('[data-testid="rental-card"]').first().click();
      await expect(page.locator('[data-testid="venue-detail-sheet"]')).toBeVisible();
      await captureScreenEvidence(page, SCREEN_ID, "mobile-venue-sheet.png");
      assertConsoleClean(errors);
    });
  });
});
