import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRightIcon } from "lucide-react";

const rows = [
  {
    id: "rentals",
    label: "Rentals near you",
    href: "/rentals",
    ctaLabel: "Browse all rentals",
    count: 4,
  },
  {
    id: "restaurants",
    label: "Top restaurants",
    href: "/restaurants",
    ctaLabel: "See all restaurants",
    count: 4,
  },
  {
    id: "cafes",
    label: "Cafés to work from",
    href: "/cafes",
    ctaLabel: "Explore cafés",
    count: 4,
  },
  {
    id: "events",
    label: "Upcoming events",
    href: "/events",
    ctaLabel: "View all events",
    count: 4,
  },
] as const;

function DiscoveryCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card overflow-hidden">
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="flex flex-col gap-1.5 p-3">
        <Skeleton className="h-3.5 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

export function HomeDiscoveryRows() {
  return (
    <section aria-label="Discover Medellín" className="bg-background py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {rows.map(({ id, label, href, ctaLabel, count }) => (
          <div key={id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground md:text-lg">
                {label}
              </h2>
              <Link
                href={href}
                data-testid={`discovery-cta-${id}`}
                className="flex items-center gap-1 text-xs font-medium text-primary transition-colors duration-200 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 motion-reduce:transition-none"
              >
                {ctaLabel}
                <ArrowRightIcon className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: count }, (_, i) => (
                <DiscoveryCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
