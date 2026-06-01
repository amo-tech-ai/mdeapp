import type { ConciergeWorkingMemory } from "@/lib/types";
import type { Rental } from "@/mastra/tools/search-rentals";
import {
  buildRentalSearchParams,
  canFastPathRentalSearch,
  shouldInstantRentalClarify,
  type RentalSearchApiParams,
} from "@/lib/rental-query-parser";

export {
  buildRentalSearchParams,
  canFastPathRentalSearch,
  shouldInstantRentalClarify,
};

export function rentalsToToolEnvelope(
  cards: Rental[],
  meta?: { hybridUsed?: boolean; rankExplanation?: Array<{ factor: string; score: number; note: string }> },
) {
  return {
    results: cards.map((r) => ({
      id: r.id,
      title: r.title,
      neighborhood: r.neighborhood,
      bedrooms: r.bedrooms,
      nightly_price: r.nightly_price,
      host_name: r.host_name,
      wifi: r.wifi,
      amenities: r.amenities,
      availability: r.availability,
      photo_url: r.image,
      image_url: r.image,
      source_url: r.source_url,
      schedule_viewing_url: r.schedule_viewing_url,
      tags: r.tags,
      latitude: r.latitude,
      longitude: r.longitude,
    })),
    total: cards.length,
    source: "supabase" as const,
    hybridUsed: meta?.hybridUsed,
    rankExplanation: meta?.rankExplanation,
  };
}

export function rentalsToPanelRows(
  cards: Rental[],
): ConciergeWorkingMemory["lastRentalResults"] {
  return cards.map((r) => ({
    id: r.id,
    title: r.title,
    neighborhood: r.neighborhood,
    nightly_price: r.nightly_price,
  }));
}

export {
  fastPathRentalNarrative,
  fastPathRentalSummary,
} from "@/lib/rental-display";

export type { RentalSearchApiParams };
