import Link from "next/link";
import { Luggage } from "lucide-react";
import { EmptyState } from "@/components/empty/empty-state";
import { TripsDashboardGrid } from "@/components/trips/trips-dashboard-grid";
import { loadUserTrips } from "@/lib/trips/load-user-trips";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "My trips · mdeai",
};

export default async function TripsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const trips = user ? await loadUserTrips(user.id) : [];

  return (
    <main
      data-testid="trips-dashboard"
      className="mx-auto min-h-screen max-w-5xl px-4 py-8"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold">My trips</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Plans for Camila&apos;s Medellín move, weekends, and event runs.
          </p>
        </div>
        <Link href="/" className="text-sm text-primary hover:underline">
          Back to chat
        </Link>
      </div>

      {!user ? (
        <EmptyState
          testId="trips-empty-signin"
          title="Sign in to view your trips"
          description="Your trip hub appears here once you're logged in."
          icon={<Luggage className="size-8" />}
        />
      ) : null}

      {user && trips.length === 0 ? (
        <>
          <EmptyState
            testId="trips-empty-list"
            title="No trips yet"
            description="Start from chat — ask for rentals or events, then create a trip from your shortlist."
            icon={<Luggage className="size-8" />}
          />
          <div className="mt-4 text-center">
            <Link
              href="/"
              data-testid="trips-start-chat"
              className="text-sm font-medium text-primary hover:underline"
            >
              Start in chat
            </Link>
          </div>
        </>
      ) : null}

      {user && trips.length > 0 ? <TripsDashboardGrid trips={trips} /> : null}

      {!user ? (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/login?next=/trips" className="font-medium text-primary hover:underline">
            Sign in
          </Link>{" "}
          to sync trips across devices.
        </p>
      ) : null}
    </main>
  );
}
