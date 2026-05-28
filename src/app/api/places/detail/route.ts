import { NextResponse } from "next/server";
import { normalizePlaceDetails } from "@/lib/place-details";
import {
  getPlaceDetails,
  normalizePlaceId,
  PlacesConfigError,
  PlacesRequestError,
} from "@/mastra/lib/google-places-client";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const rawId = url.searchParams.get("placeId")?.trim() ?? "";
  if (!rawId || rawId.length < 8) {
    return NextResponse.json({ error: "invalid_place_id" }, { status: 400 });
  }

  const placeId = normalizePlaceId(rawId);

  try {
    const raw = await getPlaceDetails({ placeId });
    const details = normalizePlaceDetails(raw);
    if (!details) {
      return NextResponse.json({ error: "place_not_found" }, { status: 404 });
    }
    return NextResponse.json(details, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    if (err instanceof PlacesConfigError) {
      return NextResponse.json({ error: "places_not_configured" }, { status: 503 });
    }
    if (err instanceof PlacesRequestError) {
      return NextResponse.json({ error: "places_request_failed" }, { status: 502 });
    }
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
