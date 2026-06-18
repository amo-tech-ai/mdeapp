import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  embedQueryText: vi.fn(),
  vectorLiteral: vi.fn((embedding: unknown[]) => `vector(${Array.isArray(embedding) ? embedding.length : 0})`),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mocks.createClient,
}));

vi.mock("../query-embedding", () => ({
  embedQueryText: mocks.embedQueryText,
  vectorLiteral: mocks.vectorLiteral,
}));

const makeQueryBuilder = (result: {
  data: unknown;
  error: { message: string } | null;
}) => {
  const builder: Record<string, unknown> = {};
  for (const method of ["select", "eq", "order", "limit", "gte", "lte", "ilike", "in"] as const) {
    builder[method] = vi.fn(() => builder);
  }
  builder.then = (
    onFulfilled?: (value: typeof result) => unknown,
    onRejected?: (reason: unknown) => unknown,
  ) => Promise.resolve(result).then(onFulfilled, onRejected);
  return builder;
};

const makeClient = (options: {
  events: { data: unknown[]; error: { message: string } | null };
  signals: { data: unknown[]; error: { message: string } | null };
  rpc?: { data: unknown[] | null; error: { message: string } | null };
}) => {
  const eventsBuilder = makeQueryBuilder(options.events);
  const signalsBuilder = makeQueryBuilder(options.signals);
  return {
    from: vi.fn((table: string) => (table === "events" ? eventsBuilder : signalsBuilder)),
    rpc: vi.fn(() => Promise.resolve(options.rpc ?? { data: null, error: null })),
  };
};

describe("searchEventsIntelligent — coverage branches", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-18T12:00:00.000Z"));
    vi.stubEnv("SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("SUPABASE_ANON_KEY", "test-anon-key");
    mocks.createClient.mockReset();
    mocks.embedQueryText.mockReset();
    mocks.vectorLiteral.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it("returns fallback when Supabase env is missing", async () => {
    vi.unstubAllEnvs();
    const { searchEventsIntelligent } = await import("../intelligence-event-search");

    await expect(searchEventsIntelligent({ limit: 5 })).resolves.toEqual({
      results: [],
      total: 0,
      source: "fallback",
      hybridUsed: false,
      rankExplanation: [],
      slots: {},
    });
  });

  it("covers hybrid RPC ranking with signal boost", async () => {
    const client = makeClient({
      events: { data: [], error: null },
      signals: {
        data: [
          {
            event_id: "e-hybrid",
            hype_score: 0.8,
            music_energy: 0.9,
            fashion_score: 0.1,
            networking_quality: 0.2,
            nightlife_score: 0.7,
            local_vs_tourist: 0.5,
            confidence: 0.9,
            source: "hybrid-signals",
            evidence: { note: "hybrid path" },
          },
        ],
        error: null,
      },
      rpc: {
        data: [
          {
            id: "e-hybrid",
            name: "Salsa Night",
            description: null,
            event_type: "music",
            address: "El Poblado, Medellín",
            city: "Medellín",
            event_start_time: "2026-06-20T18:00:00.000Z",
            ticket_price_min: 25,
            currency: "USD",
            primary_image_url: "https://example.com/salsa.jpg",
            similarity: 0.94,
            latitude: 6.2,
            longitude: -75.5,
            maps_url: "https://maps.example.com/salsa",
          },
        ],
        error: null,
      },
    });
    mocks.createClient.mockReturnValue(client);
    mocks.embedQueryText.mockResolvedValueOnce([0.1, 0.2, 0.3]);

    const { searchEventsIntelligent } = await import("../intelligence-event-search");
    const result = await searchEventsIntelligent({
      queryText: "salsa this weekend in Poblado",
      limit: 3,
    });

    expect(client.rpc).toHaveBeenCalledWith(
      "hybrid_search_events",
      expect.objectContaining({
        query_text: "salsa this weekend in Poblado",
        query_embedding: "vector(3)",
        match_count: 20,
      }),
    );
    expect(result.hybridUsed).toBe(true);
    expect(result.rankExplanation.map((entry) => entry.factor)).toContain("hybrid_semantic");
    expect(result.rankExplanation.map((entry) => entry.factor)).toContain("date_window");
    expect(result.rankExplanation.map((entry) => entry.factor)).toContain("salsa_intent");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]?.signalSource).toBe("hybrid-signals");
  });

  it("covers structured query filtering and relaxed fallback", async () => {
    const client = makeClient({
      events: {
        data: [
          {
            id: "e-structured",
            name: "Future Salsa Night",
            event_type: "music",
            address: "El Poblado, Medellín",
            city: "Medellín",
            event_start_time: "2026-06-30T18:00:00.000Z",
            ticket_price_min: 20,
            currency: "COP",
            primary_image_url: "https://example.com/future.jpg",
            latitude: 6.21,
            longitude: -75.57,
            maps_url: "https://maps.example.com/future",
          },
        ],
        error: null,
      },
      signals: {
        data: [
          {
            event_id: "e-structured",
            hype_score: 0.9,
            music_energy: 0.8,
            fashion_score: 0.1,
            networking_quality: 0.2,
            nightlife_score: 0.7,
            local_vs_tourist: 0.5,
            confidence: 0.9,
            source: "event_signals",
            evidence: { note: "structured path" },
          },
        ],
        error: null,
      },
    });
    mocks.createClient.mockReturnValue(client);
    mocks.embedQueryText.mockResolvedValueOnce(null);

    const { searchEventsIntelligent } = await import("../intelligence-event-search");
    const result = await searchEventsIntelligent({
      queryText: "salsa this weekend in Poblado",
      dateWindow: "this_weekend",
      limit: 5,
    });

    expect(client.from).toHaveBeenCalledWith("events");
    expect(client.from).toHaveBeenCalledWith("event_signals");
    expect(result.hybridUsed).toBe(false);
    expect(result.rankExplanation.map((entry) => entry.factor)).toContain("date_window_relaxed");
    expect(result.rankExplanation.map((entry) => entry.factor)).toContain("date_window");
    expect(result.rankExplanation.map((entry) => entry.factor)).toContain("salsa_intent");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]?.signalSource).toBe("event_signals");
    expect(result.results[0]?.sourceUrl).toBe("https://maps.example.com/future");
  });
});