// PlaceInfoCard — mdeai-themed adaptation of CopilotKit's WeatherCard demo.
// Pattern: tool-based generative UI via `useCopilotAction({ render, available: "disabled" })`.
// Foundation for W5 RentalCard / VenueCard / GroundedPlaceCard (PRD §20).

function PinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-12 h-12 text-white/90"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}

export interface PlaceInfoCardProps {
  name?: string;
  category?: string; // e.g. "Café", "Apartment", "Live Music Venue"
  neighborhood?: string; // e.g. "El Poblado", "Laureles"
  priceCop?: number; // mock — COP per night / per ticket
  ratingStars?: number; // 0-5
  distanceKm?: number;
  themeColor?: string;
}

export function PlaceInfoCard({
  name = "Place",
  category = "—",
  neighborhood = "Medellín",
  priceCop,
  ratingStars,
  distanceKm,
  themeColor = "#0f766e", // mdeai teal default
}: PlaceInfoCardProps) {
  const priceLabel =
    priceCop !== undefined
      ? `${priceCop.toLocaleString("es-CO")} COP`
      : "—";
  const ratingLabel = ratingStars !== undefined ? `${ratingStars.toFixed(1)} ★` : "—";
  const distLabel = distanceKm !== undefined ? `${distanceKm.toFixed(1)} km` : "—";

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="rounded-xl shadow-xl mt-6 mb-4 max-w-md w-full"
    >
      <div className="bg-white/15 p-4 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white capitalize">{name}</h3>
            <p className="text-white/90 text-sm">{category}</p>
          </div>
          <PinIcon />
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div className="text-2xl font-bold text-white">{priceLabel}</div>
          <div className="text-sm text-white/90">{neighborhood}</div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/30">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-white/80 text-xs">Rating</p>
              <p className="text-white font-medium">{ratingLabel}</p>
            </div>
            <div>
              <p className="text-white/80 text-xs">Distance</p>
              <p className="text-white font-medium">{distLabel}</p>
            </div>
            <div>
              <p className="text-white/80 text-xs">Type</p>
              <p className="text-white font-medium capitalize">{category}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
