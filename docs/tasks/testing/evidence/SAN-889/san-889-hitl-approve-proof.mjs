/**
 * SAN-889 · approve-only HITL proof (run after reject path in san-889-hitl-proof.mjs).
 */
import { chromium } from "playwright";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.SAN889_BASE_URL ?? "http://localhost:3001";
const BASE_HOST = new URL(BASE).hostname;
const QA_EMAIL = "qa-landlord@mdeai.co";
const OUT_DIR = __dirname;
const STAMP = Date.now();

function commitSha() {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

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
  if (!url || !anon || !serviceKey) throw new Error("Supabase env missing");
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
      domain: BASE_HOST,
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);
}

async function waitForServer() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`${BASE}/host/event/new`);
      if (res.status === 200 || res.status === 307) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("dev server not ready");
}

const results = {
  task: "SAN-889 · CK-V2-003 — v2 HITL approve proof",
  commitSha: commitSha(),
  at: new Date().toISOString(),
  matrix: {},
  consoleErrors: [],
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});

try {
  await waitForServer();
  const context = page.context();
  const { session, ref } = await getTestSession();
  await injectSession(context, session, ref);

  await page.goto(`${BASE}/host/event/new`, {
    waitUntil: "networkidle",
    timeout: 120_000,
  });

  const title = `QA HITL approve ${STAMP}`;
  await page.getByTestId("host-event-field-title").fill(title);
  await page.getByTestId("host-event-field-neighborhood").fill("Provenza");
  await page.getByTestId("host-event-field-date").fill("2026-07-20T19:00:00-05:00");
  await page.getByTestId("host-event-field-venue").fill("Hotel Movich");
  await page.getByTestId("host-event-field-capacity").fill("120");
  await page.getByTestId("host-event-field-price").fill("40000");
  await page.getByTestId("host-event-field-description").fill("Approve path proof.");

  const chatRegion = page.getByTestId("host-copilot-chat-region");
  const chatInput = chatRegion.getByTestId("copilot-chat-textarea");
  await chatInput.fill(
    `All required fields are filled for "${title}". Call preview_and_publish with the current draft now.`,
  );
  await chatRegion.getByTestId("copilot-send-button").click();

  // Retry once if agent is slow / rate-limited
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await page.getByTestId("host-event-approval-panel").waitFor({ timeout: 180_000 });
      break;
    } catch (err) {
      if (attempt === 1) throw err;
      await chatInput.fill("Please call preview_and_publish now — draft is complete.");
      await chatRegion.getByTestId("copilot-send-button").click();
    }
  }
  results.matrix.hitlPanelVisible = true;
  await page.screenshot({
    path: path.join(OUT_DIR, "SAN-889-hitl-approve-panel.png"),
    fullPage: true,
  });

  await page.getByTestId("host-event-approve").click();
  await page.getByText(/^Published:/).waitFor({ timeout: 120_000 });
  const publishedText = await page.getByText(/^Published:/).innerText();
  results.matrix.approvePublishedLink = /Published:/.test(publishedText);
  results.matrix.approveNoPendingApprovalRace =
    !publishedText.toLowerCase().includes("pending");
  await page.screenshot({
    path: path.join(OUT_DIR, "SAN-889-hitl-approve.png"),
    fullPage: true,
  });

  results.consoleErrors = consoleErrors.filter(
    (e) =>
      !e.includes("hydration") &&
      !e.includes("Vector Map") &&
      !e.includes("Lit is in dev mode") &&
      !e.includes("caret-color"),
  );
  results.matrix.zeroConsoleErrors = results.consoleErrors.length === 0;
  results.verdict = Object.values(results.matrix).every(Boolean) ? "PASS" : "PARTIAL";
} catch (err) {
  results.error = err instanceof Error ? err.message : String(err);
  results.verdict = "FAIL";
  await page.screenshot({ path: path.join(OUT_DIR, "SAN-889-hitl-approve-error.png") }).catch(() => {});
} finally {
  fs.writeFileSync(
    path.join(OUT_DIR, "SAN-889-hitl-approve-results.json"),
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
process.exit(results.verdict === "PASS" ? 0 : 1);
