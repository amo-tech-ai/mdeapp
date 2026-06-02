import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getPlaceDetailsMock, fromMock, createServiceRoleClientMock } = vi.hoisted(
  () => {
    const getPlaceDetailsMock = vi.fn();
    const fromMock = vi.fn();
    const createServiceRoleClientMock = vi.fn(() => ({ from: fromMock }));
    return { getPlaceDetailsMock, fromMock, createServiceRoleClientMock };
  },
);

vi.mock("@/mastra/lib/google-places-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/mastra/lib/google-places-client")>();
  return {
    ...actual,
    getPlaceDetails: getPlaceDetailsMock,
  };
});

vi.mock("@/lib/supabase/service", () => ({
  createServiceRoleClient: createServiceRoleClientMock,
}));

import { PLACE_DETAILS_FIELD_MASK_VERSION } from "@/mastra/lib/google-places-client";
import {
  fetchPlaceDetailsWithCache,
  readPlaceDetailsFromCache,
} from "@/lib/place-details-cache";

function mockCacheSelectRow(payload: unknown | null, error: unknown = null) {
  const maybeSingle = vi.fn(async () => ({
    data: payload ? { payload, expires_at: new Date(Date.now() + 86400000).toISOString() } : null,
    error,
  }));
  const gt = vi.fn(() => ({ maybeSingle }));
  const eqMask = vi.fn(() => ({ gt }));
  const eqId = vi.fn(() => ({ eq: eqMask }));
  const select = vi.fn(() => ({ eq: eqId }));
  fromMock.mockReturnValue({ select, upsert: vi.fn(async () => ({ error: null })) });
  return { select, eqId, eqMask, gt, maybeSingle };
}

describe("place-details-cache (VEN-014)", () => {
  beforeEach(() => {
    getPlaceDetailsMock.mockReset();
    fromMock.mockReset();
    createServiceRoleClientMock.mockClear();
    getPlaceDetailsMock.mockResolvedValue({
      id: "ChIJTest",
      displayName: { text: "Test Café" },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns cache hit without calling Places getPlaceDetails", async () => {
    const payload = { id: "ChIJCached", displayName: { text: "Cached" } };
    mockCacheSelectRow(payload);

    const result = await fetchPlaceDetailsWithCache("ChIJCached");

    expect(result.cacheHit).toBe(true);
    expect(result.raw).toEqual(payload);
    expect(getPlaceDetailsMock).not.toHaveBeenCalled();
  });

  it("fetches Places on cache miss and writes upsert", async () => {
    const upsert = vi.fn(async () => ({ error: null }));
    const maybeSingle = vi.fn(async () => ({ data: null, error: null }));
    const gt = vi.fn(() => ({ maybeSingle }));
    const eqMask = vi.fn(() => ({ gt }));
    const eqId = vi.fn(() => ({ eq: eqMask }));
    const select = vi.fn(() => ({ eq: eqId }));
    fromMock.mockReturnValue({ select, upsert });

    const fresh = { id: "ChIJFresh", displayName: { text: "Fresh" } };
    getPlaceDetailsMock.mockResolvedValue(fresh);

    const result = await fetchPlaceDetailsWithCache("ChIJFresh");

    expect(result.cacheHit).toBe(false);
    expect(result.raw).toEqual(fresh);
    expect(getPlaceDetailsMock).toHaveBeenCalledOnce();
    expect(upsert).toHaveBeenCalledOnce();
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        place_id: "ChIJFresh",
        field_mask_version: PLACE_DETAILS_FIELD_MASK_VERSION,
      }),
      expect.objectContaining({ onConflict: "place_id,field_mask_version" }),
    );
  });

  it("readPlaceDetailsFromCache uses current field_mask_version filter", async () => {
    const { eqMask } = mockCacheSelectRow({ id: "ChIJX" });

    await readPlaceDetailsFromCache("ChIJX");

    expect(eqMask).toHaveBeenCalledWith(
      "field_mask_version",
      PLACE_DETAILS_FIELD_MASK_VERSION,
    );
  });

  it("returns miss when service client unavailable", async () => {
    // @ts-expect-error — exercise missing Supabase service env
    createServiceRoleClientMock.mockReturnValueOnce(null);

    const read = await readPlaceDetailsFromCache("ChIJNoDb");
    expect(read.hit).toBe(false);
    if (!read.hit) expect(read.reason).toBe("no_db");
  });
});
