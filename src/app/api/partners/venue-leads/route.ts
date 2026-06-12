import { NextResponse } from "next/server";

import { venueLeadInputSchema } from "@/lib/partners/venue-lead-schema";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

/**
 * SAN-661 · MKT — For Venues landing (/venues) inline lead form.
 *
 * Guest-friendly partner lead capture (no 401 when logged out — a venue owner
 * fills the form before signing up). Writes to public.leads via the service
 * role (F13 carve-out: server-only route, leads insert is RLS-blocked for anon)
 * with intent "host" + metadata.partner_kind "venue" so Patricia's CRM picks it
 * up alongside chat leads.
 *
 * Follow-up (P2): durable rate limiting + idempotency key (see schedule-viewing
 * edge flow). Phase 1 relies on the client disabling submit while in flight.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { message: "Invalid JSON" } },
      { status: 400 },
    );
  }

  const parsed = venueLeadInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: { message: "Validation failed", details: parsed.error.flatten() },
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Optional identity: links the lead to a profile if the owner is already
  // signed in, but a logged-out guest still captures (user_id stays null).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const service = createServiceRoleClient();
  if (!service) {
    console.error("[/api/partners/venue-leads] service role client unavailable");
    return NextResponse.json(
      { success: false, error: { message: "Lead capture unavailable" } },
      { status: 503 },
    );
  }

  const { data: lead, error } = await service
    .from("leads")
    .insert({
      user_id: user?.id ?? null,
      intent: "host",
      email: data.email,
      name: data.name,
      source: "form",
      status: "new",
      metadata: {
        partner_kind: "venue",
        venue_name: data.venueName,
        venue_type: data.venueType,
        message: data.message ?? null,
        page_variant: data.variant ?? "default",
        source_page: "venues-landing",
      },
    })
    .select("id")
    .single();

  if (error || !lead) {
    console.error("[/api/partners/venue-leads] insert error:", error?.message);
    return NextResponse.json(
      { success: false, error: { message: "Could not save your request" } },
      { status: 502 },
    );
  }

  console.log(
    `[venue-lead] id=${lead.id} type=${data.venueType} email=${data.email}`,
  );

  return NextResponse.json({
    success: true,
    leadId: lead.id,
    message: "Thanks — we'll be in touch within 1 business day.",
  });
}
