import type { BrowserContext, Page } from "@playwright/test";
import type { Session } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

export const QA_HOST_EMAIL = "qa-landlord@mdeai.co";

/** Load `.env.local` into process.env for e2e helpers (Playwright doesn't read it). */
export function loadEnvLocalForE2E(): void {
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

function supabaseEnv() {
  loadEnvLocalForE2E();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  return { url, anon, serviceKey };
}

/** True only when the Supabase env required for authed e2e is present. */
export function hasE2eEnv(): boolean {
  const { url, anon, serviceKey } = supabaseEnv();
  return Boolean(url && anon && serviceKey);
}

/**
 * Mint a real Supabase session for a test user via admin magic-link → verifyOtp.
 * Retries to absorb magic-link flakiness. Never logs key values.
 */
export async function getTestSession(email = QA_HOST_EMAIL): Promise<Session> {
  const { url, anon, serviceKey } = supabaseEnv();
  if (!url || !anon || !serviceKey) {
    throw new Error("E2E Supabase env missing (url/anon/serviceKey)");
  }
  const { createClient } = await import("@supabase/supabase-js");
  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const client = createClient(url, anon);

  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
        type: "magiclink",
        email,
      });
      if (linkErr) throw linkErr;
      const otp = link?.properties?.email_otp;
      if (!otp) throw new Error("missing email_otp from generateLink");
      const { data, error } = await client.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });
      if (error || !data.session) throw error ?? new Error("no session from verifyOtp");
      return data.session;
    } catch (err) {
      lastErr = err;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("getTestSession failed");
}

/** Inject a Supabase session as the `sb-<ref>-auth-token` cookie (clears cookies first). */
export async function injectSession(
  context: BrowserContext,
  session: Session,
): Promise<void> {
  const { url } = supabaseEnv();
  const ref = new URL(url!).hostname.split(".")[0];
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

/** Sign a page's context in as `email` and return the session. */
export async function signInAs(
  page: Page,
  email = QA_HOST_EMAIL,
): Promise<Session> {
  const session = await getTestSession(email);
  await injectSession(page.context(), session);
  return session;
}
