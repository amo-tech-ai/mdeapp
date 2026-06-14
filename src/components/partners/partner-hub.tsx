import Link from "next/link";
import { ArrowRightIcon, CheckCircleIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  PARTNER_HUB_AI_PILLARS,
  PARTNER_HUB_CARDS,
  PARTNER_HUB_STEPS,
} from "@/lib/partners/partner-hub-config";

const SIGNUP_HREF = "/partners/signup";
const TRUST_PILLS = ["Free to start", "Live the same day", "You approve everything"];

/**
 * SAN-692 · D-PTR-01 — Partner hub marketing page (/partners).
 *
 * The hub is a directory page (cards route OUT to each partner path), so it
 * reuses PartnerLandingShell's visual *patterns* + primitives — hero shape,
 * 3-col band, numbered timeline, trust pills, demo band, oklch tokens — rather
 * than the shell itself (whose slots/headings are venue-sales-specific). The
 * single-vertical sales pages (rentals/sponsors/business-ai) are the true shell
 * consumers.
 */
export function PartnerHub() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        id="hero"
        aria-label="Grow your business with mdeai"
        className="border-b border-border px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8"
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <Badge variant="secondary" className="tracking-wide">
            FOR PARTNERS · MEDELLÍN
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Grow your business with Medellín&apos;s AI concierge
          </h1>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            List with us, sell with us, or let the AI concierge put your venue,
            event, or rental in front of locals and travellers already searching.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              nativeButton={false}
              render={<Link href={SIGNUP_HREF} data-testid="partner-hub-primary-cta" />}
            >
              Become a partner
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              nativeButton={false}
              render={
                <Link href="#partner-types" data-testid="partner-hub-secondary-cta" />
              }
            >
              See partner programs
            </Button>
          </div>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {TRUST_PILLS.map((pill) => (
              <li
                key={pill}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <CheckCircleIcon className="size-3.5 text-success" aria-hidden="true" />
                {pill}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Partner category grid (the core of the hub) ── */}
      <section
        id="partner-types"
        aria-labelledby="partner-types-heading"
        className="scroll-mt-20 border-b border-border px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2
              id="partner-types-heading"
              className="text-2xl font-semibold text-balance text-foreground sm:text-3xl"
            >
              Find your program
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Every path links to a typed landing or the live signup wizard — no
              dead ends, no forms to print.
            </p>
          </div>
          <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNER_HUB_CARDS.map((card) => {
              const Icon = card.Icon;
              return (
                <li key={card.key}>
                  <Link
                    href={card.href}
                    data-testid={`partner-card-${card.key}`}
                    className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
                  >
                    <Card className="h-full motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:shadow-md">
                      <CardHeader>
                        <span className="mb-1 flex size-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <CardTitle className="text-base leading-snug">
                          {card.label}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {card.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="mt-auto border-0 bg-transparent p-4 pt-0">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                          {card.cta}
                          <ArrowRightIcon
                            className="size-3.5 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── "The AI does the work" band (the differentiator vs a directory) ── */}
      <section
        aria-labelledby="ai-band-heading"
        className="border-b border-border bg-background-elevated/50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <h2
            id="ai-band-heading"
            className="mb-10 text-center text-2xl font-semibold text-balance text-foreground sm:text-3xl"
          >
            The AI does the work
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {PARTNER_HUB_AI_PILLARS.map(({ Icon, title, body }) => (
              <div key={title} className="flex flex-col gap-3 text-center sm:text-left">
                <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-accent/15 sm:mx-0">
                  <Icon className="size-5 text-accent" aria-hidden="true" />
                </span>
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works (3-step timeline) ── */}
      <section
        aria-labelledby="how-it-works-heading"
        className="border-b border-border px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <h2
            id="how-it-works-heading"
            className="mb-12 text-center text-2xl font-semibold text-balance text-foreground sm:text-3xl"
          >
            Live in three steps
          </h2>
          <ol aria-label="Steps to get started" className="relative flex flex-col gap-0">
            {PARTNER_HUB_STEPS.map((step, i) => (
              <li key={i} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  {i < PARTNER_HUB_STEPS.length - 1 && (
                    <div
                      className="mt-2 w-px flex-1 bg-border"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className="flex-1 pt-1.5 text-base leading-relaxed text-foreground">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Demo band (closing CTA) ── */}
      <section
        id="demo"
        aria-labelledby="demo-heading"
        className="bg-foreground/[0.03] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="demo-heading"
            className="text-2xl font-semibold text-balance text-foreground sm:text-3xl"
          >
            Ready to grow with mdeai?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Create your partner profile in minutes. Free to start, live the same day.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              nativeButton={false}
              render={
                <Link href={SIGNUP_HREF} data-testid="partner-hub-demo-primary-cta" />
              }
            >
              Become a partner
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
          </div>
          <Separator className="mx-auto mt-12 max-w-sm" />
          <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {["Free to list", "No setup fees", "Cancel anytime"].map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <CheckCircleIcon className="size-3.5 text-success" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
