import { describe, expect, it } from "vitest";
import {
  RESTAURANT_BUDGET_CHIPS,
  RESTAURANT_CUISINE_CHIPS,
  RESTAURANT_GEO_FALLBACK_CHIPS,
  RESTAURANT_VIBE_CHIPS,
  restaurantChipSearchPrompt,
} from "@/lib/restaurant-filter-chips";

describe("restaurant filter chips", () => {
  it("exports all required cuisine vibe area and budget chips", () => {
    expect(RESTAURANT_CUISINE_CHIPS.map((c) => c.label)).toEqual(
      expect.arrayContaining(["Steak", "Italian", "Sushi", "Colombian", "Pizza", "Vegan"]),
    );
    expect(RESTAURANT_VIBE_CHIPS.map((c) => c.label)).toEqual(
      expect.arrayContaining(["Fine dining", "Casual", "Date night", "Rooftop", "Family"]),
    );
    expect(RESTAURANT_GEO_FALLBACK_CHIPS.map((c) => c.label)).toEqual(
      expect.arrayContaining(["El Poblado", "Laureles", "Envigado", "Provenza"]),
    );
    expect(RESTAURANT_BUDGET_CHIPS.map((c) => c.label)).toEqual(["$", "$$", "$$$"]);
    expect(RESTAURANT_GEO_FALLBACK_CHIPS.some((c) => c.nearMe)).toBe(false);
  });

  it("builds chip search prompts for immediate search", () => {
    const chip = RESTAURANT_CUISINE_CHIPS.find((c) => c.id === "c-italian")!;
    expect(restaurantChipSearchPrompt(chip)).toContain("Italian");
    expect(restaurantChipSearchPrompt(chip)).toContain("restaurants");
  });
});
