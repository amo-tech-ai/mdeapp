import Link from "next/link";
import {
  ArrowRightIcon,
  Building2Icon,
  CalendarPlusIcon,
  MegaphoneIcon,
  SparklesIcon,
  Store as StoreIcon,
  UsersIcon,
  UtensilsCrossedIcon,
  type LucideIcon,
} from "lucide-react";

/**
 * SAN-692 — MKT Partner hub marketing page (/partners).
 * Mindtrip-style "grow your business" hub: hero → partner-type cards →
 * signup step marquee → CTA. Every card routes to a live or placeholder
 * destination (no dead links). Does not duplicate SAN-723 — the signup
 * wizard; it links to it.
 *
 * Tokens only (no hardcoded gray), mobile-first responsive, marquee guarded
 * with motion-reduce:animate-none for prefers-reduced-motion.
 */

type PartnerCard = {
  key: string;
  label: string;
  blurb: string;
  href: string;
  cta: string;
  icon: LucideIcon;
};

// Primary supply-side partner types — destinations verified on disk
// (host/venue live; broker/sponsor/agency are SAN-691/664/663 placeholders).
const PARTNER_CARDS: PartnerCard[] = [
  {
    key: "host",
    label: "Event hosts",
    blurb: "Publish events and sell tickets — describe it and the AI fills the form.",
    href: "/host/event/new",
    cta: "Publish your event",
    icon: CalendarPlusIcon,
  },
  {
    key: "venue",
    label: "Restaurants & venues",
    blurb: "Get listed and surfaced to diners discovering places through the concierge.",
    href: "/restaurants",
    cta: "List your venue",
    icon: UtensilsCrossedIcon,
  },
  {
    key: "broker",
    label: "Brokers & rentals",
    blurb: "Turn Medellín's rental searches into qualified leads and booked viewings.",
    href: "/partners/rentals",
    cta: "List your rentals",
    icon: Building2Icon,
  },
  {
    key: "sponsor",
    label: "Sponsors",
    blurb: "Put your brand in front of audiences already planning their nights out.",
    href: "/sponsors",
    cta: "Become a sponsor",
    icon: MegaphoneIcon,
  },
  {
    key: "agency",
    label: "Agencies & AI services",
    blurb: "AI builds, automation, and social management for your company.",
    href: "/business/ai",
    cta: "Explore AI services",
    icon: SparklesIcon,
  },
];

// P2/P3 teaser types — functional typed signup, flagged "coming soon".
const TEASER_CARDS: PartnerCard[] = [
  {
    key: "creator",
    label: "Creators & influencers",
    blurb: "Build guides, share affiliate links, and earn from your audience.",
    href: "/partners/signup?type=creator",
    cta: "Join the waitlist",
    icon: UsersIcon,
  },
  {
    key: "vendor",
    label: "Marketplace vendors",
    blurb: "Sell products and services to locals and travellers.",
    href: "/partners/signup?type=vendor",
    cta: "Join the waitlist",
    icon: StoreIcon,
  },
];

const SIGNUP_STEPS = [
  "Create your profile",
  "Add your services",
  "Publish your listings",
  "Go live",
];

const PRIMARY_CTA =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none";

const SECONDARY_CTA =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none";

function SignupStepMarquee() {
  const steps = SIGNUP_STEPS.map((label, i) => ({ n: i + 1, label }));
  const loop = [...steps, ...steps];
  return (
    <div className="relative overflow-hidden" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-4 motion-reduce:animate-none">
        {loop.map((step, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground"
          >
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {step.n}
            </span>
            {step.label}
            <ArrowRightIcon className="size-3.5 text-primary/50" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}

function PartnerTypeCard({ card, teaser = false }: { card: PartnerCard; teaser?: boolean }) {
  const Icon = card.icon;
  return (
    <Link
      href={card.href}
      data-testid={`partner-card-${card.key}`}
      className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none"
    >
      <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">{card.label}</h3>
          {teaser ? (
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Coming soon
            </span>
          ) : null}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{card.blurb}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        {card.cta}
        <ArrowRightIcon
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}

export function PartnerHub() {
  return (
    <main id="main-content" className="bg-background text-foreground">
      {/* Hero */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 md:py-24 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            For partners
          </span>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Grow your business with Medellín&rsquo;s AI concierge
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            List with us, sell with us, or let our AI run your marketing. mdeai puts
            your venue, event, or rental in front of the locals and travellers already
            searching for it.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Link href="/partners/signup" className={PRIMARY_CTA}>
              Get started free
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
            <Link href="#partner-types" className={SECONDARY_CTA}>
              See partner types
            </Link>
          </div>
        </div>
      </section>

      {/* Partner-type cards */}
      <section
        id="partner-types"
        aria-labelledby="partner-types-heading"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 md:py-20 lg:px-8"
      >
        <div className="flex flex-col gap-2 text-center">
          <h2
            id="partner-types-heading"
            className="text-2xl font-semibold text-foreground md:text-3xl"
          >
            Find your fit
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
            Every partner type gets a tailored onboarding and the same one signup form.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNER_CARDS.map((card) => (
            <PartnerTypeCard key={card.key} card={card} />
          ))}
          {TEASER_CARDS.map((card) => (
            <PartnerTypeCard key={card.key} card={card} teaser />
          ))}
        </div>
      </section>

      {/* Signup step marquee */}
      <section
        aria-label="How partner signup works"
        className="border-y border-border bg-muted/30 py-12 md:py-16"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
              Live in four steps
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
              One guided wizard takes you from profile to published — most partners go
              live the same day.
            </p>
          </div>
          <SignupStepMarquee />
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 md:py-20 lg:px-8">
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
          Ready to grow with mdeai?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
          Create your partner profile in minutes. Free to start.
        </p>
        <div className="mt-6 flex justify-center">
          <Link href="/partners/signup" className={PRIMARY_CTA}>
            Get started free
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
