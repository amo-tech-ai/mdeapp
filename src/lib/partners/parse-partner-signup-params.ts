import { PARTNER_TYPES, type PartnerType } from "@/lib/partners/partner-types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isPartnerType(value: string | null | undefined): value is PartnerType {
  return PARTNER_TYPES.includes(value as PartnerType);
}

export function parsePartnerSignupSearchParams(params: {
  type?: string | string[];
  draft?: string | string[];
}) {
  const rawType = Array.isArray(params.type) ? params.type[0] : params.type;
  const rawDraft = Array.isArray(params.draft) ? params.draft[0] : params.draft;
  const typeParam = rawType?.trim() ?? null;
  const type = isPartnerType(typeParam) ? typeParam : null;
  const draftRaw = rawDraft?.trim();
  const draftId =
    draftRaw && UUID_RE.test(draftRaw) ? draftRaw : undefined;

  return { type, typeParam, draftId };
}

/** Picker route — preserves optional draft when returning from wizard. */
export function buildPartnerSignupPickerPath(draftId?: string): string {
  if (!draftId) return "/partners/signup";
  const params = new URLSearchParams({ draft: draftId });
  return `/partners/signup?${params.toString()}`;
}

export function buildPartnerSignupTypedPath(type: string, draftId?: string): string {
  const params = new URLSearchParams({ type });
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
