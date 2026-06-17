import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Broker onboarding · mdeai",
};

/** RE-DES-005 gate placeholder — full wizard ships separately. */
export default function HostRentalsOnboardingPage() {
  return (
    <main data-testid="host-rentals-onboarding" className="space-y-4 py-8">
      <h1 className="font-serif text-2xl font-semibold">Broker onboarding</h1>
      <p className="max-w-lg text-sm text-muted-foreground">
        Create your broker profile to publish rental listings. The onboarding wizard is
        the next slice — use the RPC-backed draft flow when ready.
      </p>
      <Link
        href="/host/rentals/listings"
        className={cn(buttonVariants({ size: "sm" }))}
      >
        Back to listings
      </Link>
    </main>
  );
}
