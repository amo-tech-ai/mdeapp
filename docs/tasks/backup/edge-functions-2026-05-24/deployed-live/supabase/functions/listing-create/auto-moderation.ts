/**
 * Auto-moderation for landlord-submitted listings (V1 D5).
 *
 * Rules per tasks/plan/06-landlord-v1-30day.md §3.1, with conservative
 * thresholds — when in doubt, prefer `needs_review` over `auto_approved`.
 *
 * Verdict tiers:
 *   - 0 violations          -> auto_approved   (publishable immediately)
 *   - 1 violation           -> needs_review    (founder reviews; goes live optimistically)
 *   - 2 or more violations  -> rejected        (do not publish; return reasons)
 *
 * Pure function — no I/O, no Deno-only globals. Imported by the edge fn AND
 * by the deno test suite without runtime config.
 */

export type Verdict = "auto_approved" | "needs_review" | "rejected";

export interface ListingForModeration {
  description: string;
  latitude: number;
  longitude: number;
  price_monthly: number;
  currency: "COP" | "USD";
  photos_count: number;
}

export interface ModerationOutcome {
  verdict: Verdict;
  reasons: string[];
}

// Generous Medellín metropolitan-area bounding box. Captures Caldas →
// Bello (N-S) and the slopes of Envigado → San Cristóbal (E-W). False
// rejects are worse than false accepts at V1 scale, so we err wide.
const MEDELLIN_BBOX = {
  minLat: 6.05,
  maxLat: 6.45,
  minLng: -75.75,
  maxLng: -75.4,
} as const;

// COP-equivalent sanity range. Below 200k COP / 50 USD = scam or typo.
// Above 15M COP / 5k USD = luxury / commercial property — out of V1 scope.
const PRICE_RANGE = {
  COP: { min: 200_000, max: 15_000_000 },
  USD: { min: 50, max: 5_000 },
} as const;

const MIN_PHOTOS = 5;
const MIN_DESCRIPTION_CHARS = 80;

// Match "+57 300 123 4567", "300-123-4567", "(300) 1234567", "+13105551234"…
// Anchored to a digit run of 7+ so things like "5 stars" don't match.
const PHONE_PATTERN =
  /(\+?\d[\s().-]?){7,}|\b\d{7,}\b/;

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

export function isInMedellinMetro(lat: number, lng: number): boolean {
  return (
    lat >= MEDELLIN_BBOX.minLat &&
    lat <= MEDELLIN_BBOX.maxLat &&
    lng >= MEDELLIN_BBOX.minLng &&
    lng <= MEDELLIN_BBOX.maxLng
  );
}

export function containsContactInfo(text: string): boolean {
  return PHONE_PATTERN.test(text) || EMAIL_PATTERN.test(text);
}

export function autoModerationVerdict(
  listing: ListingForModeration,
): ModerationOutcome {
  const reasons: string[] = [];

  if (listing.photos_count < MIN_PHOTOS) reasons.push("photos_lt_5");

  if (!isInMedellinMetro(listing.latitude, listing.longitude)) {
    reasons.push("outside_medellin_metro");
  }

  if (containsContactInfo(listing.description)) {
    reasons.push("contact_info_in_description");
  }

  const range = PRICE_RANGE[listing.currency];
  if (
    listing.price_monthly < range.min ||
    listing.price_monthly > range.max
  ) {
    reasons.push(
      listing.currency === "COP"
        ? "price_out_of_range_cop"
        : "price_out_of_range_usd",
    );
  }

  if (listing.description.length < MIN_DESCRIPTION_CHARS) {
    reasons.push("description_too_short");
  }

  let verdict: Verdict;
  if (reasons.length === 0) verdict = "auto_approved";
  else if (reasons.length === 1) verdict = "needs_review";
  else verdict = "rejected";

  return { verdict, reasons };
}
