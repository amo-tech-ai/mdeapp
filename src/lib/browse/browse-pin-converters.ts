import type { MapPin } from "@/platform/contracts/map-pin";
import type { Restaurant } from "@/mastra/tools/search-restaurants";
import type { Rental } from "@/mastra/tools/search-rentals";

export function restaurantToMapPin(r: Restaurant): MapPin | null {
  if (r.latitude == null || r.longitude == null) return null;
  return {
    id: `restaurant-${r.id}`,
    category: "restaurant",
    lat: r.latitude,
    lng: r.longitude,
    title: r.name,
    subtitle: r.neighborhood,
    placeId: r.placeId ?? undefined,
    source: "sql",
  };
}

export function rentalToMapPin(r: Rental): MapPin | null {
  if (r.latitude == null || r.longitude == null) return null;
  return {
    id: `rental-${r.id}`,
    category: "rental",
    lat: r.latitude,
    lng: r.longitude,
    title: r.title,
    subtitle: r.neighborhood,
    source: "sql",
  };
}
