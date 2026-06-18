import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  expectProtectedRouteLoginRedirect,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

const SCREEN_ID = "SCREEN-013";
const DEMO_TRIP_ID = "11111111-1111-1111-1111-000000000002";

test.describe.configure({ mode: "serial" });

test.describe(`${SCREEN_ID} itinerary panel`, () => {
  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("logged-out trip detail redirects to login with next", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await expectProtectedRouteLoginRedirect(page, `/trips/${DEMO_TRIP_ID}`);
      assertConsoleClean(errors);
    });

    test("itinerary panel renders day groups when authenticated", async ({
      page,
    }) => {
      const errors = watchCriticalConsoleErrors(page);
      await injectQaLandlordSession(page);
      await page.goto(`/trips/${DEMO_TRIP_ID}`, { waitUntil: "networkidle" });
      await expect(page.getByTestId("trip-workspace-tabs")).toBeVisible();
      await expect(page.getByTestId("itinerary-panel")).toBeVisible();
      await expect(page.getByTestId("itinerary-day-2026-06-21")).toBeVisible();
      await expect(page.getByTestId("itinerary-conflict")).toBeVisible();
      await captureScreenEvidence(page, SCREEN_ID, "desktop-itinerary-conflict.png");
      assertConsoleClean(errors);
    });

    test("map tab lists pins for geocoded items", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await injectQaLandlordSession(page);
      await page.goto(`/trips/${DEMO_TRIP_ID}`, { waitUntil: "networkidle" });
      await page.getByTestId("trip-tab-map").click();
      await expect(page.getByTestId("trip-map-panel")).toBeVisible();
      await expect(page.getByTestId("trip-map-pin").first()).toBeVisible();
      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("itinerary panel on mobile", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await injectQaLandlordSession(page);
      await page.goto(`/trips/${DEMO_TRIP_ID}`, { waitUntil: "networkidle" });
      await expect(page.getByTestId("itinerary-panel")).toBeVisible();
      await captureScreenEvidence(page, SCREEN_ID, "mobile-itinerary.png");
      assertConsoleClean(errors);
    });
  });
});

async function injectQaLandlordSession(page: import("@playwright/test").Page) {
  loadEnvLocalForE2E();
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) throw new Error("Missing Supabase anon key");
  const anon = anonKey;
  const serviceKeyVal =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!serviceKeyVal) throw new Error("Missing Supabase service role key");
  const serviceKey = serviceKeyVal;
  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const client = createClient(url, anon);
  const { data: link } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: "qa-landlord@mdeai.co",
    options: { redirectTo: "http://localhost:3001/trips" },
  });
  const otp = link?.properties?.email_otp;
  if (!otp) throw new Error("missing email_otp from generateLink");
  const { data, error } = await client.auth.verifyOtp({
    email: "qa-landlord@mdeai.co",
    token: otp,
    type: "email",
  });
  if (error || !data.session) throw error ?? new Error("no session");
  const ref = new URL(url).hostname.split(".")[0];
  const cookieName = `sb-${ref}-auth-token`;
  const payload = JSON.stringify({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    expires_in: data.session.expires_in,
    token_type: "bearer",
    user: data.session.user,
  });
  await page.context().addCookies([
    {
      name: cookieName,
      value: payload,
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);
}

function loadEnvLocalForE2E() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}
