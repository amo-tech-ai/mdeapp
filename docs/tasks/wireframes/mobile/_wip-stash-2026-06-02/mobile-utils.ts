import { expect, type Page } from "@playwright/test";
import { hideCopilotWebInspector } from "./maps-layout";

export const ANDROID_VIEWPORT = { width: 412, height: 915 } as const;
export const IPHONE_SE_VIEWPORT = { width: 375, height: 667 } as const;
export const LANDSCAPE_MOBILE_VIEWPORT = { width: 844, height: 390 } as const;

/**
 * Lightweight navigation for pure mobile-shell tests.
 *
 * Does NOT call waitForCopilotRuntime — that registers a waitForResponse listener
 * which leaves CopilotKit SSE streaming active. Concurrent SSE can defer React
 * portal mounts (Base UI Sheet/Drawer) when multiple tests run in sequence.
 * These tests only need the chat canvas and textarea to be rendered.
 */
export async function gotoShell(page: Page, route = "/"): Promise<void> {
  const res = await page.goto(route, { waitUntil: "domcontentloaded" });
  if (!res?.ok()) throw new Error(`GET ${route} failed: ${res?.status()}`);
  await page
    .locator('[data-testid="chat-canvas"]')
    .waitFor({ state: "visible", timeout: 20_000 });
  await hideCopilotWebInspector(page);
  // Wait for textarea visible — same readiness signal as ensureChatInputVisible
  // but without the waitForResponse listener that keeps SSE open.
  await page
    .locator(".copilotKitInput textarea")
    .first()
    .waitFor({ state: "visible", timeout: 20_000 });
}

/** Assert no horizontal overflow — common mobile layout regression. */
export async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 2,
  );
  expect(overflow).toBe(false);
}

/** Assert touch target meets WCAG 2.5.5 (44×44px minimum). */
export async function assertTouchTarget(
  page: Page,
  selector: string,
  minPx = 44,
): Promise<void> {
  const el = page.locator(selector);
  const box = await el.boundingBox();
  expect(box, `${selector} not found in DOM`).not.toBeNull();
  expect(box!.height, `${selector} height < ${minPx}px`).toBeGreaterThanOrEqual(minPx);
  expect(box!.width, `${selector} width < ${minPx}px`).toBeGreaterThanOrEqual(minPx);
}

/** Assert all inputs have font-size ≥ 16px — prevents iOS auto-zoom. */
export async function assertNoIOSZoomInputs(page: Page): Promise<void> {
  const smallInputs = await page.evaluate(() => {
    const inputs = document.querySelectorAll("input, textarea, select");
    const small: string[] = [];
    inputs.forEach((el) => {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 16) small.push(`${el.tagName} [${el.getAttribute("name") ?? el.className}] = ${fs}px`);
    });
    return small;
  });
  expect(smallInputs, `iOS auto-zoom inputs (< 16px): ${smallInputs.join(", ")}`).toHaveLength(0);
}

/** Open a portal element (sheet/drawer) and assert it attaches within timeout. */
export async function openPortal(
  page: Page,
  triggerSelector: string,
  portalTestId: string,
  timeoutMs = 10_000,
): Promise<void> {
  await page.locator(triggerSelector).click();
  await expect(page.locator(`[data-testid="${portalTestId}"]`)).toBeAttached({
    timeout: timeoutMs,
  });
  await expect(page.locator(`[data-testid="${portalTestId}"]`)).toBeVisible();
}

/** Close a portal with Escape and assert it's no longer visible. */
export async function closePortalWithEscape(
  page: Page,
  portalTestId: string,
): Promise<void> {
  await page.keyboard.press("Escape");
  await expect(page.locator(`[data-testid="${portalTestId}"]`)).not.toBeVisible();
}
