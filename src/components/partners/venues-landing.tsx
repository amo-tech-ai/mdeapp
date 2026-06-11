import {
  CalendarIcon,
  BarChartIcon,
  BotIcon,
  MapPinIcon,
  MessageSquareMoreIcon,
  NotebookPenIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  UtensilsIcon,
} from "lucide-react";

import type { MarketingAccent } from "@/components/marketing/marketing-page-shell";
import {
  PartnerLandingShell,
  type PartnerLandingShellProps,
} from "@/components/partners/partner-landing-shell";

// ─── Variant types ────────────────────────────────────────────────────────────

export type VenueVariant = "restaurant" | "cafe" | "nightclub" | "space" | "default";

/** Maps ?v= param to MarketingPageShell accent token. */
export const VENUE_VARIANT_ACCENT: Record<VenueVariant, MarketingAccent> = {
  default: "teal",
  restaurant: "terracotta",
  cafe: "caramel",
  nightclub: "magenta",
  space: "teal",
};

// ─── Shared features (all variants) ──────────────────────────────────────────

const SHARED_FEATURES: PartnerLandingShellProps["features"] = [
  {
    icon: SparklesIcon,
    title: "AI listing drafts",
    body: "Describe your venue in a few words — the AI writes the full listing, suggests photos, and picks the right category.",
    ai: true,
  },
  {
    icon: ShieldCheckIcon,
    title: "Booking approvals (HITL)",
    body: "You approve every reservation before it confirms. AI handles the back-and-forth; you stay in control.",
  },
  {
    icon: MapPinIcon,
    title: "Listing + map pin",
    body: "Your venue appears on Medellín's discovery map and surfaces in concierge answers the moment you publish.",
  },
  {
    icon: BotIcon,
    title: "AI social posts",
    body: "Postiz auto-generates Instagram and TikTok captions for your events and specials — you approve and post.",
    ai: true,
  },
  {
    icon: MessageSquareMoreIcon,
    title: "AI review replies",
    body: "The AI drafts professional replies to Google and in-app reviews. You keep final say before anything goes public.",
    ai: true,
  },
  {
    icon: BarChartIcon,
    title: "Weekly reporting",
    body: "Profile views, bookings, and lead quality — one clean email every Monday, no dashboard required.",
  },
];

// ─── Shared value props ───────────────────────────────────────────────────────

const SHARED_VALUE_PROPS: PartnerLandingShellProps["valueProps"] = [
  {
    icon: MapPinIcon,
    title: "Be the answer",
    body: "When a traveller asks Medellín's AI concierge where to eat tonight, your venue is the answer — not a buried search result.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Bookings, not just browsing",
    body: "Reservations come through the AI — you approve each one. Real bookings, no double-entries, calendar stays yours.",
  },
  {
    icon: SparklesIcon,
    title: "Marketing that writes itself",
    body: "AI drafts your listing, event posts, and review replies. You spend minutes reviewing, not hours writing.",
  },
];

// ─── How it works (shared 5-step timeline) ───────────────────────────────────

const SHARED_HOW_IT_WORKS: PartnerLandingShellProps["howItWorks"] = [
  {
    n: 1,
    title: "List your venue",
    sub: "Sign up and describe your spot in plain language — type, location, what makes it special.",
  },
  {
    n: 2,
    title: "AI creates your listing",
    sub: "The concierge writes your full profile, picks the right categories, and sets up your booking flow.",
  },
  {
    n: 3,
    title: "Travellers discover you",
    sub: "Your venue surfaces in chat answers, browse, and on the map — reaching people already planning to visit.",
  },
  {
    n: 4,
    title: "You approve each booking",
    sub: "Every reservation request lands in your inbox. You approve or decline; the AI handles the guest communication.",
  },
  {
    n: 5,
    title: "Guests arrive, you grow",
    sub: "Confirmed bookings, AI-powered reviews, and weekly analytics — the loop runs without you chasing leads.",
  },
];

// ─── Hero copy per variant ────────────────────────────────────────────────────

type HeroCopy = {
  kicker: string;
  h1: string;
  sub: string;
};

