import { test } from "@playwright/test";

test.describe("F07 visual evidence", () => {
  test("desktop shell", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.locator('[data-testid="chat-canvas"]').waitFor({ timeout: 20_000 });
    await page.screenshot({
      path: "../tasks/notes/F07-shadcn-evidence-desktop.png",
      fullPage: true,
    });
  });

  test("mobile shell", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.locator('[data-testid="chat-canvas"]').waitFor({ timeout: 20_000 });
    await page.screenshot({
      path: "../tasks/notes/F07-shadcn-evidence-mobile.png",
      fullPage: true,
    });
  });
});
