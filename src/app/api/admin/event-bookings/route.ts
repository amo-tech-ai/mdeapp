import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  listEventBookingRequests,
  decideEventBooking,
  type EventBookingDecision,
} from "@/lib/events/admin-event-bookings-core";

/**
 * SAN-502 · EVT-043 — Patricia admin queue (event requests).
 * Admin-only API for the /admin/event-bookings page:
 *   GET  → list event proposals
 *   POST → approve / decline / needs_info on one proposal
 * Gated by auth + the is_admin() RPC; the user-scoped client keeps RLS in force.
 */

type Gate =
  | {
      ok: true;
      supabase: Awaited<ReturnType<typeof createClient>>;
      userId: string;
    }
  | { ok: false; status: number; message: string };

async function requireAdmin(): Promise<Gate> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, status: 401, message: "Sign in." };
  }
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) {
    return { ok: false, status: 403, message: "Admin access required." };
  }
  return { ok: true, supabase, userId: user.id };
}

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json(
      { success: false, error: { message: gate.message } },
      { status: gate.status },
    );
  }

  const result = await listEventBookingRequests(gate.supabase);
  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: { message: result.message } },
      { status: result.status },
    );
  }
  return NextResponse.json({ success: true, requests: result.data });
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

  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json(
      { success: false, error: { message: gate.message } },
      { status: gate.status },
    );
  }

  const { bookingId, decision, note } = (body ?? {}) as {
    bookingId?: string;
    decision?: EventBookingDecision;
    note?: string;
  };
  if (!bookingId || !decision) {
    return NextResponse.json(
      { success: false, error: { message: "Missing bookingId or decision" } },
      { status: 400 },
    );
  }

  const result = await decideEventBooking(
    gate.supabase,
    bookingId,
    decision,
    gate.userId,
    note,
  );
  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: { message: result.message } },
      { status: result.status },
    );
  }
  return NextResponse.json({
    success: true,
    bookingId: result.data.bookingId,
    partnerStatus: result.data.partnerStatus,
  });
}
