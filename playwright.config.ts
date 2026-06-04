import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.SMOKE_BASE_URL ?? "http://localhost:3001";

// When VERCEL_AUTOMATION_BYPASS_SECRET is set, inject the bypass header so
// Playwright can reach Vercel preview deployments protected by deployment protection.
// Set this secret in Vercel project settings under "Deployment Protection" and mirror
// it as VERCEL_AUTOMATION_BYPASS_SECRET in .env.local / CI secrets.
const vercelBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
const extraHTTPHeaders: Record<string, string> = vercelBypassSecret
  ? {
      "x-vercel-protection-bypass": vercelBypassSecret,
      "x-vercel-set-bypass-cookie": "true",
    }
  : {};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 150_000,
  reporter: [["list"], ["html", { open: "never", outputFolder: "tmp/playwright-report" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    extraHTTPHeaders,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: process.env.PW_SKIP_WEBSERVER
    ? undefined
    : {
        command: "npm run dev:ui",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
