import { PARTNER_TYPES, type PartnerType } from "@/lib/partners/partner-types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isPartnerType(value: string | null | undefined): value is PartnerType {
  return PARTNER_TYPES.includes(value as PartnerType);
}

export function parsePartnerSignupSearchParams(params: {
  type?: string;
  draft?: string;
}) {
  const typeParam = params.type?.trim() ?? null;
  const type = isPartnerType(typeParam) ? typeParam : null;
  const draftRaw = params.draft?.trim();
  const draftId =
    draftRaw && UUID_RE.test(draftRaw) ? draftRaw : undefined;

  return { type, typeParam, draftId };
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
