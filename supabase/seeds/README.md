# Supabase seed sources

Canonical **source artifacts** (JSON, CSV) for DATA venue seeds. **Runtime SQL** lives in [`../migrations/`](../migrations/) only.

| Task | Source files | Applied migration |
|------|--------------|-------------------|
| DATA-035 | `venues/cafes-medellin.curated.json`, `venues/cafes-medellin.seed.json` | `20260529150000_data035_venue_anchors_cafes.sql` |
| DATA-005 | `venues/nightclubs-medellin.curated.json`, `venues/nightclubs-medellin.csv` | `20260530003708_data005_venue_anchors_nightclubs.sql` |
| DATA-006 | `venues/golden-queries-venues.json` | eval harness (no migration) |
| DATA-004 | — (verify-only; legacy `20260404044721_restaurants_seed.sql`) | existing migration |

Regenerate SQL from curated JSON:

```bash
cd mdeapp
node --env-file=.env.local scripts/seed-cafe-anchors.mjs --write-sql ../supabase/migrations/<timestamp>_data035_venue_anchors_cafes.sql
node --env-file=.env.local scripts/seed-nightclub-anchors.mjs --write-sql ../supabase/migrations/<timestamp>_data005_venue_anchors_nightclubs.sql
```

Listings research (markdown): [`../../tasks/venues/tasks/listings/`](../../tasks/venues/tasks/listings/)
