import fs from "node:fs";
import path from "node:path";
import { expect, type Page } from "@playwright/test";
import { collectCriticalConsoleErrors } from "./maps-layout";

const SCREENSHOT_ROOT = path.join(process.cwd(), "tmp", "screenshots");

/** Ensures `mdeapp/tmp/screenshots/SCREEN-###/` exists for Done-gate evidence. */
export function screenshotDir(screenId: string): string {
  const dir = path.join(SCREENSHOT_ROOT, screenId);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export async function captureScreenEvidence(
  page: Page,
  screenId: string,
  filename: string,
  options?: { fullPage?: boolean },
): Promise<string> {
  const dir = screenshotDir(screenId);
  const filePath = path.join(dir, filename);
  const fullPage = options?.fullPage ?? true;
  try {
    await page.screenshot({ path: filePath, fullPage });
  } catch {
    await page.screenshot({ path: filePath, fullPage: false });
  }
  return filePath;
}

export function watchCriticalConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

export function assertConsoleClean(errors: string[]): void {
  const critical = collectCriticalConsoleErrors(errors);
  if (critical.length > 0) {
    throw new Error(`Critical console errors: ${critical.join(" | ")}`);
  }
}

export const DESKTOP_VIEWPORT = { width: 1280, height: 900 } as const;
export const MOBILE_VIEWPORT = { width: 390, height: 844 } as const;

/** AUTH-003 — anonymous users hit middleware → /login?next=… */
export async function expectProtectedRouteLoginRedirect(
  page: Page,
  path: string,
): Promise<void> {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/login/);
  const next = encodeURIComponent(path);
  expect(page.url()).toContain(`next=${next}`);
  await expect(page.locator('[data-slot="card-title"]', { hasText: "Sign in" })).toBeVisible();
}
