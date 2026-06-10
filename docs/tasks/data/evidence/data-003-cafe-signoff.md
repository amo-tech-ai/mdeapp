---
task: data-003
date: 2026-05-30
project: zkwcbyxiwklihegjhuql
status: Done
linear: SAN-334
---

# DATA-003 — Café seed sign-off

Sign-off after [DATA-035](../testing/evidence/DATA-035-venue-anchors-cafe.md). No additional ETL — eval mapping + regression proof only.

## DATA-035 evidence merged

| Check | Result |
|-------|--------|
| Active café anchors | **17** |
| Places verify log | 18/18 OK ([log](../../testing/evidence/DATA-035-places-verify.log)) |
| `metadata.ai_vibe_summary` | 17/17 |
| Duplicate `(google_place_id, kind)` | **0** |
| Seed artifact | [`cafes-medellin.seed.json`](../../venues/seeds/cafes-medellin.seed.json) populated from live DB |

**Note:** Curated pack listed 18 names; Délmuri Coffee and Amelier Laureles resolve to one `place_id` — only Amelier Laureles row kept in DB.

## Golden-query mapping (feeds DATA-006)

| Artifact | Purpose |
|----------|---------|
| [`golden-queries-venues.json`](../../venues/seeds/golden-queries-venues.json) | 7 Sarah persona café queries → `venue_anchors.id` + `google_place_id` |
| [`data-003-cafe-golden-queries.sql`](./data-003-cafe-golden-queries.sql) | Read-only SQL assertions (G0–G7) |

### Query pack summary

| ID | Prompt (Sarah) | Primary anchors |
|----|----------------|-----------------|
| cafe-001 | quiet café WiFi 3h Laureles | Semilla, Rituales, Pergamino Laureles |
| cafe-002 | third-wave Laureles | Rituales, Pergamino Laureles, Semilla |
| cafe-003 | coworking near Primer Parque | Semilla, Amelier Laureles |
| cafe-004 | roastery Poblado remote work | Hija Mía, Pergamino Calle 10B |
| cafe-005 | quiet ethical Poblado | Urbania |
| cafe-006 | brunch expat Laureles | Café Revolución, Pausa |
| cafe-007 | aesthetic Via Primavera | Velvet, Pergamino VP, Café Quindío |

## Live SQL verification (2026-05-30)

```
G0 active_cafe_anchors = 17
G6 with_vibe/total = 17/17
G7 duplicate place_id rows = 0
```

## Chat path — `search-grounded-places` primary

Confirmed in `mdeapp/src/mastra/agents/concierge.ts`:

- Café/coffee/quiet-spot requests → **`search-grounded-places`** (not `search-restaurants`)
- `normalizeCafeGroundingQuery` + `filterCafeGroundingRows` strip bar-lounge distractors (e.g. Café Noir bar filter in quality tests)

`venue_anchors` are for **eval repeatability, cache warming (DATA-007), and catalog enrich** — not a replacement for ADK grounding in `/chat`.

## Unblocks

- **DATA-006** — expand `golden-queries-venues.json` with restaurant + nightclub sections
- **DATA-007** — `place_details_cache` audit against verified café `place_id`s
