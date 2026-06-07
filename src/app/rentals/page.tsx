import { RentalBrowseView } from "@/components/rentals/rental-browse-view";
import { searchRentals, type Rental } from "@/mastra/tools/search-rentals";

interface Props {
  searchParams: Promise<{
    neighborhood?: string;
    beds?: string;
    maxPrice?: string;
  }>;
}

/** REAL-011 / SAN-478 — /rentals browse page. */
export default async function RentalsPage({ searchParams }: Props) {
  const { neighborhood, beds, maxPrice } = await searchParams;

  // Normalise filter values — unknown strings become undefined
  const nbhd     = neighborhood ?? null;
  const bedsVal  = beds && /^[0-3]$/.test(beds)    ? beds    : null;
  const priceVal = maxPrice && /^\d+$/.test(maxPrice) ? maxPrice : null;

  let error: string | null = null;
  let results: Rental[] = [];

  try {
    const minBedrooms   = bedsVal  != null ? parseInt(bedsVal,  10) : undefined;
    const maxPricePerNight = priceVal != null ? parseInt(priceVal, 10) : undefined;

    const data = await searchRentals({
      neighborhood: nbhd ?? undefined,
      minBedrooms,
      maxPricePerNight,
      limit: 12,
    });

    results = data.results;
  } catch (err) {
    error = "Could not load rentals right now. Please try again.";
    console.error("[/rentals] searchRentals failed:", (err as Error).message);
  }

  return (
    <RentalBrowseView
      results={results}
      error={error}
      neighborhood={nbhd}
      beds={bedsVal}
      maxPrice={priceVal}
    />
  );
}
