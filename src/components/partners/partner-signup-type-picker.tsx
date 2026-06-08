import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { PartnerSignupNav } from "@/components/partners/partner-signup-nav";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  PARTNER_SIGNUP_FAQ,
  PARTNER_SIGNUP_STEPS,
  PARTNER_TYPE_PICKER,
} from "@/lib/partners/partner-type-picker-config";
import {
  buildPartnerSignupPickerPath,
  buildPartnerSignupTypedPath,
  PARTNER_TYPE_LABELS,
} from "@/lib/partners/parse-partner-signup-params";
import { PARTNER_TYPES } from "@/lib/partners/partner-types";

type PartnerSignupTypePickerProps = {
  draftId?: string;
  invalidTypeParam?: string | null;
};

export function PartnerSignupTypePicker({
  draftId,
  invalidTypeParam,
}: PartnerSignupTypePickerProps) {
  const pickerPath = buildPartnerSignupPickerPath(draftId);
  const signInHref = `/login?next=${encodeURIComponent(pickerPath)}`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PartnerSignupNav pickerHref={pickerPath} signInHref={signInHref} />

      <main data-testid="partner-signup-type-picker">
        <section
          aria-labelledby="partner-signup-hero"
          className="relative overflow-hidden border-b border-border bg-background px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,oklch(0.95_0.04_160/0.7),transparent)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Partner program · Medellín
            </Badge>
            <h1
              id="partner-signup-hero"
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
            >
              Turn local demand into bookings
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              List on mdeai&apos;s AI concierge — events, venues, rentals, and
              more. One signup flow, typed to your business.
            </p>
            {invalidTypeParam ? (
              <p
                role="alert"
                className="mx-auto mt-6 max-w-lg rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                &ldquo;{invalidTypeParam}&rdquo; is not a valid partner type.
                Choose one below.
              </p>
            ) : null}
          </div>
        </section>

        <section
          aria-labelledby="choose-partner-type"
          className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="mb-10 text-center">
            <h2
              id="choose-partner-type"
              className="text-2xl font-semibold text-foreground sm:text-3xl"
            >
              Choose your partner type
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              We&apos;ll tailor onboarding to how you operate. You can change
              details later.
            </p>
          </div>

          <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNER_TYPES.map((partnerType) => {
              const meta = PARTNER_TYPE_PICKER[partnerType];
              const Icon = meta.Icon;
              const label = PARTNER_TYPE_LABELS[partnerType];

              return (
                <li key={partnerType}>
                  <Link
                    href={buildPartnerSignupTypedPath(partnerType, draftId)}
                    className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
                  >
                    <Card className="h-full motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:shadow-md">
                      <CardHeader>
                        <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                          <Icon aria-hidden="true" />
                        </div>
                        <CardTitle>{label}</CardTitle>
                        <CardDescription>{meta.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="mt-auto border-0 bg-transparent p-4 pt-0">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                          {meta.cta}
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
          aria-labelledby="partner-signup-steps"
          className="border-y border-border bg-muted/40 px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-4xl">
            <h2 id="partner-signup-steps" className="sr-only">
              How partner signup works
            </h2>
            <ol className="grid list-none gap-6 sm:grid-cols-3">
              {PARTNER_SIGNUP_STEPS.map((step, index) => (
                <li key={step.id}>
                  <Card size="sm" className="h-full text-center">
                    <CardContent className="flex flex-col items-center gap-2 pt-4">
                      <span
                        className="flex size-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground"
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                      <CardTitle className="text-base">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          aria-labelledby="partner-signup-faq"
          className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8"
        >
          <div>
            <h3
              id="partner-signup-faq"
              className="mb-4 text-center text-lg font-semibold text-foreground"
            >
              Frequently asked questions
            </h3>
            <Accordion className="rounded-xl border border-border bg-card px-4">
              {PARTNER_SIGNUP_FAQ.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-border px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© mdeai · Medellín AI</span>
          <nav aria-label="Partner signup footer" className="flex flex-wrap gap-3">
            <Link
              href="/partners/rentals"
              className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Partner rentals
            </Link>
            <Separator orientation="vertical" className="hidden h-4 sm:inline" />
            <Link
              href="/host/event/new"
              className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Host an event
            </Link>
            <Separator orientation="vertical" className="hidden h-4 sm:inline" />
            <Link
              href="/legal/privacy"
              className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
