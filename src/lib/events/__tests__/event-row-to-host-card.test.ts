import { describe, it, expect } from "vitest";
import {
  eventRowToHostCardProps,
  type HostEventRow,
} from "../event-row-to-host-card";

const base: HostEventRow = {
  id: "evt-1",
  name: "Medellín Tech Meetup",
  slug: "medellin-tech-meetup",
  status: "published",
  address: "Ruta N, El Poblado, Medellín",
  city: "Medellín",
  event_start_time: "2026-06-12T19:00:00.000Z",
  primary_image_url: "https://example.com/p.jpg",
  ticket_price_min: 25,
};

describe("eventRowToHostCardProps", () => {
  it("maps a published row to card props", () => {
    const p = eventRowToHostCardProps(base);
    expect(p.title).toBe("Medellín Tech Meetup");
    expect(p.neighborhood).toBe("Ruta N");
    expect(p.priceMin).toBe(25);
    expect(p.status).toBe("published");
    expect(p.slug).toBe("medellin-tech-meetup");
    expect(p.imageUrl).toBe("https://example.com/p.jpg");
  });

  it("preserves a null price as null (never 0)", () => {
    expect(eventRowToHostCardProps({ ...base, ticket_price_min: null }).priceMin).toBeNull();
  });

  it("falls back neighborhood to city, then to Medellín", () => {
    expect(
      eventRowToHostCardProps({ ...base, address: null, city: "Envigado" }).neighborhood,
    ).toBe("Envigado");
    expect(
      eventRowToHostCardProps({ ...base, address: null, city: null }).neighborhood,
    ).toBe("Medellín");
  });

  it("maps a missing image to undefined", () => {
    expect(
      eventRowToHostCardProps({ ...base, primary_image_url: null }).imageUrl,
    ).toBeUndefined();
  });

  it("uses safe defaults for missing name/status", () => {
    const p = eventRowToHostCardProps({ ...base, name: null, status: null });
    expect(p.title).toBe("Untitled event");
    expect(p.status).toBe("draft");
  });
});
