/**
 * lead-from-form — Landlord V1 D7.5.
 *
 * Renter clicks "Contact Host" on /apartments/:id, fills 3 fields
 * (name, when-moving, optional message), and submits. We:
 *
 *   1. Validate (Zod) + honeypot check + rate limit.
 *   2. Look up apartment → landlord_id → landlord_profiles.whatsapp_e164.
 *   3. Insert a `landlord_inbox` row (channel='form', structured_profile
 *      with the move-when answer + name).
 *   4. Return the listing_url + landlord whatsapp number so the client
 *      can build the wa.me link and open it in a new tab.
 *
 * Auth: verify_jwt: false. Anon renters need to message hosts without
 * having to sign up first — that's a key insight from §1 of the V1 plan
 * (we minimise pre-message friction). The honeypot + rate limit + edge
 * function (instead of direct insert) are what guard against spam.
 *
 * Rate limit: 5 requests / 15 min / IP, durable. Conservative for V1
 * cohort (~25-50 listings, 100-200 leads target across the whole
 * platform). Bumps if real-world traffic flags it as too tight.
 */

import { z } from "https://esm.sh/zod@3.23.8";
import {
  getCorsHeaders,
  jsonResponse,
  errorBody,
} from "../_shared/http.ts";
import { getServiceClient } from "../_shared/supabase-clients.ts";
import { allowRateDurable } from "../_shared/rate-limit.ts";
import { loadTwilioConfig, sendWhatsApp } from "../_shared/twilio-whatsapp.ts";
import { renderNewLeadMessage } from "../_shared/lead-notify-templates.ts";

const PayloadSchema = z.object({
  apartment_id: z.string().uuid(),
  /** Renter's name. Falls back to "Anonymous" if omitted. */
  name: z.string().min(1).max(60),
  /** When they want to move. Maps to landlord_inbox.structured_profile.move_when. */
  move_when: z.enum(["now", "soon", "later"]),
  /** Optional free-text note from the renter. */
  message: z.string().max(1000).optional(),
  /** Honeypot field. Real users don't see it; bots fill it. We accept
   * ANY string here so the schema doesn't reject (and signal) the trap;
   * the suppress logic below handles non-empty values silently. */
  website: z.string().optional(),
  /** Anon-session id from the client (header-or-body), used for per-session rate limit. */
  anon_session_id: z.string().max(60).optional(),
});

type Payload = z.infer<typeof PayloadSchema>;

interface ApartmentRow {
  id: string;
  title: string;
  neighborhood: string;
  city: string;
  landlord_id: string | null;
}

