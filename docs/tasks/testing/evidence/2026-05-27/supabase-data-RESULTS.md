# Supabase data smoke — 2026-05-27

**Tool:** Supabase MCP `execute_sql` (project `zkwcbyxiwklihegjhuql`)

| Check | Result |
|-------|--------|
| `apartments` row count | **44** |
| RLS on `apartments` | **enabled** (`relrowsecurity: true`) |
| RLS on `events` | **enabled** |
| API rental `source` | **supabase** (from `chat-smoke.mjs`) |

**Note:** `deleted_at` column not present on `apartments` — use plain `count(*)` for inventory.

**Service role:** Not checked in browser this run; grep `mdeapp/src` hook enforces carve-out paths only.
