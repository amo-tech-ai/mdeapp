import { describe, it, expect } from "vitest";
import { buildEventInsert } from "../../supabase/functions/approval-commit/build-event-insert";

const draft = {
  title: "Medellín Tech Meetup",
  neighborhood: "El Poblado",
  dateIso: "2026-06-12T19:00:00.000Z",
  venue: "Ruta N",
  priceMinCop: 25000,
  capacity: 80,
  description: "Monthly meetup",
  ticketTiers: [{ name: "General", priceCop: 25000, quantity: 80 }],
};

describe("buildEventInsert", () => {
  it("sets organizer_id (NOT just created_by) so the host can read their own row", () => {
    const row = buildEventInsert(draft, "user-123", "medellin-tech-meetup");
    // EVT-002 Step 0 regression guard — without organizer_id the event is
    // invisible on /host/events and via events_organizer_select_own.
    expect(row.organizer_id).toBe("user-123");
    expect(row.created_by).toBe("user-123");
  });

  it("publishes with the expected core fields", () => {
    const row = buildEventInsert(draft, "user-123", "medellin-tech-meetup");
    expect(row.status).toBe("published");
    expect(row.slug).toBe("medellin-tech-meetup");
    expect(row.name).toBe("Medellín Tech Meetup");
    expect(row.source).toBe("host_wizard");
    expect(row.event_start_time).toBe("2026-06-12T19:00:00.000Z");
  });

  it("nests neighborhood, capacity and tiers under details", () => {
    const row = buildEventInsert(draft, "u", "s");
    expect(row.details).toEqual({
      neighborhood: "El Poblado",
      capacity: 80,
      ticket_tiers: [{ name: "General", priceCop: 25000, quantity: 80 }],
    });
  });

  it("snapshots host_display when hostDisplay is provided", () => {
    const row = buildEventInsert(draft, "user-123", "slug", {
      name: "Roberto Host",
      avatarUrl: "https://example.com/host.png",
    });
    expect(row.details.host_display).toEqual({
      name: "Roberto Host",
      avatar_url: "https://example.com/host.png",
    });
  });

  it("normalizes whitespace-only avatar_url to null", () => {
    const row = buildEventInsert(draft, "user-123", "slug", {
      name: "Roberto Host",
      avatarUrl: "  ",
    });
    expect(row.details.host_display).toEqual({
      name: "Roberto Host",
      avatar_url: null,
    });
  });

  it("defaults optional fields to null / empty without throwing", () => {
    const row = buildEventInsert({ title: "T", dateIso: "2026-01-01T00:00:00Z" }, "u", "t");
    expect(row.description).toBeNull();
    expect(row.address).toBeNull();
    expect(row.ticket_price_min).toBeNull();
    expect(row.details.ticket_tiers).toEqual([]);
  });
});
