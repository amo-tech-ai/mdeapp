import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
  return (
    <main
      data-testid="events-browse-loading"
      className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6"
      aria-busy="true"
      aria-label="Loading events"
    >
      <div className="space-y-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-4 w-72" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={`f-${i}`} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={`c-${i}`} className="h-52 w-full rounded-lg" />
        ))}
      </div>
    </main>
  );
}
