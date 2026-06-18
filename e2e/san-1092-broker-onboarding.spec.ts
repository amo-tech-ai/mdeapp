/**
 * SAN-1092 · RE-DES-005 — Broker onboarding wizard (Class U proof).
 *
 *   PW_SKIP_WEBSERVER=1 infisical run --silent --env=dev --path=/ -- \
 *     npx playwright test e2e/san-1092-broker-onboarding.spec.ts --project=chromium
 */
import { test, expect, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import {
  watchCriticalConsoleErrors,
  assertConsoleClean,
} from "./helpers/screen-evidence";
import { hasE2eEnv, loadEnvLocalForE2E, injectSession, getTestSession } from "./helpers/auth";

const EVIDENCE_DATE = "2026-06-16";
const EVIDENCE_DIR = path.join(
  process.cwd(),
  "docs/tasks/testing/evidence",
  EVIDENCE_DATE,
);

function serviceClient() {
  loadEnvLocalForE2E();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function captureEvidence(page: Page, filename: string): Promise<void> {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  const filePath = path.join(EVIDENCE_DIR, filename);
  await page.screenshot({ path: filePath, fullPage: true });
}

async function hideCpkInspector(page: Page): Promise<void> {
  await page.addStyleTag({
    content: "#cpk-web-inspector { display: none !important; }",
  });
}

test.describe("SAN-1092 · RE-DES-005 broker onboarding", () => {
  test.use({ viewport: { width: 1360, height: 900 } });

  test.beforeEach(() => {
    test.skip(!hasE2eEnv(), "E2E Supabase env missing — need Infisical or .env.local");
  });

  test("new broker completes wizard → listings + DB rows", async ({ page }) => {
    test.setTimeout(180_000);
    const errors = watchCriticalConsoleErrors(page);
    const runTag = Date.now();
    const email = `qa.broker.onboard+${runTag}@mdeai.co`;
    const displayName = `QA Broker ${runTag}`;
    const admin = serviceClient();

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
    });
    expect(createErr).toBeNull();
    const userId = created.user?.id;
    expect(userId).toBeTruthy();

    const { data: existingProfile } = await admin
      .from("landlord_profiles")
      .select("id")
      .eq("user_id", userId!)
      .maybeSingle();
    expect(existingProfile).toBeNull();

    const session = await getTestSession(email);
    await injectSession(page.context(), session);
    await hideCpkInspector(page);

    await page.goto("/host/rentals/onboarding", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-testid="rentals-onboarding"]')).toBeVisible();
    await captureEvidence(page, "SAN-1092-onboarding-step1.png");

    await page.locator("#ro-display-name").fill(displayName);
    await page.getByRole("button", { name: "Laureles" }).click();
    await page.getByRole("button", { name: "Continue →" }).click();
    await expect(page.locator('[data-testid="ro-step-listing"]')).toBeVisible();
    await captureEvidence(page, "SAN-1092-onboarding-step2.png");

    await page.locator("#ro-address").fill("Calle 10 #42-15, Laureles");
    await page.locator("#ro-bedrooms").fill("2");
    await page.locator("#ro-bathrooms").fill("1");
    await page.locator("#ro-rent").fill("2400000");
    await page.getByRole("button", { name: "Continue →" }).click();
    await expect(page.locator('[data-testid="ro-step-review"]')).toBeVisible();
    await captureEvidence(page, "SAN-1092-onboarding-step3.png");

    await page.locator('[data-testid="ro-ack"]').check();
    await page.locator('[data-testid="ro-submit"]').click();

    await page.waitForURL(/\/host\/rentals\/listings/, { timeout: 60_000 });
    await expect(page.locator('[data-testid="rentals-listings"]')).toBeVisible();
    await captureEvidence(page, "SAN-1092-onboarding-listings.png");

    const { data: profile } = await admin
      .from("landlord_profiles")
      .select("id, display_name, user_id")
      .eq("user_id", userId!)
      .maybeSingle();
    expect(profile).not.toBeNull();
    expect(profile?.display_name).toBe(displayName);

    const { data: apartments } = await admin
      .from("apartments")
      .select("id, landlord_id, listing_workflow_status, address, price_monthly")
      .eq("landlord_id", profile!.id);
    expect((apartments ?? []).length).toBeGreaterThanOrEqual(1);
    const draft = apartments!.find((a) => a.listing_workflow_status === "draft");
    expect(draft).toBeTruthy();
    expect(draft?.price_monthly).toBe(2_400_000);

    assertConsoleClean(errors);
  });
});
