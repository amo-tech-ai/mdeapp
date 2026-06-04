import { test, expect } from "@playwright/test";
import {
  attachConsoleWatcher,
  assertConsoleHygiene,
  gotoBrowseRoute,
} from "../helpers/venue-release";

test.describe("SCREEN-022 /nightlife browse", () => {
  test("loads catalog with nightlife grid", async ({ page }) => {
    const errors = attachConsoleWatcher(page);
    await gotoBrowseRoute(page, "/nightlife");
    await expect(page.getByTestId("nightlife-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Nightlife" })).toBeVisible();
    await expect(page.getByTestId("nightlife-safety-notice")).toBeVisible();
    await expect(page.getByTestId("nightlife-grid")).toBeVisible();
    await expect(
      page.locator('[data-testid^="nightlife-card-"]').first(),
    ).toBeVisible();
    assertConsoleHygiene(errors);
  });

  test("Provenza filter narrows results", async ({ page }) => {
    const errors = attachConsoleWatcher(page);
    await gotoBrowseRoute(page, "/nightlife");
    const neighborhoodFilters = page.getByRole("group", {
      name: "Neighborhood filters",
    });
    await neighborhoodFilters.getByRole("link", { name: "Provenza" }).click();
    await expect(page).toHaveURL(/neighborhood=Provenza/, { timeout: 15_000 });
    await expect(
      neighborhoodFilters.getByRole("link", { name: "Provenza" }),
    ).toHaveAttribute("aria-pressed", "true");

    const cards = page.locator('[data-testid^="nightlife-card-"]');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toContainText("Provenza");
    }
    assertConsoleHygiene(errors);
  });

  test("duplicate vibe query params do not crash", async ({ page }) => {
    const errors = attachConsoleWatcher(page);
    await gotoBrowseRoute(page, "/nightlife?vibe=salsa&vibe=rooftop");
    await expect(page.getByTestId("nightlife-page")).toBeVisible();
    assertConsoleHygiene(errors);
  });
});
