import { NextResponse } from "next/server";
import { insertVenueBookingRequest } from "@/lib/venues/venue-booking-core";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

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
        error: { message: "Sign in to request a booking." },
      },
      { status: 401 },
    );
  }

  const result = await insertVenueBookingRequest(supabase, user.id, body);

  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: { message: result.message } },
      { status: result.status },
    );
  }

  return NextResponse.json({
    success: true,
    requestId: result.data.requestId,
    message: result.data.message,
  });
}
