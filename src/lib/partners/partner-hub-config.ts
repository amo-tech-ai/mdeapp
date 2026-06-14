import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Building2,
  Coffee,
  Home,
  MapPin,
  Megaphone,
  MessageSquareMore,
  Moon,
  PenLine,
  Ticket,
  UtensilsCrossed,
} from "lucide-react";

export type PartnerHubCard = {
  key: string;
  label: string;
  description: string;
  href: string;
  cta: string;
  Icon: LucideIcon;
};

/**
 * SAN-692 · D-PTR-01 — Partner hub (/partners) category grid.
 *
 * Link strategy (no dead links — prod validation found the dedicated landings
 * 404, see sitemap.md):
 *  - Venue verticals route to the LIVE /venues landing with its ?v= variant
 *    (shipped in SAN-661 · D-PTR-02), so each card lands on a rich, sold page.
 *  - Rentals / Business AI / Sponsors route to the LIVE typed signup wizard
 *    (/partners/signup?type=…) until their landings ship (SAN-691 / SAN-663 /
 *    SAN-664). Repoint the href to the landing route once each is live.
 *  - Event hosts route to the wizard because /host is the auth-gated dashboard
 *    (307 when logged out), not a marketing page.
 */
export const PARTNER_HUB_CARDS: PartnerHubCard[] = [
  {
    key: "restaurants",
    label: "Restaurants",
    description: "Be the answer when a visitor asks the concierge where to eat tonight.",
    href: "/venues?v=restaurant",
    cta: "For restaurants",
    Icon: UtensilsCrossed,
  },
  {
    key: "cafes",
    label: "Cafés",
    description: "Specialty coffee and work-friendly spots — found by Medellín's nomads.",
    href: "/venues?v=cafe",
    cta: "For cafés",
    Icon: Coffee,
  },
  {
    key: "nightlife",
    label: "Nightlife",
    description: "Clubs, bars, and live music surfaced in nightlife chat and ticketing.",
    href: "/venues?v=nightclub",
    cta: "For nightlife",
    Icon: Moon,
  },
  {
    key: "spaces",
    label: "Event spaces",
    description: "Capacity, availability, and booking requests you approve — booked by AI.",
    href: "/venues?v=space",
    cta: "For event spaces",
    Icon: Building2,
  },
  {
    key: "rentals",
    label: "Rentals & brokers",
    description: "Turn rental searches into qualified viewing requests you control.",
    href: "/partners/signup?type=broker",
    cta: "For brokers",
    Icon: Home,
  },
  {
    key: "agency",
    label: "Business AI",
    description: "AI services, automation, and social management for your company.",
    href: "/partners/signup?type=agency",
    cta: "For companies",
    Icon: Bot,
  },
  {
    key: "sponsors",
    label: "Sponsors",
    description: "Reach tourists and locals through events and curated placements.",
    href: "/partners/signup?type=sponsor",
    cta: "For sponsors",
    Icon: Megaphone,
  },
  {
    key: "host",
    label: "Event hosts",
    description: "Publish ticketed experiences and reach Camila's event searches.",
    href: "/partners/signup?type=host",
    cta: "For hosts",
    Icon: Ticket,
  },
];

/** "The AI does the work" band — the differentiator vs a plain directory. */
export type PartnerAiPillar = {
  Icon: LucideIcon;
  title: string;
  body: string;
};

export const PARTNER_HUB_AI_PILLARS: [
  PartnerAiPillar,
  PartnerAiPillar,
  PartnerAiPillar,
] = [
  {
    Icon: PenLine,
    title: "AI drafts the work",
    body: "Listings, event posts, and social captions — described in a few words, written by AI. You review, not write.",
  },
  {
    Icon: MessageSquareMore,
    title: "AI handles the replies",
    body: "Lead questions and review responses drafted for you. You approve every booking and every public reply.",
  },
  {
    Icon: MapPin,
    title: "AI surfaces you",
    body: "When someone asks the concierge what to do, your business appears in the answer and on the map — not buried in search.",
  },
];

/** How it works — 3 steps (D-PTR-01 §4). */
export const PARTNER_HUB_STEPS: [string, string, string] = [
  "Pick your program and sign up — one typed wizard, minutes not forms.",
  "AI onboards you — it writes your listing, sets your booking flow, picks categories.",
  "Go live on the concierge — discovered in chat, browse, and on the map.",
];
