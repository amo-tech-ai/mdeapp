import { test, expect } from "@playwright/test";
import {
  collectCriticalConsoleErrors,
  ensureChatInputVisible,
  gotoHome,
  RENTAL_QUERY,
  sendConciergeMessage,
  waitForRentalCards,
} from "./helpers/maps-layout";

test.describe("MAP-007B mobile layout", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("chat input visible before and after map sheet", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await gotoHome(page);
    await ensureChatInputVisible(page);

    const input = page.getByRole("textbox", { name: /type a message/i });
    await expect(input).toBeVisible();

    const send = page.getByRole("button", { name: /^send$/i });
    const sendBox = await send.boundingBox();
    const fab = page.locator('[data-testid="map-sheet-trigger"]');
    const fabBox = await fab.boundingBox();
    expect(sendBox).not.toBeNull();
    expect(fabBox).not.toBeNull();
    if (sendBox && fabBox) {
      expect(fabBox.y + fabBox.height).toBeLessThanOrEqual(sendBox.y + 4);
    }

    await fab.click();
    await expect(page.locator('[data-testid="map-sheet-content"]')).toBeVisible();
    await expect(page.locator('[data-testid="chat-map"]').last()).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator('[data-testid="map-sheet-content"]')).toBeHidden({
      timeout: 10_000,
    });

    await expect(input).toBeVisible();

    expect(collectCriticalConsoleErrors(errors)).toEqual([]);
  });

  test("rental search shows cards in center chat", async ({ page }) => {
    await gotoHome(page);
    await sendConciergeMessage(page, RENTAL_QUERY);
    await waitForRentalCards(page);
    await expect(page.locator('[data-testid="center-chat-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-rail"]:visible')).toHaveCount(0);
  });
});

test.describe("MAP-007B tablet", () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test("center chat and map sheet trigger", async ({ page }) => {
    await gotoHome(page);
    await expect(page.locator('[data-testid="chat-canvas"]')).toBeVisible();
    await expect(page.locator('[data-testid="center-chat-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="map-sheet-trigger"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-drawer-trigger"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-rail"]:visible')).toHaveCount(0);
  });
});
