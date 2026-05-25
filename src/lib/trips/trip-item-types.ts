export type TripItemType = "event" | "restaurant" | "rental" | "poi" | "other";

export type TripItemRow = {
  id: string;
  item_type: TripItemType;
  title: string;
  description: string | null;
  start_at: string | null;
  end_at: string | null;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type TripConflictRow = {
  id: string;
  title: string;
  description: string;
  status: string;
  severity: number;
  affected_items: unknown;
};

export type TripWorkspaceData = {
  id: string;
  title: string;
  description: string | null;
  destination: string | null;
  start_date: string;
  end_date: string;
  status: string;
  budget: number | null;
  currency: string | null;
  items: TripItemRow[];
  conflicts: TripConflictRow[];
};
