import { NextResponse } from "next/server";
import { insertEventProposal } from "@/lib/events/event-venue-booking-core";
import { startAdminReviewWorkflow } from "@/lib/events/start-admin-review-workflow";
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

  let result: Awaited<ReturnType<typeof insertEventProposal>>;
  try {
    result = await insertEventProposal(supabase, user.id, body);
  } catch (error) {
    // The core is designed to return { ok: false } rather than throw, but guard
    // an unexpected rejection so callers get the structured JSON 500, not an
    // HTML error page.
    console.error("[POST /api/events/proposal] unexpected error", error);
    return NextResponse.json(
      {
        success: false,
        error: { message: "An unexpected error occurred. Please try again." },
      },
      { status: 500 },
    );
  }

  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: { message: result.message } },
      { status: result.status },
    );
  }

  void startAdminReviewWorkflow({
    bookingId: result.data.bookingId,
    userId: user.id,
  });

  return NextResponse.json({
    success: true,
    bookingId: result.data.bookingId,
    message: result.data.message,
  });
}
