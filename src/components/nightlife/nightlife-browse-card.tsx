import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VenueCardShell } from "@/components/browse/venue-card-shell";
import { mapsDeepLinksEnabled } from "@/lib/maps-deep-links";
import { cn } from "@/lib/utils";
import type { NightlifeListing } from "@/lib/nightlife-browse";

type NightlifeBrowseCardProps = {
  listing: NightlifeListing;
  composition?: "legacy" | "nova";
  mediaLayout?: "inline" | "cover";
};

function formatVibeLabel(tag: string): string {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function NightlifeBrowseCardMedia({
  mediaLayout,
}: {
  mediaLayout: "inline" | "cover";
}) {
  const frameClass = cn(
    "relative flex items-center justify-center overflow-hidden rounded-xl bg-muted text-xs text-muted-foreground",
    mediaLayout === "cover"
      ? "aspect-[16/10] w-full"
      : "aspect-[16/10] w-24 shrink-0 self-start",
  );

  return (
    <div
      className={frameClass}
      data-testid="nightlife-browse-card-photo-placeholder"
      aria-hidden
    >
      Club
    </div>
  );
}

function NightlifeDirectionsLink({ listing }: { listing: NightlifeListing }) {
  const deepLinks = mapsDeepLinksEnabled();

  if (deepLinks) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-8 px-2 text-xs"
        nativeButton={false}
        render={
          <a
            href={listing.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            translate="no"
            data-testid="nightlife-browse-directions-link"
          />
        }
      >
        <MapPin data-icon="inline-start" aria-hidden />
        Directions
      </Button>
    );
  }

  return (
    <Button
      variant="link"
      size="sm"
      className="h-8 px-2 text-xs"
      nativeButton={false}
      render={
        <Link
          href={listing.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          translate="no"
          data-testid="nightlife-browse-maps-link"
        />
      }
    >
      <ExternalLink data-icon="inline-start" aria-hidden />
      Google Maps
    </Button>
  );
}

export function NightlifeBrowseCard({
  listing,
  composition = "nova",
  mediaLayout = "cover",
}: NightlifeBrowseCardProps) {
  const primaryTag = listing.tags[0];

  return (
    <VenueCardShell
      testId={`nightlife-card-${listing.id}`}
      resultKind="nightlife"
      composition={composition}
      mediaLayout={mediaLayout}
      ariaLabel={`Nightlife venue: ${listing.name}${listing.neighborhood ? `, ${listing.neighborhood}` : ""}`}
      media={<NightlifeBrowseCardMedia mediaLayout={mediaLayout} />}
      footer={<NightlifeDirectionsLink listing={listing} />}
    >
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
    </VenueCardShell>
  );
}
