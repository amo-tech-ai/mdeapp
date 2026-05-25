import { createClient } from "@/lib/supabase/server";
import type { TripItemRow, TripWorkspaceData } from "./trip-item-types";

type TripItemQueryRow = {
  id: string;
  item_type: TripItemRow["item_type"];
  title: string;
  description: string | null;
  start_at: string | null;
  end_at: string | null;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
};

/** Load trip header, items, and stored conflicts (RLS-scoped). */
export async function loadTripWorkspace(
  tripId: string,
  userId: string,
): Promise<TripWorkspaceData | null> {
  const supabase = await createClient();

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select(
      "id, title, description, destination, start_date, end_date, status, budget, currency",
    )
    .eq("id", tripId)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .maybeSingle();

  if (tripError || !trip) return null;

  const { data: items, error: itemsError } = await supabase
    .from("trip_items")
    .select(
      "id, item_type, title, description, start_at, end_at, location_name, latitude, longitude",
    )
    .eq("trip_id", tripId)
    .order("start_at", { ascending: true, nullsFirst: false });

  if (itemsError) {
    console.error("[trips] loadTripWorkspace items:", itemsError.message);
  }

  const { data: conflicts, error: conflictsError } = await supabase
    .from("conflict_resolutions")
    .select("id, title, description, status, severity, affected_items")
    .eq("trip_id", tripId)
    .in("status", ["detected", "pending_review"])
    .order("severity", { ascending: false });

  if (conflictsError) {
    console.error("[trips] loadTripWorkspace conflicts:", conflictsError.message);
  }

  return {
    ...trip,
    items: ((items ?? []) as TripItemQueryRow[]).map((row) => ({
      id: row.id,
      item_type: row.item_type,
      title: row.title,
      description: row.description,
      start_at: row.start_at,
      end_at: row.end_at,
      location_name: row.location_name,
      latitude: row.latitude != null ? Number(row.latitude) : null,
      longitude: row.longitude != null ? Number(row.longitude) : null,
    })),
    conflicts: conflicts ?? [],
  };
}
