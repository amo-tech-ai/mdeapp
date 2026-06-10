---
task_id: RE-002
title: Apartment inventory quality
layer: OPS
priority: P1
phase: core
status: Not Started
persona: Patricia
depends_on: [RE-001]
unblocks: [RE-004]
skills: [mde-supabase]
description: QA 44 active rows — photos, price_daily, lat/lng, status, scam flags.
---

# RE-002 — Apartment inventory quality

## Checks

```sql
SELECT count(*) FILTER (WHERE images IS NULL OR cardinality(images)=0) AS no_photo,
       count(*) FILTER (WHERE price_daily IS NULL) AS no_daily_price,
       count(*) FILTER (WHERE latitude IS NULL) AS no_lat
FROM apartments WHERE status = 'active';
```

## Acceptance criteria

- [ ] Report: % with photo, geo, price_daily
- [ ] Listings below threshold flagged for seed/fix
- [ ] No schema changes

## Risk

44 rows is a **product** constraint — document for Camila demo vs production scale.
