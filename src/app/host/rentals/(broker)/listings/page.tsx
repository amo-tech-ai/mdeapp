import { Suspense } from "react";
import {
  RentalsListingsShell,
  RentalsListingsSkeleton,
} from "@/components/host/rentals/rentals-listings-shell";
import { fetchBrokerListings } from "@/lib/rentals/fetch-broker-listings";
import { getBrokerContext } from "@/lib/rentals/get-broker-context";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Broker listings · mdeai",
};

async function ListingsContent() { // skipcq: JS-0067 - server component loader
  const ctx = await getBrokerContext();
  if (ctx.state !== "authorized") {
    return null;
  }

  const supabase = await createClient();
  const result = await fetchBrokerListings(supabase, ctx.user.id);

  return (
    <main data-testid="rentals-listings">
      <RentalsListingsShell
        initialListings={result.ok ? result.listings : []}
        loadError={result.ok ? null : result.message}
      />
    </main>
  );
}

/** SAN-1094 · RE-DES-003 — broker inventory grid + optional map split. */
// skipcq: JS-0067 - Next.js App Router page default export
export default function HostRentalsListingsPage() {
  return (
    <Suspense fallback={<RentalsListingsSkeleton />}>
      <ListingsContent />
    </Suspense>
  );
}
