---
title: Venues — Implementation order plan (canonical)
date: 2026-05-28
parent: 01-venues-audit.md
---

# Implementation order plan

**Rule:** Follow `exec_step` below. **Do not** sort by filename alone (VEN-031 > VEN-031 numerically but runs earlier).

## Mermaid — critical path

```mermaid
flowchart TD
  subgraph intel [Intelligence CORE parallel]
    INT1[INT-001 slots]
    INT2[INT-002-004 rental]
    INT5[INT-005 tests]
    INT1 --> INT2 --> INT5
  end

  subgraph data [Data B01-B09]
    D1[DATA-001]
    D2[DATA-002]
    D9[DATA-009 schema]
    D3[DATA-003-005 seeds]
    D7[DATA-007-008 cache]
    D1 --> D2 --> D9 --> D3
    D2 --> D7
  end

  subgraph ui [UI C10-C16]
    V9[VEN-009-010 restaurant]
    V11[VEN-011-013 nightlife]
    V12[VEN-012 kind split]
    I8[INT-008 café clarify]
    V37[VEN-031 field mask]
    D3 --> V9
    D7 --> V9
    V9 --> V11 --> V12 --> I8 --> V37
  end

  subgraph book [Booking D17-D24]
    V14[VEN-031 verify]
    V15[VEN-031-020]
    V36[VEN-026 idempotency]
    V39[VEN-028 retry]
    D9 --> V14 --> V15 --> V36 --> V39
  end

  subgraph ship [Release F31-F33]
    V35[VEN-025 RLS]
    V40[VEN-029 registry CI]
    V24[VEN-031 Playwright]
    V39 --> V35 --> V40 --> V24
  end

  INT1 -.-> V12
  V12 -.-> I8
```

## Parallel lanes

| Lane | Can start after | Tasks |
|------|-----------------|-------|
| Intelligence CORE | — | INT-001…005 |
| Venue data | — | DATA-001…009 |
| Coffee tours (optional) | VEN-032 | VEN-032…043 per mvp-index |
| Venue MVP UI | DATA-004/005 + cache | VEN-009…037 |
| Booking | DATA-009 M1 | VEN-031…039 |
| Post-MVP polish | VEN-031 pass | VEN-025…034, CTI post |

## Renumbering — no file renames

| Keep | Why |
|------|-----|
| `009-ven-*` filenames | Git history + PR links |
| `CTI-*` prefix | Distinct from VEN |
| `DATA-*` in data repo | Cross-program canonical |

Add to each task frontmatter when touched:

```yaml
exec_step: 17
track: VEN
```
