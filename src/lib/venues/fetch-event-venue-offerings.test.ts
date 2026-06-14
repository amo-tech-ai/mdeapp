import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { fetchEventVenueOfferingsByPlaceId } from "@/lib/venues/fetch-event-venue-offerings";

const MAMACITA_PLACE_ID = "ChIJSAN493MAMACITA01";
const LOCATION_ID = "00000000-0000-4001-8201-000000000001";
const PARTNER_ID = "00000000-0000-4001-8201-000000000099";

function mockSupabaseSequence(
  steps: Array<
    | { data: unknown; error: null }
    | { data: null; error: { code?: string; message: string } }
  >,
) {
  let call = 0;
  const maybeSingle = vi.fn(async () => steps[call++] ?? { data: null, error: null });
  const eqSecond = vi.fn(() => ({ maybeSingle }));
  const eqFirst = vi.fn(() => ({ eq: eqSecond, maybeSingle }));
  const select = vi.fn(() => ({ eq: eqFirst }));
  const from = vi.fn(() => ({ select }));
  return { from, eqFirst, eqSecond, select } as unknown as SupabaseClient<Database> & {
    from: ReturnType<typeof vi.fn>;
  };
}

function mockSupabaseWithOfferings() {
  let call = 0;
  const responses = [
    {
      data: {
        id: LOCATION_ID,
        partner_id: PARTNER_ID,
        label: "Mamacita Provenza",
        neighborhood: "Provenza",
        google_place_id: MAMACITA_PLACE_ID,
      },
      error: null,
    },
    {
      data: [
        {
          id: "off-1",
          offering_key: "birthday",
          event_types: ["birthday", "celebration"],
          amenities: ["rooftop"],
          minimum_spend: 5000000,
          price_per_person_from: 85000,
        },
      ],
      error: null,
    },
    {
      data: [
        {
          id: "pkg-1",
          name: "Rooftop Celebration",
          description: "Private rooftop",
          price_from: 3500000,
          min_guests: 20,
          max_guests: 80,
        },
      ],
      error: null,
    },
  ];

  const chain = {
    maybeSingle: vi.fn(async () => responses[call++]),
    then(onFulfilled: (value: unknown) => unknown) {
      const payload = responses[call++];
      return Promise.resolve(payload).then(onFulfilled);
    },
  };

  const eq = vi.fn(() => chain);
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));
  return { from } as unknown as SupabaseClient<Database>;
}

describe("fetchEventVenueOfferingsByPlaceId", () => {
  it("returns null for short place ids", async () => {
    const supabase = mockSupabaseSequence([]);
    const result = await fetchEventVenueOfferingsByPlaceId(supabase, "short");
    expect(result).toEqual({ ok: true, data: null });
  });

  it("returns null when venue_event_offerings table is absent (prod-safe)", async () => {
    let call = 0;
    const responses = [
      {
        data: {
          id: LOCATION_ID,
          label: "Mamacita Provenza",
          neighborhood: "Provenza",
          google_place_id: MAMACITA_PLACE_ID,
        },
        error: null,
      },
      {
        data: null,
        error: {
          code: "PGRST205",
          message:
            "Could not find the table 'public.venue_event_offerings' in the schema cache",
        },
      },
    ];
    const chain = {
      maybeSingle: vi.fn(async () => responses[call++]),
      then(onFulfilled: (value: unknown) => unknown) {
        const payload = responses[call++];
        return Promise.resolve(payload).then(onFulfilled);
      },
    };
    const eq = vi.fn(() => chain);
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));
    const supabase = { from } as unknown as SupabaseClient<Database>;

    const result = await fetchEventVenueOfferingsByPlaceId(
      supabase,
      MAMACITA_PLACE_ID,
    );
    expect(result).toEqual({ ok: true, data: null });
  });

  it("returns null when location has no offerings", async () => {
    let call = 0;
    const responses = [
      {
        data: {
          id: LOCATION_ID,
          partner_id: PARTNER_ID,
          label: "Plain Restaurant",
          neighborhood: "Laureles",
          google_place_id: "ChIJNOOFFERINGS001",
        },
        error: null,
      },
      { data: [], error: null },
    ];
    const chain = {
      maybeSingle: vi.fn(async () => responses[call++]),
      then(onFulfilled: (value: unknown) => unknown) {
        const payload = responses[call++];
        return Promise.resolve(payload).then(onFulfilled);
      },
    };
    const eq = vi.fn(() => chain);
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));
    const supabase = { from } as unknown as SupabaseClient<Database>;

    const result = await fetchEventVenueOfferingsByPlaceId(
      supabase,
      "ChIJNOOFFERINGS001",
    );
    expect(result).toEqual({ ok: true, data: null });
  });

  it("returns Mamacita-style payload when offerings exist", async () => {
    const supabase = mockSupabaseWithOfferings();
    const result = await fetchEventVenueOfferingsByPlaceId(
      supabase,
      MAMACITA_PLACE_ID,
    );

    expect(result.ok).toBe(true);
    if (!result.ok || !result.data) throw new Error("expected payload");
    expect(result.data.placeId).toBe(MAMACITA_PLACE_ID);
    expect(result.data.partnerId).toBe(PARTNER_ID);
    expect(result.data.partnerLocationId).toBe(LOCATION_ID);
    expect(result.data.offerings).toHaveLength(1);
    expect(result.data.offerings[0]?.minimumSpend).toBe(5000000);
    expect(result.data.offerings[0]?.offeringKey).toBe("birthday");
    expect(result.data.packages).toHaveLength(1);
    expect(result.data.packages[0]?.name).toBe("Rooftop Celebration");
  });

  it("still returns offerings (partnerId null) and warns when partner_id is missing", async () => {
    let call = 0;
    const responses = [
      {
        data: {
          id: LOCATION_ID,
          partner_id: null,
          label: "Unlinked Venue",
          neighborhood: "Provenza",
          google_place_id: MAMACITA_PLACE_ID,
        },
        error: null,
      },
      {
        data: [
          {
            id: "off-1",
            offering_key: "birthday",
            event_types: ["birthday"],
            amenities: ["rooftop"],
            minimum_spend: 5000000,
            price_per_person_from: 85000,
          },
        ],
        error: null,
      },
      { data: [], error: null },
    ];
    const chain = {
      maybeSingle: vi.fn(async () => responses[call++]),
      then(onFulfilled: (value: unknown) => unknown) {
        const payload = responses[call++];
        return Promise.resolve(payload).then(onFulfilled);
      },
    };
    const eq = vi.fn(() => chain);
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));
    const supabase = { from } as unknown as SupabaseClient<Database>;
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await fetchEventVenueOfferingsByPlaceId(
      supabase,
      MAMACITA_PLACE_ID,
    );

    expect(result.ok).toBe(true);
    if (!result.ok || !result.data) throw new Error("expected payload");
    // Venue is NOT hidden — offerings still surface...
    expect(result.data.offerings).toHaveLength(1);
    // ...but partnerId is null so the proposal CTA is suppressed downstream.
    expect(result.data.partnerId).toBeNull();
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });
});
