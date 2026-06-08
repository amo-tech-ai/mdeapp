import { test, expect } from "@playwright/test";

/**
 * SAN-717 — FE error / empty / loading state pass
 * Covers: Rentals empty + events empty paths across viewports,
 * and happy-path "never blank" checks for both pages.
 *
 * Loading skeleton (rentals-browse-loading / events-browse-loading):
 * rendered server-side by Next.js Suspense streaming; not asserted here
 * because the skeleton disappears before networkidle fires and Playwright
 * cannot intercept server-side Supabase fetches via page.route().
 * Presence is guaranteed structurally by rentals/loading.tsx and
 * events/loading.tsx; visual regression is caught in dev with turbopack
 * slow mode or Lighthouse trace.
 */

const VIEWPORTS = [
  { name: "375", width: 375, height: 812 },
  { name: "1280", width: 1280, height: 900 },
] as const;

// ── Rentals empty state ──────────────────────────────────────────────────────

for (const vp of VIEWPORTS) {
  test.describe(`SAN-717 rentals empty @ ${vp.name}px`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("empty state renders when no rentals match filter", async ({ page }) => {
      // maxPrice=1 returns 0 results — impossible price floor
      await page.goto("/rentals?maxPrice=1", { waitUntil: "networkidle" });
      await expect(page.getByTestId("rentals-browse")).toBeVisible();
      await expect(page.getByTestId("rentals-empty")).toBeVisible();
      await expect(page.getByText("No rentals matched")).toBeVisible();
    });
  });
}

// ── Events empty state ───────────────────────────────────────────────────────

for (const vp of VIEWPORTS) {
  test.describe(`SAN-717 events empty @ ${vp.name}px`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("empty state renders when no events match filter", async ({ page }) => {
      // Impossible neighborhood filter that will never match
      await page.goto("/events?neighborhood=ZZNoSuchNeighborhood999", {
        waitUntil: "networkidle",
      });
      await expect(page.getByTestId("events-browse")).toBeVisible();
      await expect(page.getByTestId("events-empty")).toBeVisible();
      await expect(page.getByText("No events match")).toBeVisible();
    });
  });
}

// ── Rentals happy path — no blank screen ────────────────────────────────────

test.describe("SAN-717 rentals happy path", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("page renders results or empty state — never blank", async ({ page }) => {
    await page.goto("/rentals", { waitUntil: "networkidle" });
    await expect(page.getByTestId("rentals-browse")).toBeVisible();

    const grid = page.getByTestId("rentals-grid");
    const empty = page.getByTestId("rentals-empty");
    const error = page.getByTestId("rentals-error");

    const [gridVisible, emptyVisible, errorVisible] = await Promise.all([
      grid.isVisible(),
      empty.isVisible(),
      error.isVisible(),
    ]);

    // At least one of: results grid, empty state, or error notice must be visible
    expect(gridVisible || emptyVisible || errorVisible).toBe(true);
  });
});

// ── Events happy path — no blank screen ─────────────────────────────────────

test.describe("SAN-717 events happy path", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("page renders results or empty state — never blank", async ({ page }) => {
    await page.goto("/events", { waitUntil: "networkidle" });
    await expect(page.getByTestId("events-browse")).toBeVisible();

    const grid = page.getByTestId("events-grid");
    const empty = page.getByTestId("events-empty");
    const error = page.getByTestId("events-error");

    const [gridVisible, emptyVisible, errorVisible] = await Promise.all([
      grid.isVisible(),
      empty.isVisible(),
      error.isVisible(),
    ]);

    expect(gridVisible || emptyVisible || errorVisible).toBe(true);
  });
});
