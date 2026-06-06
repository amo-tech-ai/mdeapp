import { describe, expect, it } from "vitest";
import {
  computeAnchorSignalBoost,
  parseAnchorIntelligenceSlots,
  rankVenueAnchorRows,
  scoreVenueAnchorRow,
  type AnchorSignalRow,
} from "../intelligence-anchor-search";

const semillaSignal: AnchorSignalRow = {
  venue_anchor_id: "7e2cdb49-c9d7-4548-9128-3d4754acf295",
  quiet_score: 0.7,
  date_night_score: 0.45,
  digital_nomad_score: 0.95,
  wifi_score: 0.92,
  rooftop_score: 0.2,
  cocktail_score: 0.4,
  brunch_score: 0.75,
  hidden_gem_score: 0.55,
  nightlife_score: 0.25,
  local_authenticity_score: 0.72,
  touristy_score: 0.4,
  service_score: 0.82,
  value_score: 0.78,
  confidence: 0.93,
  source: "human_qa",
};

const pergaminoSignal: AnchorSignalRow = {
  venue_anchor_id: "2aa4f319-f2be-4a18-8270-bed824600276",
  quiet_score: 0.65,
  date_night_score: 0.5,
  digital_nomad_score: 0.88,
  wifi_score: 0.85,
  rooftop_score: 0.15,
  cocktail_score: 0.45,
  brunch_score: 0.8,
  hidden_gem_score: 0.5,
  nightlife_score: 0.2,
  local_authenticity_score: 0.7,
  touristy_score: 0.45,
  service_score: 0.85,
  value_score: 0.75,
  confidence: 0.91,
  source: "human_qa",
};

const unsignedSignal: AnchorSignalRow = {
  venue_anchor_id: "unsigned-1",
  quiet_score: 0.3,
  date_night_score: 0.3,
  digital_nomad_score: 0.3,
  wifi_score: 0.3,
  rooftop_score: 0.1,
  cocktail_score: 0.2,
  brunch_score: 0.3,
  hidden_gem_score: 0.2,
  nightlife_score: 0.2,
  local_authenticity_score: 0.3,
  touristy_score: 0.5,
  service_score: 0.5,
  value_score: 0.5,
  confidence: 0.3,
  source: "editorial",
};

const sonHavanaSignal: AnchorSignalRow = {
  venue_anchor_id: "f8284e52-09fe-46b3-a3fd-05ebafa67aee",
  quiet_score: 0.35,
  date_night_score: 0.55,
  digital_nomad_score: 0.15,
  wifi_score: 0.2,
  rooftop_score: 0.25,
  cocktail_score: 0.6,
  brunch_score: 0.2,
  hidden_gem_score: 0.88,
  nightlife_score: 0.92,
  local_authenticity_score: 0.95,
  touristy_score: 0.15,
  service_score: 0.75,
  value_score: 0.85,
  confidence: 0.94,
  source: "human_qa",
};

const salonSignal: AnchorSignalRow = {
  venue_anchor_id: "7417d9ad-5305-4b6f-9e60-3db2cf580d17",
  quiet_score: 0.42,
  date_night_score: 0.68,
  digital_nomad_score: 0.22,
  wifi_score: 0.28,
  rooftop_score: 0.45,
  cocktail_score: 0.75,
  brunch_score: 0.3,
  hidden_gem_score: 0.55,
  nightlife_score: 0.88,
  local_authenticity_score: 0.6,
  touristy_score: 0.65,
  service_score: 0.8,
  value_score: 0.72,
  confidence: 0.88,
  source: "human_qa",
};

