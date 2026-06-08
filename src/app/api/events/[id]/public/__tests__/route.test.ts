import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/events/get-public-event", () => ({
  getPublicEvent: vi.fn(),
}));

import { getPublicEvent } from "@/lib/events/get-public-event";
import { GET } from "../route";

describe("GET /api/events/[id]/public", () => {
  beforeEach(() => {
    vi.mocked(getPublicEvent).mockReset();
  });

  it("returns 404 when event missing", async () => {
    vi.mocked(getPublicEvent).mockResolvedValue(null);
    const res = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ id: "missing" }),
    });
    expect(res.status).toBe(404);
  });

  it("returns event JSON when found", async () => {
    const event = {
      id: "e1",
      slug: "e1",
      name: "Test",
      description: null,
      address: null,
      city: null,
      startsAt: "2026-01-01T00:00:00.000Z",
      endsAt: null,
      imageUrl: null,
      currency: "USD",
      latitude: null,
      longitude: null,
      host: null,
      venue: null,
      tickets: [],
    };
    vi.mocked(getPublicEvent).mockResolvedValue(event);
    const res = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ id: "e1" }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.event.id).toBe("e1");
  });
});
