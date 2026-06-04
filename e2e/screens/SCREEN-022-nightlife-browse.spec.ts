import { test, expect } from "@playwright/test";

test.describe("SCREEN-022 /nightlife browse", () => {
  test("loads catalog with nightlife grid", async ({ page }) => {
    await page.goto("/nightlife");
    await expect(page.getByTestId("nightlife-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Nightlife" })).toBeVisible();
    await expect(page.getByTestId("nightlife-safety-notice")).toBeVisible();
    await expect(page.getByTestId("nightlife-grid")).toBeVisible();
    await expect(
      page.locator('[data-testid^="nightlife-card-"]').first(),
    ).toBeVisible();
  });

  test("Provenza filter narrows results", async ({ page }) => {
    await page.goto("/nightlife");
    const neighborhoodFilters = page.getByRole("group", {
      name: "Neighborhood filters",
    });
    await neighborhoodFilters.getByRole("link", { name: "Provenza" }).click();
    await expect(page).toHaveURL(/neighborhood=Provenza/, { timeout: 15_000 });
    await expect(
      neighborhoodFilters.getByRole("link", { name: "Provenza" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
