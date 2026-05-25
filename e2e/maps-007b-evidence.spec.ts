import { test } from "@playwright/test";

test.describe("MAP-007B evidence screenshots", () => {
  test("desktop 1440", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.locator('[data-testid="chat-canvas"]').waitFor({ timeout: 20_000 });
    await page.screenshot({
      path: "../tasks/notes/MAP-007B-evidence-desktop-1440.png",
      fullPage: false,
    });
  });

  test("tablet 768", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.locator('[data-testid="center-chat-panel"]').waitFor({ timeout: 20_000 });
    await page.screenshot({
      path: "../tasks/notes/MAP-007B-evidence-tablet-768.png",
      fullPage: true,
    });
  });

  test("mobile 390", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.locator('[data-testid="center-chat-panel"]').waitFor({ timeout: 20_000 });
    await page.screenshot({
      path: "../tasks/notes/MAP-007B-evidence-mobile-390.png",
      fullPage: true,
    });
  });

  test("mobile map sheet open", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.locator('[data-testid="map-sheet-trigger"]').click();
    await page.locator('[data-testid="map-sheet-content"]').waitFor({ state: "visible" });
    await page.screenshot({
      path: "../tasks/notes/MAP-007B-evidence-mobile-sheet.png",
      fullPage: true,
    });
  });
});
