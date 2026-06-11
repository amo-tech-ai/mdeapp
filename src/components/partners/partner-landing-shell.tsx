import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  MessageSquareIcon,
  PhoneIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ─── Slot types ──────────────────────────────────────────────────────────────

export type HeroConfig = {
  kicker: string;
  h1: string;
  sub: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export type ValuePropConfig = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export type FeatureConfig = {
  icon: LucideIcon;
  title: string;
  body: string;
  ai?: boolean;
};

export type HowItWorksStep = {
  n: number;
  title: string;
  sub: string;
};

export type PartnerLandingShellProps = {
  /** data-testid on the root element. */
  testId: string;
  hero: HeroConfig;
  valueProps: [ValuePropConfig, ValuePropConfig, ValuePropConfig];
  features: FeatureConfig[];
  howItWorks: HowItWorksStep[];
  /** One-line pricing teaser shown before the contact CTA. */
  pricingLine: string;
  /** Signup href, e.g. /partners/signup?type=venue. Used for all CTA buttons. */
  signupHref: string;
};

// ─── Shell ───────────────────────────────────────────────────────────────────

/**
 * Reusable partner marketing landing shell.
 * Slot order (D-PTR INDEX): Hero → ValueProps → Features → HowItWorks →
 * PricingTeaser → DemoBand.
 *
 * D-PTR-02 (SAN-661 · MKT — For Venues landing) is the first consumer.
 * D-PTR-03/04/05/08 configure this shell without rebuilding it.
 */
export function PartnerLandingShell({
  testId,
  hero,
  valueProps,
  features,
  howItWorks,
  pricingLine,
  signupHref,
}: PartnerLandingShellProps) {
  return (
    <div data-testid={testId}>
      {/* ── Hero ── */}
      <section
        aria-label={hero.h1}
        className="relative overflow-hidden border-b border-border px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <Badge variant="secondary" className="w-fit tracking-wide">
            {hero.kicker}
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {hero.h1}
          </h1>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {hero.sub}
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button
              size="lg"
              nativeButton={false}
              render={
                <Link
                  href={hero.primaryHref}
                  data-testid={`${testId}-primary-cta`}
                />
              }
            >
              {hero.primaryLabel}
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
            {hero.secondaryLabel && hero.secondaryHref && (
              <Button
                variant="outline"
                size="lg"
                nativeButton={false}
                render={
                  <Link
                    href={hero.secondaryHref}
                    data-testid={`${testId}-secondary-cta`}
                  />
                }
              >
                {hero.secondaryLabel}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ── Value props ── */}
      <section
        aria-labelledby="value-props-heading"
        className="border-b border-border px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <h2
            id="value-props-heading"
            className="mb-10 text-center text-2xl font-semibold text-balance text-foreground sm:text-3xl"
          >
            Why partner with mdeai
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {valueProps.map(({ icon: Icon, title, body }) => (
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

      {/* ── Features grid ── */}
      <section
        aria-labelledby="features-heading"
        className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <h2
            id="features-heading"
            className="mb-10 text-center text-2xl font-semibold text-balance text-foreground sm:text-3xl"
          >
            Everything your venue needs
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body, ai }) => (
              <Card key={title} className="h-full">
                <CardHeader className="gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/15">
                      <Icon className="size-4 text-accent" aria-hidden="true" />
                    </span>
                    {ai && (
                      <Badge variant="outline" className="text-xs">
                        AI-powered
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base leading-snug">{title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {body}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works (5-step timeline) ── */}
      <section
        aria-labelledby="how-it-works-heading"
        className="border-y border-border bg-background-elevated/50 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="how-it-works-heading"
            className="mb-12 text-center text-2xl font-semibold text-balance text-foreground sm:text-3xl"
          >
            How it works
          </h2>
          <ol aria-label="Steps to get started" className="relative flex flex-col gap-0">
            {howItWorks.map(({ n, title, sub }, i) => (
              <li key={n} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-sm text-accent-foreground"
                    aria-hidden="true"
                  >
                    {n}
                  </span>
                  {i < howItWorks.length - 1 && (
                    <div
                      className="mt-2 w-px flex-1 bg-border motion-reduce:hidden"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="flex-1 pb-1 pt-1">
                  <p className="text-base font-semibold text-foreground">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{sub}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Pricing teaser (contact-gated, no public numbers) ── */}
      <section
        aria-labelledby="pricing-heading"
        className="border-b border-border px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="pricing-heading"
            className="text-2xl font-semibold text-balance text-foreground sm:text-3xl"
          >
            {pricingLine}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Flexible plans for every venue size. Contact us to see what fits.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="mt-8"
            nativeButton={false}
            render={
              <Link href="/contact" data-testid={`${testId}-pricing-cta`} />
            }
          >
            <MessageSquareIcon data-icon="inline-start" aria-hidden="true" />
            Talk to us about pricing
          </Button>
        </div>
      </section>

      {/* ── Demo band (closing dark CTA, Mindtrip pattern) ── */}
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
            Ready to grow your venue?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Join mdeai and put your venue inside Medellín's AI concierge today.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              nativeButton={false}
              render={
                <Link
                  href={signupHref}
                  data-testid={`${testId}-demo-primary-cta`}
                />
              }
            >
              List your venue free
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              nativeButton={false}
              render={
                <Link
                  href="/contact"
                  data-testid={`${testId}-demo-secondary-cta`}
                />
              }
            >
              <PhoneIcon data-icon="inline-start" aria-hidden="true" />
              Book a demo
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
    </div>
  );
}
