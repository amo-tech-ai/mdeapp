import { test, expect } from "@playwright/test";
import {
  attachConsoleWatcher,
  assertConsoleHygiene,
  gotoBrowseRoute,
} from "../helpers/venue-release";

test.describe("SCREEN-027 /events browse", () => {
  test("loads catalog with event grid or empty state", async ({ page }) => {
    const errors = attachConsoleWatcher(page);
    await gotoBrowseRoute(page, "/events");
    await expect(page.getByTestId("events-browse").first()).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Events in Medellín" }),
    ).toBeVisible();

    const cards = page.getByTestId("event-card");
    const empty = page.getByTestId("events-empty");
    const cardCount = await cards.count();
    if (cardCount > 0) {
      await expect(cards.first()).toBeVisible();
      await expect(page.getByTestId("events-grid")).toBeVisible();
    } else {
      await expect(empty).toBeVisible();
    }

    assertConsoleHygiene(errors);
  });

  test("filters render for date, category, neighborhood, and price", async ({
    page,
  }) => {
    const errors = attachConsoleWatcher(page);
    await gotoBrowseRoute(page, "/events");
    await expect(
      page.getByRole("group", { name: "Date filters" }),
    ).toBeVisible();
    await expect(
      page.getByRole("group", { name: "Category filters" }),
    ).toBeVisible();
    await expect(
      page.getByRole("group", { name: "Neighborhood filters" }),
    ).toBeVisible();
    await expect(
      page.getByRole("group", { name: "Price filters" }),
    ).toBeVisible();
    assertConsoleHygiene(errors);
  });

  test("music category filter updates URL", async ({ page }) => {
    const errors = attachConsoleWatcher(page);
    await gotoBrowseRoute(page, "/events");
    const categoryFilters = page.getByRole("group", {
      name: "Category filters",
    });
    await categoryFilters.getByRole("link", { name: "Music" }).click();
    await expect(page).toHaveURL(/category=music/, { timeout: 15_000 });
    await expect(
      categoryFilters.getByRole("link", { name: "Music" }),
    ).toHaveAttribute("aria-pressed", "true");
    assertConsoleHygiene(errors);
  });

  test("Details link navigates to event detail when cards exist", async ({
    page,
  }) => {
    const errors = attachConsoleWatcher(page);
    await gotoBrowseRoute(page, "/events");
    const details = page.getByTestId("event-details-cta").first();
    if ((await details.count()) === 0) {
      test.skip(true, "No published events in catalog");
    }
    await details.click();
    await expect(page).toHaveURL(/\/events\/[^/]+$/, { timeout: 15_000 });
    assertConsoleHygiene(errors);
  });

  test("sidebar Events nav links to browse catalog", async ({ page }) => {
    const errors = attachConsoleWatcher(page);
    await gotoBrowseRoute(page, "/");
    const eventsLink = page.getByTestId("nav-events-link");
    await expect(eventsLink).not.toHaveAttribute("aria-disabled", "true");
    await eventsLink.click();
    await expect(page).toHaveURL(/\/events/, { timeout: 15_000 });
    await expect(page.getByTestId("events-browse").first()).toBeVisible();
    assertConsoleHygiene(errors);
  });

  test("duplicate category query params do not crash", async ({ page }) => {
    const errors = attachConsoleWatcher(page);
    await gotoBrowseRoute(page, "/events?category=music&category=food");
    await expect(page.getByTestId("events-browse").first()).toBeVisible();
    assertConsoleHygiene(errors);
  });
});
