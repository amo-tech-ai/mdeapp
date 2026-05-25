"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { PublicEventDetail, PublicEventTicket } from "@/lib/events/types";
import { formatTicketPrice } from "@/lib/events/format-event";
import { submitTicketCheckout } from "@/lib/tickets/submit-ticket-checkout";
import { persistWalletAccess } from "@/components/tickets/checkout-wallet-link";
import { useModalA11y } from "@/lib/use-modal-a11y";

export type BookingCheckoutTarget = {
  event: Pick<PublicEventDetail, "id" | "name">;
  tier: PublicEventTicket;
  quantity: number;
};

type BookingCheckoutModalProps = {
  target: BookingCheckoutTarget | null;
  returnPath: string;
  onClose: () => void;
};

function BookingCheckoutForm({
  target,
  returnPath,
  onClose,
}: {
  target: BookingCheckoutTarget;
  returnPath: string;
  onClose: () => void;
}) {
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const lineTotal = target.tier.priceCents * target.quantity;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await submitTicketCheckout({
        eventId: target.event.id,
        ticketId: target.tier.id,
        quantity: target.quantity,
        buyerEmail: buyerEmail.trim(),
        buyerName: buyerName.trim(),
        idempotencyKey,
        returnPath,
      });
      persistWalletAccess(result.orderId, result.walletAccessToken);
      window.location.assign(result.stripeSessionUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setSubmitting(false);
    }
  };

  return (
    <>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Tier</dt>
          <dd className="font-medium">{target.tier.name}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Quantity</dt>
          <dd className="font-medium">{target.quantity}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-2">
          <dt className="text-muted-foreground">Total</dt>
          <dd className="font-semibold">
            {formatTicketPrice(lineTotal, target.tier.currency)}
          </dd>
        </div>
      </dl>
      <form className="mt-4 space-y-3" onSubmit={handlePay}>
        <label className="block text-sm">
          <span className="font-medium">Full name</span>
          <input
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            name="buyerName"
            autoComplete="name"
            required
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            disabled={submitting}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Email</span>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            name="email"
            autoComplete="email"
            required
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            disabled={submitting}
          />
        </label>
        {error ? (
          <p
            role="alert"
            className="text-sm text-destructive"
            data-testid="booking-checkout-error"
          >
            {error}
          </p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          You will redirect to Stripe Checkout. Payment is never processed in the browser.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" data-testid="booking-checkout-submit" disabled={submitting}>
            {submitting ? "Redirecting…" : "Pay with Stripe"}
          </Button>
        </div>
      </form>
    </>
  );
}

/** SCREEN-009 — tier checkout → /api/tickets/checkout → Stripe redirect (EVT-01). */
export function BookingCheckoutModal({
  target,
  returnPath,
  onClose,
}: BookingCheckoutModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useModalA11y(Boolean(target), onClose, panelRef);

  if (!target) return null;

  const formKey = `${target.event.id}:${target.tier.id}:${target.quantity}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="presentation"
      data-testid="booking-checkout-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-checkout-title"
        className="w-full max-w-md rounded-xl border border-border bg-background p-4 shadow-lg"
      >
        <h2 id="booking-checkout-title" className="text-lg font-semibold">
          Buy tickets
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{target.event.name}</p>
        <BookingCheckoutForm
          key={formKey}
          target={target}
          returnPath={returnPath}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
