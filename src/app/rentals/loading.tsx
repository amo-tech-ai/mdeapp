import { Skeleton } from "@/components/ui/skeleton";

// Stable keys for fixed-length skeleton lists (no array-index keys — JS-0437).
const NEIGHBORHOOD_SKELETON_KEYS = ["n-a", "n-b", "n-c", "n-d", "n-e"];
const BEDS_SKELETON_KEYS = ["b-a", "b-b", "b-c", "b-d"];
const PRICE_SKELETON_KEYS = ["p-a", "p-b", "p-c", "p-d"];
const CARD_SKELETON_KEYS = ["c-a", "c-b", "c-c", "c-d", "c-e", "c-f"];

// skipcq: JS-0067 - module-local skeleton component; not browser global scope
function RentalCardSkeleton() {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-card p-3">
      {/* Image — hidden on mobile, 200×120 on sm+ */}
      <Skeleton className="hidden h-[120px] w-[200px] shrink-0 rounded-md sm:block" />
      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 py-1">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-4 w-14 rounded-full" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="mt-auto flex gap-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function RentalsLoading() {
  return (
    <main
      data-testid="rentals-browse-loading"
      className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6"
      aria-busy="true"
      aria-label="Loading rentals"
    >
      {/* Sticky header */}
      <header className="sticky top-0 z-10 -mx-4 border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-start gap-3">
          <Skeleton className="mt-1 size-10 rounded-md" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        {/* Filter chips — neighborhoods + beds + price */}
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {NEIGHBORHOOD_SKELETON_KEYS.map((key) => (
              <Skeleton key={key} className="h-8 w-24 rounded-full" />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {BEDS_SKELETON_KEYS.map((key) => (
              <Skeleton key={key} className="h-8 w-20 rounded-full" />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {PRICE_SKELETON_KEYS.map((key) => (
              <Skeleton key={key} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </header>

      {/* Two-column layout: cards + map */}
      <div className="lg:flex lg:items-start lg:gap-6">
        {/* Card list */}
        <div className="mt-6 min-w-0 flex-1">
          <div className="grid gap-4 sm:grid-cols-2" aria-hidden="true">
            {CARD_SKELETON_KEYS.map((key) => (
              <RentalCardSkeleton key={key} />
            ))}
          </div>
        </div>

        {/* Map panel skeleton — desktop only */}
        <aside className="w-full lg:w-[400px] lg:shrink-0" aria-hidden="true">
          <Skeleton className="sticky top-28 hidden h-[calc(100vh-8rem)] w-full rounded-xl lg:block" />
        </aside>
      </div>
    </main>
  );
}
