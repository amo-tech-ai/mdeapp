import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { DATA_PENDING_LABEL } from "@/lib/rentals/data-pending";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Rentals dashboard · mdeai",
};

/** RE-DES-004 placeholder — KPI briefing ships in SAN-1095. */
// skipcq: JS-0067
export default function HostRentalsDashboardPage() {
  return (
    <main data-testid="host-rentals-dashboard" className="space-y-4 py-8">
      <h1 className="font-serif text-2xl font-semibold">Rentals dashboard</h1>
      <p className="text-sm text-muted-foreground">
        KPI briefing — {DATA_PENDING_LABEL}
      </p>
      <Link
        href="/host/rentals/listings"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        Manage listings
      </Link>
    </main>
  );
}
