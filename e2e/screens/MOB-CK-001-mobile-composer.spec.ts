import { test, expect } from "@playwright/test";
import { gotoHome } from "../helpers/maps-layout";
import {
  assertConsoleClean,
  captureScreenEvidence,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

// MOB-CK-001 — CopilotKit v1.55.2 mobile composer best practices.
//
// The composer is a custom textarea (CopilotKit's Input is not exported in
// 1.55.2) reusing CK's class names; the mobile fixes live in globals.css
// (overrides CK's bundled defaults) + concierge-chat-input.tsx (input attrs +
// auto-grow). These assertions prove the fixes are actually applied on disk —
// the spec previously claimed them "already implemented" while none existed.

const SCREEN_ID = "MOB-CK-001";
const COMPOSER = ".copilotKitInput textarea";
const SEND_BTN = ".copilotKitInputControlButton";
const CONTAINER = ".copilotKitInputContainer";
const MESSAGES = ".copilotKitMessages";

test.describe(`${SCREEN_ID} CopilotKit v1 mobile composer`, () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test("textarea font-size ≥ 16px so iOS Safari does not auto-zoom on focus", async ({
    page,
  }) => {
    const errors = watchCriticalConsoleErrors(page);
    await gotoHome(page);

    const fontSize = await page
      .locator(COMPOSER)
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    // CK default is 0.875rem (14px) — anything < 16px triggers the zoom.
    expect(fontSize).toBeGreaterThanOrEqual(16);

    await captureScreenEvidence(page, SCREEN_ID, "composer-390.png");
    assertConsoleClean(errors);
  });

  test("send button is a ≥44x44 touch target (WCAG 2.5.5)", async ({ page }) => {
    await gotoHome(page);

    const box = await page.locator(SEND_BTN).first().boundingBox();
    expect(box).not.toBeNull();
    expect(box ? box.height : 0).toBeGreaterThanOrEqual(44);
    expect(box ? box.width : 0).toBeGreaterThanOrEqual(44);
  });

  test("input container keeps a safe-area bottom padding floor", async ({
    page,
  }) => {
    await gotoHome(page);

    const paddingBottom = await page
      .locator(CONTAINER)
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).paddingBottom));
    // env(safe-area-inset-bottom) is 0 in headless, so the max() 15px floor holds;
    // on a notched device the inset adds on top, lifting it above the home bar.
    expect(paddingBottom).toBeGreaterThanOrEqual(15);
  });

  test("messages list contains overscroll (no page pull-to-refresh)", async ({
    page,
  }) => {
    await gotoHome(page);

    const overscroll = await page
      .locator(MESSAGES)
      .first()
      .evaluate((el) => getComputedStyle(el).overscrollBehaviorY);
    expect(overscroll).toBe("contain");
  });

  test("textarea hints the mobile keyboard (enterKeyHint=send, inputMode=text)", async ({
    page,
  }) => {
    await gotoHome(page);

    const composer = page.locator(COMPOSER).first();
    await expect(composer).toHaveAttribute("enterkeyhint", "send");
    await expect(composer).toHaveAttribute("inputmode", "text");
  });

  test("textarea auto-grows with content and collapses after clear", async ({
    page,
  }) => {
    await gotoHome(page);

    const composer = page.locator(COMPOSER).first();
    await composer.click();
    const beforeBox = await composer.boundingBox();
    if (!beforeBox) {
      throw new Error("Composer bounding box not found before input");
    }
    const before = beforeBox.height;

    // Shift+Enter inserts newlines (plain Enter sends), so the box must grow.
    for (let i = 0; i < 5; i++) {
      await composer.pressSequentially(`line ${i}`);
      await composer.press("Shift+Enter");
    }
    const grownBox = await composer.boundingBox();
    if (!grownBox) {
      throw new Error("Composer bounding box not found after growing");
    }
    const grown = grownBox.height;
    expect(grown).toBeGreaterThan(before);

    await composer.fill("");
    const resetBox = await composer.boundingBox();
    if (!resetBox) {
      throw new Error("Composer bounding box not found after reset");
    }
    const reset = resetBox.height;
    expect(reset).toBeLessThan(grown);
  });

  test("reduced-motion zeroes the send-button transition", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoHome(page);

    const transitionDuration = await page
      .locator(SEND_BTN)
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(transitionDuration).toBe("0s");
  });
});
