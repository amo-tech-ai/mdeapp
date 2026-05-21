// PlaceInfoCard — generative UI for places (PRD §20). shadcn Card + Badge.

import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface PlaceInfoCardProps {
  name?: string;
  category?: string;
  neighborhood?: string;
  priceCop?: number;
  ratingStars?: number;
  distanceKm?: number;
}

export function PlaceInfoCard({
  name = "Place",
  category = "—",
  neighborhood = "Medellín",
  priceCop,
  ratingStars,
  distanceKm,
}: PlaceInfoCardProps) {
  const priceLabel =
    priceCop !== undefined
      ? `${priceCop.toLocaleString("en-US")} COP`
      : "—";
  const ratingLabel =
    ratingStars !== undefined ? `${ratingStars.toFixed(1)} ★` : "—";
  const distLabel =
    distanceKm !== undefined ? `${distanceKm.toFixed(1)} km` : "—";

  return (
    <Card className="mt-6 mb-4 max-w-md w-full border-primary/20 bg-primary text-primary-foreground">
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl capitalize text-primary-foreground">
            {name}
          </CardTitle>
          <Badge
            variant="secondary"
            className="w-fit bg-primary-foreground/15 text-primary-foreground"
          >
            {category}
          </Badge>
        </div>
        <MapPin className="size-12 shrink-0 opacity-90" aria-hidden />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold">{priceLabel}</p>
          <p className="text-sm opacity-90">{neighborhood}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-primary-foreground/30 pt-4 text-center text-sm">
          <div>
            <p className="text-xs opacity-80">Rating</p>
            <p className="font-medium">{ratingLabel}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">Distance</p>
            <p className="font-medium">{distLabel}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">Type</p>
            <p className="font-medium capitalize">{category}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
