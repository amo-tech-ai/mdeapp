import type { RentalSearchApiParams } from "@/lib/rental-query-parser";

export type RentalResultRow = {
  id: string;
  title: string;
  neighborhood: string;
  nightly_price?: number;
  bedrooms?: number;
  wifi?: boolean;
  amenities?: string[];
  tags?: string[];
  availability?: string;
  host_name?: string;
};

const BENEFIT_MAP: Array<{ re: RegExp; label: string }> = [
  { re: /\bwifi|wi-fi\b/i, label: "Fast WiFi" },
  { re: /\bpet[- ]?friendly\b/i, label: "Pet-friendly" },
  { re: /\bquiet\b/i, label: "Quiet" },
  { re: /\bnightlife\b/i, label: "Near nightlife" },
  { re: /\bcowork|workspace|remote\b/i, label: "Remote-work friendly" },
  { re: /\blong[- ]?stay\b/i, label: "Long-stay" },
  { re: /\bbudget\b/i, label: "Budget-friendly" },
  { re: /\bparking\b/i, label: "Parking" },
  { re: /\bsafe|security\b/i, label: "Secure building" },
];

export function formatRentalPrices(nightly?: number): {
  nightlyLabel: string | null;
  monthlyLabel: string | null;
} {
  if (nightly == null || !Number.isFinite(nightly)) {
    return { nightlyLabel: null, monthlyLabel: null };
  }
  const nightlyLabel = `$${nightly.toLocaleString("en-US")}/night`;
  const monthlyLabel = `~$${Math.round(nightly * 30).toLocaleString("en-US")}/mo`;
  return { nightlyLabel, monthlyLabel };
}

export function rentalBenefitBadges(row: RentalResultRow): string[] {
  const haystack = [
    ...(row.amenities ?? []),
    ...(row.tags ?? []),
    row.wifi ? "wifi" : "",
  ].join(" ");
  const out: string[] = [];
  for (const { re, label } of BENEFIT_MAP) {
    if (re.test(haystack) && !out.includes(label)) out.push(label);
  }
  if (row.wifi && !out.includes("Fast WiFi")) out.unshift("Fast WiFi");
  return out.slice(0, 5);
}

export function buildMatchReason(
  row: RentalResultRow,
  params?: RentalSearchApiParams,
): string {
  const parts: string[] = [];
  if (params?.neighborhood && row.neighborhood) {
    parts.push(`In ${row.neighborhood}`);
  }
  if (params?.minBedrooms != null && row.bedrooms != null) {
    parts.push(`${row.bedrooms} BR fits your bedroom ask`);
  }
  if (params?.maxPricePerNight != null && row.nightly_price != null) {
    if (row.nightly_price <= params.maxPricePerNight) {
      parts.push(`Within ~$${params.maxPricePerNight}/night budget`);
    }
  }
  const badges = rentalBenefitBadges(row);
  if (badges.length) parts.push(badges.slice(0, 2).join(" · "));
  return parts.length
    ? parts.join(" · ")
    : "Matches your neighborhood and stay filters.";
}

export function describeSearchCriteria(
  params: RentalSearchApiParams,
  userText: string,
): string {
  const bits: string[] = [];
  if (params.neighborhood) bits.push(params.neighborhood);
  if (params.minBedrooms != null) {
    bits.push(
      params.minBedrooms === 0
        ? "studio"
        : `${params.minBedrooms} bedroom${params.minBedrooms > 1 ? "s" : ""}`,
    );
  }
  if (params.maxPricePerNight != null) {
    bits.push(`under $${params.maxPricePerNight}/night`);
  }
  if (bits.length === 0) {
    return userText.trim() || "Short-term rentals in Medellín";
  }
  return bits.join(" · ");
}

/** Rental fast-path uses cards only — no prose block in chat. */
export function fastPathRentalNarrative(count: number): string {
  if (count === 0) {
    return "No rentals matched — try a wider budget or another neighborhood.";
  }
  return "";
}

export function fastPathRentalSummary(count: number): string {
  if (count === 0) {
    return "No rentals matched — try a wider budget or another neighborhood.";
  }
  return `Found ${count} rental${count === 1 ? "" : "s"} — see cards below and pins on the map.`;
}
