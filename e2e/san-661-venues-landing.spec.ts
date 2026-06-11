import { test, expect } from "@playwright/test";

/**
 * SAN-661 · MKT — For Venues landing (/venues)
 * Smoke: route renders, hero h1 present, ?v= variants switch copy,
 * primary CTA carries ?type=venue into signup wizard.
 */

const BASE = "/venues";
const SIGNUP_PATH = "/partners/signup";

test.describe("SAN-661 · For Venues landing", () => {
  test("default route returns 200 and renders hero", async ({ page }) => {
    const res = await page.goto(BASE, { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);

    await expect(
      page.getByRole("heading", {
        name: /fill your tables\. fill your nights\./i,
        level: 1,
      }),
    ).toBeVisible();
  });

  test("primary CTA links to /partners/signup?type=venue", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    const primaryCta = page.getByTestId("venues-landing-primary-cta");
    await expect(primaryCta).toBeVisible();
    const href = await primaryCta.getAttribute("href");
    expect(href).toContain(SIGNUP_PATH);
    expect(href).toContain("type=venue");
  });

  test("?v=restaurant switches hero h1", async ({ page }) => {
    await page.goto(`${BASE}?v=restaurant`, { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", {
        name: /be the answer to/i,
        level: 1,
      }),
    ).toBeVisible();
  });

  test("?v=nightclub switches hero h1", async ({ page }) => {
    await page.goto(`${BASE}?v=nightclub`, { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", {
        name: /slow tuesdays are a software problem/i,
        level: 1,
      }),
    ).toBeVisible();
  });

  test("?v=cafe switches hero h1", async ({ page }) => {
    await page.goto(`${BASE}?v=cafe`, { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", {
        name: /where medellín's nomads work next/i,
        level: 1,
      }),
    ).toBeVisible();
  });

  test("?v=space switches hero h1", async ({ page }) => {
    await page.goto(`${BASE}?v=space`, { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", {
        name: /your space, booked by ai/i,
        level: 1,
      }),
    ).toBeVisible();
  });

  test("unknown ?v= falls back to default hero", async ({ page }) => {
    await page.goto(`${BASE}?v=invalid`, { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", {
        name: /fill your tables\. fill your nights\./i,
        level: 1,
      }),
    ).toBeVisible();
  });

  test("pricing CTA links to /contact", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    const pricingCta = page.getByTestId("venues-landing-pricing-cta");
    await expect(pricingCta).toBeVisible();
    const href = await pricingCta.getAttribute("href");
    expect(href).toBe("/contact");
  });

  test("how-it-works section has 5 steps", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    const steps = page.getByRole("list", { name: /steps to get started/i }).getByRole("listitem");
    await expect(steps).toHaveCount(5);
  });
});
