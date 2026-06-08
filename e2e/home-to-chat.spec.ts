import { test, expect } from "@playwright/test";
import {
  assertConciergeShellVisible,
  ensureChatInputVisible,
  gotoMarketingHome,
  hideCopilotWebInspector,
  submitHomeHeroQuery,
  waitForCafeGroundedCards,
  waitForCopilotIdle,
  waitForCopilotRuntime,
  waitForHomeEventHandoff,
  waitForHomeToChatHandoff,
  waitForMapPinsUpdated,
  waitForRentalCards,
  waitForRestaurantCards,
} from "./helpers/maps-layout";

const HOME_VIEWPORT = { width: 1360, height: 900 } as const;

const VERTICAL_CASES = [
  {
    query: "fashion events in medellin",
    waitForResults: waitForHomeEventHandoff,
    cardSelector: '[data-testid="event-card"]',
    requireCards: false,
    requireMapPins: false,
  },
  {
    query: "apartments in laureles",
    waitForResults: waitForRentalCards,
    cardSelector: '[data-testid="rental-card"]',
    requireCards: true,
    requireMapPins: true,
  },
  {
    query: "best restaurants in poblado",
    waitForResults: waitForRestaurantCards,
    cardSelector: '[data-testid="restaurant-card"]',
    requireCards: true,
    requireMapPins: true,
  },
] as const;

test.describe("Home → Chat launch (SAN-733)", () => {
  test.use({ viewport: HOME_VIEWPORT });

  test("hero search: cafes auto-send, cards, map, URL /chat", async ({ page }) => {
    test.setTimeout(180_000);

    await gotoMarketingHome(page);
    await submitHomeHeroQuery(page, "suggest cafes in medellin");

    await waitForHomeToChatHandoff(page, "suggest cafes in medellin");
    await assertConciergeShellVisible(page);

    await waitForCafeGroundedCards(page);
    expect(
      await page.locator('[data-testid="grounded-card"]').count(),
    ).toBeGreaterThan(0);
    await waitForMapPinsUpdated(page);
    await waitForCopilotIdle(page);

    await ensureChatInputVisible(page);
    await expect(page.getByRole("button", { name: /^send$/i })).toBeVisible();
    expect(page.url()).toMatch(/\/chat$/);
    expect(page.url()).not.toContain("?q=");
  });

  test("FAB opens GeoChatShell at /chat without auto-send", async ({ page }) => {
    test.setTimeout(60_000);

    await gotoMarketingHome(page);
    await page.getByTestId("home-fab-chat").click();

    await page.waitForURL(/\/chat$/, { timeout: 20_000 });
    await page
      .locator('[data-testid="chat-canvas"]')
      .waitFor({ state: "visible", timeout: 20_000 });
    await hideCopilotWebInspector(page);
    await waitForCopilotRuntime(page);
    await assertConciergeShellVisible(page);

    const userMessages = page.locator(
      ".copilotKitMessage.copilotKitUserMessage",
    );
    expect(await userMessages.count()).toBe(0);
  });
});

test.describe("Home → Chat vertical handoffs", () => {
  test.describe.configure({ mode: "serial" });
  test.use({ viewport: HOME_VIEWPORT });

  for (const {
    query,
    waitForResults,
    cardSelector,
    requireCards,
    requireMapPins,
  } of VERTICAL_CASES) {
    test(`hero → /chat: ${query}`, async ({ page }) => {
      test.setTimeout(180_000);

      await gotoMarketingHome(page);
      await submitHomeHeroQuery(page, query);

      await waitForHomeToChatHandoff(page, query);
      await assertConciergeShellVisible(page);
      await waitForResults(page);

      const cardCount = await page.locator(cardSelector).count();
      if (requireCards) {
        expect(cardCount).toBeGreaterThan(0);
      } else {
        expect(cardCount).toBeGreaterThanOrEqual(0);
      }
      if (requireMapPins) {
        await waitForMapPinsUpdated(page);
      }
      await waitForCopilotIdle(page);
      await ensureChatInputVisible(page);

      const region = page.locator('[data-testid="copilot-chat-region"]');
      await expect(region.getByText(query, { exact: true })).toHaveCount(1);
      expect(page.url()).toMatch(/\/chat$/);
    });
  }
});
