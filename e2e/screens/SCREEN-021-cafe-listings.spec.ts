import { test, expect } from "@playwright/test";
import {
  collectCriticalConsoleErrors,
  gotoHome,
  GROUNDING_QUERY,
  sendConciergeMessage,
  waitForCafeGroundedCards,
} from "../helpers/maps-layout";

test.describe("SCREEN-021 Phase A café listings", () => {
  test("renders ranked café cards, map sync, detail panel, and booking stub", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    const eventSearchCalls: string[] = [];

    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (res) => {
      const url = res.url();
      if (url.includes("/api/events/search")) eventSearchCalls.push(url);
    });

    await page.setViewportSize({ width: 1360, height: 900 });
    await gotoHome(page);
    await sendConciergeMessage(page, GROUNDING_QUERY);
    await waitForCafeGroundedCards(page);

    const firstCard = page
      .locator('[data-testid="grounded-card"][data-result-kind="cafe"]')
      .first();
    await expect(firstCard).toBeVisible();
    await expect(
      page.locator(
        '[data-testid="grounding-attribution"], [data-testid="grounding-attribution-compact"]',
      ),
    ).toHaveCount(0);
    await expect(page.locator('[data-testid="results-column"]')).toHaveCount(0);
    await expect(firstCard).toContainText(/Match #1/);
    await expect(firstCard).toContainText(/Google-verified candidate/);

    const pinId = await firstCard.getAttribute("data-pin-id");
    expect(pinId).toBeTruthy();

    await firstCard.hover();
    await expect(firstCard).toHaveAttribute("data-selected", "true");
    await expect(
      page.locator(`[data-testid="map-pin"][data-pin-id="${pinId}"]`).first(),
    ).toBeVisible();

    await expect(
      page.locator('[data-testid="map-panel"][data-right-column-mode="map"]'),
    ).toBeVisible();

    await firstCard.locator('[data-testid="cafe-details-cta"]').click();
    const detailPanel = page.locator(
      '[data-testid="map-panel"] [data-testid="cafe-detail-panel"]',
    );
    await expect(detailPanel).toBeVisible();
    await expect(
      page.locator('[data-testid="map-panel"][data-right-column-mode="detail"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="venue-detail-sheet"]'),
    ).toHaveCount(0);
    await expect(detailPanel.locator('[data-testid="cafe-detail-tab-overview"]')).toBeVisible();
    await expect(detailPanel).toContainText(/Google-verified/);

    await detailPanel.locator('[data-testid="cafe-detail-booking-cta"]').click();
    const bookingSheet = page.locator('[data-testid="cafe-booking-sheet"]');
    await expect(bookingSheet).toBeVisible();
    await expect(bookingSheet).toContainText(/Booking stub for Phase A/);
    await expect(bookingSheet).toContainText(/No request is sent yet/);
    await bookingSheet.locator('[data-slot="sheet-close"]').click();
    await expect(bookingSheet).toHaveCount(0);
    await expect(detailPanel).toBeVisible();

    await detailPanel.locator('[data-testid="cafe-detail-close"]').click();
    await expect(detailPanel).toHaveCount(0);
    await expect(
      page.locator('[data-testid="map-panel"][data-right-column-mode="map"]'),
    ).toBeVisible();

    expect(eventSearchCalls).toEqual([]);
    expect(collectCriticalConsoleErrors(errors)).toEqual([]);

    const assistantProse = page.locator(".copilotKitAssistantMessage");
    await expect(assistantProse).not.toContainText(/"source"\s*:\s*"grounding"/);
    await expect(assistantProse).not.toContainText(/\{"success"\s*:\s*true\}/);
  });

  test("ask prompt keeps detail panel open and injects chat", async ({ page }) => {
    test.setTimeout(180_000);

    await page.setViewportSize({ width: 1360, height: 900 });
    await gotoHome(page);
    await sendConciergeMessage(page, GROUNDING_QUERY);
    await waitForCafeGroundedCards(page);

    const firstCard = page
      .locator('[data-testid="grounded-card"][data-result-kind="cafe"]')
      .first();
    await firstCard.locator('[data-testid="cafe-details-cta"]').click();

    const detailPanel = page.locator(
      '[data-testid="map-panel"] [data-testid="cafe-detail-panel"]',
    );
    await expect(detailPanel).toBeVisible();

    const prompt = detailPanel.locator('[data-testid="cafe-ask-prompt"]').first();
    const promptText = (await prompt.textContent())?.trim() ?? "";
    expect(promptText.length).toBeGreaterThan(10);

    await prompt.click();
    await expect(detailPanel).toBeVisible();
    await expect(page.locator(".copilotKitUserMessage").last()).toContainText(
      promptText.slice(0, 24),
    );
  });

  test("keeps café cards usable on mobile without horizontal overflow", async ({
    page,
  }) => {
    test.setTimeout(180_000);

    await page.setViewportSize({ width: 390, height: 844 });
    await gotoHome(page);
    await sendConciergeMessage(page, GROUNDING_QUERY);
    await waitForCafeGroundedCards(page);

    const card = page
      .locator('[data-testid="grounded-card"][data-result-kind="cafe"]')
      .first();
    await expect(card).toBeVisible();
    await expect(card.locator('[data-testid="cafe-booking-cta"]')).toBeVisible();

    await card.locator('[data-testid="cafe-details-cta"]').click();
    await expect(
      page.locator('[data-testid="cafe-detail-mobile-sheet"]'),
    ).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(2);
  });

  test("best cafes medellin — no JSON leak or bar-lounge cards", async ({
    page,
  }) => {
    test.setTimeout(180_000);

    await page.setViewportSize({ width: 1360, height: 900 });
    await gotoHome(page);
    await sendConciergeMessage(page, "best cafes medellin");
    await waitForCafeGroundedCards(page);

    const assistantProse = page.locator(".copilotKitAssistantMessage").last();
    await expect(assistantProse).not.toContainText(/"source"\s*:\s*"grounding"/);
    await expect(assistantProse).not.toContainText(/"placeId"\s*:\s*"ChIJ/);
    await expect(assistantProse).not.toContainText(/\{"success"\s*:\s*true\}/);

    const cards = page.locator(
      '[data-testid="grounded-card"][data-result-kind="cafe"]',
    );
    await expect(cards.first()).toBeVisible();
    const titles = await cards.locator("h3").allTextContents();
    expect(titles.length).toBeGreaterThanOrEqual(1);
    for (const title of titles) {
      expect(title).not.toMatch(/bar\s*&\s*lounge|skybar|cafe\s*bar/i);
    }
  });
});
