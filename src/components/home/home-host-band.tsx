import Link from "next/link";
import { CalendarPlusIcon } from "lucide-react";

const marqueeItems = [
  "Sell tickets",
  "Set your capacity",
  "AI-assisted setup",
  "Reach locals & expats",
  "Free to list",
  "Manage RSVPs",
  "Build your audience",
  "Go live in minutes",
];

function InlineMarquee() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div
      className="relative overflow-hidden py-2"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee gap-8 motion-reduce:animate-none">
        {items.map((item, i) => (
          <span
            key={i}
            className="whitespace-nowrap text-xs font-medium uppercase tracking-widest text-primary/60"
          >
            {item}
            <span className="mx-4 opacity-40">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function HomeHostBand() {
  return (
    <section
      aria-label="Host an event on mdeai"
      className="border-y border-border bg-muted/40 py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:gap-12 md:text-left">
          <div className="flex flex-col gap-3 md:flex-1">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <CalendarPlusIcon className="size-5 text-primary" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                For hosts
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
              Publish your event in Medellín
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Describe your event to the AI. It fills the form — venue, tickets, capacity —
              and puts it in front of locals and travellers already searching for what you offer.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                href="/host/event/new"
                data-testid="host-band-primary-cta"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                <CalendarPlusIcon className="size-4" aria-hidden="true" />
                Create an event
              </Link>
              <Link
                href="/host/events"
                data-testid="host-band-secondary-cta"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                My events
              </Link>
            </div>
          </div>

          <div className="w-full rounded-xl border border-border bg-card p-6 md:max-w-xs">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              What you get
            </p>
            <InlineMarquee />
          </div>
        </div>
      </div>
    </section>
  );
}
