import { describe, expect, it } from "vitest";
import {
  buildMatchReason,
  fastPathRentalNarrative,
  formatRentalPrices,
  rentalBenefitBadges,
} from "@/lib/rental-display";

describe("rental-display", () => {
  it("formats nightly and monthly labels", () => {
    expect(formatRentalPrices(80)).toEqual({
      nightlyLabel: "$80/night",
      monthlyLabel: "~$2,400/mo",
    });
  });

  it("extracts benefit badges from amenities and wifi", () => {
    const badges = rentalBenefitBadges({
      id: "1",
      title: "Studio",
      neighborhood: "Laureles",
      wifi: true,
      amenities: ["WiFi", "AC"],
      tags: ["pet-friendly", "long-stay"],
    });
    expect(badges).toContain("Fast WiFi");
    expect(badges.some((b) => /pet/i.test(b))).toBe(true);
  });

  it("builds match reason from search params", () => {
    const reason = buildMatchReason(
      {
        id: "1",
        title: "Loft",
        neighborhood: "Laureles",
        nightly_price: 70,
        bedrooms: 1,
        wifi: true,
      },
      { neighborhood: "Laureles", minBedrooms: 1, maxPricePerNight: 80 },
    );
    expect(reason).toContain("Laureles");
    expect(reason).toContain("budget");
  });

  it("narrative is empty when results exist (cards carry the UI)", () => {
    expect(fastPathRentalNarrative(3)).toBe("");
  });
});
