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

const SCREEN_ID = "SCREEN-008";
const MOCK_LEAD_ID = "11111111-1111-1111-1111-000000000001";

test.describe.configure({ mode: "serial" });

test.describe(`${SCREEN_ID} schedule viewing modal`, () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/leads/schedule-viewing", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          leadId: MOCK_LEAD_ID,
          message: "Viewing request received — we will reach out within 24h.",
        }),
      });
    });
  });

  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("submit shows confirmation card in chat chrome", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);
      await sendConciergeMessage(page, RENTAL_QUERY);
      await waitForRentalCards(page);

      await page.locator('[data-testid="rental-schedule-cta"]').first().click();
      await expect(page.locator('[data-testid="schedule-viewing-modal"]')).toBeVisible();

      await page.locator('[data-testid="schedule-viewing-modal"] input[name="name"]').fill("Camila Test");
      await page.locator('[data-testid="schedule-viewing-modal"] input[name="email"]').fill("camila.test@mdeai.co");
      await page.locator('[data-testid="schedule-viewing-submit"]').click();

      await expect(page.locator('[data-testid="lead-confirmation-card"]')).toBeVisible();
      await expect(page.locator('[data-testid="schedule-viewing-modal"]')).toHaveCount(0);

      await captureScreenEvidence(page, SCREEN_ID, "desktop-lead-confirmation.png");
      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("venue sheet schedule path submits", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);
      await sendConciergeMessage(page, RENTAL_QUERY);
      await waitForRentalCards(page);

      await page.locator('[data-testid="rental-details-cta"]').first().click();
      await page.locator('[data-testid="venue-detail-schedule-cta"]').click();

      await page.locator('[data-testid="schedule-viewing-modal"] input[name="name"]').fill("Camila Test");
      await page.locator('[data-testid="schedule-viewing-modal"] input[name="email"]').fill("camila.test@mdeai.co");
      await page.locator('[data-testid="schedule-viewing-submit"]').click();

      await expect(page.locator('[data-testid="lead-confirmation-card"]')).toBeVisible();
      await captureScreenEvidence(page, SCREEN_ID, "mobile-lead-confirmation.png");
      assertConsoleClean(errors);
    });
  });
});
