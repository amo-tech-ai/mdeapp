import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

const queryResult = { data: null, error: { message: "permission denied" } };

function createQueryBuilder() {
  const builder: Record<string, unknown> = {};
  for (const method of ["select", "eq", "order", "limit", "gte", "lte", "ilike"] as const) {
    builder[method] = vi.fn(() => builder);
  }
  builder.then = (
    onFulfilled?: (value: typeof queryResult) => unknown,
    onRejected?: (reason: unknown) => unknown,
  ) => Promise.resolve(queryResult).then(onFulfilled, onRejected);
  return builder;
}

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => createQueryBuilder()),
    rpc: vi.fn(),
  })),
}));

vi.mock("../query-embedding", () => ({
  embedQueryText: vi.fn().mockResolvedValue(null),
  vectorLiteral: vi.fn(),
}));

describe("searchEventsIntelligent — structured DB errors", () => {
  beforeEach(() => {
    vi.stubEnv("SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("SUPABASE_ANON_KEY", "test-anon-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("throws when structured events query fails (not empty success)", async () => {
    const { searchEventsIntelligent } = await import("../intelligence-event-search");
    await expect(searchEventsIntelligent({ limit: 5 })).rejects.toThrow(
      "structured event query failed: permission denied",
    );
  });
});
