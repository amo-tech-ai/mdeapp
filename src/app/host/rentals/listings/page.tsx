import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  RentalsListingsShell,
  RentalsListingsSkeleton,
} from "@/components/host/rentals/rentals-listings-shell";
import { fetchBrokerListings } from "@/lib/rentals/fetch-broker-listings";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Broker listings · mdeai",
};

async function ListingsContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/host/rentals/listings");

  const { data: profiles } = await supabase
    .from("landlord_profiles")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  if (!profiles?.length) {
    redirect("/host/rentals/onboarding");
  }

  const result = await fetchBrokerListings(supabase, user.id);

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
export default function HostRentalsListingsPage() {
  return (
    <Suspense fallback={<RentalsListingsSkeleton />}>
      <ListingsContent />
    </Suspense>
  );
}
