import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { scheduleViewingInputSchema } from "@/lib/leads/schedule-viewing-schema";
import { createClient } from "@/lib/supabase/server";
import {
  getSupabaseAnonAuthHeaders,
  getSupabaseFunctionsBaseUrl,
} from "@/lib/supabase/edge-functions";

function buildScheduleIdempotencyKey(input: {
  listingId: string;
  email: string;
  name: string;
  preferredAt?: string;
}): string {
  const raw = [
    input.listingId,
    input.email.toLowerCase(),
    input.name.trim().toLowerCase(),
    input.preferredAt ?? "",
  ].join("|");
  const digest = createHash("sha256").update(raw).digest("hex").slice(0, 32);
  return `sv-${digest}`;
}

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

  const parsed = scheduleViewingInputSchema.safeParse(body);
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
  const supabase = await createClient();
  // Guest lead capture: no 401 when logged out — edge receives anon JWT (AUTH-004).
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const edgeRes = await fetch(
    `${getSupabaseFunctionsBaseUrl()}/chat-lead-capture`,
    {
      method: "POST",
      headers: getSupabaseAnonAuthHeaders(session?.access_token),
      body: JSON.stringify({
        intent: "rental",
        source: "form",
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        neighborhood: data.neighborhood,
        listing_id: data.listingId,
        listing_title: data.listingTitle,
        preferred_at: data.preferredAt ?? null,
        trip_id: data.tripId ?? null,
        idempotency_key: buildScheduleIdempotencyKey({
          listingId: data.listingId,
          email: data.email,
          name: data.name,
          preferredAt: data.preferredAt,
        }),
      }),
    },
  );

  const edgeJson = (await edgeRes.json()) as {
    success?: boolean;
    data?: {
      lead_id?: string;
      showing_id?: string;
      actions?: Array<{ payload?: { message?: string } }>;
    };
    error?: { message?: string };
  };

  if (!edgeRes.ok || !edgeJson.success || !edgeJson.data?.lead_id) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: edgeJson.error?.message ?? "Lead capture failed",
        },
      },
      { status: edgeRes.status >= 400 ? edgeRes.status : 502 },
    );
  }

  const message =
    edgeJson.data.actions?.[0]?.payload?.message ??
    "Viewing request received — we will reach out within 24h.";

  return NextResponse.json({
    success: true,
    leadId: edgeJson.data.lead_id,
    showingId: edgeJson.data.showing_id,
    message,
  });
}
