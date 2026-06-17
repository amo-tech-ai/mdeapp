import type { ComponentType } from "react";
import Link from "next/link";
import { Coffee, ExternalLink, MapPin, Martini } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VenueCardShell } from "@/components/browse/venue-card-shell";
import { VenueCardPlaceholder } from "@/components/browse/venue-card-placeholder";
import { mapsDeepLinksEnabled } from "@/lib/maps-deep-links";

/**
 * The one browse card shared by the venue verticals whose listing shape is
 * identical — cafés and nightlife. Both are
 * `{ id, name, neighborhood, tags, summary, mapsUrl }` derived from the same
 * venue anchor, so they render through one component instead of duplicate
 * per-vertical cards. Category is conveyed by glyph + label (never colour);
 * the photo fallback is the single pale-teal placeholder.
 *
 * Verticals with a genuinely different shape or actions (events, rentals,
 * restaurants) keep their own thin card on the shared `VenueCardShell`.
 */
export type VenueBrowseKind = "cafe" | "nightlife";

export type VenueBrowseListing = {
  id: string;
  name: string;
  neighborhood: string | null;
  tags: string[];
  summary: string | null;
  mapsUrl: string;
};

type KindConfig = {
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  ariaPrefix: string;
  cardTestId: (id: string) => string;
  placeholderTestId: string;
  directionsTestId: string;
  mapsTestId: string;
};

const KIND_CONFIG: Record<VenueBrowseKind, KindConfig> = {
  cafe: {
    label: "Café",
    icon: Coffee,
    ariaPrefix: "Café",
    cardTestId: (id) => `cafe-card-${id}`,
    placeholderTestId: "cafe-browse-card-photo-placeholder",
    directionsTestId: "cafe-browse-directions-link",
    mapsTestId: "cafe-browse-maps-link",
  },
  nightlife: {
    label: "Nightlife",
    icon: Martini,
    ariaPrefix: "Nightlife venue",
    cardTestId: (id) => `nightlife-card-${id}`,
    placeholderTestId: "nightlife-browse-card-photo-placeholder",
    directionsTestId: "nightlife-browse-directions-link",
    mapsTestId: "nightlife-browse-maps-link",
  },
};

type VenueBrowseCardProps = {
  kind: VenueBrowseKind;
  listing: VenueBrowseListing;
  composition?: "legacy" | "nova";
  mediaLayout?: "inline" | "cover";
};

function formatTagLabel(tag: string): string {
  return tag
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function DirectionsLink({
  mapsUrl,
  directionsTestId,
  mapsTestId,
}: {
  mapsUrl: string;
  directionsTestId: string;
  mapsTestId: string;
}) {
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
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            translate="no"
            data-testid={directionsTestId}
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
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          translate="no"
          data-testid={mapsTestId}
        />
      }
    >
      <ExternalLink data-icon="inline-start" aria-hidden />
      Google Maps
    </Button>
  );
}

export function VenueBrowseCard({
  kind,
  listing,
  composition = "nova",
  mediaLayout = "cover",
}: VenueBrowseCardProps) {
  const config = KIND_CONFIG[kind];
  const Icon = config.icon;
  const primaryTag = listing.tags[0];

  return (
    <VenueCardShell
      testId={config.cardTestId(listing.id)}
      resultKind={kind}
      composition={composition}
      mediaLayout={mediaLayout}
      ariaLabel={`${config.ariaPrefix}: ${listing.name}${listing.neighborhood ? `, ${listing.neighborhood}` : ""}`}
      media={
        <VenueCardPlaceholder
          label={config.label}
          icon={<Icon className="size-5" aria-hidden />}
          mediaLayout={mediaLayout}
          testId={config.placeholderTestId}
        />
      }
      footer={
        <DirectionsLink
          mapsUrl={listing.mapsUrl}
          directionsTestId={config.directionsTestId}
          mapsTestId={config.mapsTestId}
        />
      }
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
          <Badge variant="secondary">{config.label}</Badge>
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
