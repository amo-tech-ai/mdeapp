import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HostEventCardProps = {
  id: string;
  title: string;
  venue: string;
  neighborhood: string;
  startsAt: string;
  /** null = price unknown → "Price TBD" (never coerce to 0; null ≠ free). */
  priceMin: number | null;
  imageUrl?: string;
  /** EVP-008 enum: draft | pending_approval | approved | published | rejected. */
  status: string;
  slug: string | null;
};

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

const STATUS_BADGE: Record<string, { label: string; variant: BadgeVariant }> = {
  published: { label: "Published", variant: "default" },
  approved: { label: "Approved", variant: "secondary" },
  pending_approval: { label: "Pending", variant: "outline" },
  draft: { label: "Draft", variant: "outline" },
  rejected: { label: "Rejected", variant: "destructive" },
};

function formatStartsAt(iso: string) {
  if (!iso) return "Date TBD";
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** EVP-014 — host's own event in the /host/events list. Status-aware: only a
 *  published event with a slug links to its public page; all others show the
 *  chip with no action (no edit/publish routes exist yet). */
export function HostEventCard({
  title,
  venue,
  neighborhood,
  startsAt,
  priceMin,
  imageUrl,
  status,
  slug,
}: HostEventCardProps) {
  const badge = STATUS_BADGE[status] ?? { label: status || "Unknown", variant: "outline" as const };
  const canView = status === "published" && Boolean(slug);

  return (
    <article
      className="overflow-hidden rounded-lg border border-border bg-card text-sm shadow-sm"
      data-testid="host-event-card"
      data-status={status}
      aria-label={`Event: ${title}${neighborhood ? `, ${neighborhood}` : ""}`}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="h-28 w-full object-cover" loading="lazy" />
      ) : (
        <div
          className="flex h-28 items-center justify-center bg-muted text-xs text-muted-foreground"
          aria-hidden
        >
          Event photo
        </div>
      )}
      <div className="p-3">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-medium">{title}</h3>
          <Badge variant={badge.variant} data-testid="host-event-status">
            {badge.label}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {venue} · {neighborhood}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{formatStartsAt(startsAt)}</p>
        <p
          className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary"
          data-testid="host-event-price"
        >
          {priceMin == null ? "Price TBD" : `From $${priceMin.toLocaleString("en-US")}`}
        </p>
        {canView ? (
          <div className="mt-3">
            <Link
              href={`/events/${slug}`}
              data-testid="host-event-view-link"
              className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
            >
              View public event
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}
