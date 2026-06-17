import type { ReactNode } from "react";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";

/** RE-DES-005 — logo-only chrome until onboarding completes (no HostNavRail). */
export function RentalsOnboardingMinimalChrome({ children }: { children: ReactNode }) {
  return (
    <div
      data-testid="rentals-onboarding-chrome"
      className="flex min-h-screen flex-col bg-background"
    >
      <header className="flex h-14 items-center justify-between border-b border-border px-4 md:px-6">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight">
          mde·ai
        </Link>
        <SignOutButton />
      </header>
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 md:px-6">{children}</div>
    </div>
  );
}
