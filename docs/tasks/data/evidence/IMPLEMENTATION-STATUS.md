# Data pack — implementation status

**Updated:** 2026-05-30 · Project `zkwcbyxiwklihegjhuql`

## Completed phases

| Phase | Tasks | Evidence |
|-------|-------|----------|
| **A–E** | Inventories, contract, DDL | `evidence/data-*` |
| **F** | DATA-003, 004, 005, 023, 030, **035** | venue seeds + golden queries |

## Phase F shipped (2026-05-30)

| Task | Result |
|------|--------|
| **DATA-004** | 44/44 restaurants verified — no migration |
| **DATA-023** | Rental golden SQL + JSON |
| **DATA-030** | Trips golden query pack |
| **DATA-035** | **17** café `venue_anchors` (Places-verified) |
| **DATA-003** | 7 golden café queries → anchor IDs; seed.json populated |
| **DATA-005** | **13** nightclub `venue_anchors` (Places-verified) |

## Repo migrations (synced)

- `20260529120000` … `20260529150000_data035_venue_anchors_cafes.sql`
- `20260529160000_data005_venue_anchors_nightclubs.sql` (in `evidence/migrations/`)
- `20260529140000_data027_*` · `20260529140100_data029_*`

## Next

1. **DATA-006** — venue golden queries eval pack (restaurant section + harness)
2. **DATA-021** — showings ↔ leads bridge
3. **DATA-028** — webhook → `trip_items` (app)

## Artifacts

- Café seed: `mdeapp/scripts/seed-cafe-anchors.mjs`
- Nightclub seed: `mdeapp/scripts/seed-nightclub-anchors.mjs`
- Curated: `supabase/seeds/venues/cafes-medellin.curated.json`, `nightclubs-medellin.curated.json`
- Golden queries: `supabase/seeds/venues/golden-queries-venues.json`
- Places logs: `tasks/testing/evidence/DATA-035-*.log`, `DATA-005-*.log`
