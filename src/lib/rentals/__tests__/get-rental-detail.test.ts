import { describe, expect, it } from "vitest";
import { mapApartmentRowToDetail } from "../get-rental-detail";

describe("SAN-1202 · mapApartmentRowToDetail", () => {
  it("maps a full apartments row to the detail view-model", () => {
    const rentalDetail = mapApartmentRowToDetail({
      id: "abc",
      slug: "laureles-2br",
      title: "Bright Laureles 2BR",
      neighborhood: "Laureles",
      address: "Cra 70 #1-23",
      bedrooms: 2,
      bathrooms: 1,
      price_daily: 80,
      price_monthly: 2400,
      currency: "USD",
      deposit_amount: 500,
      amenities: ["wifi", "ac"],
      building_amenities: ["gym"],
      images: ["a.jpg", "b.jpg"],
      available_from: "2026-07-01",
      minimum_stay_days: 30,
      latitude: 6.24,
      longitude: -75.6,
      status: "active",
    });
    expect(rentalDetail.id).toBe("abc");
    expect(rentalDetail.bedrooms).toBe(2);
    expect(rentalDetail.priceMonthly).toBe(2400);
    expect(rentalDetail.amenities).toEqual(["wifi", "ac"]);
    expect(rentalDetail.buildingAmenities).toEqual(["gym"]);
    expect(rentalDetail.images).toHaveLength(2);
  });

  it("returns null for unknown/blank fields so the UI can show Data pending — never faked", () => {
    const detail = mapApartmentRowToDetail({ id: "x", title: "Studio", neighborhood: "El Poblado" });
    expect(detail.bathrooms).toBeNull();
    expect(detail.maxGuests).toBeNull();
    expect(detail.priceMonthly).toBeNull();
    expect(detail.description).toBeNull();
    expect(detail.houseRules).toBeNull();
    expect(detail.availableFrom).toBeNull();
    expect(detail.minimumStayDays).toBeNull();
    expect(detail.amenities).toEqual([]);
    expect(detail.images).toEqual([]);
  });

  it("coerces numeric strings and rejects non-finite values", () => {
    const rentalDetail = mapApartmentRowToDetail({ id: "y", title: "T", neighborhood: "N", price_daily: "95", bedrooms: "nope" });
    expect(rentalDetail.priceNightly).toBe(95);
    expect(rentalDetail.bedrooms).toBeNull();
  });
});
