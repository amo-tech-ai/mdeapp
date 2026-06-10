/**
 * Founder moderation email — Landlord V1 D6.
 *
 * Plain-text body for now (Resend-friendly); pure functions so the deno
 * test can assert content without spinning up the edge runtime.
 */

import type { ListingForReview } from "./types.ts";

export interface RenderedEmail {
  subject: string;
  text: string;
}

/**
 * Build the founder email for a listing that landed in needs_review.
 * `approveUrl` and `rejectUrl` already contain the signed token.
 */
export function renderNeedsReviewEmail(
  listing: ListingForReview,
  approveUrl: string,
  rejectUrl: string,
): RenderedEmail {
  const reasons =
    listing.reasons.length === 0
      ? "(none flagged)"
      : listing.reasons.map((r) => `  • ${r}`).join("\n");

  const subject = `[mdeai] Listing needs review: ${listing.title}`;

  const text = [
    `A new listing was flagged for review (1 auto-moderation violation).`,
    ``,
    `Listing: ${listing.title}`,
    `Neighborhood: ${listing.neighborhood}, ${listing.city}`,
    `Price: ${formatPrice(listing.price_monthly, listing.currency)} / month`,
    `Photos: ${listing.photo_count}`,
    `Landlord: ${listing.landlord_display_name ?? "(unknown)"}`,
    ``,
    `Auto-moderation reasons:`,
    reasons,
    ``,
    `Approve → ${approveUrl}`,
    `Reject  → ${rejectUrl}`,
    ``,
    `Links expire in 7 days. The first click wins; subsequent clicks are no-ops.`,
  ].join("\n");

  return { subject, text };
}

function formatPrice(amount: number, currency: "COP" | "USD"): string {
  if (currency === "COP") {
    return `$${amount.toLocaleString("es-CO")} COP`;
  }
  return `$${amount.toLocaleString("en-US")} USD`;
}
