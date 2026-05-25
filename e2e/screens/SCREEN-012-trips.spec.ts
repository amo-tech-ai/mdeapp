import { test, expect } from "@playwright/test";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

const SCREEN_ID = "SCREEN-012";

test.describe.configure({ mode: "serial" });

test.describe(`${SCREEN_ID} trips dashboard`, () => {
  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("trips page renders shell and empty sign-in state", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      const res = await page.goto("/trips", { waitUntil: "domcontentloaded" });
      expect(res?.status()).toBe(200);
      await expect(page.getByTestId("trips-dashboard")).toBeVisible();
      await expect(page.getByTestId("trips-empty-signin")).toBeVisible();
      await captureScreenEvidence(page, SCREEN_ID, "desktop-trips-empty.png");
      assertConsoleClean(errors);
    });

    test("nav trips link reaches /trips", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.getByTestId("nav-trips-link").click();
      await expect(page).toHaveURL(/\/trips$/);
      await expect(page.getByTestId("trips-dashboard")).toBeVisible();
      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("trips page renders on mobile", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await page.goto("/trips", { waitUntil: "domcontentloaded" });
      await expect(page.getByTestId("trips-dashboard")).toBeVisible();
      await captureScreenEvidence(page, SCREEN_ID, "mobile-trips-empty.png");
      assertConsoleClean(errors);
    });
  });
});