interface LandlordRow {
  id: string;
  whatsapp_e164: string | null;
  display_name: string;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ?? "unknown";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }
  if (req.method !== "POST") {
    return jsonResponse(
      errorBody("METHOD_NOT_ALLOWED", "Use POST"),
      405,
      req,
    );
  }

  // 1. Parse + validate body. Reject malformed first so we don't waste
  // a rate-limit slot on garbage requests.
  let payload: Payload;
  try {
    const json = await req.json();
    payload = PayloadSchema.parse(json);
  } catch (err) {
    return jsonResponse(
      errorBody(
        "INVALID_PAYLOAD",
        "Form payload didn't validate",
        err instanceof z.ZodError ? err.flatten() : String(err),
      ),
      400,
      req,
    );
  }

  // 2. Honeypot — quietly accept-and-discard so bots don't probe for
  // the rejection signal. Status 200, no DB write, nothing in the
  // landlord's inbox. Returning 200 prevents bots from learning the
  // honeypot exists.
  if (payload.website && payload.website.length > 0) {
    return jsonResponse(
      { success: true, data: { suppressed: true } },
      200,
      req,
    );
  }

  // 3. Rate limit. Two keys: per-IP (covers most bots) and per
  // anon-session (covers shared-IP cases like coworking + university WiFi).
  const service = getServiceClient();
  const ip = clientIp(req);
  const ipRate = await allowRateDurable(
    service,
    `lead-from-form:ip:${ip}`,
    5,
    900,
  );
  if (!ipRate.allowed) {
    return jsonResponse(
      errorBody(
        "RATE_LIMITED",
        "Too many inquiries from this network. Wait 15 minutes.",
        { retry_after_seconds: ipRate.retry_after_seconds },
      ),
      429,
      req,
    );
  }
  if (payload.anon_session_id) {
    const sessRate = await allowRateDurable(
      service,
      `lead-from-form:sess:${payload.anon_session_id}`,
      20,
      3600,
    );
    if (!sessRate.allowed) {
      return jsonResponse(
        errorBody(
          "RATE_LIMITED",
          "Too many inquiries from this session. Wait an hour.",
          { retry_after_seconds: sessRate.retry_after_seconds },
        ),
        429,
        req,
      );
    }
  }

  // 4. Look up the apartment + its landlord. Service role because the
  // caller is anon and the renter shouldn't need read access to
  // landlord_profiles.whatsapp_e164.
  const { data: apt, error: aptErr } = await service
    .from("apartments")
    .select("id, title, neighborhood, city, landlord_id")
    .eq("id", payload.apartment_id)
    .maybeSingle<ApartmentRow>();
  if (aptErr) {
    console.error("lead-from-form apartment lookup error:", aptErr);
    return jsonResponse(
      errorBody("APARTMENT_LOOKUP_FAILED", aptErr.message),
      500,
      req,
    );
  }
  if (!apt) {
    return jsonResponse(
      errorBody("APARTMENT_NOT_FOUND", "Listing was deleted or never existed"),
      404,
      req,
    );
  }
  if (!apt.landlord_id) {
    // Legacy seeded apartments don't have a landlord_id. The frontend
    // should never call us for those; if it does, surface a clear error
    // so we can fix the routing instead of silently failing.
    return jsonResponse(
      errorBody(
        "NO_DIRECT_LANDLORD",
        "This listing isn't part of the V1 landlord cohort yet. Use the chat to ask the mdeai team.",
      ),
      409,
      req,
    );
  }

  const { data: landlord, error: landlordErr } = await service
    .from("landlord_profiles")
    .select("id, whatsapp_e164, display_name")
    .eq("id", apt.landlord_id)
    .maybeSingle<LandlordRow>();
  if (landlordErr) {
    console.error("lead-from-form landlord lookup error:", landlordErr);
    return jsonResponse(
      errorBody("LANDLORD_LOOKUP_FAILED", landlordErr.message),
      500,
      req,
    );
  }
  if (!landlord || !landlord.whatsapp_e164) {
    return jsonResponse(
      errorBody(
        "LANDLORD_NO_WHATSAPP",
        "This host hasn't added a WhatsApp number yet.",
      ),
      409,
      req,
    );
  }

  // 5. INSERT landlord_inbox row. raw_message gets the user's note (or a
  // placeholder); structured_profile carries the form metadata so D8's
  // lead-classify can skip re-extraction for form-channel rows.
  const trimmed = payload.message?.trim() ?? "";
  const rawMessage = trimmed.length > 0
    ? trimmed
    : `(no message — clicked Contact Host with move-when=${payload.move_when})`;
  const renterName = payload.name.trim();

  const { data: inboxRow, error: insertErr } = await service
    .from("landlord_inbox")
    .insert({
      landlord_id: landlord.id,
      apartment_id: apt.id,
      channel: "form",
      renter_name: renterName,
      raw_message: rawMessage,
      structured_profile: {
        source: "contact-host-form",
        move_when: payload.move_when,
        renter_name: renterName,
        apartment_title: apt.title,
        apartment_neighborhood: apt.neighborhood,
      },
      status: "new",
    })
    .select("id")
    .single();
  if (insertErr) {
    console.error("lead-from-form insert error:", insertErr);
    return jsonResponse(
      errorBody("INSERT_FAILED", insertErr.message),
      500,
      req,
    );
  }

  // 6. Fire WhatsApp notification fire-and-forget. Failures are LOGGED
  // ONLY — never block the request, never retry. The lead is already in
  // the inbox; landlord sees it on next dashboard open as a fallback.
  fireWhatsAppNotification({
    landlordPhone: landlord.whatsapp_e164,
    landlordName: landlord.display_name,
    renterName,
    apartmentTitle: apt.title,
    apartmentNeighborhood: apt.neighborhood,
    moveWhen: payload.move_when,
    messageSnippet: rawMessage,
    leadId: inboxRow.id,
    service,
  }).catch((err) => {
    console.warn("[lead-from-form] WhatsApp dispatch failed:", err);
  });

  return jsonResponse(
    {
      success: true,
      data: {
        lead_id: inboxRow.id,
        whatsapp_e164: landlord.whatsapp_e164,
        landlord_display_name: landlord.display_name,
        apartment: {
          id: apt.id,
          title: apt.title,
          neighborhood: apt.neighborhood,
        },
      },
    },
    201,
    req,
  );
});

interface FireWhatsAppArgs {
  landlordPhone: string;
  landlordName: string;
  renterName: string;
  apartmentTitle: string;
  apartmentNeighborhood: string;
  moveWhen: "now" | "soon" | "later";
  messageSnippet: string;
  leadId: string;
  // deno-lint-ignore no-explicit-any
  service: any;
}

async function fireWhatsAppNotification(args: FireWhatsAppArgs): Promise<void> {
  const config = loadTwilioConfig(/* useSandbox */ true);
  if (!config) {
    console.warn("[lead-from-form] Twilio config missing — skipping WhatsApp send");
    return;
  }
  const baseUrl = Deno.env.get("MDEAI_PUBLIC_URL") ?? "https://mdeai.co";
  const leadUrl = `${baseUrl}/host/leads`;
  const body = renderNewLeadMessage({
    landlordFirstName: args.landlordName.split(" ")[0] ?? "Anfitrión",
    renterName: args.renterName,
    apartmentTitle: args.apartmentTitle,
    apartmentNeighborhood: args.apartmentNeighborhood,
    moveWhen: args.moveWhen,
    messageSnippet: args.messageSnippet,
    leadUrl,
  });
  const result = await sendWhatsApp(config, {
    toE164: args.landlordPhone,
    body,
  });
  if (result.ok) {
    console.log(
      `[lead-from-form] WhatsApp sent — sid=${result.sid} to=${args.landlordPhone}`,
    );
    // Stamp whatsapp_sent_at so the reminder tick won't re-fire as a
    // first-send. Best-effort; failure here is fine.
    await args.service
      .from("landlord_inbox")
      .update({ whatsapp_sent_at: new Date().toISOString() })
      .eq("id", args.leadId);
  } else {
    console.warn(
      `[lead-from-form] WhatsApp send failed — code=${result.errorCode} msg=${result.errorMessage}`,
    );
  }
}
