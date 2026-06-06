# DATA-041 seeds

## `data041_venue_signals.sql`

**Task:** DATA-041 — Venue Signals Human QA Sign-Off · **Remediation:** DATA-041-R02

| Kind | Rows |
|------|-----:|
| restaurant | 20 |
| cafe (venue_anchors) | 5 |
| nightclub (venue_anchors) | 5 |

### Apply

Requires parent FK rows (`restaurants`, `venue_anchors`) from DATA-039 / DATA-035.

```bash
psql "$DATABASE_URL" -f tasks/data/seeds/data041_venue_signals.sql
```

Re-export from production:

```bash
cd mdeapp && infisical run --silent --env=dev --path=/ -- node scripts/intelligence/export-data041-seed.mjs
```

### Rollback

See `DELETE` comment at top of seed file (30 primary-key ids only).

### Verify

```bash
cd mdeapp && infisical run --silent --env=dev --path=/ -- npm run verify:mis-phase1
```

## `data041_anchor_evidence.sql`

**Task:** DATA-041-R06 — Anchor venue_source_evidence

| Kind | Rows |
|------|-----:|
| cafe (`venue_anchor_id`) | 5 |
| nightclub (`venue_anchor_id`) | 5 |

### Apply

```bash
psql "$DATABASE_URL" -f tasks/data/seeds/data041_anchor_evidence.sql
```

Re-export from production:

```bash
cd mdeapp && infisical run --silent --env=dev --path=/ -- node scripts/intelligence/export-data041-anchor-evidence.mjs
```
