import { CheckIcon, StarIcon } from "lucide-react";

import type { VenueVariant } from "@/components/partners/venues-landing";

/**
 * SAN-661 · MKT — For Venues landing (/venues).
 *
 * Product proof for the hero: a CSS mockup of Medellín's AI concierge answering
 * a "where should we…" question with the partner's venue card + a booking
 * approval chip (the HITL control). No screenshots — pure HTML/Tailwind so it
 * ships now and swaps for a real screenshot later (P2).
 *
 * Decorative: the whole panel is aria-hidden — the real value props live in the
 * hero copy and the value-prop section, not in this illustration.
 */

type MockContent = {
  question: string;
  venueName: string;
  venueMeta: string;
  approval: string;
};

const MOCK_BY_VARIANT: Record<VenueVariant, MockContent> = {
  default: {
    question: "Where should we eat in El Poblado tonight?",
    venueName: "El Balcón Mediterráneo",
    venueMeta: "Rooftop · Mediterranean tapas · El Poblado",
    approval: "Booking approved · Tonight 8 pm · Party of 4",
  },
  restaurant: {
    question: "Best dinner spot in Provenza tonight?",
    venueName: "El Balcón Mediterráneo",
    venueMeta: "Rooftop · Mediterranean tapas · El Poblado",
    approval: "Booking approved · Tonight 8 pm · Party of 4",
  },
  cafe: {
    question: "Quiet café with fast WiFi in Laureles?",
    venueName: "Pergamino Café",
    venueMeta: "Specialty coffee · WiFi · Power outlets · Laureles",
    approval: "Table held · Today 2 pm · Remote work session",
  },
  nightclub: {
    question: "Where's good live salsa tonight?",
    venueName: "Salón Málaga",
    venueMeta: "Live salsa · Cocktails · Centro nightlife",
    approval: "2 tickets reserved · Saturday 10 pm",
  },
  space: {
    question: "Event space for 80 people this month?",
    venueName: "Casa Provenza",
    venueMeta: "Capacity 80 · Catering · Provenza",
    approval: "Hold requested · Jun 20 · 80 guests",
  },
};

export function ConciergePreviewMockup({ variant }: { variant: VenueVariant }) {
  const mock = MOCK_BY_VARIANT[variant];

  return (
    <div
      aria-hidden="true"
      className="w-full max-w-sm rounded-2xl border border-border bg-background p-4 shadow-xl"
    >
      {/* Concierge label */}
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
          ai
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          Medellín concierge
        </span>
      </div>

      {/* User question */}
      <div className="mb-3 ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-accent/15 px-3 py-2 text-sm text-foreground">
        {mock.question}
      </div>

      {/* Venue answer card */}
      <div className="rounded-xl border border-border bg-background-elevated p-3">
        <div className="flex gap-3">
          <div
            className="size-14 shrink-0 rounded-lg bg-gradient-to-br from-accent/30 to-accent/5"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {mock.venueName}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <StarIcon className="size-3 fill-accent text-accent" aria-hidden="true" />
              4.8
              <span className="truncate">· {mock.venueMeta}</span>
            </p>
            <span className="mt-1.5 inline-block text-xs font-medium text-accent">
              Reserve table →
            </span>
          </div>
        </div>
      </div>

      {/* Booking approval chip (HITL proof) */}
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
        <CheckIcon className="size-3.5" aria-hidden="true" />
        {mock.approval}
      </div>
    </div>
  );
}
