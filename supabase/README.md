# Supabase — mdeai (`zkwcbyxiwklihegjhuql`)

Canonical SQL migrations and edge functions for the new app. Legacy `/home/sk/mde/supabase/` is frozen for new work.

## Migrations

**47 files** in `migrations/` — pulled 2026-05-24 from legacy tree, version prefixes matched to live remote.

```bash
cd /home/sk/mdeai
supabase migration list   # expect 47/47 Local | Remote
```

**Not on remote (archived):** `migrations/_archive-not-on-remote/` — 2 legacy-only SQL files; do not push.

**New DDL:** add `migrations/<timestamp>_<name>.sql` here only.

## Seeds

**Source JSON/CSV:** `seeds/venues/` — curated packs for DATA-003/005/035/006.

**Applied seed SQL:** only in `migrations/` (e.g. `20260529150000_data035_*`, `20260530003708_data005_*`).

Regenerate via `mdeapp/scripts/seed-*-anchors.mjs` → write directly to a new migration file. See [`seeds/README.md`](seeds/README.md).

## Edge functions

`functions/` — Phase 1 target home (e.g. `chat-lead-capture`). Port ticket edges from legacy per `tasks/data/17-edge-audit.md`.
