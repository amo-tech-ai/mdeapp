import type { GroundedPhotoAttribution } from "@/lib/parse-grounded-tool-result";

export type MapPinPreviewMeta = {
  photoName?: string;
  rating?: number;
  userRatingCount?: number;
  openNow?: boolean;
  priceLevel?: string;
  primaryType?: string;
  summary?: string;
  directionsUrl?: string;
  reviewsUrl?: string;
  photoAuthorAttributions?: GroundedPhotoAttribution[];
};

export function parseMapPinPreviewMeta(
  meta: Record<string, unknown> | undefined,
): MapPinPreviewMeta {
  if (!meta) return {};
  const rating =
    typeof meta.rating === "number" && !Number.isNaN(meta.rating)
      ? meta.rating
      : undefined;
  const userRatingCount =
    typeof meta.userRatingCount === "number" && !Number.isNaN(meta.userRatingCount)
      ? meta.userRatingCount
      : undefined;
  const openNow =
    meta.openNow === false ? false : meta.openNow === true ? true : undefined;
  const photoName =
    typeof meta.photoName === "string" ? meta.photoName : undefined;
  const priceLevel =
    typeof meta.priceLevel === "string" ? meta.priceLevel : undefined;
  const primaryType =
    typeof meta.primaryType === "string" ? meta.primaryType : undefined;
  const summary = typeof meta.summary === "string" ? meta.summary.trim() : undefined;
  const directionsUrl =
    typeof meta.directionsUrl === "string" ? meta.directionsUrl : undefined;
  const reviewsUrl =
    typeof meta.reviewsUrl === "string" ? meta.reviewsUrl : undefined;
  const photoAuthorAttributions = Array.isArray(meta.photoAuthorAttributions)
    ? (meta.photoAuthorAttributions as GroundedPhotoAttribution[])
    : undefined;
  return {
    photoName,
    rating,
    userRatingCount,
    openNow,
    priceLevel,
    primaryType,
    summary,
    directionsUrl,
    reviewsUrl,
    photoAuthorAttributions,
  };
}
