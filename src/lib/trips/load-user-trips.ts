import { createClient } from "@/lib/supabase/server";

export type TripStatus = "planning" | "active" | "completed" | "cancelled";

export type UserTripRow = {
  id: string;
  title: string;
  description: string | null;
  destination: string | null;
  start_date: string;
  end_date: string;
  status: TripStatus;
  budget: number | null;
  currency: string | null;
  item_count: number;
};

type TripQueryRow = {
  id: string;
  title: string;
  description: string | null;
  destination: string | null;
  start_date: string;
  end_date: string;
  status: TripStatus;
  budget: number | null;
  currency: string | null;
  trip_items: Array<{ count: number }> | null;
};

/** Load non-deleted trips for the authenticated user (RLS-scoped). */
export async function loadUserTrips(userId: string): Promise<UserTripRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select(
      "id, title, description, destination, start_date, end_date, status, budget, currency, trip_items(count)",
    )
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("[trips] loadUserTrips:", error.message);
    return [];
  }

  return ((data ?? []) as TripQueryRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    destination: row.destination,
    start_date: row.start_date,
    end_date: row.end_date,
    status: row.status,
    budget: row.budget,
    currency: row.currency,
    item_count: row.trip_items?.[0]?.count ?? 0,
  }));
}

export function formatTripDateRange(start: string, end: string): string {
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });
  const parseDateOnly = (iso: string) => {
    const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  try {
    return `${fmt.format(parseDateOnly(start))} – ${fmt.format(parseDateOnly(end))}`;
  } catch {
    return `${start} – ${end}`;
  }
}
