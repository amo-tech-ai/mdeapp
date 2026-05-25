import Link from "next/link";
import type { UserTripRow } from "@/lib/trips/load-user-trips";
import { formatTripDateRange } from "@/lib/trips/load-user-trips";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<UserTripRow["status"], string> = {
  planning: "Planning",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

type TripsDashboardGridProps = {
  trips: UserTripRow[];
};

/** SCREEN-012 — trip cards linking to workspace. */
export function TripsDashboardGrid({ trips }: TripsDashboardGridProps) {
  return (
    <ul
      data-testid="trips-list"
      className="grid gap-4 sm:grid-cols-2"
    >
      {trips.map((trip) => (
        <li key={trip.id}>
          <Link
            href={`/trips/${trip.id}`}
            data-testid={`trip-card-${trip.id}`}
            className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{trip.title}</CardTitle>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                      trip.status === "active"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {STATUS_LABEL[trip.status]}
                  </span>
                </div>
                <CardDescription>
                  {formatTripDateRange(trip.start_date, trip.end_date)}
                  {trip.destination ? ` · ${trip.destination}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {trip.item_count === 1
                    ? "1 item"
                    : `${trip.item_count} items`}
                  {trip.budget != null
                    ? ` · budget ${trip.currency ?? "USD"} ${trip.budget}`
                    : ""}
                </p>
                <p className="mt-2 text-sm font-medium text-primary">
                  Open workspace →
                </p>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
