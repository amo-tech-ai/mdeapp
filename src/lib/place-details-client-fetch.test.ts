import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchPlaceDetailsDto,
  resetPlaceDetailsClientFetchForTests,
} from "@/lib/place-details-client-fetch";

describe("place-details-client-fetch", () => {
  beforeEach(() => {
    resetPlaceDetailsClientFetchForTests();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 502 })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    resetPlaceDetailsClientFetchForTests();
  });

  it("does not call fetch when placeId is missing", async () => {
    const fetchMock = vi.mocked(fetch);
    const result = await fetchPlaceDetailsDto("", new AbortController().signal);
    expect(result).toBe("error");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("dedupes concurrent requests for the same placeId", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({ placeId: "ChIJTest123456789", displayName: "Test" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const signal = new AbortController().signal;
    const [a, b] = await Promise.all([
      fetchPlaceDetailsDto("ChIJTest123456789", signal),
      fetchPlaceDetailsDto("ChIJTest123456789", signal),
    ]);

    expect(a).not.toBe("error");
    expect(b).not.toBe("error");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not refetch after 502 while failure TTL is active", async () => {
    const fetchMock = vi.mocked(fetch);
    const signal = new AbortController().signal;
    const placeId = "ChIJFail1234567890";

    expect(await fetchPlaceDetailsDto(placeId, signal)).toBe("error");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    expect(await fetchPlaceDetailsDto(placeId, signal)).toBe("error");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
