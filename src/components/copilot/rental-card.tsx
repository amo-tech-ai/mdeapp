import { Button } from "@/components/ui/button";
import { Calendar, Heart } from "lucide-react";

export type RentalCardProps = {
  id: string;
  listingId: string;
  title: string;
  neighborhood: string;
  nightly_price?: number;
  price_daily?: number;
  bedrooms?: number;
  photoUrl?: string;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onSchedule?: () => void;
  onSave?: () => void;
  onOpenDetails?: () => void;
};

export function RentalCard({
  id,
  title,
  neighborhood,
  nightly_price,
  price_daily,
  bedrooms,
  photoUrl,
  selected,
  onSelect,
  onSchedule,
  onSave,
  onOpenDetails,
}: RentalCardProps) {
  const price = nightly_price ?? price_daily;

  return (
    <article
      className={`overflow-hidden rounded-lg border bg-card text-sm shadow-sm ${
        selected ? "border-primary ring-2 ring-primary/30" : "border-border"
      }`}
      data-testid="rental-card"
      data-pin-id={id}
      data-selected={selected ? "true" : "false"}
    >
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- listing URLs vary; Phase 1 uses tool payload only
        <img
          src={photoUrl}
          alt=""
          className="h-28 w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className="flex h-28 items-center justify-center bg-muted text-xs text-muted-foreground"
          aria-hidden
        >
          Photo coming soon
        </div>
      )}
      <div
        className="p-3"
        role={onSelect ? "button" : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onClick={onSelect ? () => (onOpenDetails ? onOpenDetails() : onSelect(id)) : undefined}
        onKeyDown={
          onSelect
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (onOpenDetails) onOpenDetails();
                  else onSelect(id);
                }
              }
            : undefined
        }
      >
        <h3 className="font-medium">{title}</h3>
        <p className="text-muted-foreground">
          {neighborhood}
          {bedrooms != null ? ` · ${bedrooms} BR` : ""}
        </p>
        {price != null ? (
          <p className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            ${price.toLocaleString("en-US")}/night
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="default"
            data-testid="rental-schedule-cta"
            onClick={(e) => {
              e.stopPropagation();
              onSchedule?.();
            }}
          >
            <Calendar className="size-3.5" aria-hidden />
            Schedule viewing
          </Button>
          {onOpenDetails ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-testid="rental-details-cta"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails();
              }}
            >
              Details
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="rental-save-cta"
            disabled
            title="Saved collections ship with SCREEN-011"
            onClick={(e) => {
              e.stopPropagation();
              onSave?.();
            }}
          >
            <Heart className="size-3.5" aria-hidden />
            Save
          </Button>
        </div>
      </div>
    </article>
  );
}
