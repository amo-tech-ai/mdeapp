import {
  computeSignalBoost,
  parseIntelligenceSlots,
  type IntelligenceSlots,
} from "./intelligence-restaurant-search";

export type AnchorSignalRow = {
  venue_anchor_id: string;
  quiet_score: number | null;
  date_night_score: number | null;
  rooftop_score: number | null;
  digital_nomad_score: number | null;
  wifi_score: number | null;
  cocktail_score: number | null;
  brunch_score: number | null;
  hidden_gem_score: number | null;
  nightlife_score: number | null;
  local_authenticity_score: number | null;
  touristy_score: number | null;
  service_score: number | null;
  value_score: number | null;
  confidence: number | null;
  source: string | null;
};

export type AnchorEvidence = {
  sourceType: string;
  sourceUrl: string | null;
  extractedText: string | null;
};

export function parseAnchorIntelligenceSlots(
  queryText: string,
  venueKind: "cafe" | "nightclub",
): IntelligenceSlots {
  const slots = parseIntelligenceSlots(queryText);
  const q = queryText.toLowerCase();
  if (venueKind === "nightclub") {
    if (/\b(clubs?|nightlife|party|parties|discotec|tonight)\b/.test(q)) {
      slots.wantsNightlife = true;
    }
  }
  if (venueKind === "cafe") {
    if (/\b(specialty|third-wave|single-origin|roaster)\b/.test(q)) {
      slots.wantsSpecialtyCoffee = true;
    }
    if (/\b(work spot|laptop|remote work)\b/.test(q)) {
      slots.wantsNomad = true;
    }
  }
  return slots;
}

/** Café specialty leans on quiet + hidden_gem; nightlife slot uses shared boost columns. */
export function computeAnchorSignalBoost(
  slots: IntelligenceSlots,
  s: AnchorSignalRow,
): number {
  const slotsForShared = { ...slots, wantsNomad: false };
  let boost = computeSignalBoost(slotsForShared, s);
  if (slots.wantsNomad) {
    boost += (s.digital_nomad_score ?? 0) * 0.35 + (s.wifi_score ?? 0) * 0.1;
  }
  if (slots.wantsSpecialtyCoffee) {
    boost +=
      (s.quiet_score ?? 0) * 0.15 + (s.hidden_gem_score ?? 0) * 0.15;
  }
  if (slots.wantsNightlife) {
    boost += (s.nightlife_score ?? 0) * 0.25;
  }
  return boost;
}

export function scoreVenueAnchorRow(params: {
  slots: IntelligenceSlots;
  signal?: AnchorSignalRow;
  neighborhood?: string;
  rowNeighborhood?: string | null;
  listIndex: number;
}): number {
  const { slots, signal, neighborhood, rowNeighborhood, listIndex } = params;
  const hoodMatch =
    neighborhood && rowNeighborhood
      ? rowNeighborhood.toLowerCase().includes(neighborhood.toLowerCase())
        ? 1
        : 0
      : 0.5;
  const boost = signal ? computeAnchorSignalBoost(slots, signal) : 0;
  const stability = Math.max(0, 1 - listIndex * 0.02);
  return hoodMatch * 0.25 + boost * 0.55 + stability * 0.2;
}

export function rankVenueAnchorRows<T extends { id: string; neighborhood?: string | null }>(
  rows: T[],
  params: {
    queryText?: string;
    neighborhood?: string;
    venueKind: "cafe" | "nightclub";
    signalMap: Map<string, AnchorSignalRow>;
  },
): Array<{ row: T; rankScore: number; signal?: AnchorSignalRow }> {
  const queryText = params.queryText?.trim() ?? "";
  const slots = queryText
    ? parseAnchorIntelligenceSlots(queryText, params.venueKind)
    : {};
  const neighborhood =
    params.neighborhood ??
    (queryText ? parseIntelligenceSlots(queryText).neighborhood : undefined);

  const scored = rows.map((row, listIndex) => {
    const signal = params.signalMap.get(row.id);
    const rankScore = scoreVenueAnchorRow({
      slots,
      signal,
      neighborhood,
      rowNeighborhood: row.neighborhood ?? null,
      listIndex,
    });
    return { row, rankScore, signal };
  });

  scored.sort((a, b) => b.rankScore - a.rankScore);
  return scored;
}
