import { test, expect } from "@playwright/test";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  expectProtectedRouteLoginRedirect,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

const SCREEN_ID = "SCREEN-016";

test.describe(`${SCREEN_ID} host event wizard`, () => {
  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("logged-out host wizard redirects to login", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await expectProtectedRouteLoginRedirect(page, "/host/event/new");
      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("logged-out host wizard redirects on mobile", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await expectProtectedRouteLoginRedirect(page, "/host/event/new");
      await captureScreenEvidence(page, SCREEN_ID, "mobile-host-login-redirect.png");
      assertConsoleClean(errors);
    });
  });
});
