import { NextResponse } from "next/server";
import { fetchPlaceDetailsWithCache } from "@/lib/place-details-cache";
import { normalizePlaceDetails } from "@/lib/place-details";
import {
  normalizePlaceId,
  PlacesConfigError,
  PlacesRequestError,
} from "@/mastra/lib/google-places-client";
import {
  isPlacesDetailRateLimited,
  placesDetailRateLimitKey,
} from "@/lib/places-detail-rate-limit";

export async function GET(req: Request) {
  const rateKey = placesDetailRateLimitKey(req);
  if (isPlacesDetailRateLimited(rateKey)) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }

  const url = new URL(req.url);
  const rawId = url.searchParams.get("placeId")?.trim() ?? "";
  if (!rawId || rawId.length < 8) {
    return NextResponse.json({ error: "invalid_place_id" }, { status: 400 });
  }

  const placeId = normalizePlaceId(rawId);

  try {
    const { raw, cacheHit } = await fetchPlaceDetailsWithCache(placeId);
    const details = normalizePlaceDetails(raw);
    if (!details) {
      return NextResponse.json({ error: "place_not_found" }, { status: 404 });
    }
    return NextResponse.json(details, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Places-Cache": cacheHit ? "hit" : "miss",
      },
    });
  } catch (err) {
    if (err instanceof PlacesConfigError) {
      return NextResponse.json(
        { error: "places_not_configured" },
        {
          status: 503,
          headers: { "Cache-Control": "private, max-age=600" },
        },
      );
    }
    if (err instanceof PlacesRequestError) {
      return NextResponse.json(
        { error: "places_request_failed" },
        {
          status: 502,
          headers: { "Cache-Control": "private, max-age=600" },
        },
      );
    }
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
