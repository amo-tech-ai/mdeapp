---
task: data-006
layer: A
date: 2026-05-30
project: zkwcbyxiwklihegjhuql
method: Supabase MCP execute_sql (read-only)
mutation: none
status: pass
sql_pack: data-006-venue-golden-queries.sql
json_map: ../../../supabase/seeds/venues/golden-queries-venues.json
---

# DATA-006 — Layer A golden query evidence

## Verdict

**Layer A: PASS** — 19/19 persona queries resolve on live Supabase. **0 failures.** No DDL or mutation executed.

| Section | Queries | Pass | Fail |
|---------|--------:|-----:|-----:|
| Café (`venue_anchors` kind=cafe) | 7 | 7 | 0 |
| Restaurant (`public.restaurants`) | 6 | 6 | 0 |
| Nightclub (`venue_anchors` kind=nightclub) | 6 | 6 | 0 |
| **Persona total** | **19** | **19** | **0** |
| Contract asserts (G0, G6–G7, R7–R8, N7–N8) | 7 | 7 | 0 |
| **Grand total** | **26** | **26** | **0** |

**Layer B (MSV-012 / CopilotKit harness):** OPEN — not required for this evidence gate.

---

## Confirmations

| Check | Result |
|-------|--------|
| 7 café queries → `venue_anchors` | ✅ 12 golden anchor IDs resolve |
| 6 nightclub queries → `venue_anchors` | ✅ 10 golden anchor IDs resolve |
| 6 restaurant queries → `public.restaurants` | ✅ 9 golden restaurant IDs resolve |
| All expected restaurant IDs have `google_place_id` | ✅ R7: `missing_place_id = 0` |
| No restaurant query uses `venue_anchors` | ✅ JSON `source_table: restaurants`; SQL R* queries only `restaurants` |
| No DDL / mutation | ✅ read-only SELECT only |

---

## G0 — Catalog gates

### G0a — active café anchors

```json
[{"active_cafe_anchors": 17}]
```

**PASS** (expect ≥17)

### G0b — active nightclub anchors

```json
[{"active_nightclub_anchors": 13}]
```

**PASS** (expect 13)

### G0c — restaurant catalog

```json
[{"total_restaurants": 43, "with_place_id": 43}]
```

**PASS** — 100% `google_place_id` coverage (live count 43; DATA-004 audit was 44 before dedupe migration). Contract: `missing_place_id = 0`.

---

## Café — 7 persona queries

### cafe-001 — quiet WiFi Laureles (G1)

**Expected place_ids:** Semilla, Rituales, Pergamino Laureles — **3/3 resolve**

```json
[
  {"id":"2aa4f319-f2be-4a18-8270-bed824600276","name":"Pergamino Café Laureles","google_place_id":"ChIJzcFcU8spRI4RKdDH5QXv8LU"},
  {"id":"39dbcfad-8e46-4631-9b5d-0cdc67fd1774","name":"Rituales Compañía de Café","google_place_id":"ChIJQ-PPmKEpRI4RhZKQdct4w6Q"},
  {"id":"7e2cdb49-c9d7-4548-9128-3d4754acf295","name":"Semilla Café Coworking","google_place_id":"ChIJt22VcKMpRI4RBfxl2xT31yM"}
]
```

Tag filter returned **8** Laureles rows (min 3 required). **PASS**

### cafe-002 — third-wave Laureles (G2)

**4 rows** including all 3 expected place_ids. **PASS**

### cafe-003 — coworking near Primer Parque Laureles

**Expected:** Semilla + Amelier — **2/2 resolve** (3 coworking rows total). **PASS**

### cafe-004 — roastery El Poblado (G3)

**Expected:** Hija Mía + Pergamino Calle 10B — **2/2 resolve** (6 Poblado specialty rows). **PASS**

### cafe-005 — Urbania quiet ethical (G4)

```json
[{"id":"33c43a66-c478-4472-8351-19bc7717b550","name":"Urbania Café","google_place_id":"ChIJ1QrC3yooRI4RZ18CGQQG63s","tags":["specialty-coffee","ethical","quiet"]}]
```

