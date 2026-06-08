import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailLoading() {
  return (
    <div
      data-testid="event-detail-skeleton"
      className="min-h-screen bg-background pb-24 md:pb-8"
      aria-busy="true"
      aria-label="Loading event"
    >
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-8 w-16" />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 md:grid-cols-[1fr_minmax(320px,400px)] md:py-8">
        <div className="space-y-6">
          <Skeleton className="aspect-[16/10] w-full rounded-xl" />
          <Skeleton className="h-8 w-3/4 max-w-md" />
          <Skeleton className="h-4 w-48" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        <aside className="space-y-4">
          <Skeleton className="hidden h-8 w-full max-w-sm md:block" />
          <Skeleton className="hidden h-4 w-40 md:block" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </aside>
      </div>
    </div>
  );
}
