import { test, expect, type Page } from "@playwright/test";
import {
  RESTAURANT_FAST_PATH_QUERY,
  gotoHome,
  sendConciergeMessage,
  waitForRestaurantCards,
} from "./helpers/maps-layout";
import { DESKTOP_VIEWPORT } from "./helpers/screen-evidence";

/**
 * SAN-494 · EVT-035 — Restaurant card Event Venue CTA.
 *
 * The SAN-492 offerings tables are AUTHORED, not applied, so the live DB
 * cannot serve offerings yet. Test 1 mocks the Supabase REST responses to
 * prove the full UI path (badge → CTA → sheet → offerings/packages).
 * Test 2 runs unmocked to prove graceful absence (no CTA, no crash) —
 * the behavior production has today.
 */
test.describe.configure({ mode: "serial" });
test.use({ viewport: DESKTOP_VIEWPORT });

const PARTNER_LOCATION = {
  id: "11111111-1111-4111-8111-111111111111",
  label: "Mamacita Medellín",
  neighborhood: "El Poblado",
  google_place_id: "ChIJSAN493MAMACITA01",
};

const OFFERINGS = [
  {
    id: "22222222-2222-4222-8222-222222222222",
    offering_key: "private_dining",
    event_types: ["birthday", "corporate"],
    amenities: ["sound_system", "projector"],
    minimum_spend: 1500000,
    price_per_person_from: 120000,
  },
];

const PACKAGES = [
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "Birthday Package",
    description: "Cake, decor and a reserved area",
    price_from: 2500000,
    min_guests: 10,
    max_guests: 40,
  },
];

function collectConsoleErrors(page: Page, sink: string[]) {
  page.on("console", (msg) => {
    if (msg.type() === "error") sink.push(msg.text());
  });
  page.on("pageerror", (err) => sink.push(`pageerror: ${err.message}`));
}

function filterExpectedErrors(errors: string[]) {
  return errors.filter(
    (e) =>
      !/venue_event_offerings|venue_event_packages|PGRST/i.test(e) &&
      !/Failed to load resource.*40[04]/i.test(e) &&
      // headless Chromium lacks WebGL: Maps falls back to raster (env artifact)
      !/Attempted to load a Vector Map, but failed/i.test(e),
  );
}

test.describe("SAN-494 event venue CTA (mocked offerings)", () => {
  test("badge + CTA render and sheet opens with offerings/packages", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    const consoleErrors: string[] = [];
    collectConsoleErrors(page, consoleErrors);

    await page.route("**/rest/v1/partner_locations*", (route) =>
      route.fulfill({ json: PARTNER_LOCATION }),
    );
    await page.route("**/rest/v1/venue_event_offerings*", (route) =>
      route.fulfill({ json: OFFERINGS }),
    );
    await page.route("**/rest/v1/venue_event_packages*", (route) =>
      route.fulfill({ json: PACKAGES }),
    );

    await gotoHome(page);
    await sendConciergeMessage(page, RESTAURANT_FAST_PATH_QUERY);
    await waitForRestaurantCards(page);

    const badge = page
      .locator('[data-testid="restaurant-hosts-events-badge"]')
      .first();
    await expect(badge).toBeVisible({ timeout: 30_000 });

    const cta = page.locator('[data-testid="event-venue-cta"]').first();
    await expect(cta).toBeVisible();

    const box = await cta.boundingBox();
    expect(box, "CTA bounding box").toBeTruthy();
    expect(box!.height, "CTA touch target height >= 44px").toBeGreaterThanOrEqual(44);
    expect(box!.width, "CTA touch target width >= 44px").toBeGreaterThanOrEqual(44);

    await cta.click();
    const sheet = page.locator('[data-testid="event-venue-offerings-sheet"]');
    await expect(sheet).toBeVisible();
    await expect(
      page.locator('[data-testid="event-venue-offerings-list"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="event-venue-offering-card"]').first(),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="event-venue-package-card"]').first(),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(sheet).not.toBeVisible();

    expect(filterExpectedErrors(consoleErrors), "console errors").toEqual([]);
  });
});

test.describe("SAN-494 graceful absence (live DB, tables not applied)", () => {
  test("cards render without CTA and without crash", async ({ page }) => {
    test.setTimeout(180_000);
    const consoleErrors: string[] = [];
    collectConsoleErrors(page, consoleErrors);

    await gotoHome(page);
    await sendConciergeMessage(page, RESTAURANT_FAST_PATH_QUERY);
    await waitForRestaurantCards(page);

    await expect(
      page.locator('[data-testid="restaurant-card"]').first(),
    ).toBeVisible();
    await expect(page.locator('[data-testid="event-venue-cta"]')).toHaveCount(0);
    await expect(
      page.locator('[data-testid="restaurant-hosts-events-badge"]'),
    ).toHaveCount(0);

    expect(filterExpectedErrors(consoleErrors), "console errors").toEqual([]);
  });
});