**PASS**

### cafe-006 — brunch expat Laureles (G5)

**Expected:** Café Revolución + Pausa — **2/2 resolve** (4 brunch rows). **PASS**

### cafe-007 — Via Primavera aesthetic (G3 ext)

**Expected:** Velvet, Pergamino Vía Primavera, Café Quindío — **3/3 resolve**. **PASS**

### G6 — ai_vibe_summary contract

```json
[{"with_vibe": 17, "total": 17}]
```

**PASS**

### G7 — no duplicate café place_id

```json
[]
```

**PASS**

---

## Restaurant — 6 persona queries (`public.restaurants` only)

### restaurant-001 — bandeja paisa Laureles (R1)

```json
[
  {"id":"038f84d2-bd57-475a-ab7b-1ef2d89dd536","name":"Bárbaro Cocina Primitiva - Sede Laureles","google_place_id":"ChIJx3bu-qEpRI4Rg_hkQIAltXU"},
  {"id":"a1b2c3d4-e5f6-4789-abcd-100000000002","name":"Hacienda Junín","google_place_id":"ChIJw67M_fgoRI4RMiM53OU6lnQ"}
]
```

**PASS** (2/2)

### restaurant-002 — fine dining El Poblado (R2)

**El Cielo + Carmen** — 2/2 with `price_level >= 3`. **PASS**

### restaurant-003 — vegetarian El Poblado (R3)

**Verdeo** — 1/1. **PASS**

### restaurant-004 — Peruvian Laureles (R4)

**Rocoto** — 1/1, `cuisine_types @> ['Peruvian']`. **PASS**

### restaurant-005 — affordable Laureles (R5)

**Cucayito + Narcobollo** — 2/2, `price_level <= 2`. **PASS**

### restaurant-006 — Argentine parrilla Laureles (R6)

**La Pampa Laureles** — 1/1. **PASS**

### R7 — missing google_place_id

```json
[{"missing_place_id": 0}]
```

**PASS**

### R8 — all 9 golden restaurant IDs

9 rows returned (Bárbaro, Carmen, Cucayito, El Cielo, Hacienda Junín, La Pampa, Narcobollo, Rocoto, Verdeo). **PASS**

---

## Nightclub — 6 persona queries

### nightlife-001 — reggaeton Provenza (N1)

**Dulce Jesús Mío, VIVO, Bar Chupitos** — 3/3. **PASS**

### nightlife-002 — rooftop cocktails (N2)

**360 Rooftop, Envy Roof** — 2/2. **PASS**

### nightlife-003 — techno Salon Amador (N3)

**1/1**. **PASS**

### nightlife-004 — reggaeton Manila (N4)

**Bendito Seas, Palma Pitón Manila** — 2/2. **PASS**

### nightlife-005 — salsa Laureles (N5)

**Son Havana** — 1/1. **PASS**

### nightlife-006 — Laureles not Provenza (N6)

**818 DISTRICT** — 1/1, `neighborhood: Laureles`. **PASS**

### N7 — no duplicate nightclub place_id

```json
[]
```

**PASS**

### N8 — all 10 golden nightclub anchor IDs

10 rows returned. **PASS**

---

## Layer B — remaining (app track, not blocking Layer A)

| Item | Owner | Status |
|------|-------|--------|
| MSV-012 harness reads `golden-queries-venues.json` | App / MSV | Open |
| Restaurant tool eval asserts `source: 'supabase'` | Vitest / `/api/copilotkit` | Open |
| CopilotKit prompt regression per persona | Lucía QA | Open |

---

## Score

| Scope | Score |
|-------|------:|
| **Layer A (DATA Done gate)** | **100/100** |
| **Full DATA-006 (incl. Layer B)** | **75/100** |

Layer B = 25 pts (MSV-012 harness + live tool/chat eval). Explicitly out of scope for DATA Layer A sign-off per task spec.
