import { PARTNER_TYPES, type PartnerType } from "@/lib/partners/partner-types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isPartnerType(value: string | null | undefined): value is PartnerType {
  return PARTNER_TYPES.includes(value as PartnerType);
}

/** Venue subtypes accepted on the signup URL (?type=venue&category=…). */
export const PARTNER_CATEGORIES = ["restaurant", "cafe", "nightclub"] as const;
export type PartnerCategory = (typeof PARTNER_CATEGORIES)[number];

export const PARTNER_CATEGORY_LABELS: Record<PartnerCategory, string> = {
  restaurant: "Restaurant",
  cafe: "Café",
  nightclub: "Nightclub",
};

export function isPartnerCategory(
  value: string | null | undefined,
): value is PartnerCategory {
  return PARTNER_CATEGORIES.includes(value as PartnerCategory);
}

export function parsePartnerSignupSearchParams(params: {
  type?: string | string[];
  draft?: string | string[];
  category?: string | string[];
}) {
  const rawType = Array.isArray(params.type) ? params.type[0] : params.type;
  const rawDraft = Array.isArray(params.draft) ? params.draft[0] : params.draft;
  const rawCategory = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const typeParam = rawType?.trim() ?? null;
  const type = isPartnerType(typeParam) ? typeParam : null;
  const draftRaw = rawDraft?.trim();
  const draftId =
    draftRaw && UUID_RE.test(draftRaw) ? draftRaw : undefined;
  const categoryParam = rawCategory?.trim() ?? null;
  // Only the allow-listed venue subtypes are accepted; anything else is ignored.
  const category = isPartnerCategory(categoryParam) ? categoryParam : null;

  return { type, typeParam, draftId, category, categoryParam };
}

/** Picker route — preserves optional draft when returning from wizard. */
export function buildPartnerSignupPickerPath(draftId?: string): string {
  if (!draftId) return "/partners/signup";
  const params = new URLSearchParams({ draft: draftId });
  return `/partners/signup?${params.toString()}`;
}

export function buildPartnerSignupTypedPath(
  type: string,
  draftId?: string,
  category?: string,
): string {
  const params = new URLSearchParams({ type });
  if (category) params.set("category", category);
  if (draftId) params.set("draft", draftId);
  return `/partners/signup?${params.toString()}`;
}

export const PARTNER_TYPE_LABELS: Record<PartnerType, string> = {
  host: "Event host",
  venue: "Venue",
  broker: "Rental broker",
  sponsor: "Sponsor",
  agency: "Agency",
  vendor: "Vendor",
  tour: "Tour operator",
  creator: "Creator",
};