describe("DATA-041-R05 — intelligence-anchor-search", () => {
  it("parseAnchorIntelligenceSlots adds specialty coffee and nomad for café work spot", () => {
    const slots = parseAnchorIntelligenceSlots(
      "coffee work spot Laureles",
      "cafe",
    );
    expect(slots.wantsNomad).toBe(true);
    expect(slots.neighborhood).toBe("Laureles");
  });

  it("parseAnchorIntelligenceSlots adds nightlife for clubs tonight", () => {
    const slots = parseAnchorIntelligenceSlots(
      "popular clubs tonight in Provenza",
      "nightclub",
    );
    expect(slots.wantsNightlife).toBe(true);
    expect(slots.neighborhood).toBe("Provenza");
  });

  it("quiet specialty coffee boosts Semilla/Pergamino over low-confidence anchor", () => {
    const slots = parseAnchorIntelligenceSlots(
      "quiet specialty coffee Laureles",
      "cafe",
    );
    const semillaBoost = computeAnchorSignalBoost(slots, semillaSignal);
    const unsignedBoost = computeAnchorSignalBoost(slots, unsignedSignal);
    expect(semillaBoost).toBeGreaterThan(unsignedBoost);
    expect(slots.wantsQuiet).toBe(true);
    expect(slots.wantsSpecialtyCoffee).toBe(true);
  });

  it("salsa locals query boosts Son Havana over generic club", () => {
    const slots = parseAnchorIntelligenceSlots(
      "salsa bars locals go to",
      "nightclub",
    );
    const sonBoost = computeAnchorSignalBoost(slots, sonHavanaSignal);
    const salonBoost = computeAnchorSignalBoost(slots, salonSignal);
    expect(sonBoost).toBeGreaterThan(salonBoost);
    expect(slots.wantsSalsa).toBe(true);
    expect(slots.wantsHiddenGem).toBe(true);
  });

  it("rankVenueAnchorRows orders Semilla first for work spot Laureles", () => {
    const rows = [
      { id: "unsigned-1", neighborhood: "Laureles", name: "Generic Café" },
      {
        id: "7e2cdb49-c9d7-4548-9128-3d4754acf295",
        neighborhood: "Laureles",
        name: "Semilla",
      },
      {
        id: "2aa4f319-f2be-4a18-8270-bed824600276",
        neighborhood: "Laureles",
        name: "Pergamino",
      },
    ];
    const signalMap = new Map<string, AnchorSignalRow>([
      ["7e2cdb49-c9d7-4548-9128-3d4754acf295", semillaSignal],
      ["2aa4f319-f2be-4a18-8270-bed824600276", pergaminoSignal],
      ["unsigned-1", unsignedSignal],
    ]);
    const ranked = rankVenueAnchorRows(rows, {
      queryText: "coffee work spot Laureles",
      venueKind: "cafe",
      signalMap,
    });
    expect(ranked[0]?.row.name).toBe("Semilla");
    expect(ranked[0]?.rankScore).toBeGreaterThan(ranked[2]?.rankScore ?? 0);
  });

  it("rankScore is monotonic descending", () => {
    const rows = [
      { id: "7417d9ad-5305-4b6f-9e60-3db2cf580d17", neighborhood: "Provenza" },
      { id: "f8284e52-09fe-46b3-a3fd-05ebafa67aee", neighborhood: "Laureles" },
    ];
    const signalMap = new Map<string, AnchorSignalRow>([
      ["7417d9ad-5305-4b6f-9e60-3db2cf580d17", salonSignal],
      ["f8284e52-09fe-46b3-a3fd-05ebafa67aee", sonHavanaSignal],
    ]);
    const ranked = rankVenueAnchorRows(rows, {
      queryText: "salsa nightlife Provenza",
      venueKind: "nightclub",
      signalMap,
    });
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1]!.rankScore).toBeGreaterThanOrEqual(
        ranked[i]!.rankScore,
      );
    }
  });

  it("without queryText, list order stability preserves browse grid order", () => {
    const rows = [
      { id: "a", neighborhood: "Laureles" },
      { id: "b", neighborhood: "Laureles" },
    ];
    const ranked = rankVenueAnchorRows(rows, {
      venueKind: "cafe",
      signalMap: new Map(),
    });
    const aScore = scoreVenueAnchorRow({
      slots: {},
      neighborhood: undefined,
      rowNeighborhood: "Laureles",
      listIndex: 0,
    });
    const bScore = scoreVenueAnchorRow({
      slots: {},
      neighborhood: undefined,
      rowNeighborhood: "Laureles",
      listIndex: 1,
    });
    expect(aScore).toBeGreaterThanOrEqual(bScore);
    expect(ranked[0]?.row.id).toBe("a");
  });
});
