import type { TripItemRow } from "./trip-item-types";

export type ItineraryDayGroup = {
  dayKey: string;
  label: string;
  items: TripItemRow[];
};

export type ScheduleOverlap = {
  id: string;
  dayKey: string;
  dayLabel: string;
  itemAId: string;
  itemBId: string;
  itemATitle: string;
  itemBTitle: string;
  message: string;
};

const UNSCHEDULED_KEY = "unscheduled";

function parseDateOnly(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

function dayKeyFromIso(iso: string): string {
  return iso.slice(0, 10);
}

function formatDayLabel(dayKey: string): string {
  if (dayKey === UNSCHEDULED_KEY) return "Unscheduled";
  const fmt = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return fmt.format(parseDateOnly(dayKey));
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

/** Group trip_items by calendar day (local date from start_at). */
export function groupTripItemsByDay(items: TripItemRow[]): ItineraryDayGroup[] {
  const buckets = new Map<string, TripItemRow[]>();

  for (const item of items) {
    const key = item.start_at ? dayKeyFromIso(item.start_at) : UNSCHEDULED_KEY;
    const list = buckets.get(key) ?? [];
    list.push(item);
    buckets.set(key, list);
  }

  const keys = [...buckets.keys()].sort((a, b) => {
    if (a === UNSCHEDULED_KEY) return 1;
    if (b === UNSCHEDULED_KEY) return -1;
    return a.localeCompare(b);
  });

  return keys.map((dayKey) => ({
    dayKey,
    label: formatDayLabel(dayKey),
    items: (buckets.get(dayKey) ?? []).sort((a, b) => {
      const ta = a.start_at ? new Date(a.start_at).getTime() : 0;
      const tb = b.start_at ? new Date(b.start_at).getTime() : 0;
      return ta - tb;
    }),
  }));
}

function itemWindow(item: TripItemRow): { start: number; end: number } | null {
  if (!item.start_at) return null;
  const start = new Date(item.start_at).getTime();
  const end = item.end_at
    ? new Date(item.end_at).getTime()
    : start + 60 * 60 * 1000;
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  return { start, end };
}

/** Detect time overlaps among scheduled items on the same day. */
export function detectScheduleOverlaps(
  items: TripItemRow[],
): ScheduleOverlap[] {
  const overlaps: ScheduleOverlap[] = [];
  const groups = groupTripItemsByDay(items).filter((g) => g.dayKey !== UNSCHEDULED_KEY);

  for (const group of groups) {
    const scheduled = group.items.filter((i) => i.start_at);
    for (let i = 0; i < scheduled.length; i++) {
      for (let j = i + 1; j < scheduled.length; j++) {
        const a = scheduled[i];
        const b = scheduled[j];
        const wa = itemWindow(a);
        const wb = itemWindow(b);
        if (!wa || !wb) continue;
        if (wa.start >= wb.end || wb.start >= wa.end) continue;

        overlaps.push({
          id: `${a.id}:${b.id}`,
          dayKey: group.dayKey,
          dayLabel: group.label,
          itemAId: a.id,
          itemBId: b.id,
          itemATitle: a.title,
          itemBTitle: b.title,
          message: `${formatTime(a.start_at!)} ${a.title} overlaps ${formatTime(b.start_at!)} ${b.title}`,
        });
      }
    }
  }

  return overlaps;
}

export function formatItemTimeRange(item: TripItemRow): string {
  if (!item.start_at) return "Time TBD";
  const start = formatTime(item.start_at);
  if (!item.end_at) return start;
  return `${start} – ${formatTime(item.end_at)}`;
}

export function itemTypeLabel(type: TripItemRow["item_type"]): string {
  const labels: Record<TripItemRow["item_type"], string> = {
    event: "Event",
    restaurant: "Restaurant",
    rental: "Rental",
    poi: "Place",
    other: "Other",
  };
  return labels[type] ?? type;
}
