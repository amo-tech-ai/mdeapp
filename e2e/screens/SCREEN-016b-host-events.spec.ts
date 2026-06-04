import { test } from "@playwright/test";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  expectProtectedRouteLoginRedirect,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

const SCREEN_ID = "SCREEN-016b";

// /host/events is a protected route (middleware PROTECTED_PREFIXES includes
// /host). Logged-out access must redirect to /login?next=/host/events. The
// populated grid + empty state are covered by component tests + a live MCP
// screenshot, since the e2e suite has no authenticated-session fixture.
test.describe.configure({ mode: "serial" });

test.describe(`${SCREEN_ID} host events list`, () => {
  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("logged-out /host/events redirects to login with next", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await expectProtectedRouteLoginRedirect(page, "/host/events");
      await captureScreenEvidence(page, SCREEN_ID, "desktop-host-events-login-redirect.png");
      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("logged-out /host/events redirects on mobile", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await expectProtectedRouteLoginRedirect(page, "/host/events");
      await captureScreenEvidence(page, SCREEN_ID, "mobile-host-events-login-redirect.png");
      assertConsoleClean(errors);
    });
  });
});
