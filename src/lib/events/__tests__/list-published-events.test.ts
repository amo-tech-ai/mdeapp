import { describe, expect, it, vi, beforeEach } from "vitest";
import { mapEventRowToBrowseItem } from "../list-published-events";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "@/lib/supabase/server";
import { GET } from "@/app/api/events/public/route";

describe("mapEventRowToBrowseItem", () => {
  it("maps slug and ticketUrl for browse cards", () => {
    const item = mapEventRowToBrowseItem({
      id: "e1",
      slug: "salsa-night",
      name: "Salsa Night",
      event_type: "music",
      address: "Laureles, Calle 10",
      city: "Medellín",
      event_start_time: "2026-06-10T01:00:00.000Z",
      ticket_price_min: 25000,
      currency: "COP",
      primary_image_url: "https://cdn.example/photo.jpg",
      ticket_url: null,
      status: "published",
    });
    expect(item.slug).toBe("salsa-night");
    expect(item.ticketUrl).toBe("/events/salsa-night");
    expect(item.category).toBe("music");
    expect(item.currency).toBe("COP");
    expect(item.neighborhood).toBe("Laureles");
  });
});

describe("GET /api/events/public", () => {
  beforeEach(() => {
    vi.mocked(createClient).mockReset();
  });

  it("returns 400 on invalid category", async () => {
    const res = await GET(
      new Request("http://localhost/api/events/public?category=invalid"),
    );
    expect(res.status).toBe(400);
  });

  it("returns published events JSON", async () => {
    const chain = {
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      then: undefined as unknown,
    };
    chain.range.mockImplementation(() =>
      Promise.resolve({
        data: [
          {
            id: "e1",
            slug: "salsa-night",
            name: "Salsa Night",
            event_type: "music",
            address: "Laureles, Calle 10",
            city: "Medellín",
            event_start_time: "2026-06-10T01:00:00.000Z",
            ticket_price_min: 0,
            currency: "COP",
            primary_image_url: null,
            ticket_url: null,
            status: "published",
          },
        ],
        error: null,
        count: 1,
      }),
    );

    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue(chain),
      }),
    } as never);

    const res = await GET(new Request("http://localhost/api/events/public"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results).toHaveLength(1);
    expect(body.results[0].slug).toBe("salsa-night");
    expect(body.total).toBe(1);
  });
});
