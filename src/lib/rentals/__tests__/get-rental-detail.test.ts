import { describe, expect, it } from "vitest";
import { mapApartmentRowToDetail } from "../get-rental-detail";

describe("SAN-1202 · mapApartmentRowToDetail", () => {
  it("maps a full apartments row to the detail view-model", () => {
    const d = mapApartmentRowToDetail({
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
    expect(d.id).toBe("abc");
    expect(d.bedrooms).toBe(2);
    expect(d.priceMonthly).toBe(2400);
    expect(d.amenities).toEqual(["wifi", "ac"]);
    expect(d.buildingAmenities).toEqual(["gym"]);
    expect(d.images).toHaveLength(2);
  });

  it("returns null for unknown/blank fields so the UI can show Data pending — never faked", () => {
    const d = mapApartmentRowToDetail({ id: "x", title: "Studio", neighborhood: "El Poblado" });
    expect(d.bathrooms).toBeNull();
    expect(d.maxGuests).toBeNull();
    expect(d.priceMonthly).toBeNull();
    expect(d.description).toBeNull();
    expect(d.houseRules).toBeNull();
    expect(d.availableFrom).toBeNull();
    expect(d.minimumStayDays).toBeNull();
    expect(d.amenities).toEqual([]);
    expect(d.images).toEqual([]);
  });

  it("coerces numeric strings and rejects non-finite values", () => {
    const d = mapApartmentRowToDetail({ id: "y", title: "T", neighborhood: "N", price_daily: "95", bedrooms: "nope" });
    expect(d.priceNightly).toBe(95);
    expect(d.bedrooms).toBeNull();
  });
});
