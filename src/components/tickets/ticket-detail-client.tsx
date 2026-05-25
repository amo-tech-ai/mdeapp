"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TicketQrDisplay } from "@/components/tickets/ticket-qr-display";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatEventWhen,
  formatWalletMoney,
} from "@/lib/tickets/wallet-format";
import type { WalletOrderPayload } from "@/lib/tickets/wallet-types";

type TicketDetailClientProps = {
  orderId: string;
  accessToken: string;
};

export function TicketDetailClient({
  orderId,
  accessToken,
}: TicketDetailClientProps) {
  const [payload, setPayload] = useState<WalletOrderPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ orderId, token: accessToken });

    fetch(`/api/tickets/wallet?${params}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("not found");
        return res.json() as Promise<WalletOrderPayload>;
      })
      .then((data) => {
        if (!cancelled) setPayload(data);
      })
      .catch(() => {
        if (!cancelled) setMissing(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId, accessToken]);

  if (loading) {
    return (
      <main className="mx-auto max-w-lg px-4 py-10">
        <p className="text-sm text-muted-foreground">Loading ticket…</p>
      </main>
    );
  }

  if (missing || !payload) {
    return (
      <main className="mx-auto max-w-lg px-4 py-10">
        <p className="font-medium">Ticket not found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Check your email link or try again after payment completes.
        </p>
        <Link
          href="/me/tickets"
          className={cn(buttonVariants({ variant: "outline" }), "mt-4 inline-flex")}
        >
          ← My tickets
        </Link>
      </main>
    );
  }

  const { order, event, attendees } = payload;
  const activeAttendees = attendees.filter((a) => a.status === "active");
  const primary = activeAttendees[0] ?? attendees[0];

  if (order.status === "pending") {
    return (
      <main className="mx-auto max-w-lg px-4 py-10" data-testid="my-tickets-pending">
        <h1 className="font-serif text-2xl font-semibold">Payment processing</h1>
        <p className="mt-2 text-muted-foreground">
          Order {order.short_id ?? order.id.slice(0, 8)} is still pending. Refresh
          after Stripe confirms payment.
        </p>
        <Link
          href="/me/tickets"
          className={cn(buttonVariants({ variant: "outline" }), "mt-4 inline-flex")}
        >
          ← My tickets
        </Link>
      </main>
    );
  }

  if (!primary?.qr_token) {
    return (
      <main className="mx-auto max-w-lg px-4 py-10">
        <p>No QR available for this order yet.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10" data-testid="my-tickets-detail">
      <Link
        href="/me/tickets"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-6 -ml-2 inline-flex",
        )}
      >
        ← My tickets
      </Link>

      <TicketQrDisplay
        value={primary.qr_token}
        label={`${primary.full_name ?? order.buyer_name ?? "Guest"} · scan at door`}
      />

      <div className="mt-6 space-y-1 text-center">
        <h1 className="font-serif text-xl font-semibold">{event.name}</h1>
        <p className="text-sm text-muted-foreground">
          {formatEventWhen(event.event_start_time)}
        </p>
        {event.address ? (
          <p className="text-sm text-muted-foreground">
            {event.address}
            {event.city ? ` · ${event.city}` : ""}
          </p>
        ) : null}
        <p className="pt-2 text-sm">
          Order {order.short_id ?? order.id.slice(0, 8)} · Paid{" "}
          {formatWalletMoney(order.total_cents, order.currency)}
        </p>
      </div>
    </main>
  );
}
