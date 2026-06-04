import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mapsDeepLinksEnabled } from "@/lib/maps-deep-links";
import type { NightlifeListing } from "@/lib/nightlife-browse";

type NightlifeBrowseCardProps = {
  listing: NightlifeListing;
};

function formatVibeLabel(tag: string): string {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function NightlifeBrowseCard({ listing }: NightlifeBrowseCardProps) {
  const deepLinks = mapsDeepLinksEnabled();
  const primaryTag = listing.tags[0];

  return (
    <article
      className="overflow-hidden rounded-lg border border-border bg-card text-sm shadow-sm"
      data-testid={`nightlife-card-${listing.id}`}
      data-result-kind="nightlife"
      aria-label={`Nightlife venue: ${listing.name}${listing.neighborhood ? `, ${listing.neighborhood}` : ""}`}
    >
      <div className="flex gap-3 p-3">
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground"
          data-testid="nightlife-browse-card-photo-placeholder"
          aria-hidden
        >
          Club
        </div>
        <div className="min-w-0 flex-1">
          {listing.neighborhood ? (
            <p className="text-[11px] font-medium text-muted-foreground">
              {listing.neighborhood}
            </p>
          ) : null}
          <h3 className="font-medium leading-snug">{listing.name}</h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {primaryTag ? (
              <Badge variant="secondary">{formatVibeLabel(primaryTag)}</Badge>
            ) : (
              <Badge variant="secondary">Nightlife</Badge>
            )}
          </div>
          {listing.summary ? (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
              {listing.summary}
            </p>
          ) : null}
        </div>
      </div>
      <div className="border-t px-3 py-2">
        {deepLinks ? (
          <Link
            href={listing.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            translate="no"
            className="inline-flex min-h-8 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs font-medium text-primary hover:bg-muted"
            data-testid="nightlife-browse-directions-link"
          >
            <MapPin className="size-3.5" aria-hidden />
            Directions
          </Link>
        ) : (
          <Link
            href={listing.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            translate="no"
            className="inline-flex min-h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-primary underline-offset-2 hover:underline"
            data-testid="nightlife-browse-maps-link"
          >
            <ExternalLink className="size-3.5" aria-hidden />
            Google Maps
          </Link>
        )}
      </div>
    </article>
  );
}
