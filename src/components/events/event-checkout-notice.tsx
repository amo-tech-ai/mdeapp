"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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
        isSuccess
          ? "rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm"
          : "rounded-lg border border-border bg-muted px-4 py-3 text-sm",
      )}
      data-testid={isSuccess ? "checkout-success-notice" : "checkout-cancel-notice"}
      role="status"
    >
      <p className="font-medium">
        {isSuccess ? "Payment received — check your email for tickets." : "Checkout cancelled"}
      </p>
      {isSuccess ? (
        <>
          <p className="mt-1 text-muted-foreground">
            Your order is processing. Open My Tickets for your QR code at the door.
          </p>
          <CheckoutWalletLink />
        </>
      ) : (
        <p className="mt-1 text-muted-foreground">No charge was made. You can try again anytime.</p>
      )}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="mt-2 h-auto p-0 text-primary"
        onClick={() => setDismissed(true)}
      >
        Dismiss
      </Button>
    </div>
  );
}
