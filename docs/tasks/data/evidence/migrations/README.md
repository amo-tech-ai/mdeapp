# Evidence migration snapshots

Historical copies of migrations applied via MCP before repo sync.

**Canonical (use for `db push`):** [`../../../supabase/migrations/`](../../../supabase/migrations/)

| Evidence file | Canonical in repo |
|---------------|-------------------|
| `20260529160000_data005_venue_anchors_nightclubs.sql` | `supabase/migrations/20260530003708_data005_venue_anchors_nightclubs.sql` |

Do not apply files from this folder if the canonical migration already exists.
