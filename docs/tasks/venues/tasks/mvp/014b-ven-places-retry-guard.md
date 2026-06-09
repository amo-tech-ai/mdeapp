---
task_id: ven-014b
mvp_step: 014b
title: Places detail retry guard (403/502 storm)
layer: MAPS
priority: P0
status: Done
depends_on: [ven-014]
unblocks: []
skills: [mde-maps, task-verifier]
description: Stop repeated /api/places/detail and Google getPlace calls while Places API New returns 403/502.
---

# VEN-014b — Places detail retry guard

## Shipped

- Linear: **SAN-520**
- PR #52 squash-merged to `main` @ `435c476` (2026-06-02).
- Client in-flight dedupe + 10m failure cache (403/502/503).
- Server 10m negative cache per `placeId` on `PlacesRequestError`.

## Evidence

`tasks/venues/tasks/evidence/VEN-014b-verify-2026-06-02.md`

## Parent

VEN-014 remains **In Review** until GCP Places API New miss→hit proof.
