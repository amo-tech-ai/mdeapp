"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitVenueLead } from "@/lib/partners/submit-venue-lead";
import {
  VENUE_LEAD_TYPES,
  type VenueLeadType,
} from "@/lib/partners/venue-lead-schema";

const TYPE_LABELS: Record<VenueLeadType, string> = {
  restaurant: "Restaurant",
  cafe: "Café",
  nightclub: "Nightclub / Bar",
  space: "Event space",
  other: "Other",
};

/** Map the page ?v= variant to a sensible default venue type. */
function defaultType(variant: string): VenueLeadType | "" {
  return (VENUE_LEAD_TYPES as readonly string[]).includes(variant)
    ? (variant as VenueLeadType)
    : "";
}

const FIELD =
  "h-11 text-base " +
  "md:text-sm"; // h-11 = 44px touch target; text-base avoids iOS zoom on focus.

type Props = {
  /** testId prefix, e.g. "venues-landing". */
  testId: string;
  /** Page ?v= variant — preselects the venue type + attributes the lead. */
  variant: string;
  /** Signup href for the "start now" escape hatch + success CTA. */
  signupHref: string;
};

/**
 * SAN-661 · MKT — For Venues landing (/venues) inline lead form.
 * Captures interest in-page (no /contact navigation) → /api/partners/venue-leads.
 */
export function PartnerLeadForm({ testId, variant, signupHref }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueType, setVenueType] = useState<VenueLeadType | "">(
    defaultType(variant),
  );
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!venueType) {
      setError("Please choose your venue type");
      return;
    }
    setSubmitting(true);
    try {
      await submitVenueLead({
        name: name.trim(),
        email: email.trim(),
        venueName: venueName.trim(),
        venueType,
        message: message.trim() || undefined,
        variant,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your request");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div
        data-testid={`${testId}-lead-success`}
        className="rounded-2xl border border-border bg-background-elevated p-6 text-center"
      >
        <CheckCircleIcon
          className="mx-auto size-8 text-success"
          aria-hidden="true"
        />
        <p className="mt-3 text-base font-semibold text-foreground">
          Thanks — we&apos;ll be in touch within 1 business day.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Want to get started right away? You can list your venue now.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          nativeButton={false}
          render={<Link href={signupHref} data-testid={`${testId}-success-cta`} />}
        >
          List your venue
          <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
        </Button>
      </div>
    );
  }

  return (
    <form
      data-testid={`${testId}-lead-form`}
      className="rounded-2xl border border-border bg-background p-5 text-left shadow-sm sm:p-6"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor={`${testId}-name`}>Your name</Label>
          <Input
            id={`${testId}-name`}
            data-testid={`${testId}-field-name`}
            className={FIELD}
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${testId}-email`}>Email</Label>
          <Input
            id={`${testId}-email`}
            data-testid={`${testId}-field-email`}
            className={FIELD}
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${testId}-venue-name`}>Venue name</Label>
          <Input
            id={`${testId}-venue-name`}
            data-testid={`${testId}-field-venue-name`}
            className={FIELD}
            name="venueName"
            required
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${testId}-venue-type`}>Venue type</Label>
          <select
            id={`${testId}-venue-type`}
            data-testid={`${testId}-field-venue-type`}
            className="h-11 w-full rounded-lg border border-input bg-transparent px-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            name="venueType"
            required
            value={venueType}
            onChange={(e) => setVenueType(e.target.value as VenueLeadType)}
            disabled={submitting}
          >
            <option value="" disabled>
              Select venue type…
            </option>
            {VENUE_LEAD_TYPES.map((t) => (
              <option key={t} value={t}>
                {TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={`${testId}-message`}>
            Message <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id={`${testId}-message`}
            data-testid={`${testId}-field-message`}
            className="text-base md:text-sm"
            name="message"
            rows={3}
            placeholder="Tell us about your venue…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={submitting}
          />
        </div>

        {error ? (
          <p
            role="alert"
            data-testid={`${testId}-lead-error`}
            className="text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          data-testid={`${testId}-lead-submit`}
          disabled={submitting}
        >
          {submitting ? "Sending…" : "Request access"}
          {!submitting && <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          No credit card required. Or{" "}
          <Link
            href={signupHref}
            className="font-medium text-accent underline-offset-2 hover:underline"
            data-testid={`${testId}-lead-signup-link`}
          >
            list your venue now
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
