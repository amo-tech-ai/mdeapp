---
title: Linear sync log — PR / Stable Beta
date: 2026-06-02T13:42Z
main_sha: 4de18f1
prod_sha: 4de18f1
tracker: tasks/PR/PROGRESS-TRACKER.md
---

# Linear sync — 2026-06-02

Synced from [`tasks/PR/PROGRESS-TRACKER.md`](../PR/PROGRESS-TRACKER.md) after archive audit.

## State changes

| Issue | Was | Now | Notes |
|-------|-----|-----|-------|
| [SAN-458](https://linear.app/sanjiovani/issue/SAN-458) | Todo | **In Progress** | `floor.yml` on prod; admin branch protection open |
| [SAN-462](https://linear.app/sanjiovani/issue/SAN-462) | In Progress | In Progress | Description: 1/3 soak, queue, `4de18f1` |
| [SAN-437](https://linear.app/sanjiovani/issue/SAN-437) | Todo | Todo | `blockedBy` SAN-462; spec path `tasks/PR/ux/` |
| [SAN-460](https://linear.app/sanjiovani/issue/SAN-460) | Todo | Todo | `blockedBy` SAN-462 |
| [SAN-438](https://linear.app/sanjiovani/issue/SAN-438) | Todo | Todo | `blockedBy` SAN-462, SAN-437 |
| [SAN-443](https://linear.app/sanjiovani/issue/SAN-443) | Todo | Todo | `blockedBy` SAN-462, SAN-437 |
| [SAN-323](https://linear.app/sanjiovani/issue/SAN-323) | Todo | Todo | `blockedBy` SAN-462, SAN-437 |
| [SAN-322](https://linear.app/sanjiovani/issue/SAN-322) | Done | Done | Soak → SAN-462; archived spec path |
| [SAN-436](https://linear.app/sanjiovani/issue/SAN-436) | Done | Done | Prod @ `4de18f1`; archived spec |

## Launch Critical board sort

1. **SAN-462** — Urgent · 2 more scheduled synthetics  
2. **SAN-458** — High · branch protection (parallel with soak)  
3. **SAN-437** → SAN-438 → SAN-443 → SAN-323 — post-soak UX train  

PR-01…17 Linear rows unchanged (already Done).
