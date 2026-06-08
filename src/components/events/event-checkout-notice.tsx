"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutWalletLink } from "@/components/tickets/checkout-wallet-link";
import { cn } from "@/lib/utils";

/** Post-Stripe return banner on event detail (SCREEN-009). */
export function EventCheckoutNotice() {
  const searchParams = useSearchParams();
  const status = searchParams.get("checkout");
  const [dismissed, setDismissed] = useState(false);

  const show =
    !dismissed && (status === "success" || status === "cancelled");

  if (!show || !status) return null;

  const isSuccess = status === "success";

  return (
    <div
      className={cn(
        "mx-auto mb-4 max-w-6xl px-4",
      )}
    >
      <div
        className={cn(
          "flex gap-3 rounded-lg border px-4 py-3 text-sm",
          isSuccess
            ? "border-primary/30 bg-primary/5"
            : "border-border bg-muted",
        )}
        data-testid={isSuccess ? "checkout-success-notice" : "checkout-cancel-notice"}
        role="status"
      >
        {isSuccess ? (
          <CheckCircle
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden
          />
        ) : (
          <X className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
        )}

        <div className="min-w-0 flex-1">
          <p className="font-medium">
            {isSuccess
              ? "Payment received — check your email for tickets."
              : "Checkout not completed"}
          </p>
          {isSuccess ? (
            <>
              <p className="mt-1 text-muted-foreground">
                Your order is processing. Your QR code will be ready shortly.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <CheckoutWalletLink />
                <Link
                  href="/me/tickets"
                  className="inline-flex items-center text-xs text-primary underline-offset-2 hover:underline"
                  data-testid="checkout-my-tickets-link"
                >
                  My tickets →
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="mt-1 text-muted-foreground">
                No charge was made. Scroll up to select tickets and try again.
              </p>
              <a
                href="#event-tiers-heading"
                className="mt-2 inline-flex text-xs text-primary underline-offset-2 hover:underline"
                data-testid="checkout-retry-anchor"
              >
                Back to tickets ↑
              </a>
            </>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-6 shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
        >
          <X className="size-3.5" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
