import Link from "next/link";
import { Coffee, ExternalLink, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VenueCardShell } from "@/components/browse/venue-card-shell";
import { VenueCardPlaceholder } from "@/components/browse/venue-card-placeholder";
import { mapsDeepLinksEnabled } from "@/lib/maps-deep-links";
import type { CafeListing } from "@/lib/cafe-browse";

type CafeBrowseCardProps = {
  listing: CafeListing;
  composition?: "legacy" | "nova";
  mediaLayout?: "inline" | "cover";
};

function formatTagLabel(tag: string): string {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function CafeBrowseCardMedia({
  mediaLayout,
}: {
  mediaLayout: "inline" | "cover";
}) {
  return (
    <VenueCardPlaceholder
      label="Café"
      icon={<Coffee className="size-5" aria-hidden />}
      mediaLayout={mediaLayout}
      testId="cafe-browse-card-photo-placeholder"
    />
  );
}

function CafeDirectionsLink({ listing }: { listing: CafeListing }) {
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
            data-testid="cafe-browse-directions-link"
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
          data-testid="cafe-browse-maps-link"
        />
      }
    >
      <ExternalLink data-icon="inline-start" aria-hidden />
      Google Maps
    </Button>
  );
}

export function CafeBrowseCard({
  listing,
  composition = "nova",
  mediaLayout = "cover",
}: CafeBrowseCardProps) {
  const primaryTag = listing.tags[0];

  return (
    <VenueCardShell
      testId={`cafe-card-${listing.id}`}
      resultKind="cafe"
      composition={composition}
      mediaLayout={mediaLayout}
      ariaLabel={`Café: ${listing.name}${listing.neighborhood ? `, ${listing.neighborhood}` : ""}`}
      media={<CafeBrowseCardMedia mediaLayout={mediaLayout} />}
      footer={<CafeDirectionsLink listing={listing} />}
    >
      {listing.neighborhood ? (
        <p className="text-[11px] font-medium text-muted-foreground">
          {listing.neighborhood}
        </p>
      ) : null}
      <h3 className="font-medium leading-snug">{listing.name}</h3>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {primaryTag ? (
          <Badge variant="secondary">{formatTagLabel(primaryTag)}</Badge>
        ) : (
          <Badge variant="secondary">Café</Badge>
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
