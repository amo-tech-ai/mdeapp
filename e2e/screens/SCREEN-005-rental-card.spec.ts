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

const SCREEN_ID = "SCREEN-005";

test.describe.configure({ mode: "serial" });

test.describe(`${SCREEN_ID} rental card polish`, () => {
  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("cards show CTAs and schedule modal opens", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);
      await sendConciergeMessage(page, RENTAL_QUERY);
      await waitForRentalCards(page);

      const cards = page.locator('[data-testid="rental-card"]');
      await expect(cards.first()).toBeVisible();
      expect(await cards.count()).toBeGreaterThanOrEqual(3);

      await expect(page.locator('[data-testid="rental-schedule-cta"]').first()).toBeVisible();
      await expect(page.locator('[data-testid="rental-save-cta"]').first()).toBeDisabled();

      await captureScreenEvidence(page, SCREEN_ID, "desktop-rental-cards.png");

      await page.locator('[data-testid="rental-schedule-cta"]').first().click();
      await expect(page.locator('[data-testid="schedule-viewing-modal"]')).toBeVisible();
      await captureScreenEvidence(page, SCREEN_ID, "desktop-schedule-modal.png");

      assertConsoleClean(errors);
    });

    test("card click selects map pin (F50 sync)", async ({ page }) => {
      await gotoHome(page);
      await sendConciergeMessage(page, RENTAL_QUERY);
      await waitForRentalCards(page);
      await page.waitForTimeout(1500);

      const card = page.locator('[data-testid="rental-card"]').first();
      const pinId = await card.getAttribute("data-pin-id");
      await card.click();
      await expect(card).toHaveAttribute("data-selected", "true");
      if (pinId) {
        await expect(
          page.locator(`[data-testid="map-pin"][data-pin-id="${pinId}"]`).first(),
        ).toBeVisible();
      }
      await expect(page.locator('[data-testid="results-column"]')).toHaveCount(0);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("rental cards render in center chat", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);
      await sendConciergeMessage(page, RENTAL_QUERY);
      await waitForRentalCards(page);

      await expect(page.locator('[data-testid="rental-card"]').first()).toBeVisible();
      await captureScreenEvidence(page, SCREEN_ID, "mobile-rental-cards.png");
      assertConsoleClean(errors);
    });
  });
});
