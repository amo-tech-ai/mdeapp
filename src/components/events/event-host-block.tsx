import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { hostInitials } from "@/lib/events/parse-host-display";
import type { PublicEventHost } from "@/lib/events/types";
import { cn } from "@/lib/utils";

type EventHostBlockProps = {
  host: PublicEventHost;
  className?: string;
};

export function EventHostBlock({ host, className }: EventHostBlockProps) {
  const initials = hostInitials(host.name);

  return (
    <section
      className={cn("flex items-center gap-3", className)}
      data-testid="event-host-block"
      aria-labelledby="event-host-heading"
    >
      <Avatar size="lg">
        {host.avatarUrl ? (
          <AvatarImage src={host.avatarUrl} alt="" />
        ) : null}
        <AvatarFallback aria-hidden>{initials || "?"}</AvatarFallback>
      </Avatar>
      <div>
        <h2 id="event-host-heading" className="text-sm font-medium text-muted-foreground">
          Hosted by
        </h2>
        <p className="text-base font-semibold tracking-tight">{host.name}</p>
      </div>
    </section>
  );
}
