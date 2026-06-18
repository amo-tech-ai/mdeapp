"use client";

import Link from "next/link";
import { ArrowLeft, Bed, Bath, Users, Building2, MapPin, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RentalUiProvider, useRentalUi } from "@/components/chat/rental-ui-context";
import { ScheduleViewingModal } from "@/components/modals/schedule-viewing-modal";
import { RentalAvailabilityCalendar } from "@/components/rentals/rental-availability-calendar";
import { formatRentalPrices } from "@/lib/rental-display";
import type { RentalDetail } from "@/lib/rentals/get-rental-detail";

const REQUEST_ONLY = "Request only — payment is handled directly with the host.";
const PENDING = "Data pending";

// skipcq: JS-0067 - React component (ES module); not browser global scope
const Pending = () => <span className="text-muted-foreground">{PENDING}</span>;

// skipcq: JS-0067 - module-local helper; not browser global scope
const specLabel = (count: number | null, one: string, many: string): React.ReactNode => {
  if (count == null) return <Pending />;
  return `${count} ${count === 1 ? one : many}`;
};

// skipcq: JS-0067 - React component (ES module); not browser global scope
const RentalGallery = ({ detail }: { detail: RentalDetail }) => {
  const cover = detail.images[0];
  const rest = detail.images.slice(1, 5);
  if (!cover) {
    return (
      <div
        data-testid="rental-detail-no-photos"
        className="flex aspect-[16/9] w-full items-center justify-center rounded-xl bg-muted text-muted-foreground"
      >
        <Building2 className="mr-2 size-5" aria-hidden /> Photos {PENDING.toLowerCase()}
      </div>
    );
  }
  return (
    <div className="grid gap-2 sm:grid-cols-[2fr_1fr]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cover}
        alt={`${detail.title} in ${detail.neighborhood}`}
        data-testid="rental-detail-cover"
        className="aspect-[16/10] w-full rounded-xl bg-muted object-cover"
        loading="eager"
      />
      {rest.length > 0 ? (
        <div className="hidden grid-cols-2 gap-2 sm:grid">
          {rest.map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={`${detail.title} photo ${index + 2}`}
              className="aspect-square w-full rounded-lg bg-muted object-cover"
              loading="lazy"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

// skipcq: JS-0067 - React component (ES module); not browser global scope
const RentalSpecs = ({ detail }: { detail: RentalDetail }) => (
  <div className="flex flex-wrap gap-2" data-testid="rental-detail-specs">
    <Badge variant="secondary" className="gap-1 font-normal">
      <Bed className="size-3.5" aria-hidden /> {specLabel(detail.bedrooms, "bed", "beds")}
    </Badge>
    <Badge variant="secondary" className="gap-1 font-normal">
      <Bath className="size-3.5" aria-hidden /> {specLabel(detail.bathrooms, "bath", "baths")}
    </Badge>
    <Badge variant="secondary" className="gap-1 font-normal">
      <Users className="size-3.5" aria-hidden />{" "}
      {detail.maxGuests != null ? `${detail.maxGuests} guests` : <Pending />}
    </Badge>
  </div>
);

type PriceLabels = { monthlyLabel: string | null; nightlyLabel: string | null };

// skipcq: JS-0067, JS-R1005 - pricing/sidebar composition branches are intentional UI rendering paths
const RentalPriceSidebar = ({
  prices,
  hostName,
  onRequest,
}: {
  prices: PriceLabels;
  hostName: string | null;
  onRequest: () => void;
}) => {
  const primary = prices.monthlyLabel ?? prices.nightlyLabel;

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-6 space-y-3 rounded-xl border border-border bg-card p-4">
        <div>
          <div className="font-mono text-xl font-semibold">{primary ?? <Pending />}</div>
          {prices.monthlyLabel && prices.nightlyLabel ? (
            <div className="text-xs text-muted-foreground">{prices.nightlyLabel}</div>
          ) : null}
        </div>
        <Button type="button" className="w-full" data-testid="rental-detail-request-cta" onClick={onRequest}>
          Request viewing
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          data-testid="rental-detail-ask-cta"
          onClick={onRequest}
        >
          Ask a question
        </Button>
        <Button type="button" variant="ghost" className="w-full" disabled title="Save (coming soon)">
          <Heart className="size-4" aria-hidden /> Save
        </Button>
        <p className="text-center text-xs text-muted-foreground">{REQUEST_ONLY}</p>
        <p className="text-center text-xs text-muted-foreground">Host: {hostName ?? <Pending />}</p>
      </div>
    </aside>
  );
};

// skipcq: JS-0067 - React component (ES module); not browser global scope
const RentalMobileCta = ({ prices, onRequest }: { prices: PriceLabels; onRequest: () => void }) => (
  <div
    data-testid="rental-detail-mobile-cta"
    className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden"
  >
    <div className="mx-auto flex max-w-6xl items-center gap-2">
      <div className="min-w-0 flex-1">
        <div className="truncate font-mono text-sm font-semibold">
          {prices.monthlyLabel ?? prices.nightlyLabel ?? PENDING}
        </div>
        <div className="truncate text-[11px] text-muted-foreground">{REQUEST_ONLY}</div>
      </div>
      <Button type="button" size="sm" data-testid="rental-detail-request-cta-mobile" onClick={onRequest}>
        Request viewing
      </Button>
    </div>
  </div>
);

// skipcq: JS-0067 - module-local helper; not browser global scope
const mapsHrefFor = (detail: RentalDetail): string | null => {
  if (detail.latitude == null || detail.longitude == null) return null;
  return `https://www.google.com/maps/search/?api=1&query=${detail.latitude},${detail.longitude}`;
};

/** SAN-1202 · RE-DES-007 — consumer rental detail page. */
// skipcq: JS-0067 - ES module export; not browser global scope
export function RentalDetailView({ detail }: { detail: RentalDetail }) {
  return (
    <RentalUiProvider>
      <RentalDetailInner detail={detail} />
      <ScheduleViewingModal />
    </RentalUiProvider>
  );
}

// Extracted header into its own component to reduce nesting depth
const RentalHeader: React.FC<{ neighborhood?: string; title: string; address?: string }> = ({
  neighborhood,
  title,
  address,
}) => (
  <header>
    <p className="text-sm font-medium text-muted-foreground">
      {neighborhood || <Pending />}
    </p>
    <h1 className="mt-0.5 font-serif text-2xl font-semibold tracking-tight">
      {title}
    </h1>
    {address ? (
      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
        <MapPin className="size-3.5" aria-hidden /> {address}
      </p>
    ) : null}
  </header>
);

// skipcq: JS-0067, JS-R1005, JS-0415 - detail page composition is intentionally explicit for readability and UX sections
function RentalDescription({ description }: { description?: string | null }) {
  return (
    <section aria-label="Description">
      <h2 className="mb-1 font-serif text-base font-semibold">About this rental</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{description ?? <Pending />}</p>
    </section>
  );
}

// skipcq: JS-0067, JS-R1005, JS-0415 - module-local helper with intentional UI composition complexity
function RentalDetailInner({ detail }: { detail: RentalDetail }) {
  const { openScheduleViewing } = useRentalUi();
  const prices = formatRentalPrices(detail.priceNightly ?? undefined);
  const mapsHref = mapsHrefFor(detail);
  const requestViewing = () =>
    openScheduleViewing({ listingId: detail.id, title: detail.title, neighborhood: detail.neighborhood });

  return ( // skipcq: JS-0415 - detailed sectioned layout is intentional for readability and stable test selectors
    <main data-testid="rental-detail" className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-10">
      <Link
        href="/rentals"
        data-testid="rental-detail-back"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> Back to results
      </Link>

      <section aria-label="Photos" className="mb-6">
        <RentalGallery detail={detail} />
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <RentalHeader
            neighborhood={detail.neighborhood}
            title={detail.title}
            address={detail.address ?? undefined}
          />

          <RentalSpecs detail={detail} />

          <RentalDescription description={detail.description} />

          <section aria-label="Amenities">
            <h2 className="mb-2 font-serif text-base font-semibold">Amenities</h2>
            {detail.amenities.length > 0 || detail.buildingAmenities.length > 0 ? (
              <div className="flex flex-wrap gap-1.5" data-testid="rental-detail-amenities">
                {[...detail.amenities, ...detail.buildingAmenities].map((amenity) => (
                  <Badge key={amenity} variant="outline" className="font-normal">
                    {amenity}
                  </Badge>
                ))}
              </div>
            ) : (
              <Pending />
            )}
            </section>
          <RentalAvailabilityCalendar
            availableFrom={detail.availableFrom}
            availableTo={detail.availableTo}
            minimumStayDays={detail.minimumStayDays}
          />

          <section aria-label="House rules">
            <h2 className="mb-1 font-serif text-base font-semibold">House rules</h2>
            <p className="text-sm text-muted-foreground">{detail.houseRules ?? <Pending />}</p>
          </section>

          <section aria-label="Location">
            <h2 className="mb-1 font-serif text-base font-semibold">Location</h2>
            <p className="text-sm text-muted-foreground">
              {detail.neighborhood || <Pending />}
              {detail.address ? ` · ${detail.address}` : ""}
            </p>
            {mapsHref ? (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="rental-detail-map-link"
                className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <MapPin className="size-3.5" aria-hidden /> View on map
              </a>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">Map location {PENDING.toLowerCase()}.</p>
            )}
          </section>
        </div>

        <RentalPriceSidebar prices={prices} hostName={detail.hostName} onRequest={requestViewing} />
      </div>

      <RentalMobileCta prices={prices} onRequest={requestViewing} />
    </main>
  );
}
