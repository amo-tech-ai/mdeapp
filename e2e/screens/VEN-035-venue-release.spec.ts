import { test, expect } from "@playwright/test";
import {
  attachConsoleWatcher,
  assertChatComposerUsable,
  assertConsoleHygiene,
  assertCuratedFallbackGrounding,
  assertNoDuplicateVenueSurfaces,
  gotoBrowseRoute,
  gotoChatHome,
  sendCafeGroundingQuery,
  sendNightlifeGroundingQuery,
} from "../helpers/venue-release";
import { MOBILE_VIEWPORT } from "../helpers/screen-evidence";

const SUITE = "VEN-035 venue release gate (SAN-314)";

test.describe(SUITE, () => {
  test.describe.configure({ mode: "serial" });

  test.describe("browse surfaces (no agent)", () => {
    test("SCREEN-023 /restaurants — grid, cards, back to chat", async ({
      page,
    }) => {
      const errors = attachConsoleWatcher(page);
      await gotoBrowseRoute(page, "/restaurants");

      await expect(page.getByTestId("restaurants-browse")).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Restaurants" }),
      ).toBeVisible();
      await expect(page.getByTestId("restaurants-grid")).toBeVisible();
      await expect(
        page.locator('[data-testid^="restaurant-card-"]').first(),
      ).toBeVisible();

      await page.getByRole("link", { name: "Back to chat" }).click();
      await expect(page).toHaveURL(/\/(\?|$)/);
      await expect(page.locator('[data-testid="chat-canvas"]')).toBeVisible();

      assertConsoleHygiene(errors);
    });

    test("SCREEN-023 /restaurants — Laureles neighborhood filter", async ({
      page,
    }) => {
      await gotoBrowseRoute(page, "/restaurants");
      const neighborhoodFilters = page.getByRole("group", {
        name: "Neighborhood filters",
      });
      await neighborhoodFilters.getByRole("link", { name: "Laureles" }).click();
      await expect(page).toHaveURL(/neighborhood=Laureles/, { timeout: 15_000 });
      await expect(
        neighborhoodFilters.getByRole("link", { name: "Laureles" }),
      ).toHaveAttribute("aria-pressed", "true");
    });

    test("SCREEN-028 /cafes — placeholder → concierge chat", async ({
      page,
    }) => {
      const errors = attachConsoleWatcher(page);
      await gotoBrowseRoute(page, "/cafes");

      await expect(page.getByTestId("cafes-browse-placeholder")).toBeVisible();
      await expect(page.getByTestId("cafes-placeholder")).toBeVisible();
      await expect(page.getByTestId("cafes-back-to-chat")).toBeVisible();

      await page.getByTestId("cafes-back-to-chat").click();
      await expect(page).toHaveURL(/\/(\?|$)/);
      await expect(page.locator('[data-testid="chat-canvas"]')).toBeVisible();

      assertConsoleHygiene(errors);
    });

    test("SCREEN-022 /nightlife — placeholder → concierge chat", async ({
      page,
    }) => {
      const errors = attachConsoleWatcher(page);
      await gotoBrowseRoute(page, "/nightlife");

      await expect(
        page.getByTestId("nightlife-browse-placeholder"),
      ).toBeVisible();
      await expect(page.getByTestId("nightlife-placeholder")).toBeVisible();
      await expect(page.getByTestId("nightlife-back-to-chat")).toBeVisible();

      await page.getByTestId("nightlife-back-to-chat").click();
      await expect(page).toHaveURL(/\/(\?|$)/);
      await expect(page.locator('[data-testid="chat-canvas"]')).toBeVisible();

      assertConsoleHygiene(errors);
    });
  });

  test.describe("SCREEN-018 mobile shell regression", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("FAB + nav drawer visible; chat usable after map sheet cycle", async ({
      page,
    }) => {
      const errors = attachConsoleWatcher(page);
      await gotoChatHome(page);

      await expect(page.locator('[data-testid="map-sheet-trigger"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-drawer-trigger"]')).toBeVisible();
      await expect(page.locator('aside [data-testid="nav-rail"]')).toBeHidden();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 2,
      );
      expect(overflow).toBe(false);

      await page.locator('[data-testid="map-sheet-trigger"]').click();
      await expect(page.locator('[data-testid="map-sheet-content"]')).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.locator('[data-testid="map-sheet-content"]')).toBeHidden();

      await assertChatComposerUsable(page);
      assertConsoleHygiene(errors);
    });
  });

  test.describe("chat venue cards (agent — strict, no nudge retry)", () => {
    test.beforeEach(async ({ page }) => {
      test.setTimeout(120_000);
      await page.setViewportSize({ width: 1360, height: 900 });
    });

    test("SCREEN-021 café cards — detail panel, fallback mode, no duplicate lists", async ({
      page,
    }) => {
      const errors = attachConsoleWatcher(page);
      await gotoChatHome(page);
      await sendCafeGroundingQuery(page);

      const firstCard = page
        .locator('[data-testid="grounded-card"][data-result-kind="cafe"]')
        .first();
      await expect(firstCard).toBeVisible();
      await assertNoDuplicateVenueSurfaces(page);
      await assertCuratedFallbackGrounding(page);

      await firstCard.locator('[data-testid="cafe-details-cta"]').click();
      const detailPanel = page.locator(
        '[data-testid="map-panel"] [data-testid="cafe-detail-panel"]',
      );
      await expect(detailPanel).toBeVisible();
      await expect(
        page.locator('[data-testid="map-panel"][data-right-column-mode="detail"]'),
      ).toBeVisible();
      await expect(detailPanel).toContainText(/Google-verified/);

      await detailPanel.locator('[data-testid="cafe-detail-close"]').click();
      await expect(detailPanel).toHaveCount(0);

      assertConsoleHygiene(errors);
    });

    test("SCREEN-022 nightlife cards — NightlifeDetailPanel, not café tabs", async ({
      page,
    }) => {
      const errors = attachConsoleWatcher(page);
      await gotoChatHome(page);
      await sendNightlifeGroundingQuery(page);

      const firstCard = page
        .locator('[data-testid="nightlife-card"][data-result-kind="nightlife"]')
        .first();
      await expect(firstCard).toBeVisible();
      await expect(page.locator('[data-testid="cafe-detail-panel"]')).toHaveCount(
        0,
      );
      await assertNoDuplicateVenueSurfaces(page);
      await assertCuratedFallbackGrounding(page);

      await firstCard.locator('[data-testid="nightlife-details-cta"]').click();
      const detailPanel = page.locator(
        '[data-testid="map-panel"] [data-testid="nightlife-detail-panel"]',
      );
      await expect(detailPanel).toBeVisible();
      await expect(
        page.locator('[data-testid="cafe-detail-tab-overview"]'),
      ).toHaveCount(0);
      await expect(
        detailPanel.locator('[data-testid="nightlife-safety-notice"]'),
      ).toBeVisible();

      await detailPanel.locator('[data-testid="nightlife-detail-close"]').click();
      await expect(detailPanel).toHaveCount(0);

      assertConsoleHygiene(errors);
    });

    test("browse + chat coexistence — restaurants then concierge still loads", async ({
      page,
    }) => {
      const errors = attachConsoleWatcher(page);
      await gotoBrowseRoute(page, "/restaurants");
      await expect(page.getByTestId("restaurants-browse")).toBeVisible();

      await page.goto("/", { waitUntil: "domcontentloaded" });
      await gotoChatHome(page);
      await assertChatComposerUsable(page);

      assertConsoleHygiene(errors);
    });
  });
});
