import { test, expect, type Page } from "@playwright/test";
import type { Session } from "@supabase/supabase-js";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";
import {
  getTestSession,
  hasE2eEnv,
  injectSession,
  QA_HOST_EMAIL,
} from "../helpers/auth";

const SCREEN_ID = "SAN-729";

// Anonymous guard — deterministic, no env needed.
test.describe(`${SCREEN_ID} · AIE-008 — /host/analytics auth guard`, () => {
  test("anonymous /host/analytics redirects to /login with next", async ({ page }) => {
    await page.goto("/host/analytics");
    await expect(page).toHaveURL(/\/login\?/);
    // redirect("/login?next=/host/analytics") keeps literal slashes
    expect(page.url()).toContain("next=/host/analytics");
  });
});

// Authed dashboard — needs a real QA session; skipped when E2E env is absent.
const describeAuthed = hasE2eEnv() ? test.describe : test.describe.skip;

describeAuthed(`${SCREEN_ID} · AIE-008 — Host Analytics dashboard`, () => {
  test.use({ viewport: DESKTOP_VIEWPORT });
  let session: Session;

  test.beforeAll(async () => {
    session = await getTestSession(QA_HOST_EMAIL);
  });

  async function gotoAnalytics(page: Page): Promise<void> {
    await injectSession(page.context(), session);
    await page.goto("/host/analytics", { waitUntil: "domcontentloaded" });
  }

  test("dashboard shell + empty KPI prompt render; Analytics nav is active", async ({ page }) => {
    const errors = watchCriticalConsoleErrors(page);
    await gotoAnalytics(page);

    // Three-panel shell present
    await expect(page.getByTestId("host-analytics")).toBeVisible();
    await expect(page.getByTestId("host-nav-rail")).toBeVisible();

    // Before any chat, KPI canvas shows the "ask about your sales" empty state
    await expect(page.getByTestId("host-kpi-empty")).toBeVisible();

    // Chat surface is mounted
    await expect(page.getByTestId("host-ops-chat-region")).toBeVisible();

    // The Analytics nav item is now a live link, marked current on this route
    await expect(page.getByTestId("host-nav-link-analytics")).toHaveAttribute(
      "aria-current",
      "page",
    );

    await captureScreenEvidence(page, SCREEN_ID, "desktop-host-analytics-empty.png");
    assertConsoleClean(errors);
  });
});
