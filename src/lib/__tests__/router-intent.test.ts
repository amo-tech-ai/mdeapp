import { describe, expect, it } from "vitest";
import {
  classifyRouterIntent,
  routerHandlerOrderFor,
  routerIntentSchema,
  ROUTER_ROUTING_TABLE,
} from "../router-intent";

describe("routerIntentSchema", () => {
  it("accepts all eight router intents", () => {
    for (const intent of [
      "rental_search",
      "event_discovery",
      "venue_booking",
      "restaurant_discovery",
      "day_trip_planning",
      "general_concierge",
      "chitchat",
      "unknown",
    ] as const) {
      expect(routerIntentSchema.parse(intent)).toBe(intent);
      expect(ROUTER_ROUTING_TABLE[intent].workflow).toBeTruthy();
    }
  });
});

describe("SAN-494 · Canonical router intent schema + deterministic classifier — routing matrix", () => {
  it.each([
    ["I need a venue for a birthday party", "venue_booking"],
    ["Restaurant for 20 people", "venue_booking"],
    ["Best restaurants in Laureles", "restaurant_discovery"],
    ["What should I do this weekend?", "day_trip_planning"],
    ["Find me a 2BR apartment", "rental_search"],
    ["Salsa events tonight", "event_discovery"],
  ] as const)("«%s» → %s", (query, intent) => {
    expect(classifyRouterIntent(query).intent).toBe(intent);
  });

  const venueBooking = [
    "I need a venue for a birthday party for 30 people",
    "Looking for a venue for 30 guests",
    "Corporate event venue in Poblado",
    "Restaurant for a private event",
    "Wedding venue",
  ];

  it.each(venueBooking)("venue hire never event_discovery: %s", (query) => {
    const out = classifyRouterIntent(query);
    expect(out.intent).toBe("venue_booking");
    expect(out.routingTarget).toBe("event_venue_booking");
    expect(routerHandlerOrderFor(query)[0]).toBe("event_venue_booking");
  });

  const eventDiscovery = [
    "salsa events this weekend",
    "music events in Medellín",
    "nightlife this weekend in Poblado",
  ];

  it.each(eventDiscovery)("ticketed events: %s", (query) => {
    expect(classifyRouterIntent(query).intent).toBe("event_discovery");
  });
});

describe("SAN-867 · VEB-MVP-001 — Router hijack fix — agent intents skip fast-path", () => {
  it.each([
    "plan my weekend",
    "what can I do tonight",
    "What should I do this weekend?",
    "things to do in Medellín tomorrow",
  ])("«%s» → no fast-path handlers", (query) => {
    expect(classifyRouterIntent(query).routingTarget).toBe("agent");
    expect(routerHandlerOrderFor(query)).toEqual([]);
  });

  it("venue_booking still runs event_venue_booking first", () => {
    const q = "I need a venue for a birthday party for 30 people";
    expect(routerHandlerOrderFor(q)[0]).toBe("event_venue_booking");
  });

  it("event_discovery still runs event handler first", () => {
    const q = "salsa events this weekend";
    expect(routerHandlerOrderFor(q)[0]).toBe("event");
  });
});

describe("classifyRouterIntent — confidence actions", () => {
  it("venue_booking always search_now", () => {
    expect(classifyRouterIntent("Restaurant for 20 people").action).toBe(
      "search_now",
    );
  });

  it("unknown short message clarifies", () => {
    expect(classifyRouterIntent("ok").action).toBe("clarify");
  });
});
