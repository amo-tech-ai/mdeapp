/**
 * SAN-869 · VEB-MVP-004 — duplicate proposal dev validation.
 * Usage: infisical run --silent --env=dev --path=/ -- node scripts/san-869-duplicate-proposal-proof.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import fs from "node:fs";
import path from "node:path";

const EVIDENCE = path.resolve(
  "docs/tasks/testing/evidence/2026-06-11/SAN-869-bookings-idempotency-duplicate-proof.json",
);

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = "qa-landlord@mdeai.co";

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const client = createClient(url, anon);
  const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (linkErr) throw linkErr;
  const otp = link.properties?.email_otp;
  if (!otp) throw new Error("no otp");
  const { data, error } = await client.auth.verifyOtp({
    email,
    token: otp,
    type: "email",
  });
  if (error || !data.session) throw error ?? new Error("no session");

  const ref = new URL(url).hostname.split(".")[0];
  const cookieVal = JSON.stringify({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    expires_in: data.session.expires_in,
    token_type: "bearer",
    user: data.session.user,
  });

  const runTag = Date.now();
  const body = {
    partnerLocationId: "00000000-0000-4001-8201-000000000001",
    partnerId: "00000000-0000-4001-8101-000000000001",
    venueTitle: "Mamasita Medallo",
    eventType: "Birthday",
    startDate: `2026-09-${String((runTag % 28) + 1).padStart(2, "0")}`,
    startTime: "19:00",
    partySize: 30,
    contactName: "SAN-869 proof",
    contactEmail: `san869.proof+${runTag}@mdeai.co`,
  };

  const post = async () =>
    fetch("http://localhost:3001/api/events/proposal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `sb-${ref}-auth-token=${encodeURIComponent(cookieVal)}`,
      },
      body: JSON.stringify(body),
    }).then(async (r) => ({ status: r.status, body: await r.json() }));

  const first = await post();
  const second = await post();
  const raw = `${body.partnerLocationId}|${body.startDate}|${body.partySize}`;
  const idempotencyKey = `ep-${createHash("sha256").update(raw).digest("hex").slice(0, 32)}`;

  const db = createClient(url, serviceKey);
  const { count } = await db
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("idempotency_key", idempotencyKey)
    .eq("booking_type", "event");
  const { data: row } = await db
    .from("bookings")
    .select("id, idempotency_key, partner_status, booking_type, user_id")
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();

  const result = {
    task: "SAN-869 · VEB-MVP-004 — Bookings Idempotency Migration",
    at: new Date().toISOString(),
    firstSubmit: first,
    secondSubmit: second,
    idempotencyKey,
    rowCount: count,
    bookingRow: row,
    pass:
      first.status === 200 &&
      second.status === 409 &&
      count === 1 &&
      row?.booking_type === "event",
  };

  fs.mkdirSync(path.dirname(EVIDENCE), { recursive: true });
  fs.writeFileSync(EVIDENCE, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  if (!result.pass) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
