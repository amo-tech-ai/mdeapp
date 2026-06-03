import { test, expect } from "@playwright/test";

// AUTH-005 — deterministic auth-guard journeys.
//
// Completing a magic link (needs an inbox) or Google OAuth (needs Google consent)
// can't be automated here — those are covered by the manual production smoke.
// This suite asserts the guard logic that needs no real session: protected-route
// redirects, the guest ticket-view exemption, the passwordless login/signup UI,
// signout, and auth-callback error handling.

const PROTECTED_ROUTES = ["/trips", "/saved", "/host/event/new", "/me/tickets"];

test.describe("AUTH-005 auth guards", () => {
  for (const route of PROTECTED_ROUTES) {
    test(`anonymous ${route} redirects to /login with next`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login\?/);
      expect(page.url()).toContain(`next=${encodeURIComponent(route)}`);
    });
  }

  test("guest ticket-view subpath stays public (no login redirect)", async ({
    page,
  }) => {
    // /me/tickets/[id] is the guest QR view (email link carries ?token=). The
    // middleware guard is exact-match on /me/tickets, so deeper paths must pass.
    await page.goto("/me/tickets/00000000-0000-0000-0000-000000000000");
    expect(page.url()).not.toContain("/login");
    expect(page.url()).toContain("/me/tickets/");
  });

  test("login page renders passwordless options", async ({ page }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("button", { name: "Email magic link" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Continue with Google" }),
    ).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
  });

  test("signup page renders passwordless options", async ({ page }) => {
    await page.goto("/signup");
    await expect(
      page.getByRole("button", { name: "Email magic link" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Continue with Google" }),
    ).toBeVisible();
  });

  test("signout POST clears session and redirects home", async ({ request }) => {
    const res = await request.post("/auth/signout", { maxRedirects: 0 });
    expect(res.status()).toBe(303);
    expect(res.headers()["location"]).toMatch(/\/$/);
  });

  test("auth callback without code redirects to /login with error", async ({
    request,
  }) => {
    const res = await request.get("/auth/callback", { maxRedirects: 0 });
    expect(res.status()).toBeGreaterThanOrEqual(300);
    expect(res.status()).toBeLessThan(400);
    expect(res.headers()["location"]).toContain(
      "error=auth_callback_missing_code",
    );
  });

  test("provider error on a normal path relays to /login", async ({ page }) => {
    await page.goto("/?error=access_denied");
    await expect(page).toHaveURL(/\/login\?/);
    expect(page.url()).toContain("error=access_denied");
  });
});
