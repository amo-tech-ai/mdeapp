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

/** SAN-692 — eight funnel cards (landings stubbed until SAN-660/661/691/etc.). */
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
    href: "/venues",
    cta: "Explore venues program",
    Icon: MapPin,
  },
  {
    key: "rentals",
    label: "Rental brokers",
    description: "Turn rental searches into qualified viewing requests.",
    href: "/partners/rentals",
    cta: "List rentals",
    Icon: Home,
  },
  {
    key: "sponsors",
    label: "Sponsors",
    description: "Reach tourists and locals through events and curated placements.",
    href: "/sponsors",
    cta: "Become a sponsor",
    Icon: Sparkles,
  },
  {
    key: "agency",
    label: "Business AI",
    description: "AI services, automation, and social for your company.",
    href: "/business/ai",
    cta: "Explore AI services",
    Icon: Building2,
  },
  {
    key: "restaurants",
    label: "Restaurants",
    description: "Get listed for diners discovering places through the concierge.",
    href: "/partners/restaurants",
    cta: "Restaurant partners",
    Icon: UtensilsCrossed,
  },
  {
    key: "cafes",
    label: "Cafés",
    description: "Specialty coffee and work-friendly spots for local seekers.",
    href: "/partners/cafes",
    cta: "Café partners",
    Icon: Coffee,
  },
  {
    key: "nightlife",
    label: "Nightlife",
    description: "Clubs, bars, and late-night venues surfaced in nightlife chat.",
    href: "/partners/nightlife",
    cta: "Nightlife partners",
    Icon: Moon,
  },
];

export const PARTNER_HUB_STEPS = [
  "Pick your program",
  "Sign in and activate",
  "Publish listings",
  "Go live on concierge",
] as const;
