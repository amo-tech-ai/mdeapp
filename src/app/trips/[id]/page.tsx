import Link from "next/link";
import { notFound } from "next/navigation";
import { TripWorkspaceView } from "@/components/trips/trip-workspace-view";
import { createClient } from "@/lib/supabase/server";
import { formatTripDateRange } from "@/lib/trips/load-user-trips";
import { loadTripWorkspace } from "@/lib/trips/load-trip-workspace";

type TripDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main data-testid="trips-workspace" className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-sm text-muted-foreground">
          <Link href={`/login?next=/trips/${id}`} className="text-primary hover:underline">
            Sign in
          </Link>{" "}
          to open this trip.
        </p>
      </main>
    );
  }

  const trip = await loadTripWorkspace(id, user.id);
  if (!trip) notFound();

  return (
    <main data-testid="trips-workspace" className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold">{trip.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatTripDateRange(trip.start_date, trip.end_date)}
            {trip.destination ? ` · ${trip.destination}` : ""}
            {" · "}
            <span className="capitalize">{trip.status}</span>
          </p>
        </div>
        <Link href="/trips" className="text-sm text-primary hover:underline">
          All trips
        </Link>
      </div>
      <TripWorkspaceView trip={trip} />
    </main>
  );
}
