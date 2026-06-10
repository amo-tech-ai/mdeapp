---
legacy_id: EVT-053
linear: SAN-512
linear_url: https://linear.app/sanjiovani/issue/SAN-512/evt-053-wire-venue-match-panel-compare
type: wireframe
id: VEB-W03
title: Venue match panel + compare drawer
persona: Roberto
path: /chat (generative UI + drawer)
priority: P1
build_status: Not Started
paired_tasks: [VEB-007, VEB-008]
skill: [mde-wireframe]
---

# Wireframe W03 — Venue match + compare

> **Linear:** [EVT-053 — Venue match panel + compare drawer](https://linear.app/sanjiovani/issue/SAN-512/evt-053-wire-venue-match-panel-compare) · **Project:** [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues)

## Match panel (in chat thread)

```text
┌─ Venue match ────────────────────────────────────────┐
│ Mamacita Medallo                          92% fit    │
│ ████████████████████░░  AI networking · 80 guests    │
│                                                       │
│ ✓ Capacity 120 standing (you need 80)                 │
│ ✓ Package: Coworking meetup from $15/person           │
│ ✓ Provenza — 8 min from Metro                         │
│ ⚠ No dedicated stage (fashion show may be tight)       │
│                                                       │
│ [ View offerings ] [ Compare ] [ Request proposal ]   │
└───────────────────────────────────────────────────────┘
```

Repeat for 2nd/3rd results in thread.

## Compare drawer (bottom or right)

```text
┌─ Compare venues (2) ───────────────────────────── [×] ─┐
│              Mamacita          Rooftop Provenza       │
│ Fit          92%               85%                    │
│ Capacity     120 stand         80 stand               │
│ Min spend    $500              $800                   │
│ Packages     2                 1                      │
│ Area         Provenza          Provenza               │
│ Best for     Networking        Launches               │
│                                                       │
│ [ Remove ] [ Remove ]                                 │
│                                                       │
│ [ Request proposal for Mamacita ]  (primary winner)   │
└───────────────────────────────────────────────────────┘
```

## Map sync

- Each match card focus → pin pulse on map
- Compare mode → all shortlisted pins visible, others dimmed

## Empty state

```text
No event venues match 200 guests in Laureles.
Try Provenza or reduce guest count.
[ Search again ]
```

## testids

`venue-match-card` · `venue-fit-score` · `compare-tray` · `compare-request-btn`
