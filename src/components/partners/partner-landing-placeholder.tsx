import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PartnerType } from "@/lib/partners/partner-types";
import { cn } from "@/lib/utils";

export type PartnerLandingPlaceholderProps = {
  /** Display name for the partner type, e.g. "Brokers & rental hosts". */
  partnerLabel: string;
  /** One-line summary of who this page serves. */
  tagline: string;
  /** Short explanation of the partner type's value. */
  description: string;
  /** Bullets describing what the full landing will offer. */
  highlights: string[];
  /** Signup wizard type param — drives `/partners/signup?type=…`. */
  signupType: PartnerType;
  /** Linear task this placeholder stands in for, shown as visible copy. */
  linearRef: string;
  /**
   * Whether the typed signup wizard exists on this build.
   * When false the signup CTA renders disabled (safe fallback) — see SAN-723.
   */
  signupAvailable?: boolean;
};

/**
 * Shared placeholder shell for partner landing pages that are scoped but not
 * yet built (SAN-691 / SAN-664 / SAN-663). Prevents dead links from the
 * SAN-692 partner hub cards while the full landings are pending.
 *
 * Tokens only (no hardcoded gray), mobile-first responsive, motion guarded
 * behind `motion-safe:` so `prefers-reduced-motion` users see no animation.
 */
export function PartnerLandingPlaceholder({
  partnerLabel,
  tagline,
  description,
  highlights,
  signupType,
  linearRef,
  signupAvailable = true,
}: PartnerLandingPlaceholderProps) {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-background text-foreground"
    >
      <section className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-16 sm:py-24">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-accent motion-safe:animate-pulse"
            />
            Coming soon
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {partnerLabel}
          </h1>
          <p className="text-lg text-muted-foreground">{tagline}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What&rsquo;s coming</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {highlights.map((highlight) => (
                <li key={highlight} className="flex gap-2">
                  <span aria-hidden="true" className="text-accent">
                    &rarr;
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row">
          {signupAvailable ? (
            <Link
              href={`/partners/signup?type=${signupType}`}
              className={cn(buttonVariants(), "w-full sm:w-auto")}
            >
              Start signup
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className={cn(
                buttonVariants(),
                "pointer-events-none w-full opacity-60 sm:w-auto",
              )}
            >
              Signup opening soon
            </span>
          )}
          <Link
            href="/partners"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full sm:w-auto",
            )}
          >
            Back to partner hub
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Placeholder page for {linearRef}.
        </p>
      </section>
    </main>
  );
}
