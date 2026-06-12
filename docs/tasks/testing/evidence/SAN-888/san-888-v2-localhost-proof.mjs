/**
 * SAN-888 · CK-V2-002 — localhost runtime proof (flag on).
 * Run: COPILOTKIT_V2_ANALYTICS=1 infisical run --silent --env=dev --path=/ -- node docs/tasks/testing/evidence/SAN-888/san-888-v2-localhost-proof.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.SAN888_BASE_URL ?? "http://localhost:3001";
const QA_EMAIL = "qa-landlord@mdeai.co";
const OUT_DIR = __dirname;

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    if (process.env[key] === undefined) {
      process.env[key] = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
}

async function getTestSession() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !anon || !serviceKey) {
    throw new Error("Supabase env missing for session mint");
  }
  const { createClient } = await import("@supabase/supabase-js");
  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const client = createClient(url, anon);
  const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: QA_EMAIL,
  });
  if (linkErr) throw linkErr;
  const otp = link?.properties?.email_otp;
  if (!otp) throw new Error("missing email_otp");
  const { data, error } = await client.auth.verifyOtp({
    email: QA_EMAIL,
    token: otp,
    type: "email",
  });
  if (error || !data.session) throw error ?? new Error("no session");
  return { session: data.session, ref: new URL(url).hostname.split(".")[0] };
}

async function injectSession(context, session, ref) {
  const payload = JSON.stringify({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    expires_in: session.expires_in,
    token_type: "bearer",
    user: session.user,
  });
  await context.clearCookies();
  await context.addCookies([
    {
      name: `sb-${ref}-auth-token`,
      value: payload,
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);
}

const results = {
  task: "SAN-888 · CK-V2-002 — host-analytics-prototype",
  flag: process.env.COPILOTKIT_V2_ANALYTICS ?? "(unset)",
  baseUrl: BASE,
  at: new Date().toISOString(),
  gates: {},
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});

try {
  const { session, ref } = await getTestSession();
  await injectSession(context, session, ref);

  const nav = await page.goto(`${BASE}/host/analytics`, { waitUntil: "networkidle", timeout: 120_000 });
  results.gates.analyticsHttp = nav?.status() ?? 0;
  results.gates.signedInEmail = (await page.getByText(QA_EMAIL).count()) > 0;
  results.gates.hostAnalyticsTestId = await page.getByTestId("host-analytics").isVisible();

  const chatRegion = page.getByTestId("host-ops-chat-region");
  const chatInput = chatRegion.getByTestId("copilot-chat-textarea");
  await chatInput.waitFor({ timeout: 30_000 });
  await chatInput.fill("how are my sales?");
  await chatRegion.getByTestId("copilot-send-button").click();

  await page.getByText("Sales loaded ✓").waitFor({ timeout: 120_000 });
  results.gates.salesLoadedAck = true;

  await page.waitForTimeout(3000);
  const kpiText = await page.locator('[data-testid="host-analytics"]').innerText();
  results.gates.kpiPanelHasRevenue = /revenue|COP|ticket/i.test(kpiText);
  results.gates.consoleErrors = consoleErrors.filter(
    (e) => !e.includes("Vector Map") && !e.includes("Lit is in dev mode"),
  );

  await page.screenshot({ path: path.join(OUT_DIR, "SAN-888-v2-flag-on-localhost.png"), fullPage: true });
  results.verdict =
    results.gates.analyticsHttp === 200 &&
    results.gates.hostAnalyticsTestId &&
    results.gates.salesLoadedAck &&
    results.gates.consoleErrors.length === 0
      ? "PASS"
      : "PARTIAL";
} catch (err) {
  results.error = err instanceof Error ? err.message : String(err);
  results.verdict = "FAIL";
  await page.screenshot({ path: path.join(OUT_DIR, "SAN-888-v2-flag-on-localhost-error.png"), fullPage: true }).catch(() => {});
} finally {
  fs.writeFileSync(path.join(OUT_DIR, "SAN-888-v2-flag-on-results.json"), JSON.stringify(results, null, 2));
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
  process.exit(results.verdict === "PASS" ? 0 : 1);
}
