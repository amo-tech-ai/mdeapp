import { NextResponse } from "next/server";
import {
  isPlacesPhotoRateLimited,
  placesPhotoRateLimitKey,
} from "@/lib/places-photo-rate-limit";
import {
  buildPlacesPhotoMediaUrl,
  clampPhotoMaxWidthPx,
  isValidPlacesPhotoName,
} from "@/lib/places-photo-proxy";
import { requirePlacesApiKey } from "@/mastra/lib/google-places-client";

export async function GET(req: Request) {
  const rateKey = placesPhotoRateLimitKey(req);
  if (isPlacesPhotoRateLimited(rateKey)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const url = new URL(req.url);
  const name = url.searchParams.get("name")?.trim() ?? "";
  if (!isValidPlacesPhotoName(name)) {
    return NextResponse.json({ error: "invalid_photo_name" }, { status: 400 });
  }

  let apiKey: string;
  try {
    apiKey = requirePlacesApiKey();
  } catch {
    return NextResponse.json({ error: "places_not_configured" }, { status: 503 });
  }

  const maxWidthPx = clampPhotoMaxWidthPx(url.searchParams.get("maxWidthPx"));
  const mediaUrl = buildPlacesPhotoMediaUrl(name, maxWidthPx, apiKey);

  try {
    const upstream = await fetch(mediaUrl, {
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
    if (!upstream.ok) {
      return new NextResponse(null, { status: upstream.status });
    }
    const bytes = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get("content-type") ?? "image/jpeg";
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json({ error: "photo_fetch_failed" }, { status: 502 });
  }
}
