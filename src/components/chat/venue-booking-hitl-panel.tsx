"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/hooks/use-session";
import type { VenueBookingKind } from "@/lib/venues/venue-booking-form-schema";

export type VenueBookingHitlArgs = {
  venueKind: VenueBookingKind;
  placeId: string;
  requestedAt: string;
  partySize: number;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  notes?: string;
  venueTitle?: string;
};

type VenueBookingHitlPanelProps = {
  args: VenueBookingHitlArgs;
  status: "inProgress" | "executing" | "complete";
  respond: (decision: "approved" | "rejected" | "edit") => void;
};

function formatRequestedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** SAN-302 — HITL confirm card before requestVenueBooking inserts. */
export function VenueBookingHitlPanel({
  args,
  status,
  respond,
}: VenueBookingHitlPanelProps) {
  const { user, loading } = useSession();
  const [decided, setDecided] = useState(false);

  const venueLabel = args.venueTitle?.trim() || args.placeId;

  return (
    <Card
      className="mx-2 my-3 max-w-lg border-primary/30 sm:mx-4"
      data-testid="venue-booking-hitl-card"
    >
      <CardHeader>
        <CardTitle>Send booking request?</CardTitle>
        <CardDescription>
          Review details below. This is a request — not a confirmed reservation.
          Patricia will follow up by WhatsApp.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Venue:</span> {venueLabel}
        </p>
        <p>
          <span className="font-medium">When:</span>{" "}
          {formatRequestedAt(args.requestedAt)}
        </p>
        <p>
          <span className="font-medium">Party:</span> {args.partySize}
        </p>
        <p>
          <span className="font-medium">Contact:</span> {args.contactName} ·{" "}
          {args.contactEmail}
        </p>
        {args.contactPhone ? (
          <p>
            <span className="font-medium">Phone:</span> {args.contactPhone}
          </p>
        ) : null}
        {args.notes ? (
          <p>
            <span className="font-medium">Notes:</span> {args.notes}
          </p>
        ) : null}
        {loading ? (
          <p className="text-muted-foreground">Checking session…</p>
        ) : null}
        {!loading && !user ? (
          <div
            className="rounded-lg border border-border bg-muted/40 p-3"
            data-testid="venue-booking-hitl-sign-in"
          >
            <p className="font-medium">Sign in to send this request</p>
            <p className="mt-1 text-muted-foreground">
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
              {" · "}
              <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        ) : null}
      </CardContent>
      {status === "executing" && !decided ? (
        <CardFooter className="flex flex-wrap gap-2">
          {user ? (
            <>
              <Button
                type="button"
                data-testid="venue-booking-hitl-approve"
                onClick={() => {
                  setDecided(true);
                  respond("approved");
                }}
              >
                Send request
              </Button>
              <Button
                type="button"
                variant="outline"
                data-testid="venue-booking-hitl-edit"
                onClick={() => {
                  setDecided(true);
                  respond("edit");
                }}
              >
                Edit details
              </Button>
            </>
          ) : null}
          <Button
            type="button"
            variant={user ? "destructive" : "outline"}
            data-testid="venue-booking-hitl-reject"
            onClick={() => {
              setDecided(true);
              respond("rejected");
            }}
          >
            Cancel
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
