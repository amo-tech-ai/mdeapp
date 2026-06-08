import Link from "next/link";
import {
  CalendarPlusIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TicketIcon,
} from "lucide-react";

import { HomeFooter } from "@/components/home/home-footer";
import { PartnerMarketingNav } from "@/components/partners/partner-marketing-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SIGNUP_PATH = "/partners/signup?type=host";
const WIZARD_PATH = "/host/event/new";
const LOGIN_HREF = `/login?next=${encodeURIComponent(SIGNUP_PATH)}`;

const HOST_NAV_LINKS = [
  { label: "For hosts", href: "/host", active: true },
  { label: "Rentals", href: "/partners/rentals" },
  { label: "Browse events", href: "/events" },
] as const;

const FEATURES = [
  {
    title: "AI form-fill",
    description:
      "Describe your event in plain words — AI fills title, venue, and ticket tiers.",
    Icon: SparklesIcon,
    ai: true,
  },
  {
    title: "Ticketing built in",
    description: "Set tiers and accept card payments with Stripe checkout.",
    Icon: TicketIcon,
    ai: false,
  },
  {
    title: "Reach + map",
    description:
      "Your event surfaces in concierge answers, browse, and on the map.",
    Icon: MapPinIcon,
    ai: false,
  },
  {
    title: "You approve before publish",
    description: "Human-in-the-loop — nothing goes live without your OK.",
    Icon: ShieldCheckIcon,
    ai: false,
  },
] as const;

const STEPS = [
  { n: 1, label: "Describe your event" },
  { n: 2, label: "AI drafts it" },
  { n: 3, label: "Approve and publish" },
] as const;

const STATS = [
  { value: "30s", label: "to publish" },
  { value: "120+", label: "events live" },
  { value: "0", label: "setup fees" },
] as const;

const PRICING = [
  {
    title: "Free to publish",
    description: "List your event on mdeai with no upfront cost.",
    featured: false,
  },
  {
    title: "Fee per ticket sold",
    description: "We earn when Andrés buys — you keep the rest.",
    featured: true,
  },
  {
    title: "Featured placement",
    description: "Boost visibility in concierge and browse (coming soon).",
    featured: false,
  },
] as const;

/**
 * SAN-660 — /host marketing landing (event hosts / Roberto).
 * Patterns: shadcn Card/Button, 21st Hero-1 text-balance + dual CTA, wireframe host-wireframe.html
 */
export function EventHostLanding() {
  return (
    <>
      <PartnerMarketingNav
        primaryCtaHref={SIGNUP_PATH}
        primaryCtaLabel="Publish your event"
        signInHref={LOGIN_HREF}
        links={[...HOST_NAV_LINKS]}
      />

      <main
        id="main-content"
        data-testid="event-host-landing"
        className="bg-background text-foreground"
      >
        <section
          aria-label="Event hosts"
          className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent/15 via-background to-background py-16 md:py-24"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,oklch(0.95_0.04_160/0.7),transparent)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
            <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
              <Badge variant="secondary" className="w-fit">
                AI event publishing
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground md:text-5xl">
                Publish your event in 30 seconds.
              </h1>
              <p className="max-w-xl text-base text-pretty text-muted-foreground leading-relaxed">
                Roberto describes a salsa night — the AI fills the wizard, you
                approve, and ticket buyers find it in chat, browse, and on the
                map.
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                120+ events published on mdeai
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Button
                  size="lg"
                  nativeButton={false}
                  render={<Link href={SIGNUP_PATH} data-testid="event-host-primary-cta" />}
                >
                  <CalendarPlusIcon data-icon="inline-start" aria-hidden="true" />
                  Publish your event
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  nativeButton={false}
                  render={<Link href={WIZARD_PATH} data-testid="event-host-secondary-cta" />}
                >
                  Try the wizard
                </Button>
              </div>
            </div>

            <Card
              className="mx-auto w-full max-w-md border-dashed lg:max-w-none"
              aria-label="Wizard preview"
            >
              <CardHeader>
                <CardTitle className="text-base">Host event wizard</CardTitle>
                <CardDescription>
                  Live at{" "}
                  <Link href={WIZARD_PATH} className="font-medium text-primary hover:underline">
                    /host/event/new
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="h-3 w-3/4 rounded-md bg-muted" aria-hidden="true" />
                <div className="h-3 w-full rounded-md bg-muted" aria-hidden="true" />
                <div className="h-20 rounded-lg bg-accent/10" aria-hidden="true" />
                <div className="flex gap-2">
                  <div className="h-8 flex-1 rounded-md bg-muted" aria-hidden="true" />
                  <div className="h-8 w-24 rounded-md bg-primary/20" aria-hidden="true" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          aria-label="How event publishing works"
          className="scroll-mt-24 border-b border-border bg-muted/30 py-16 md:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-semibold text-balance md:text-3xl">
                How it works
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Chat → draft → approve. The live wizard is already shipping.
              </p>
            </div>
            <ol
              aria-label="Host publishing steps"
              className="grid list-none gap-6 sm:grid-cols-3"
            >
              {STEPS.map(({ n, label }) => (
                <li key={n}>
                  <Card className="h-full text-center">
                    <CardContent className="flex flex-col items-center gap-3 pt-6">
                      <span
                        className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                        aria-hidden="true"
                      >
                        {n}
                      </span>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-label="Host features" className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-semibold text-balance md:text-3xl">
                What you get as a host
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map(({ title, description, Icon, ai }) => (
                <Card key={title} className="h-full">
                  <CardHeader className="gap-3">
                    <div className="flex items-center gap-2">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                        <Icon aria-hidden="true" />
                      </span>
                      {ai ? (
                        <Badge variant="outline" className="text-xs">
                          AI-powered
                        </Badge>
                      ) : null}
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-label="Host proof"
          className="border-y border-border bg-muted/40 py-16 md:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-balance text-foreground md:text-3xl">
              Hosts ship faster with mdeai
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              More hosts → more events → more tickets for tourists and locals
              already searching Medellín.
            </p>
            <dl className="mt-12 grid gap-8 sm:grid-cols-3">
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <dt className="text-3xl font-bold tabular-nums text-accent md:text-4xl">
                    {value}
                  </dt>
                  <dd className="text-sm text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          aria-label="Host pricing"
          className="scroll-mt-24 border-b border-border py-16 md:py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-semibold text-balance md:text-3xl">
                Simple pricing
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {PRICING.map(({ title, description, featured }) => (
                <Card
                  key={title}
                  className={
                    featured
                      ? "border-primary ring-2 ring-primary/30"
                      : undefined
                  }
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="border-0 bg-transparent">
                    <Button
                      variant={featured ? "default" : "outline"}
                      className="w-full"
                      nativeButton={false}
                      render={<Link href={SIGNUP_PATH} />}
                    >
                      Get started
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-label="Start hosting"
          className="bg-accent/10 py-16 md:py-20"
        >
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-balance md:text-3xl">
              Ready to publish?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Free to publish — we earn a small fee per ticket sold.
            </p>
            <Button
              size="lg"
              className="mt-8"
              nativeButton={false}
              render={<Link href={SIGNUP_PATH} data-testid="event-host-final-cta" />}
            >
              <CalendarPlusIcon data-icon="inline-start" aria-hidden="true" />
              Publish your event
            </Button>
          </div>
        </section>
      </main>

      <HomeFooter />
    </>
  );
}
