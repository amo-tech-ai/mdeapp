"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  TicketQrDisplay,
  type QrPassState,
} from "@/components/tickets/ticket-qr-display";
import { TicketPassActions } from "@/components/tickets/ticket-pass-actions";
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

// skipcq: JS-0067
function useWalletPayload(orderId: string, accessToken: string) {
  const [payload, setPayload] = useState<WalletOrderPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    const params = new URLSearchParams({ orderId, token: accessToken });
    fetch(`/api/tickets/wallet?${params}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("not found");
        return res.json() as Promise<WalletOrderPayload>;
      })
      .then((data) => { if (!cancelled) setPayload(data); })
      .catch(() => { if (!cancelled) setMissing(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [orderId, accessToken]);

  return { payload, loading, missing };
}

// skipcq: JS-0067
function resolvePassState(isUsed: boolean, isExpired: boolean): QrPassState {
  if (isUsed) return "used";
  if (isExpired) return "expired";
  return "valid";
}

// skipcq: JS-0067, JS-R1005
export function TicketDetailClient({
  orderId,
  accessToken,
}: TicketDetailClientProps) {
  const { payload, loading, missing } = useWalletPayload(orderId, accessToken);
  const [nowMs] = useState(() => Date.now());

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

  const holder = primary.full_name ?? order.buyer_name ?? "Guest";
  const eventEnd = event.event_end_time ?? event.event_start_time;
  const isExpired = new Date(eventEnd).getTime() < nowMs;
  const isUsed = primary.status !== "active";
  const passState = resolvePassState(isUsed, isExpired);
  const venueLine = [event.address, event.city].filter(Boolean).join(" · ");
  const directionsQuery = venueLine
    ? `${event.name}, ${venueLine}`
    : event.name;
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  return (
    <main className="mx-auto max-w-lg px-4 py-10" data-testid="my-tickets-detail">
      <Link
        href="/me/tickets"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-6 -ml-2 inline-flex min-h-11",
        )}
      >
        ← My tickets
      </Link>

      <div className="space-y-1 pb-5 text-center">
        <h1 className="font-serif text-xl font-semibold">{event.name}</h1>
        <p className="text-sm text-muted-foreground">
          {formatEventWhen(event.event_start_time)}
        </p>
        {venueLine ? (
          <p className="text-sm text-muted-foreground">{venueLine}</p>
        ) : null}
      </div>

      <TicketQrDisplay
        value={primary.qr_token}
        label={`${holder} · scan at door`}
        state={passState}
      />

      <dl className="mt-5 divide-y divide-border rounded-xl border border-border text-sm">
        <PassRow label="Ticket holder" value={holder} />
        <PassRow
          label="Tickets"
          value={`${order.quantity} ${order.quantity === 1 ? "ticket" : "tickets"}`}
        />
        <PassRow
          label="Order"
          value={order.short_id ?? order.id.slice(0, 8)}
        />
        <PassRow
          label="Paid"
          value={formatWalletMoney(order.total_cents, order.currency)}
        />
      </dl>

      <TicketPassActions
        eventName={event.name}
        directionsQuery={venueLine ? directionsQuery : null}
        shareUrl={shareUrl}
      />
    </main>
  );
}

// skipcq: JS-0067
function PassRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
