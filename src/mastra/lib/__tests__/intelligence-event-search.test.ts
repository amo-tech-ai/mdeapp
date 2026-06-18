import { describe, expect, it } from "vitest";
import {
  parseEventIntelligenceSlots,
  resolveEventCategoryForQuery,
  isWithinDateWindow,
  hybridRowToEventCard,
  filterHybridEventRows,
} from "../intelligence-event-search";

const sampleRow = {
  id: "e1",
  name: "Salsa Night",
  description: null,
  event_type: "music",
  address: "El Poblado, Calle 10 #43, Medellín",
  city: "Medellín",
  event_start_time: "2026-06-20T02:00:00.000Z",
  ticket_price_min: 25,
  currency: "USD",
  primary_image_url: "https://example.com/img.jpg",
  similarity: 0.9,
  latitude: 6.2,
  longitude: -75.5,
  maps_url: "https://maps.example.com",
};

describe("resolveEventCategoryForQuery", () => {
  it("remaps nightlife chip + salsa queryText to music for hybrid filter", () => {
    expect(
      resolveEventCategoryForQuery(
        "nightlife",
        "salsa events this weekend in Medellín",
      ),
    ).toBe("music");
  });

  it("clears nightlife when queryText is absent (chip-only scope)", () => {
    expect(resolveEventCategoryForQuery("nightlife", undefined)).toBeUndefined();
    expect(resolveEventCategoryForQuery("nightlife", "")).toBeUndefined();
  });

  it("keeps other categories when queryText is absent", () => {
    expect(resolveEventCategoryForQuery("music", undefined)).toBe("music");
  });

  it("remaps nightlife chip + hyphenated live-music queryText to music", () => {
    expect(
      resolveEventCategoryForQuery(
        "nightlife",
        "live-music in Laureles tonight",
      ),
    ).toBe("music");
  });

  it("keeps nightlife when query has no salsa/live-music signals", () => {
    expect(
      resolveEventCategoryForQuery("nightlife", "clubs this weekend in Poblado"),
    ).toBe("nightlife");
  });

  it("leaves music unchanged", () => {
    expect(
      resolveEventCategoryForQuery("music", "salsa events this weekend"),
    ).toBe("music");
  });
});

describe("parseEventIntelligenceSlots", () => {
  it("extracts salsa + this weekend", () => {
    const slots = parseEventIntelligenceSlots("salsa this weekend in Provenza");
    expect(slots.wantsSalsa).toBe(true);
    expect(slots.dateWindow).toBe("this_weekend");
    expect(slots.neighborhood).toBe("El Poblado");
  });

  it("extracts live music intent", () => {
    const slots = parseEventIntelligenceSlots("live music in Laureles tonight");
    expect(slots.wantsLiveMusic).toBe(true);
    expect(slots.dateWindow).toBe("tonight");
    expect(slots.neighborhood).toBe("Laureles");
  });

  it("extracts hyphenated live-music intent", () => {
    const slots = parseEventIntelligenceSlots("live-music in Laureles tonight");
    expect(slots.wantsLiveMusic).toBe(true);
  });

  it("extracts fashion + networking", () => {
    const slots = parseEventIntelligenceSlots("fashion networking event Poblado");
    expect(slots.wantsFashion).toBe(true);
    expect(slots.wantsNetworking).toBe(true);
  });
});

describe("isWithinDateWindow", () => {
  it("treats Z and +00:00 ISO forms as the same instant", () => {
    const window = {
      gte: "2026-06-18T05:00:00.000Z",
      lte: "2026-06-18T23:59:59.999Z",
    };
    expect(isWithinDateWindow("2026-06-18T05:00:00+00:00", window)).toBe(true);
    expect(isWithinDateWindow("2026-06-17T23:59:59.999Z", window)).toBe(false);
  });
});

describe("hybridRowToEventCard", () => {
  it("uses full address for venue and first segment for neighborhood", () => {
    const card = hybridRowToEventCard(sampleRow);
    expect(card.venue).toBe("El Poblado, Calle 10 #43, Medellín");
    expect(card.neighborhood).toBe("El Poblado");
    expect(card.venue).not.toBe(card.neighborhood);
  });
});

describe("filterHybridEventRows", () => {
  const nightlifeRow = { ...sampleRow, id: "e2", event_type: "nightlife", ticket_price_min: 80 };
  const rows = [sampleRow, nightlifeRow];

  it("filters by category when queryText path would pass category", () => {
    const filtered = filterHybridEventRows(rows, "music");
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.id).toBe("e1");
  });

  it("filters by maxPricePerTicket", () => {
    const filtered = filterHybridEventRows(rows, undefined, 50);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.id).toBe("e1");
  });

  it("applies category remap used with queryText (nightlife+salsa → music)", () => {
    const category = resolveEventCategoryForQuery(
      "nightlife",
      "salsa events this weekend in Medellín",
    );
    const filtered = filterHybridEventRows(rows, category);
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.event_type).toBe("music");
  });
});
