import { test, expect } from "@playwright/test";

/**
 * SAN-692 · D-PTR-01 — Partner hub marketing page (/partners)
 * Smoke: route renders, hero, category cards route correctly (venue verticals →
 * live /venues ?v= variants; others → typed signup), AI band, 3-step how-it-works.
 */

const BASE = "/partners";

test.describe("SAN-692 · Partner hub", () => {
  test("route returns 200 and renders hero", async ({ page }) => {
    const res = await page.goto(BASE, { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: /grow your business with/i, level: 1 }),
    ).toBeVisible();
  });

  test("primary CTA links to /partners/signup", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    const cta = page.getByTestId("partner-hub-primary-cta");
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/partners/signup");
  });

  test("secondary CTA anchors to #partner-types", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("partner-hub-secondary-cta")).toHaveAttribute(
      "href",
      "#partner-types",
    );
  });

  test("venue vertical cards link to the live /venues ?v= variants", async ({
    page,
  }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("partner-card-restaurants")).toHaveAttribute(
      "href",
      "/venues?v=restaurant",
    );
    await expect(page.getByTestId("partner-card-cafes")).toHaveAttribute(
      "href",
      "/venues?v=cafe",
    );
    await expect(page.getByTestId("partner-card-nightlife")).toHaveAttribute(
      "href",
      "/venues?v=nightclub",
    );
    await expect(page.getByTestId("partner-card-spaces")).toHaveAttribute(
      "href",
      "/venues?v=space",
    );
  });

  test("non-venue cards route to the live typed signup wizard", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("partner-card-rentals")).toHaveAttribute(
      "href",
      "/partners/signup?type=broker",
    );
    await expect(page.getByTestId("partner-card-agency")).toHaveAttribute(
      "href",
      "/partners/signup?type=agency",
    );
    await expect(page.getByTestId("partner-card-sponsors")).toHaveAttribute(
      "href",
      "/partners/signup?type=sponsor",
    );
    await expect(page.getByTestId("partner-card-host")).toHaveAttribute(
      "href",
      "/partners/signup?type=host",
    );
  });

  test("renders the 'AI does the work' band", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: /the ai does the work/i, level: 2 }),
    ).toBeVisible();
  });

  test("how-it-works has 3 steps", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    const steps = page
      .getByRole("list", { name: /steps to get started/i })
      .getByRole("listitem");
    await expect(steps).toHaveCount(3);
  });
});
