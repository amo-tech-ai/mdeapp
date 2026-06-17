import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Rentals concierge · mdeai",
};

/** RE-DES-002 placeholder — deep AI workflows route here from listings helper. */
export default function HostRentalsConciergePage() {
  return (
    <main data-testid="host-rentals-concierge" className="space-y-4 py-8">
      <h1 className="font-serif text-2xl font-semibold">Rentals concierge</h1>
      <p className="max-w-lg text-sm text-muted-foreground">
        Multi-turn AI for marketing copy, performance analysis, and portfolio questions.
        Inventory management lives in Listings.
      </p>
      <Link
        href="/host/rentals/listings"
        data-testid="host-rentals-go-listings"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        Open listings
      </Link>
    </main>
  );
}
