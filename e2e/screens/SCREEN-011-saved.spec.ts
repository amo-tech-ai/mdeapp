import { test, expect } from "@playwright/test";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

const SCREEN_ID = "SCREEN-011";

test.describe.configure({ mode: "serial" });

test.describe(`${SCREEN_ID} saved collections`, () => {
  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("saved page renders shell and empty sign-in state", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      const res = await page.goto("/saved", { waitUntil: "domcontentloaded" });
      expect(res?.status()).toBe(200);
      await expect(page.getByTestId("saved-page")).toBeVisible();
      await expect(page.getByTestId("saved-empty-signin")).toBeVisible();
      await captureScreenEvidence(page, SCREEN_ID, "desktop-saved-empty.png");
      assertConsoleClean(errors);
    });

    test("nav saved link reaches /saved", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.getByTestId("nav-saved-link").click();
      await expect(page).toHaveURL(/\/saved$/);
      await expect(page.getByTestId("saved-page")).toBeVisible();
      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("saved page renders on mobile", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await page.goto("/saved", { waitUntil: "domcontentloaded" });
      await expect(page.getByTestId("saved-page")).toBeVisible();
      await captureScreenEvidence(page, SCREEN_ID, "mobile-saved-empty.png");
      assertConsoleClean(errors);
    });
  });
});
