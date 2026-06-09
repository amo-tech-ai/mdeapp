/**
 * lead-reminder-tick — Landlord V1 D11.5.
 *
 * pg_cron fires this every 5 minutes. We:
 *
 *   1. Authenticate the request via X-Cron-Secret header (the secret
 *      lives both in the cron.job statement + as an edge fn secret so
 *      we can rotate without touching the cron schedule).
 *   2. SELECT landlord_inbox rows that:
 *        - status='new'              (landlord hasn't acted)
 *        - reminder_sent_at IS NULL  (we haven't nudged yet)
 *        - created_at < now() - 30 minutes
 *      Limit 25/tick so a backlog can't take down the function.
 *   3. UPDATE-RETURNING reminder_sent_at FIRST so a parallel tick can't
 *      double-fire. The send happens AFTER the row is reserved.
 *   4. For each reserved lead, call Twilio. Failures logged only — no
 *      retry, no requeue (per scope: "skip retries").
 *
 * Auth: verify_jwt:false (registered in supabase/config.toml). Cron
 * runs without a JWT.
 */

import {
  jsonResponse,
  errorBody,
  getCorsHeaders,
} from "../_shared/http.ts";
import { getServiceClient } from "../_shared/supabase-clients.ts";
import { loadTwilioConfig, sendWhatsApp } from "../_shared/twilio-whatsapp.ts";
import { renderReminderMessage } from "../_shared/lead-notify-templates.ts";

const REMINDER_DELAY_MINUTES = 30;
const BATCH_SIZE = 25;

interface DueLeadRow {
  id: string;
  renter_name: string | null;
  raw_message: string;
  apartment_id: string | null;
  landlord_id: string;
  created_at: string;
  structured_profile: Record<string, unknown>;
  apartments: { title: string } | null;
  landlord_profiles: { display_name: string; whatsapp_e164: string | null } | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  // 1. Cron auth.
  const expected = Deno.env.get("LEAD_REMINDER_CRON_SECRET");
  const provided = req.headers.get("X-Cron-Secret");
  if (!expected || !provided || expected !== provided) {
    return jsonResponse(
      errorBody("UNAUTHORIZED", "Bad or missing X-Cron-Secret"),
      401,
      req,
    );
  }

  const service = getServiceClient();
  const cutoff = new Date(
    Date.now() - REMINDER_DELAY_MINUTES * 60 * 1000,
  ).toISOString();

  // 2. Reserve a batch of due rows in one round-trip. We UPDATE first
  // (set reminder_sent_at to claim the row) then RETURN the data we
  // need. This makes parallel ticks safe — only one tick wins for each
  // row.
  const { data: claimed, error: claimErr } = await service
    .from("landlord_inbox")
    .update({ reminder_sent_at: new Date().toISOString() })
    .eq("status", "new")
    .is("reminder_sent_at", null)
    .lt("created_at", cutoff)
    .select(
      `id, renter_name, raw_message, apartment_id, landlord_id, created_at,
       structured_profile,
       apartments(title),
       landlord_profiles(display_name, whatsapp_e164)`,
    )
    .limit(BATCH_SIZE)
    .returns<DueLeadRow[]>();

  if (claimErr) {
    console.error("lead-reminder-tick claim error:", claimErr);
    return jsonResponse(
      errorBody("CLAIM_FAILED", claimErr.message),
      500,
      req,
    );
  }
  const rows = claimed ?? [];
  if (rows.length === 0) {
    return jsonResponse({ success: true, claimed: 0, sent: 0 }, 200, req);
  }

  // 3. Send each. Failures are logged — no requeue (scope: skip retries).
  const config = loadTwilioConfig(/* useSandbox */ true);
  if (!config) {
    console.warn(
      `[lead-reminder-tick] Twilio config missing — claimed ${rows.length} rows but didn't send`,
    );
    return jsonResponse(
      { success: true, claimed: rows.length, sent: 0, reason: "twilio_not_configured" },
      200,
      req,
    );
  }

  const baseUrl = Deno.env.get("MDEAI_PUBLIC_URL") ?? "https://mdeai.co";
  let sent = 0;
  for (const row of rows) {
    if (!row.landlord_profiles?.whatsapp_e164) {
      console.warn(`[lead-reminder-tick] lead=${row.id} skipped: no landlord whatsapp`);
      continue;
    }
    const ageLabel = relativeMinutes(row.created_at);
    const body = renderReminderMessage({
      landlordFirstName:
        (row.landlord_profiles?.display_name ?? "Anfitrión").split(" ")[0],
      renterName: row.renter_name ?? "Renter",
      apartmentTitle: row.apartments?.title ?? "tu apartamento",
      ageLabel,
      leadUrl: `${baseUrl}/host/leads`,
    });
    const r = await sendWhatsApp(config, {
      toE164: row.landlord_profiles.whatsapp_e164,
      body,
    });
    if (r.ok) {
      sent += 1;
      console.log(`[lead-reminder-tick] reminder sent — lead=${row.id} sid=${r.sid}`);
    } else {
      console.warn(
        `[lead-reminder-tick] send failed — lead=${row.id} code=${r.errorCode} msg=${r.errorMessage}`,
      );
    }
  }

  return jsonResponse(
    { success: true, claimed: rows.length, sent },
    200,
    req,
  );
});

function relativeMinutes(iso: string): string {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 60) return `${min} min`;
  const hr = Math.round(min / 60);
  return `${hr} h`;
}
