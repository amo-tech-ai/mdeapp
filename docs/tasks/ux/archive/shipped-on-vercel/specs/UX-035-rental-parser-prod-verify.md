---
id: UX-035
title: Verify UX-003 rental parser on production
status: Not Started
priority: P1
phase: MVP — rental NLU prod gate
effort: 30min
owner: claude
legacy_from: UX-003
depends_on: []
blocks: []
skill: [mde-task-lifecycle, testing]
related:
  - ../UX-003-deploy-price-wording-parser-fix.md
description: "$500 a night" parser fix is on disk with Vitest — confirm prod returns cards and maxPricePerNight 500 not 17.
---

# UX-035 — UX-003 prod verify gate

## Purpose

Code + tests ship on branch; **SAN-316** needs prod proof before closing UX-003.

## Probe (disk ✅)

```text
rental-query-parser.test.ts — "$500 a night" → nightly 500
```

## Acceptance

- [ ] On https://www.mdeai.co — query `"$500 a night rental in Laureles"` → ≥1 rental card.
- [ ] Network: `POST /api/rentals/search` body `maxPricePerNight: 500` (not 17).
- [ ] Evidence: `tasks/testing/evidence/<date>/ux-003-prod-verify.png`

## Flow diagram

```mermaid
flowchart LR
  Q["$500 a night Laureles"] --> Parser[rental-query-parser]
  Parser -->|nightly 500| API[/api/rentals/search]
  API --> Cards[RentalCard results]

  Parser -.->|bug| Wrong[monthly ÷30 = 17 empty]
  style Wrong fill:#fde2e2,stroke:#c0392b
  style Cards fill:#e7f6e7,stroke:#27ae60
```

## Verification (2026-05-31)

| Claim | Result |
|-------|--------|
| Code fixed | ✅ on branch |
| Prod verified | ❌ not done — this task |
