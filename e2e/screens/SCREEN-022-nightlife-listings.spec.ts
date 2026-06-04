import { test, expect } from "@playwright/test";
import {
  collectCriticalConsoleErrors,
  gotoHome,
  NIGHTLIFE_GROUNDING_QUERY,
  sendConciergeMessage,
  waitForNightlifeGroundedCards,
} from "../helpers/maps-layout";

test.describe("SCREEN-022 Phase A nightlife listings", () => {
  test("renders nightlife cards and NightlifeDetailPanel (not café tabs)", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.setViewportSize({ width: 1360, height: 900 });
    await gotoHome(page);
    await sendConciergeMessage(page, NIGHTLIFE_GROUNDING_QUERY);
    await waitForNightlifeGroundedCards(page);

    const firstCard = page
      .locator('[data-testid="nightlife-card"][data-result-kind="nightlife"]')
      .first();
    await expect(firstCard).toBeVisible();
    await expect(
      page.locator('[data-testid="cafe-detail-panel"]'),
    ).toHaveCount(0);

    await firstCard.locator('[data-testid="nightlife-details-cta"]').click();
    const detailPanel = page.locator(
      '[data-testid="map-panel"] [data-testid="nightlife-detail-panel"]',
    );
    await expect(detailPanel).toBeVisible();
    await expect(
      page.locator('[data-testid="map-panel"][data-right-column-mode="detail"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="cafe-detail-tab-overview"]'),
    ).toHaveCount(0);
    await expect(detailPanel.locator('[data-testid="nightlife-detail-cover"]')).toBeVisible();
    await expect(detailPanel.locator('[data-testid="nightlife-safety-notice"]')).toBeVisible();

    await detailPanel.locator('[data-testid="nightlife-detail-booking-cta"]').click();
    const bookingSheet = page.locator('[data-testid="nightlife-booking-sheet"]');
    await expect(bookingSheet).toBeVisible();
    await expect(
      bookingSheet.locator(
        '[data-testid="venue-booking-form"], [data-testid="venue-booking-sign-in-gate"]',
      ),
    ).toBeVisible();

    await bookingSheet.locator('[data-slot="sheet-close"]').click();
    await expect(bookingSheet).toHaveCount(0);

    await detailPanel.locator('[data-testid="nightlife-detail-close"]').click();
    await expect(detailPanel).toHaveCount(0);

    expect(collectCriticalConsoleErrors(errors)).toEqual([]);
  });

  test("mobile opens nightlife bottom sheet", async ({ page }) => {
    test.setTimeout(180_000);

    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHome(page);
    await sendConciergeMessage(page, NIGHTLIFE_GROUNDING_QUERY);
    await waitForNightlifeGroundedCards(page);

    const card = page
      .locator('[data-testid="nightlife-card"][data-result-kind="nightlife"]')
      .first();
    await card.locator('[data-testid="nightlife-details-cta"]').click();
    await expect(
      page.locator('[data-testid="nightlife-detail-mobile-sheet"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="cafe-detail-mobile-sheet"]'),
    ).toHaveCount(0);
  });
});
