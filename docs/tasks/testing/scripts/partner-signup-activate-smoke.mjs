#!/usr/bin/env node
/**
 * SAN-723 signed-in activate smoke — mint session, POST activate, assert draft partner.
 * Usage: infisical run --silent --env=dev --path=/ -- node tasks/testing/scripts/partner-signup-activate-smoke.mjs
 */
import { createClient } from "@supabase/supabase-js";

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3001";
const EMAIL = process.env.E2E_QA_EMAIL ?? "qa-landlord@mdeai.co";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`PASS: ${msg}`);
}

if (!url || !anon || !serviceKey) {
  fail("Missing Supabase env (NEXT_PUBLIC_SUPABASE_URL, anon key, service role)");
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const client = createClient(url, anon);

async function mintSession() {
  const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: EMAIL,
  });
  if (linkErr) throw linkErr;
  const otp = link?.properties?.email_otp;
  if (!otp) throw new Error("missing email_otp");
  const { data, error } = await client.auth.verifyOtp({
    email: EMAIL,
    token: otp,
    type: "email",
  });
  if (error || !data.session) throw error ?? new Error("no session");
  return data.session;
}

async function main() {
  const landing = await fetch(`${BASE}/partners/signup`);
  if (landing.status !== 200) fail(`GET /partners/signup → ${landing.status}`);
  ok(`GET /partners/signup → 200`);

  const wizard = await fetch(`${BASE}/partners/signup?type=host`);
  if (wizard.status !== 200) fail(`GET ?type=host → ${wizard.status}`);
  ok(`GET /partners/signup?type=host → 200`);

  const session = await mintSession();
  ok(`Session minted for ${EMAIL}`);

  const businessName = `Smoke Host ${Date.now()}`;
  const res = await fetch(`${BASE}/api/partners/activate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      type: "host",
      businessName,
      category: "Nightlife",
      neighborhood: "Provenza",
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (res.status !== 200 && res.status !== 201) {
    fail(`POST /api/partners/activate → ${res.status} ${JSON.stringify(body)}`);
  }
  ok(`POST /api/partners/activate → ${res.status}`);

  if (!body.partnerId) fail("Response missing partnerId");
  ok(`partnerId present: ${body.partnerId}`);

  const service = createClient(url, serviceKey);
  const { data: partner, error: pErr } = await service
    .from("partners")
    .select("id, type, status, settings")
    .eq("id", body.partnerId)
    .maybeSingle();
  if (pErr || !partner) fail(`DB partners row missing: ${pErr?.message ?? "null"}`);
  if (partner.type !== "host") fail(`partner.type = ${partner.type}`);
  if (partner.status !== "draft") fail(`partner.status = ${partner.status}`);
  ok(`DB partners row draft host (${partner.id})`);

  const { data: member, error: mErr } = await service
    .from("partner_members")
    .select("role")
    .eq("partner_id", body.partnerId)
    .eq("profile_id", session.user.id)
    .maybeSingle();
  if (mErr || !member) fail(`partner_members missing: ${mErr?.message ?? "null"}`);
  if (member.role !== "owner") fail(`member.role = ${member.role}`);
  ok("partner_members owner row");

  console.log("\nSAN-723 signed-in activate smoke: ALL PASS");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
