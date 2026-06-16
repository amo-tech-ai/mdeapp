"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CheckoutWalletLink,
  readWalletAccess,
} from "@/components/tickets/checkout-wallet-link";
import { cn } from "@/lib/utils";

/** Poll the real order until finalized; resolve to confirmed vs still pending. */
type FinalizeState = "pending" | "confirmed";

function useOrderFinalizeState(active: boolean): FinalizeState {
  const [state, setState] = useState<FinalizeState>("pending");

  useEffect(() => {
    if (!active) return;
    const access = readWalletAccess();
    if (!access) return; // No token (e.g. email-only return) → stay pending

    let cancelled = false;
    let attempts = 0;
    const poll = async () => {
      attempts += 1;
      try {
        const res = await fetch(
          `/api/tickets/wallet?orderId=${encodeURIComponent(access.orderId)}&token=${encodeURIComponent(access.token)}`,
        );
        if (res.ok) {
          const data = (await res.json()) as { order?: { status?: string } };
          if (data?.order?.status === "paid") {
            if (!cancelled) setState("confirmed");
            return;
          }
        }
      } catch {
        // Network hiccup — retry below; never claim success on error
      }
      if (!cancelled && attempts < 6) {
        window.setTimeout(poll, 2000);
      }
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return state;
}

/** Post-Stripe return banner on event detail (SCREEN-009). */
export function EventCheckoutNotice() {
  const searchParams = useSearchParams();
  const status = searchParams.get("checkout");
  const [dismissed, setDismissed] = useState(false);

  const isSuccess = status === "success";
  const finalizeState = useOrderFinalizeState(isSuccess && !dismissed);

  const show =
    !dismissed && (status === "success" || status === "cancelled");

  if (!show || !status) return null;

  const confirmed = isSuccess && finalizeState === "confirmed";

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
                {confirmed
                  ? "Your tickets are confirmed and ready in your wallet."
                  : "Your order is processing. Your QR code will be ready shortly."}
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