const HERO_COPY: Record<VenueVariant, HeroCopy> = {
  default: {
    kicker: "FOR RESTAURANTS · CAFÉS · NIGHTLIFE · SPACES",
    h1: "Fill your tables. Fill your nights.",
    sub: "mdeai puts your venue inside Medellín's AI concierge — where visitors already ask what to do, where to eat, and where to go out.",
  },
  restaurant: {
    kicker: "FOR RESTAURANTS",
    h1: "Be the answer when visitors ask where to eat",
    sub: "Every time a visitor or local asks Medellín's AI concierge for a restaurant, your place can be the answer — with a direct booking link, not just a link.",
  },
  cafe: {
    kicker: "FOR CAFÉS",
    h1: "Where Medellín's nomads work next.",
    sub: "Nomads and creatives ask the concierge for quiet cafés with WiFi every day. mdeai puts your café in front of them — with your vibe, your menu, and a table booking.",
  },
  nightclub: {
    kicker: "FOR NIGHTLIFE",
    h1: "Slow Tuesdays are a software problem.",
    sub: "Publish a salsa night in minutes, let AI promote it, and have ticket buyers find it in the concierge before your flyers even print.",
  },
  space: {
    kicker: "FOR EVENT SPACES",
    h1: "Your space, booked by AI.",
    sub: "Event planners ask the concierge for spaces in Medellín every week. mdeai puts your venue in the answer — with capacity, availability, and a booking request flow.",
  },
};

// ─── Variant-specific feature additions ──────────────────────────────────────

const NIGHTCLUB_EXTRA: PartnerLandingShellProps["features"][number] = {
  icon: CalendarIcon,
  title: "AI event publishing",
  body: "Describe a salsa night or DJ set — the AI drafts the event, sets ticket tiers, and queues the social posts. You publish in under 2 minutes.",
  ai: true,
};

const RESTAURANT_EXTRA: PartnerLandingShellProps["features"][number] = {
  icon: UtensilsIcon,
  title: "AI menu highlights",
  body: "The AI reads your menu and writes the 3-line concierge pitch that answers 'what's good there?' — updated whenever you change the menu.",
  ai: true,
};

const CAFE_EXTRA: PartnerLandingShellProps["features"][number] = {
  icon: NotebookPenIcon,
  title: "Nomad tags auto-applied",
  body: "WiFi speed, power outlets, noise level, opening hours — the AI fills these from your listing so nomads can filter you in.",
  ai: true,
};

const SPACE_EXTRA: PartnerLandingShellProps["features"][number] = {
  icon: StarIcon,
  title: "Capacity + availability display",
  body: "Live capacity, floor plans, and available dates show directly in concierge answers — no back-and-forth before the booking request.",
};

function getFeatures(variant: VenueVariant): PartnerLandingShellProps["features"] {
  const extras: Partial<Record<VenueVariant, PartnerLandingShellProps["features"][number]>> = {
    nightclub: NIGHTCLUB_EXTRA,
    restaurant: RESTAURANT_EXTRA,
    cafe: CAFE_EXTRA,
    space: SPACE_EXTRA,
  };
  const extra = extras[variant];
  return extra ? [extra, ...SHARED_FEATURES.slice(1)] : SHARED_FEATURES;
}

// ─── Component ────────────────────────────────────────────────────────────────

type VenuesLandingProps = {
  variant: VenueVariant;
};

/**
 * SAN-661 · MKT — For Venues landing (/venues).
 * Configures PartnerLandingShell for the venues vertical.
 * The ?v= query param selects hero copy + accent token;
 * the accent is resolved in the page server component and passed to
 * MarketingPageShell — this component receives only the variant key.
 */
export function VenuesLanding({ variant }: VenuesLandingProps) {
  const hero = HERO_COPY[variant];
  const signupHref = "/partners/signup?type=venue";

  return (
    <PartnerLandingShell
      testId="venues-landing"
      hero={{
        kicker: hero.kicker,
        h1: hero.h1,
        sub: hero.sub,
        primaryLabel: "List your venue",
        primaryHref: signupHref,
        secondaryLabel: "Book a demo",
        secondaryHref: "#demo",
      }}
      valueProps={SHARED_VALUE_PROPS}
      features={getFeatures(variant)}
      howItWorks={SHARED_HOW_IT_WORKS}
      pricingLine="Free to list. Growth when you grow."
      signupHref={signupHref}
    />
  );
}

/** Resolve a raw ?v= string to a typed VenueVariant. */
export function resolveVenueVariant(v: string | string[] | undefined): VenueVariant {
  const raw = Array.isArray(v) ? v[0] : v;
  const valid: VenueVariant[] = ["restaurant", "cafe", "nightclub", "space"];
  return valid.includes(raw as VenueVariant) ? (raw as VenueVariant) : "default";
}
