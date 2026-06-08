import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PARTNER_HUB_CARDS,
  PARTNER_HUB_STEPS,
} from "@/lib/partners/partner-hub-config";

function SignupStepMarquee() {
  const steps = PARTNER_HUB_STEPS.map((label, i) => ({ n: i + 1, label }));
  const loop = [...steps, ...steps];
  return (
    <div className="relative overflow-hidden" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-4 motion-reduce:animate-none">
        {loop.map((step, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground"
          >
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
              {step.n}
            </span>
            {step.label}
            <ArrowRightIcon className="size-3.5 text-accent/60" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function PartnerHub() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <Badge variant="secondary">For partners · Medellín</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Grow your business with mdeai
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            List with us, sell with us, or let our AI concierge put your venue,
            event, or rental in front of locals and travellers already searching.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link href="/partners/signup" />}>
              Get started free
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href="#partner-types" />}
            >
              See partner programs
            </Button>
          </div>
        </div>
      </section>

      <section
        id="partner-types"
        aria-labelledby="partner-types-heading"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mb-10 text-center">
          <h2
            id="partner-types-heading"
            className="text-2xl font-semibold text-foreground sm:text-3xl"
          >
            Find your program
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Eight supply-side paths — each links to a typed landing or signup flow.
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
                      <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                        <Icon aria-hidden="true" />
                      </div>
                      <CardTitle>{card.label}</CardTitle>
                      <CardDescription>{card.description}</CardDescription>
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
      </section>

      <section
        aria-label="How partner signup works"
        className="border-y border-border bg-muted/40 py-12 md:py-16"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
              Live in four steps
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              One signup wizard — most partners activate the same day.
            </p>
          </div>
          <SignupStepMarquee />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 md:py-16 lg:px-8">
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
          Ready to grow with mdeai?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
          Create your partner profile in minutes. Free to start.
        </p>
        <div className="mt-6 flex justify-center">
          <Button size="lg" nativeButton={false} render={<Link href="/partners/signup" />}>
            Get started free
            <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
          </Button>
        </div>
      </section>
    </>
  );
}
