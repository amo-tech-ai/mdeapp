import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Rentals home · mdeai",
};

/** RE-DES-002 placeholder — broker concierge ships in SAN-1093. */
export default function HostRentalsHomePage() {
  return (
    <main data-testid="host-rentals-home" className="space-y-4 py-8">
      <h1 className="font-serif text-2xl font-semibold">Rentals home</h1>
      <p className="max-w-lg text-sm text-muted-foreground">
        Multi-turn AI for marketing copy, performance analysis, and portfolio questions
        lands here. Inventory management lives in Listings.
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
