"use client";

import { useRef, useState } from "react";
import { AlertCircle, CreditCard, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicEventDetail, PublicEventTicket } from "@/lib/events/types";
import { formatTicketPrice } from "@/lib/events/format-event";
import {
  submitTicketCheckout,
  CheckoutApiError,
} from "@/lib/tickets/submit-ticket-checkout";
import { persistWalletAccess } from "@/components/tickets/checkout-wallet-link";
import {
  classifyCheckoutError,
  type ClassifiedCheckoutError,
} from "@/lib/tickets/checkout-error";
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

function CheckoutErrorDisplay({ err }: { err: ClassifiedCheckoutError }) {
  const Icon = err.kind === "network" ? Wifi : AlertCircle;
  return (
    <div
      role="alert"
      data-testid="booking-checkout-error"
      className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>
        <p className="font-medium">{err.heading}</p>
        <p className="mt-0.5 text-xs text-destructive/80">{err.detail}</p>
      </div>
    </div>
  );
}

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
  const [checkoutErr, setCheckoutErr] = useState<ClassifiedCheckoutError | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Stable across retries — guarantees idempotency (no double-charge on network retry)
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const lineTotal = target.tier.priceCents * target.quantity;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutErr(null);
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
      const isNetwork = err instanceof TypeError && err.message.includes("fetch");
      const msg = err instanceof Error ? err.message : undefined;
      const code = err instanceof CheckoutApiError ? err.code : undefined;
      setCheckoutErr(classifyCheckoutError(msg, code, isNetwork));
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

        {checkoutErr ? <CheckoutErrorDisplay err={checkoutErr} /> : null}

        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <CreditCard className="size-3.5 shrink-0" aria-hidden />
          <span>
            Visa, Mastercard, Apple Pay & Google Pay accepted at Stripe checkout.
            Payment is never processed in this browser.
          </span>
        </div>

        {checkoutErr?.canRetry ? (
          <p className="text-xs text-muted-foreground" data-testid="booking-checkout-retry-note">
            Retrying is safe — your payment info will not be duplicated.
          </p>
        ) : null}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          {checkoutErr && !checkoutErr.canRetry ? null : (
            <Button
              type="submit"
              data-testid="booking-checkout-submit"
              disabled={submitting}
            >
              {submitting
                ? "Redirecting…"
                : checkoutErr?.canRetry
                  ? "Try again"
                  : "Pay with Stripe"}
            </Button>
          )}
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
