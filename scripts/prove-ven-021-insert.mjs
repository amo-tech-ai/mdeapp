#!/usr/bin/env node
/**
 * VEN-021 live insert proof: magic-link session → POST /api/venue-booking/request.
 * Usage: node --env-file=.env.local scripts/prove-ven-021-insert.mjs [baseUrl]
 */
import { createClient } from "@supabase/supabase-js";

const baseUrl = process.argv[2] ?? "http://localhost:3001";
const email = process.env.VEN_021_PROOF_EMAIL ?? "qa-landlord@mdeai.co";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

if (!url || !anonKey || !serviceKey) {
  console.error("FAIL: missing Supabase env (url, anon, service role)");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const anon = createClient(url, anonKey);

const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
  type: "magiclink",
  email,
  options: { redirectTo: `${baseUrl}/chat` },
});
if (linkErr) {
  console.error("FAIL: generateLink", linkErr.message);
  process.exit(1);
}
const otp = link?.properties?.email_otp;
if (!otp) {
  console.error("FAIL: missing email_otp from generateLink");
  process.exit(1);
}

const { data: authData, error: otpErr } = await anon.auth.verifyOtp({
  email,
  token: otp,
  type: "email",
});
if (otpErr || !authData.session) {
  console.error("FAIL: verifyOtp", otpErr?.message ?? "no session");
  process.exit(1);
}

const ref = new URL(url).hostname.split(".")[0];
const cookieName = `sb-${ref}-auth-token`;
const cookiePayload = JSON.stringify({
  access_token: authData.session.access_token,
  refresh_token: authData.session.refresh_token,
  expires_at: authData.session.expires_at,
  expires_in: authData.session.expires_in,
  token_type: "bearer",
  user: authData.session.user,
});

const requestedAt = new Date(Date.now() + 86400000).toISOString();
const body = {
  venueKind: "cafe",
  placeId: "ChIJven021proof01",
  requestedAt,
  partySize: 2,
  contactName: "VEN-021 Proof",
  contactEmail: email,
  contactPhone: "+573001234567",
  notes: "VEN-021 signed-in insert proof",
  venueTitle: "Proof Café",
};

const res = await fetch(`${baseUrl}/api/venue-booking/request`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Cookie: `${cookieName}=${encodeURIComponent(cookiePayload)}`,
  },
  body: JSON.stringify(body),
});

const json = await res.json().catch(() => ({}));
if (!res.ok || !json.success || !json.requestId) {
  console.error("FAIL: API", res.status, JSON.stringify(json));
  process.exit(1);
}

const userId = authData.session.user.id;
const { data: row, error: rowErr } = await admin
  .from("venue_booking_requests")
  .select("id, user_id, venue_kind, place_id, status, source, created_at")
  .eq("id", json.requestId)
  .maybeSingle();

if (rowErr || !row) {
  console.error("FAIL: row lookup", rowErr?.message ?? "not found");
  process.exit(1);
}
if (row.user_id !== userId) {
  console.error("FAIL: user_id mismatch", row.user_id, userId);
  process.exit(1);
}

console.log("PASS: venue_booking_requests insert");
console.log(
  JSON.stringify(
    {
      requestId: row.id,
      userId: row.user_id,
      venueKind: row.venue_kind,
      placeId: row.place_id,
      status: row.status,
      source: row.source,
      createdAt: row.created_at,
      apiMessage: json.message,
    },
    null,
    2,
  ),
);
