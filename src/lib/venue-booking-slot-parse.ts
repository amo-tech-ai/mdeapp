/** Parse natural-language venue booking slots from concierge chat (Class U + Tourist prompts). */

const BOGOTA_OFFSET = "-05:00";

export type ParsedVenueBookingSlots = {
  venueName?: string;
  partySize?: number;
  contactName?: string;
  contactEmail?: string;
  requestedAtIso?: string;
};

const CONTACT_RE =
  /\bcontact\s+(.+?)\s+at\s+([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})\b/i;
const PARTY_RE = /\b(?:party\s+of|for)\s+(\d{1,2})\b/i;
const PLACE_ID_RE = /\bplace[_\s-]?id:\s*([A-Za-z0-9_-]+)/i;

const EXPLICIT_DATE_RE =
  /\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+([a-z]+)\s+(\d{1,2})\s+(\d{4})\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i;

const WEEKDAY_TIME_RE =
  /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i;

const WEEKDAY_ONLY_TIME_RE =
  /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i;

const VENUE_NAME_RE =
  /\b(?:book|reserve|reservation(?:\s+at)?)\s+(?:a\s+table\s+at\s+)?(.+?)(?=\s+(?:on\s+)?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)|\s+for\s+\d|\s+party\s+of|\s+contact\b|$)/i;

function weekdayIndex(name: string): number {
  const map: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  return map[name.toLowerCase()] ?? -1;
}

function monthIndex(name: string): number {
  const map: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };
  return map[name.toLowerCase()] ?? -1;
}

function to24Hour(hour: number, ampm?: string): number {
  if (!ampm) return hour;
  const lower = ampm.toLowerCase();
  if (lower === "pm" && hour < 12) return hour + 12;
  if (lower === "am" && hour === 12) return 0;
  return hour;
}

function formatIso(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): string {
  const y = String(year);
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  const h = String(hour).padStart(2, "0");
  const min = String(minute).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}:00${BOGOTA_OFFSET}`;
}

function nextWeekdayAt(
  weekday: number,
  hour: number,
  minute: number,
  now = new Date(),
): string {
  const base = new Date(now);
  base.setHours(12, 0, 0, 0);
  const current = base.getDay();
  let delta = (weekday - current + 7) % 7;
  if (delta === 0) delta = 7;
  base.setDate(base.getDate() + delta);
  return formatIso(
    base.getFullYear(),
    base.getMonth(),
    base.getDate(),
    hour,
    minute,
  );
}

export function parseRequestedAtIso(text: string, now = new Date()): string | undefined {
  const explicit = text.match(EXPLICIT_DATE_RE);
  if (explicit) {
    const [, monthName, dayStr, yearStr, hourStr, minuteStr, ampm] = explicit;
    const month = monthIndex(monthName);
    const day = Number(dayStr);
    const year = Number(yearStr);
    const hour = to24Hour(Number(hourStr), ampm);
    const minute = minuteStr ? Number(minuteStr) : 0;
    if (month >= 0 && day > 0 && year > 2000) {
      return formatIso(year, month, day, hour, minute);
    }
  }

  const weekdayAt = text.match(WEEKDAY_TIME_RE) ?? text.match(WEEKDAY_ONLY_TIME_RE);
  if (weekdayAt) {
    const [, dayName, hourStr, minuteStr, ampm] = weekdayAt;
    const wd = weekdayIndex(dayName);
    if (wd >= 0) {
      const hour = to24Hour(Number(hourStr), ampm);
      const minute = minuteStr ? Number(minuteStr) : 0;
      return nextWeekdayAt(wd, hour, minute, now);
    }
  }

  return undefined;
}

export function parseVenueBookingSlots(text: string): ParsedVenueBookingSlots {
  const trimmed = text.trim();
  const slots: ParsedVenueBookingSlots = {};

  const placeIdMatch = trimmed.match(PLACE_ID_RE);
  if (placeIdMatch) {
    return { venueName: placeIdMatch[1] };
  }

  const contact = trimmed.match(CONTACT_RE);
  if (contact) {
    slots.contactName = contact[1].trim();
    slots.contactEmail = contact[2].trim();
  }

  const party = trimmed.match(PARTY_RE);
  if (party) {
    slots.partySize = Number(party[1]);
  }

  const venue = trimmed.match(VENUE_NAME_RE);
  if (venue) {
    slots.venueName = venue[1].replace(/[.,!?]+$/, "").trim();
  }

  slots.requestedAtIso = parseRequestedAtIso(trimmed);

  return slots;
}

export function extractExplicitPlaceId(text: string): string | undefined {
  return text.match(PLACE_ID_RE)?.[1];
}
