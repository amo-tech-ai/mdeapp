import type { RestaurantSearchApiParams } from "@/lib/restaurant-search-fast-path";

export type RestaurantChipGroup = "cuisine" | "vibe" | "area" | "budget";

export type RestaurantFilterChip = {
  id: string;
  label: string;
  group: RestaurantChipGroup;
  cuisine?: string;
  vibe?: string;
  neighborhood?: string;
  priceTier?: "$" | "$$" | "$$$";
  nearMe?: boolean;
};

export const RESTAURANT_CUISINE_CHIPS: readonly RestaurantFilterChip[] = [
  { id: "c-steak", label: "Steak", group: "cuisine", cuisine: "steakhouse" },
  { id: "c-italian", label: "Italian", group: "cuisine", cuisine: "international" },
  { id: "c-sushi", label: "Sushi", group: "cuisine", cuisine: "seafood" },
  { id: "c-colombian", label: "Colombian", group: "cuisine", cuisine: "colombian" },
  { id: "c-pizza", label: "Pizza", group: "cuisine", cuisine: "international" },
  { id: "c-vegan", label: "Vegan", group: "cuisine", cuisine: "vegetarian" },
] as const;

export const RESTAURANT_VIBE_CHIPS: readonly RestaurantFilterChip[] = [
  { id: "v-fine", label: "Fine dining", group: "vibe", vibe: "fine dining" },
  { id: "v-casual", label: "Casual", group: "vibe", vibe: "casual" },
  { id: "v-date", label: "Date night", group: "vibe", vibe: "date night" },
  { id: "v-rooftop", label: "Rooftop", group: "vibe", vibe: "rooftop" },
  { id: "v-family", label: "Family", group: "vibe", vibe: "family" },
] as const;

export const RESTAURANT_AREA_CHIPS: readonly RestaurantFilterChip[] = [
  { id: "a-near", label: "Near me", group: "area", nearMe: true },
  { id: "a-poblado", label: "El Poblado", group: "area", neighborhood: "El Poblado" },
  { id: "a-laureles", label: "Laureles", group: "area", neighborhood: "Laureles" },
  { id: "a-envigado", label: "Envigado", group: "area", neighborhood: "Envigado" },
  { id: "a-provenza", label: "Provenza", group: "area", neighborhood: "Provenza" },
] as const;

export const RESTAURANT_BUDGET_CHIPS: readonly RestaurantFilterChip[] = [
  { id: "b-1", label: "$", group: "budget", priceTier: "$" },
  { id: "b-2", label: "$$", group: "budget", priceTier: "$$" },
  { id: "b-3", label: "$$$", group: "budget", priceTier: "$$$" },
] as const;

/** Shown when geolocation is denied or unavailable. */
export const RESTAURANT_GEO_FALLBACK_CHIPS: readonly RestaurantFilterChip[] =
  RESTAURANT_AREA_CHIPS.filter((c) => !c.nearMe);

export const RESTAURANT_FILTER_CHIP_GROUPS = [
  { label: "Cuisine", chips: RESTAURANT_CUISINE_CHIPS },
  { label: "Vibe", chips: RESTAURANT_VIBE_CHIPS },
  { label: "Area", chips: RESTAURANT_AREA_CHIPS },
  { label: "Budget", chips: RESTAURANT_BUDGET_CHIPS },
] as const;

export function restaurantChipSearchPrompt(chip: RestaurantFilterChip): string {
  const parts: string[] = [];
  if (chip.cuisine) parts.push(chip.label);
  if (chip.vibe) parts.push(chip.vibe);
  if (chip.neighborhood) parts.push(`in ${chip.neighborhood}`);
  if (chip.nearMe) parts.push("near me");
  if (chip.priceTier) parts.push(chip.priceTier);
  if (parts.length === 0) return "restaurants in Medellín";
  return `${parts.join(" ")} restaurants Medellín`;
}

export function restaurantSearchParamsFromChip(
  chip: RestaurantFilterChip,
  geo?: { latitude: number; longitude: number },
): RestaurantSearchApiParams {
  const queryParts: string[] = ["restaurants"];
  if (chip.cuisine) queryParts.unshift(chip.label);
  if (chip.vibe) queryParts.unshift(chip.vibe);
  if (chip.neighborhood) queryParts.push(`in ${chip.neighborhood}`);
  if (chip.nearMe) queryParts.push("near me");
  if (chip.priceTier) queryParts.push(chip.priceTier);

  return {
    cuisine: chip.cuisine,
    neighborhood: chip.neighborhood,
    priceTier: chip.priceTier,
    queryText: queryParts.join(" "),
    userLatitude: geo?.latitude,
    userLongitude: geo?.longitude,
    limit: 5,
  };
}
