import { HostEventCard, type HostEventCardProps } from "@/components/host/host-event-card";

type HostEventsGridProps = {
  events: HostEventCardProps[];
};

/** EVP-014 — responsive grid of the host's events. */
export function HostEventsGrid({ events }: HostEventsGridProps) {
  return (
    <ul
      data-testid="host-events-list"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {events.map((event) => (
        <li key={event.id}>
          <HostEventCard {...event} />
        </li>
      ))}
    </ul>
  );
}
