"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { buildVenueBookingIdempotencyKey } from "@/lib/venues/venue-booking-core";
import { submitVenueBooking } from "@/lib/venues/submit-venue-booking";
import type {
  VenueBookingKind,
  VenueBookingSubmitResult,
} from "@/lib/venues/venue-booking-form-schema";

export function VenueBookingForm({
  venueKind,
  placeId,
  venueTitle,
  onSuccess,
}: {
  venueKind: VenueBookingKind;
  placeId: string;
  venueTitle: string;
  onSuccess: (result: VenueBookingSubmitResult) => void;
}) {
  const { user, loading } = useSession();
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [requestedAtLocal, setRequestedAtLocal] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="venue-booking-loading">
        Checking session…
      </p>
    );
  }

  if (!user) {
    return (
      <div
        className="rounded-lg border border-border bg-muted/40 p-3 text-sm"
        data-testid="venue-booking-sign-in-gate"
      >
        <p className="font-medium">Sign in to request a booking</p>
        <p className="mt-1 text-muted-foreground">
          We save your request securely. WhatsApp confirmation comes after our team
          reviews it — not an instant reservation.
        </p>
        <p className="mt-2">
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
          {" · "}
          <Link
            href="/signup"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!requestedAtLocal) {
      setError("Choose a date and time for your visit.");
      return;
    }

    const requestedAt = new Date(requestedAtLocal);
    if (Number.isNaN(requestedAt.getTime())) {
      setError("Choose a valid date and time.");
      return;
    }

    const parsedParty = Number.parseInt(partySize, 10);
    if (!Number.isFinite(parsedParty) || parsedParty < 1) {
      setError("Party size must be at least 1.");
      return;
    }

    setSubmitting(true);
    try {
      const requestedAtIso = requestedAt.toISOString();
      const result = await submitVenueBooking({
        venueKind,
        placeId,
        requestedAt: requestedAtIso,
        partySize: parsedParty,
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim() || undefined,
        notes: notes.trim() || undefined,
        venueTitle,
        idempotencyKey: buildVenueBookingIdempotencyKey({
          venueKind,
          placeId,
          requestedAt: requestedAtIso,
          partySize: parsedParty,
        }),
      });
      onSuccess(result);
      setNotes("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit} data-testid="venue-booking-form">
      <p className="text-sm text-muted-foreground">
        Submit a visit request for <span className="font-medium text-foreground">{venueTitle}</span>.
        Status stays <span className="font-medium text-foreground">pending</span> until we
        confirm by WhatsApp.
      </p>
      <label className="block text-sm">
        <span className="font-medium">Your name</span>
        <input
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          name="contactName"
          autoComplete="name"
          required
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          disabled={submitting}
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium">Email</span>
        <input
          type="email"
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          name="contactEmail"
          autoComplete="email"
          required
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          disabled={submitting}
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium">Phone (optional, for WhatsApp)</span>
        <input
          type="tel"
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          name="contactPhone"
          autoComplete="tel"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          disabled={submitting}
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium">Preferred date & time</span>
        <input
          type="datetime-local"
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          name="requestedAt"
          required
          value={requestedAtLocal}
          onChange={(e) => setRequestedAtLocal(e.target.value)}
          disabled={submitting}
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium">Party size</span>
        <input
          type="number"
          min={1}
          max={50}
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          name="partySize"
          required
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
          disabled={submitting}
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium">Notes (optional)</span>
        <textarea
          className="mt-1 min-h-[4rem] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={submitting}
          maxLength={2000}
        />
      </label>
      {error ? (
        <p
          role="alert"
          className="text-sm text-destructive"
          data-testid="venue-booking-error"
        >
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        data-testid="venue-booking-submit"
        disabled={submitting}
        className="w-full"
      >
        {submitting ? "Sending request…" : "Send booking request"}
      </Button>
    </form>
  );
}
