import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DATA_PENDING_LABEL, formatBrokerMetric } from "@/lib/rentals/data-pending";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: apartmentId } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: apartment, error: aptError } = await supabase
    .from("apartments")
    .select("id, landlord_id")
    .eq("id", apartmentId)
    .maybeSingle();

  if (aptError) {
    return NextResponse.json({ error: "Failed to load listing" }, { status: 500 });
  }

  if (!apartment) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("landlord_profiles")
    .select("id")
    .eq("user_id", user.id);

  if (profilesError) {
    return NextResponse.json({ error: "Failed to load broker profile" }, { status: 500 });
  }

  const ownedIds = new Set((profiles ?? []).map((p) => p.id));
  if (!apartment.landlord_id || !ownedIds.has(apartment.landlord_id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [{ data: leads, error: leadsError }, { data: showings, error: showingsError }] =
    await Promise.all([
      supabase
        .from("leads")
        .select("id, name, status, created_at, budget_max")
        .eq("apartment_id", apartmentId)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("showings")
        .select("id, scheduled_at, status, lead_id")
        .eq("apartment_id", apartmentId)
        .order("scheduled_at", { ascending: true })
        .limit(20),
    ]);

  if (leadsError || showingsError) {
    return NextResponse.json({ error: "Failed to load listing detail" }, { status: 500 });
  }

  return NextResponse.json({
    leads: (leads ?? []).map((lead) => ({
      id: lead.id,
      name: lead.name,
      status: lead.status,
      createdAt: lead.created_at,
      budgetMax: lead.budget_max,
    })),
    showings: (showings ?? []).map((showing) => ({
      id: showing.id,
      scheduledAt: showing.scheduled_at,
      status: showing.status,
      leadId: showing.lead_id,
    })),
    performance: {
      views: DATA_PENDING_LABEL,
      inquiries: DATA_PENDING_LABEL,
      formattedViews: formatBrokerMetric(null),
      formattedInquiries: formatBrokerMetric(null),
    },
  });
}
