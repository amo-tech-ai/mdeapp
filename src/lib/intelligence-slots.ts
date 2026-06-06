/**
 * Client-safe query slot extraction (INT-021 / SEARCH-003). No Mastra or Supabase imports.
 *
 * `parseIntelligenceSlots` populates common neighborhood and vibe slots from raw query text.
 * Route classifiers (`restaurant-query-classifier`, venue wrapper) set `wantsNightlife` and
 * `wantsSpecialtyCoffee` when the query matches café or nightclub anchor patterns.
 */

export type IntelligenceSlots = {
  neighborhood?: string;
  wantsRooftop?: boolean;
  wantsQuiet?: boolean;
  wantsNomad?: boolean;
  wantsSalsa?: boolean;
  wantsBrunch?: boolean;
  wantsCocktails?: boolean;
  wantsDateNight?: boolean;
  wantsHiddenGem?: boolean;
  wantsAntiTouristy?: boolean;
  wantsValue?: boolean;
  wantsService?: boolean;
  /** Nightclub anchor queries (DATA-041-R05). */
  wantsNightlife?: boolean;
  /** Café specialty queries (DATA-041-R05). */
  wantsSpecialtyCoffee?: boolean;
};

export function parseIntelligenceSlots(queryText: string): IntelligenceSlots {
  const q = queryText.toLowerCase();
  const slots: IntelligenceSlots = {};
  if (/provenza/.test(q)) slots.neighborhood = "Provenza";
  else if (/poblado/.test(q)) slots.neighborhood = "El Poblado";
  else if (/laureles/.test(q)) slots.neighborhood = "Laureles";
  else if (/envigado/.test(q)) slots.neighborhood = "Envigado";
  else if (/manila/.test(q)) slots.neighborhood = "Manila";
  if (/rooftop/.test(q)) slots.wantsRooftop = true;
  if (/quiet/.test(q)) slots.wantsQuiet = true;
  if (/cowork|nomad|wifi|work from|work spot|laptop|remote work/.test(q)) {
    slots.wantsNomad = true;
  }
  if (/salsa/.test(q)) slots.wantsSalsa = true;
  if (/brunch/.test(q)) slots.wantsBrunch = true;
  if (/cocktail/.test(q)) slots.wantsCocktails = true;
  if (/romantic|date night|anniversary/.test(q)) slots.wantsDateNight = true;
  if (/hidden|local|locals/.test(q)) slots.wantsHiddenGem = true;
  if (/not touristy|avoid tourist|tourist trap|non-touristy|non touristy/.test(q)) {
    slots.wantsAntiTouristy = true;
  }
  if (/under \$?\d+|budget|cheap|value|affordable/.test(q)) slots.wantsValue = true;
  if (/good service|great service|excellent service/.test(q)) slots.wantsService = true;
  return slots;
}
