/**
 * search-events — pure logic tests (no Supabase, no Mastra runtime)
 *
 * Tests cover:
 * 1. mapCategory — known DB event_type strings
 * 2. mapCategory — null / unknown falls back to "culture"
 * 3. extractNeighborhood — comma-separated address
 * 4. extractNeighborhood — null address falls back to city, then "Medellin"
 * 5. dateWindow('any') — returns empty bounds
 * 6. dateWindow('tonight') — gte ≤ lte, both today
 * 7. dateWindow('this_weekend') — gte is Friday, lte is Sunday
 * 8. dateWindow('this_week') — gte is Monday, lte is Sunday of same week
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  mapCategory,
  extractNeighborhood,
  dateWindow,
  BOGOTA_OFFSET_MS,
} from '../search-events.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Convert a UTC ISO string to a Bogota-local Date object (for day-of-week
 * assertions without relying on the host TZ env variable).
 */
function toBogotaDate(iso: string): Date {
  return new Date(new Date(iso).getTime() + BOGOTA_OFFSET_MS);
}

// ── mapCategory ───────────────────────────────────────────────────────────────

describe('mapCategory', () => {
  it('maps known DB event_type strings to the correct category', () => {
    expect(mapCategory('music')).toBe('music');
    expect(mapCategory('nightlife')).toBe('nightlife');
    expect(mapCategory('dance')).toBe('nightlife');
    expect(mapCategory('sport')).toBe('sport');
    expect(mapCategory('food')).toBe('food');
    expect(mapCategory('festival')).toBe('culture');
  });

  it('returns "culture" for null or unrecognised event_type', () => {
    expect(mapCategory(null)).toBe('culture');
    expect(mapCategory('unknown_type')).toBe('culture');
    expect(mapCategory('')).toBe('culture');
  });
});

// ── extractNeighborhood ───────────────────────────────────────────────────────

describe('extractNeighborhood', () => {
  it('extracts the first segment before the first comma', () => {
    expect(extractNeighborhood('El Poblado, Calle 10, Medellín', 'Medellín')).toBe('El Poblado');
    expect(extractNeighborhood('Laureles, Carrera 80', 'Medellín')).toBe('Laureles');
  });

  it('falls back to city when address is null, then "Medellin" when city is null', () => {
    expect(extractNeighborhood(null, 'Medellín')).toBe('Medellín');
    expect(extractNeighborhood(null, null)).toBe('Medellin');
  });
});

// ── dateWindow ────────────────────────────────────────────────────────────────

describe('dateWindow', () => {
  // Pin system clock to Wednesday 2026-05-13 14:00 UTC
  // → Bogota: 2026-05-13 09:00 (UTC-5), dayOfWeek = 3 (Wed)
  const FIXED_UTC_MS = Date.UTC(2026, 4, 13, 14, 0, 0); // month is 0-indexed

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_UTC_MS);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns empty bounds for "any" and undefined', () => {
    expect(dateWindow('any')).toEqual({});
    expect(dateWindow(undefined)).toEqual({});
  });

  it('tonight: gte ≤ lte, both fall on today (2026-05-13 in Bogota)', () => {
    const { gte, lte } = dateWindow('tonight');
    expect(gte).toBeDefined();
    expect(lte).toBeDefined();

    const gteDate = toBogotaDate(gte!);
    const lteDate = toBogotaDate(lte!);

    // Both must fall on 2026-05-13
    expect(gteDate.getUTCFullYear()).toBe(2026);
    expect(gteDate.getUTCMonth()).toBe(4); // May (0-indexed)
    expect(gteDate.getUTCDate()).toBe(13);

    expect(lteDate.getUTCDate()).toBe(13);

    // gte must be ≤ lte
    expect(new Date(gte!).getTime()).toBeLessThanOrEqual(new Date(lte!).getTime());
  });

  it('this_weekend: gte is Friday 2026-05-15, lte is Sunday 2026-05-17', () => {
    // Clock is Wed May 13 → upcoming weekend is Fri May 15 – Sun May 17
    const { gte, lte } = dateWindow('this_weekend');
    expect(gte).toBeDefined();
    expect(lte).toBeDefined();

    const gteLocal = toBogotaDate(gte!);
    const lteLocal = toBogotaDate(lte!);

    // Friday = day 5 (UTCDay on a Bogota-local Date)
    expect(gteLocal.getUTCDay()).toBe(5); // Friday
    expect(lteLocal.getUTCDay()).toBe(0); // Sunday

    // Dates
    expect(gteLocal.getUTCDate()).toBe(15); // May 15
    expect(lteLocal.getUTCDate()).toBe(17); // May 17
  });

  it('this_week: gte is Monday 2026-05-11, lte is Sunday 2026-05-17', () => {
    const { gte, lte } = dateWindow('this_week');
    expect(gte).toBeDefined();
    expect(lte).toBeDefined();

    const gteLocal = toBogotaDate(gte!);
    const lteLocal = toBogotaDate(lte!);

    expect(gteLocal.getUTCDay()).toBe(1); // Monday
    expect(lteLocal.getUTCDay()).toBe(0); // Sunday

    expect(gteLocal.getUTCDate()).toBe(11); // May 11
    expect(lteLocal.getUTCDate()).toBe(17); // May 17
  });
});
