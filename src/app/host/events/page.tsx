import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarPlus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/empty/empty-state";
import { HostEventsGrid } from "@/components/host/host-events-grid";
import {
  eventRowToHostCardProps,
  type HostEventRow,
} from "@/lib/events/event-row-to-host-card";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "My events · mdeai",
};

/** EVP-014 / SAN-118 — Roberto's read-only list of his own events. Server
 *  Component. RLS policy `events_organizer_select_own` scopes rows to the
 *  authenticated organizer; the `.eq` is belt-and-suspenders + correctness. */
export default async function HostEventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // /host is already a protected middleware prefix; this guards the bypass path
  // and keeps `user` non-null for the query below.
  if (!user) redirect("/login?next=/host/events");

  const { data, error } = await supabase
    .from("events")
    .select(
      "id, name, slug, status, address, city, event_start_time, primary_image_url, ticket_price_min, ticket_url",
    )
    .eq("organizer_id", user.id)
    .order("event_start_time", { ascending: false })
    .limit(50);

  // Log + render a distinct error state — a failed query must not masquerade as
  // an empty list (would hide a broken column/RLS bug). Convention mirrors
  // loadUserTrips: degrade gracefully, don't throw (no error boundary exists).
  if (error) {
    console.error("[host-events] failed to load events:", error.message);
  }

  const events = ((data ?? []) as HostEventRow[]).map(eventRowToHostCardProps);

  return (
    <main
      data-testid="host-events"
      className="mx-auto min-h-screen max-w-5xl px-4 py-8"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold">My events</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drafts and published events you host on mdeai.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-primary hover:underline">
            Back to chat
          </Link>
          <Link
            href="/host/event/new"
            data-testid="host-events-new"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <CalendarPlus className="size-4" aria-hidden />
            Create event
          </Link>
        </div>
      </div>

      {error ? (
        <EmptyState
          testId="host-events-error"
          title="Couldn't load your events"
          description="Something went wrong fetching your events. Refresh to try again."
          icon={<CalendarPlus className="size-8" />}
        />
      ) : events.length === 0 ? (
        <>
          <EmptyState
            testId="host-events-empty"
            title="No events yet"
            description="Create your first event with the AI wizard — your drafts and published events appear here."
            icon={<CalendarPlus className="size-8" />}
          />
          <div className="mt-4 text-center">
            <Link
              href="/host/event/new"
              data-testid="host-events-create-cta"
              className="text-sm font-medium text-primary hover:underline"
            >
              Create your first event
            </Link>
          </div>
        </>
      ) : (
        <HostEventsGrid events={events} />
      )}
    </main>
  );
}
