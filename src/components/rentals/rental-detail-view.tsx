import React from "react";
import Image from "next/image";
import { css } from "@/lib/emotion";

export interface RentalDetailViewProps {
  title: string;
  neighborhood: string;
  price: number;
  images: string[];
}

export const RentalDetailView: React.FC<RentalDetailViewProps> = ({
  title,
  neighborhood,
  price,
  images,
}) => {
  return (
    <div className={css`padding: 16px;`}>
      <h1>{title}</h1>
      <h2>{neighborhood}</h2>
      <p>${price.toFixed(2)}/night</p>
      <div className={css`display: flex; gap: 8px;`}>
        {images.map((src, idx) => (
          <Image key={idx} src={src} alt={`Image ${idx + 1}`} width={300} height={200} />
        ))}
      </div>
    </div>
  );
};
    </section>
  );
}
                {rest.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt={`${detail.title} photo ${i + 2}`}
                    className="aspect-square w-full rounded-lg bg-muted object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div
            data-testid="rental-detail-no-photos"
            className="flex aspect-[16/9] w-full items-center justify-center rounded-xl bg-muted text-muted-foreground"
          >
            <Building2 className="mr-2 size-5" aria-hidden /> Photos {PENDING.toLowerCase()}
          </div>
        )}
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main content */}
        <div className="min-w-0 space-y-6">
          <header>
            <p className="text-sm font-medium text-muted-foreground">{detail.neighborhood || <Pending />}</p>
            <h1 className="mt-0.5 font-serif text-2xl font-semibold tracking-tight">{detail.title}</h1>
            {detail.address ? (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden /> {detail.address}
              </p>
            ) : null}
          </header>

          <div className="flex flex-wrap gap-2" data-testid="rental-detail-specs">
            <Badge variant="secondary" className="gap-1 font-normal">
              <Bed className="size-3.5" aria-hidden /> {specLabel(detail.bedrooms, "bed", "beds")}
            </Badge>
            <Badge variant="secondary" className="gap-1 font-normal">
              <Bath className="size-3.5" aria-hidden /> {specLabel(detail.bathrooms, "bath", "baths")}
            </Badge>
            <Badge variant="secondary" className="gap-1 font-normal">
              <Users className="size-3.5" aria-hidden /> {detail.maxGuests != null ? `${detail.maxGuests} guests` : <Pending />}
            </Badge>
          </div>

          <section aria-label="Description">
            <h2 className="mb-1 font-serif text-base font-semibold">About this rental</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {detail.description ?? <Pending />}
            </p>
          </section>

          <section aria-label="Amenities">
            <h2 className="mb-2 font-serif text-base font-semibold">Amenities</h2>
            {detail.amenities.length > 0 || detail.buildingAmenities.length > 0 ? (
              <div className="flex flex-wrap gap-1.5" data-testid="rental-detail-amenities">
                {[...detail.amenities, ...detail.buildingAmenities].map((a) => (
                  <Badge key={a} variant="outline" className="font-normal">
                    {a}
                  </Badge>
                ))}
              </div>
            ) : (
              <Pending />
            )}
          </section>

          <RentalAvailabilityCalendar
              {rest.map((img, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                {gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${title} in ${neighborhood}`}
                  className="aspect-[16/10] w-full rounded-xl bg-muted object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
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

        {/* Sticky price / CTA sidebar (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-3 rounded-xl border border-border bg-card p-4">
            <div>
              <div className="font-mono text-xl font-semibold">{monthlyLabel ?? nightlyLabel ?? <Pending />}</div>
              {monthlyLabel && nightlyLabel ? (
                <div className="text-xs text-muted-foreground">{nightlyLabel}</div>
              ) : null}
            </div>
            <Button
              type="button"
              className="w-full"
              data-testid="rental-detail-request-cta"
              onClick={requestViewing}
            >
              Request viewing
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              data-testid="rental-detail-ask-cta"
              onClick={requestViewing}
            >
              Ask a question
            </Button>
            <Button type="button" variant="ghost" className="w-full" disabled title="Save (coming soon)">
              <Heart className="size-4" aria-hidden /> Save
            </Button>
            <p className="text-center text-xs text-muted-foreground">{REQUEST_ONLY}</p>
            <p className="text-center text-xs text-muted-foreground">
              Host: {detail.hostName ?? <Pending />}
            </p>
          </div>
        </aside>
      </div>

      {/* Sticky bottom CTA (mobile ≤ lg) */}
      <div
        data-testid="rental-detail-mobile-cta"
        className={cn(
          "fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          <div className="min-w-0 flex-1">
            <div className="truncate font-mono text-sm font-semibold">
              {monthlyLabel ?? nightlyLabel ?? PENDING}
            </div>
            <div className="truncate text-[11px] text-muted-foreground">{REQUEST_ONLY}</div>
          </div>
          <Button type="button" size="sm" data-testid="rental-detail-request-cta-mobile" onClick={requestViewing}>
            Request viewing
          </Button>
        </div>
      </div>
    </main>
  );
}
