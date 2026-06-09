---
task_id: RE-016
title: Production smoke + floor
layer: OPS
priority: P1
phase: ship
status: Not Started
persona: Sofía
depends_on: [RE-015]
unblocks: []
skills: [mde-task-lifecycle, deploy-to-vercel]
description: Vercel preview chat rental flow; floor; ship evidence.
---

# RE-016 — Production smoke

## Checks

| Check | Pass |
|-------|------|
| `npm run floor` | exit 0 |
| Preview `/` chat rental query | cards render |
| Schedule viewing on preview | lead path or documented blocker |
| No service role in client bundle | audit grep |

## Evidence

`tasks/real-estate/evidence/RE-016-ship.md`

## Acceptance criteria

- [ ] RE-001–015 criteria met or explicitly N/A with reason
- [ ] Preview URL recorded
- [ ] CORE+MVP rental loop documented for Camila + Andrés
