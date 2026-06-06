import { test, expect } from "@playwright/test";
import {
  attachConsoleWatcher,
  assertConsoleHygiene,
  gotoBrowseRoute,
} from "../helpers/venue-release";

test.describe("SCREEN-028 /cafes browse", () => {
  test("loads catalog with café grid", async ({ page }) => {
    const errors = attachConsoleWatcher(page);
    await gotoBrowseRoute(page, "/cafes");
    await expect(page.getByTestId("cafes-browse").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Cafés" })).toBeVisible();
    await expect(page.getByTestId("cafes-grid")).toBeVisible();
    await expect(
      page.locator('[data-testid^="cafe-card-"]').first(),
    ).toBeVisible();
    assertConsoleHygiene(errors);
  });

  test("Laureles filter narrows results", async ({ page }) => {
    const errors = attachConsoleWatcher(page);
    await gotoBrowseRoute(page, "/cafes");
    const neighborhoodFilters = page.getByRole("group", {
      name: "Neighborhood filters",
    });
    await neighborhoodFilters.getByRole("link", { name: "Laureles" }).click();
    await expect(page).toHaveURL(/neighborhood=Laureles/, { timeout: 15_000 });
    await expect(
      neighborhoodFilters.getByRole("link", { name: "Laureles" }),
    ).toHaveAttribute("aria-pressed", "true");

    const cards = page.locator('[data-testid^="cafe-card-"]');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toContainText("Laureles");
    }
    assertConsoleHygiene(errors);
  });

  test("duplicate feature query params do not crash", async ({ page }) => {
    const errors = attachConsoleWatcher(page);
    await gotoBrowseRoute(page, "/cafes?feature=specialty&feature=workspace");
    await expect(page.getByTestId("cafes-browse").first()).toBeVisible();
    assertConsoleHygiene(errors);
  });
});
