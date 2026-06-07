import { test, expect } from "@playwright/test";

test.describe("REAL-011 /rentals browse", () => {
  test("loads rentals page with grid", async ({ page }) => {
    await page.goto("/rentals");
    await expect(page.getByTestId("rentals-browse")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Rentals" })).toBeVisible();
    await expect(page.getByTestId("rentals-grid")).toBeVisible();
    await expect(page.getByTestId("rental-card").first()).toBeVisible();
  });

  test("neighborhood filter chip sets URL param and shows active state", async ({
    page,
  }) => {
    await page.goto("/rentals");
    const neighborhoodGroup = page.getByRole("group", {
      name: "Neighborhood filters",
    });
    await neighborhoodGroup.getByRole("link", { name: "Laureles" }).click();
    await expect(page).toHaveURL(/neighborhood=Laureles/, { timeout: 15_000 });
    await expect(
      neighborhoodGroup.getByRole("link", { name: "Laureles" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("bedroom filter chip sets URL param", async ({ page }) => {
    await page.goto("/rentals");
    const bedsGroup = page.getByRole("group", { name: "Bedroom filters" });
    await bedsGroup.getByRole("link", { name: "2 BR" }).click();
    await expect(page).toHaveURL(/beds=2/, { timeout: 15_000 });
    await expect(
      bedsGroup.getByRole("link", { name: "2 BR" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("price filter chip sets URL param", async ({ page }) => {
    await page.goto("/rentals");
    const priceGroup = page.getByRole("group", { name: "Price filters" });
    await priceGroup.getByRole("link", { name: /≤ \$100/ }).click();
    await expect(page).toHaveURL(/maxPrice=100/, { timeout: 15_000 });
    await expect(
      priceGroup.getByRole("link", { name: /≤ \$100/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("direct URL with filters pre-selects chips", async ({ page }) => {
    await page.goto("/rentals?neighborhood=El+Poblado&beds=1");
    await expect(
      page
        .getByRole("group", { name: "Neighborhood filters" })
        .getByRole("link", { name: "El Poblado" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page
        .getByRole("group", { name: "Bedroom filters" })
        .getByRole("link", { name: "1 BR" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("/rentals no longer redirects to /chat", async ({ page }) => {
    await page.goto("/rentals");
    await expect(page).not.toHaveURL(/\/chat/);
    await expect(page).toHaveURL(/\/rentals/);
  });
});
