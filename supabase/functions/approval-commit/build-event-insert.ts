// Pure builder for the public.events insert on a host-wizard publish.
// Kept dependency-free so it runs under both Deno (edge fn) and Vitest (node).

export type EventHostDisplaySnapshot = {
  name: string;
  avatarUrl?: string | null;
};

export type EventInsertDraft = {
  title?: string;
  neighborhood?: string;
  dateIso?: string;
  venue?: string;
  priceMinCop?: number;
  capacity?: number;
  description?: string;
  ticketTiers?: Array<{ name: string; priceCop: number; quantity: number }>;
};

function hostDisplayDetails(snapshot?: EventHostDisplaySnapshot) {
  if (!snapshot?.name?.trim()) {
    return {};
  }
  return {
    host_display: {
      name: snapshot.name.trim(),
      avatar_url: snapshot.avatarUrl?.trim() || null,
    },
  };
}

/**
 * Build the `public.events` insert payload for a host-wizard publish.
 *
 * `organizer_id` MUST be set (not only `created_by`) — the host reads their own
 * events via RLS `events_organizer_select_own` (`organizer_id = auth.uid()`) and
 * `/host/events` filters `.eq("organizer_id", user.id)`. Without it a published
 * event is invisible to its own host. (EVT-002 / SAN-366 Step 0.)
 */
export function buildEventInsert(
  draft: EventInsertDraft,
  userId: string,
  slug: string,
  hostDisplay?: EventHostDisplaySnapshot,
) {
  return {
    source: "host_wizard",
    name: draft.title,
    description: draft.description ?? null,
    address: draft.venue ?? null,
    city: "Medellín",
    country: "CO",
    event_start_time: draft.dateIso,
    ticket_price_min: draft.priceMinCop ?? null,
    currency: "cop",
    slug,
    status: "published",
    organizer_id: userId,
    created_by: userId,
    details: {
      neighborhood: draft.neighborhood ?? null,
      capacity: draft.capacity ?? null,
      ticket_tiers: draft.ticketTiers ?? [],
      ...hostDisplayDetails(hostDisplay),
    },
  };
}
