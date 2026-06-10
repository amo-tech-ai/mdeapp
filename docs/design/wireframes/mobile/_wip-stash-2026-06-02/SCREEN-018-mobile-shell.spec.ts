import { test, expect, type Page } from "@playwright/test";
import { hideCopilotWebInspector } from "../helpers/maps-layout";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

/**
 * Lightweight shell navigation for pure-UI tests.
 * Does NOT call waitForCopilotRuntime — that registers a waitForResponse listener
 * which leaves CopilotKit SSE streaming active and can defer React portal mounts
 * when multiple tests run in sequence (the root cause of flaky FAB/drawer tests).
 *
 * Instead we wait for the chat textarea to be visible — same readiness signal as
 * ensureChatInputVisible, but without the concurrent API-response listener.
 */
async function gotoShell(page: Page): Promise<void> {
  const res = await page.goto("/", { waitUntil: "domcontentloaded" });
  if (!res?.ok()) throw new Error(`GET / failed: ${res?.status()}`);
  await page
    .locator('[data-testid="chat-canvas"]')
    .waitFor({ state: "visible", timeout: 20_000 });
  await hideCopilotWebInspector(page);
  // Wait for the textarea inside CopilotKit input to be visible — same signal as
  // ensureChatInputVisible but without firing waitForResponse which keeps SSE open.
  await page
    .locator(".copilotKitInput textarea")
    .first()
    .waitFor({ state: "visible", timeout: 20_000 });
}

const SCREEN_ID = "SCREEN-018";

test.describe(`${SCREEN_ID} mobile shell — 390×844`, () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test("mobile layout: FAB visible, desktop nav rail hidden, no overflow", async ({
    page,
  }) => {
    const errors = watchCriticalConsoleErrors(page);
    await gotoShell(page);

    // Center panel always visible on mobile
    await expect(page.locator('[data-testid="center-chat-panel"]')).toBeVisible();
    // Desktop left rail is hidden on mobile
    await expect(page.locator('[data-testid="nav-rail"]:visible')).toHaveCount(0);
    // Hamburger trigger visible
    await expect(page.locator('[data-testid="nav-drawer-trigger"]')).toBeVisible();
    // Map FAB visible (desktop map panel hidden)
    await expect(page.locator('[data-testid="map-sheet-trigger"]')).toBeVisible();
    await expect(page.locator('[data-testid="map-panel"]')).toHaveCSS("display", "none");

    // No horizontal overflow
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 2,
    );
    expect(overflow).toBe(false);

    await captureScreenEvidence(page, SCREEN_ID, "mobile-layout.png");
    assertConsoleClean(errors);
  });

  test("nav drawer opens with hamburger and shows nav rail", async ({ page }) => {
    const errors = watchCriticalConsoleErrors(page);
    await gotoShell(page);

    const trigger = page.locator('[data-testid="nav-drawer-trigger"]');
    const drawer = page.locator('[data-testid="nav-drawer-content"]');

    await expect(trigger).toBeVisible();
    await trigger.click();
    await expect(drawer).toBeAttached({ timeout: 10000 });
    await expect(drawer).toBeVisible();
    await expect(page.locator('[data-testid="nav-rail-drawer"]')).toBeVisible();

    await captureScreenEvidence(page, SCREEN_ID, "nav-drawer-open.png");
    assertConsoleClean(errors);
  });

  test("nav drawer closes with Escape key", async ({ page }) => {
    await gotoShell(page);

    await page.locator('[data-testid="nav-drawer-trigger"]').click();
    await expect(page.locator('[data-testid="nav-drawer-content"]')).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator('[data-testid="nav-drawer-content"]')).not.toBeVisible();
  });

  test("nav drawer closes on outside click", async ({ page }) => {
    await gotoShell(page);

    await page.locator('[data-testid="nav-drawer-trigger"]').click();
    await expect(page.locator('[data-testid="nav-drawer-content"]')).toBeAttached({ timeout: 10000 });
    await expect(page.locator('[data-testid="nav-drawer-content"]')).toBeVisible();

    // Click the right edge of the screen — outside the 280px drawer
    await page.mouse.click(MOBILE_VIEWPORT.width - 10, MOBILE_VIEWPORT.height / 2);
    await expect(page.locator('[data-testid="nav-drawer-content"]')).not.toBeVisible();
  });

  test("map FAB opens sheet; chat region not covered after close", async ({
    page,
  }) => {
    const errors = watchCriticalConsoleErrors(page);
    await gotoShell(page);

    const fab = page.locator('[data-testid="map-sheet-trigger"]');
    const sheet = page.locator('[data-testid="map-sheet-content"]');
    const chatRegion = page.locator('[data-testid="copilot-chat-region"]');

    // Open sheet
    await fab.click();
    await expect(sheet).toBeAttached({ timeout: 10000 });
    await expect(sheet).toBeVisible();

    await captureScreenEvidence(page, SCREEN_ID, "map-sheet-open.png");

    // Close sheet with Escape
    await page.keyboard.press("Escape");
    await expect(sheet).not.toBeVisible();

    // Chat region still visible and accessible after sheet closes
    await expect(chatRegion).toBeVisible();

    assertConsoleClean(errors);
  });

  test("chat input clickable after map sheet open-close cycle", async ({
    page,
  }) => {
    await gotoShell(page);

    const fab = page.locator('[data-testid="map-sheet-trigger"]');
    const sheet = page.locator('[data-testid="map-sheet-content"]');

    // Open → close cycle
    await fab.click();
    await expect(sheet).toBeAttached({ timeout: 10000 });
    await expect(sheet).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(sheet).not.toBeVisible();

    // CopilotKit input must be interactable (not intercepted by a stale overlay)
    const input = page.locator(".copilotKitInput");
    await expect(input).toBeVisible();
    // Clicking must succeed without "element is outside viewport" or pointer-events error
    await expect(async () => {
      await input.click({ timeout: 3000 });
    }).not.toThrow();
  });

  test("FAB tap target is at least 44px tall", async ({ page }) => {
    await gotoShell(page);

    const fab = page.locator('[data-testid="map-sheet-trigger"]');
    const box = await fab.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
  });
});

test.describe(`${SCREEN_ID} desktop baseline`, () => {
  test.use({ viewport: DESKTOP_VIEWPORT });

  test("desktop: nav rail visible, drawer trigger hidden, map panel visible", async ({
    page,
  }) => {
    const errors = watchCriticalConsoleErrors(page);
    await gotoShell(page);

    await expect(page.locator('[data-testid="nav-rail"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-drawer-trigger"]')).toHaveCSS(
      "display",
      "none",
    );
    await expect(page.locator('[data-testid="map-panel"]')).toBeVisible();
    // No FAB on desktop
    await expect(
      page.locator('[data-testid="map-mobile-controls"]'),
    ).toHaveCSS("display", "none");

    await captureScreenEvidence(page, SCREEN_ID, "desktop-baseline.png");
    assertConsoleClean(errors);
  });
});
