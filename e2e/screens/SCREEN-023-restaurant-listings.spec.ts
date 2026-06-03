import { test, expect } from "@playwright/test";

test.describe("SCREEN-023 /restaurants browse", () => {
  test("loads catalog with restaurant grid", async ({ page }) => {
    await page.goto("/restaurants");
    await expect(page.getByTestId("restaurants-browse")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Restaurants" })).toBeVisible();
    await expect(page.getByTestId("restaurants-grid")).toBeVisible();
    await expect(page.locator('[data-testid^="restaurant-card-"]').first()).toBeVisible();
  });

  test("Laureles filter narrows results", async ({ page }) => {
    await page.goto("/restaurants");
    const neighborhoodFilters = page.getByRole("group", {
      name: "Neighborhood filters",
    });
    await neighborhoodFilters.getByRole("link", { name: "Laureles" }).click();
    await expect(page).toHaveURL(/neighborhood=Laureles/, { timeout: 15_000 });
    await expect(
      neighborhoodFilters.getByRole("link", { name: "Laureles" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
