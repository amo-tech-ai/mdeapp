import { test, expect, type Page } from "@playwright/test";
import type { Session } from "@supabase/supabase-js";
import {
  assertConsoleClean,
  captureScreenEvidence,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";
import {
  getTestSession,
  hasE2eEnv,
  injectSession,
  QA_HOST_EMAIL,
} from "../helpers/auth";

const SCREEN_ID = "SAN-1194";

// SAN-1194 · HOST-DASH-001 — Host Dashboard OS verification viewports.
const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
} as const;

// Anonymous guard — deterministic, no env needed.
test.describe(`${SCREEN_ID} · HOST-DASH-001 — /host/dashboard auth guard`, () => {
  test("anonymous /host/dashboard redirects to /login with next", async ({ page }) => {
    await page.goto("/host/dashboard");
    await expect(page).toHaveURL(/\/login\?/);
    // redirect("/login?next=/host/dashboard") keeps literal slashes
    expect(page.url()).toContain("next=/host/dashboard");
  });
});

// Authed dashboard — needs a real QA session; skipped when E2E env is absent.
const describeAuthed = hasE2eEnv() ? test.describe : test.describe.skip;

describeAuthed(`${SCREEN_ID} · HOST-DASH-001 — Host Dashboard OS`, () => {
  let session: Session;

  test.beforeAll(async () => {
    session = await getTestSession(QA_HOST_EMAIL);
  });

  async function gotoDashboard(page: Page): Promise<void> {
    await injectSession(page.context(), session);
    await page.goto("/host/dashboard", { waitUntil: "domcontentloaded" });
  }

  test("overview shell renders; Dashboard nav active; quick links + honest placeholders present", async ({
    page,
  }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    const errors = watchCriticalConsoleErrors(page);
    await gotoDashboard(page);

    // Aggregated overview shell present, inside the unified Host OS frame
    await expect(page.getByTestId("host-os-shell")).toBeVisible();
    await expect(page.getByTestId("host-dashboard")).toBeVisible();
    await expect(page.getByTestId("host-os-nav")).toBeVisible();

    // Figure-free briefing placeholder (no narrative yet on first load)
    await expect(page.getByTestId("dashboard-briefing-pending")).toBeVisible();

    // KPI snapshot renders in a valid state — real cards if the host has sales,
    // otherwise the "ask about your sales" empty prompt. Both are correct; never
    // a fabricated number. (This QA host has real sales → grid.)
    await expect(
      page
        .getByTestId("host-kpi-grid")
        .or(page.getByTestId("host-kpi-empty"))
        .or(page.getByTestId("host-kpi-error"))
        .first(),
    ).toBeVisible();

    // Needs-attention triage renders ranked recommendations, all-clear, or (on
    // loader failure) the error card — never a false all-clear when status=error
    await expect(
      page
        .getByTestId("host-recommendations")
        .or(page.getByTestId("dashboard-allclear"))
        .or(page.getByTestId("dashboard-triage-error"))
        .first(),
    ).toBeVisible();

    // Quick links deep-link out to the owning workspaces
    await expect(page.getByTestId("dashboard-quick-links")).toBeVisible();
    await expect(page.getByTestId("dashboard-open-analytics")).toBeVisible();

    // Honest data-pending tiles (never fake numbers)
    await expect(page.getByTestId("dashboard-portfolio-pending")).toBeVisible();
    await expect(page.getByTestId("dashboard-health-pending")).toBeVisible();

    // Overview nav item (the dashboard route) is marked current on this route
    await expect(page.getByTestId("host-os-nav-overview")).toHaveAttribute(
      "aria-current",
      "page",
    );

    await captureScreenEvidence(page, SCREEN_ID, "desktop-1440-host-dashboard.png");
    assertConsoleClean(errors);
  });

  test("renders responsively at tablet (768) and mobile (390x844)", async ({ page }) => {
    const errors = watchCriticalConsoleErrors(page);

    await page.setViewportSize(VIEWPORTS.tablet);
    await gotoDashboard(page);
    await expect(page.getByTestId("host-dashboard")).toBeVisible();
    await captureScreenEvidence(page, SCREEN_ID, "tablet-768-host-dashboard.png");

    await page.setViewportSize(VIEWPORTS.mobile);
    await expect(page.getByTestId("host-dashboard")).toBeVisible();
    // On mobile the persistent Host OS concierge chat stacks below the overview
    await expect(page.getByTestId("host-os-chat-region")).toBeVisible();
    await captureScreenEvidence(page, SCREEN_ID, "mobile-390-host-dashboard.png");

    assertConsoleClean(errors);
  });
});
