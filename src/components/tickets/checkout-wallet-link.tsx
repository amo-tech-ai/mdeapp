"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WALLET_KEY_PREFIX = "mdeai_wallet:";

function readWalletHref(): string | null {
  if (typeof window === "undefined") return null;
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (!key?.startsWith(WALLET_KEY_PREFIX)) continue;
    const orderId = key.slice(WALLET_KEY_PREFIX.length);
    const token = sessionStorage.getItem(key);
    if (orderId && token) {
      return `/me/tickets/${orderId}?token=${encodeURIComponent(token)}`;
    }
  }
  return null;
}

/** After Stripe return, link to wallet using token stored pre-redirect. */
export function CheckoutWalletLink() {
  const searchParams = useSearchParams();
  const checkout = searchParams.get("checkout");
  const href = checkout === "success" ? readWalletHref() : null;

  if (!href) return null;

  return (
    <Link
      href={href}
      className={cn(buttonVariants({ size: "sm" }), "mt-3 inline-flex")}
      data-testid="checkout-wallet-link"
    >
      View my ticket QR →
    </Link>
  );
}

export function persistWalletAccess(orderId: string, accessToken: string): void {
  try {
    sessionStorage.setItem(`${WALLET_KEY_PREFIX}${orderId}`, accessToken);
  } catch {
    // Private browsing / quota — email link remains fallback
  }
}
