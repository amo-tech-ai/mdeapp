import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Coffee,
  Home,
  MapPin,
  Moon,
  Sparkles,
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
 * SAN-692 — eight funnel cards. Every card routes to the LIVE typed signup
 * (/partners/signup?type=…) so there are no dead links — prod validation found
 * the dedicated landings 404. Repoint to the marketing landings
 * (SAN-660/661/663/664/691/712/713/714) once those ship.
 */
export const PARTNER_HUB_CARDS: PartnerHubCard[] = [
  {
    key: "host",
    label: "Event hosts",
    description: "Publish ticketed experiences and reach Camila's event searches.",
    href: "/partners/signup?type=host",
    cta: "Start as host",
    Icon: Ticket,
  },
  {
    key: "venues",
    label: "Venues",
    description: "Rooftops, clubs, and spaces — get discovered in chat and on the map.",
    href: "/partners/signup?type=venue",
    cta: "Start as venue",
    Icon: MapPin,
  },
  {
    key: "rentals",
    label: "Rental brokers",
    description: "Turn rental searches into qualified viewing requests.",
    href: "/partners/signup?type=broker",
    cta: "Start as broker",
    Icon: Home,
  },
  {
    key: "sponsors",
    label: "Sponsors",
    description: "Reach tourists and locals through events and curated placements.",
    href: "/partners/signup?type=sponsor",
    cta: "Start as sponsor",
    Icon: Sparkles,
  },
  {
    key: "agency",
    label: "Business AI",
    description: "AI services, automation, and social for your company.",
    href: "/partners/signup?type=agency",
    cta: "Start as agency",
    Icon: Building2,
  },
  {
    key: "restaurants",
    label: "Restaurants",
    description: "Get listed for diners discovering places through the concierge.",
    href: "/partners/signup?type=venue&category=restaurant",
    cta: "Start as restaurant",
    Icon: UtensilsCrossed,
  },
  {
    key: "cafes",
    label: "Cafés",
    description: "Specialty coffee and work-friendly spots for local seekers.",
    href: "/partners/signup?type=venue&category=cafe",
    cta: "Start as café",
    Icon: Coffee,
  },
  {
    key: "nightlife",
    label: "Nightlife",
    description: "Clubs, bars, and late-night venues surfaced in nightlife chat.",
    href: "/partners/signup?type=venue&category=nightclub",
    cta: "Start as nightlife",
    Icon: Moon,
  },
];

export const PARTNER_HUB_STEPS = [
  "Pick your program",
  "Sign in and activate",
  "Publish listings",
  "Go live on concierge",
] as const;
