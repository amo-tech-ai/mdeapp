import { NextResponse } from "next/server";
import { insertEventProposal } from "@/lib/events/event-venue-booking-core";
import { createClient } from "@/lib/supabase/server";

/**
 * SAN-496 · EVT-037 — Request proposal modal (HITL).
 * Server target for the proposal modal's submit: persists an event proposal
 * (bookings, booking_type='event') via the SAN-865 core. The user-scoped
 * Supabase client is passed through, so RLS governs the insert — no
 * service-role here.
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: { message: "Sign in to request an event proposal." },
      },
      { status: 401 },
    );
  }

  const result = await insertEventProposal(supabase, user.id, body);

  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: { message: result.message } },
      { status: result.status },
    );
  }

  return NextResponse.json({
    success: true,
    bookingId: result.data.bookingId,
    message: result.data.message,
  });
}
