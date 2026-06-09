---
task_id: data-033
mvp_step: 33
title: route_cache schema + RLS + TTL
layer: DATA
priority: P2
status: Not Started
estimated_effort: 2h
depends_on: ["data-001"]
unblocks: ["MAP-011"]
skills: [mde-supabase, mde-maps]
related:
  - ../../maps/MAP-011-route-previews.md
  - ../../maps/docs/maps-audit-plan.md
  - ../audit-supabase.md
description: Add route_cache for Grounding Lite compute_routes responses — cost control before MAP-011 commute cards.
---

# DATA-033 — route_cache schema

## Forensic gap (audit 2026-05-27)

| Item | Today | Blocker |
|------|-------|---------|
| `route_cache` table | ❌ missing | MAP-011 repeat route queries bill MCP every time |
| `grounding_quota_log` | ✅ | Quota only — no response cache |

## Migration (sketch)

```sql
CREATE TABLE IF NOT EXISTS public.route_cache (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  route_hash      text        NOT NULL,
  origin_key      text        NOT NULL,
  destination_key text        NOT NULL,
  travel_mode     text        NOT NULL DEFAULT 'DRIVE',
  payload         jsonb       NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  CONSTRAINT route_cache_route_hash_key UNIQUE (route_hash)
);

CREATE INDEX IF NOT EXISTS idx_route_cache_route_hash
  ON public.route_cache (route_hash);

CREATE INDEX IF NOT EXISTS idx_route_cache_expires_at
  ON public.route_cache (expires_at);

ALTER TABLE public.route_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_select_route_cache"
  ON public.route_cache FOR SELECT TO service_role USING (true);
CREATE POLICY "service_role_insert_route_cache"
  ON public.route_cache FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "service_role_update_route_cache"
  ON public.route_cache FOR UPDATE TO service_role USING (true);
CREATE POLICY "service_role_delete_route_cache"
  ON public.route_cache FOR DELETE TO service_role USING (true);
```

**Cache key:** `sha256(origin_lat,lng|dest_lat,lng|travelMode|maskVersion)`

**TTL:** 24h default (commute answers stale quickly; tune in MAP-011).

## RLS

- **service_role only** — same pattern as `places_search_cache`
- No anon/authenticated writes
- Read via ADK sidecar or future edge — never browser

## App follow-up (MAP-011, not this task)

- ADK sidecar write-through on `compute_routes` MCP miss
- Parse duration strings `"180s"` in Mastra — not in migration

## Acceptance criteria

- [ ] Migration applied on remote
- [ ] RLS enabled + 4 service_role policies
- [ ] Documented in MAP-011 § cache
- [ ] Evidence: `tasks/data/evidence/data-033-route-cache.md`
- [ ] No service role in `mdeapp/src/**` except F13 carve-out paths
