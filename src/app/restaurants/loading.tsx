import { Skeleton } from "@/components/ui/skeleton";

export default function RestaurantsLoading() {
  return (
    <main
      data-testid="restaurants-browse-loading"
      className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6"
      aria-busy="true"
      aria-label="Loading restaurants"
    >
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-72" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`n-${i}`} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={`c-${i}`} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    </main>
  );
}
