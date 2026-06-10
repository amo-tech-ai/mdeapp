---
title: tasks/INDEX MVP gap analysis
date: 2026-05-21
mvp: ../../mvp.md
canon: ../../plan/prd/10-delivery-roadmap.md
index: ../../index.md
lifecycle: .claude/skills/mde-task-lifecycle/planning.md
---

# tasks/INDEX — MVP gap analysis (2026-05-21)

## Verdict

| Question | Answer |
|----------|--------|
| INDEX 100% correct? | **No (~70%)** |
| Correct execution order? | **No** — Path A (F14–F20) runs before MAP-001 |
| MVP features missing? | **Yes** — 6 critical task families |
| Repo/example refs in tasks? | **Partial** — F01/F36/F33 good; MAP-* absent; F41–F45 placeholders |

---

## MVP exit vs INDEX coverage

| MVP outcome ([`mvp.md`](../../mvp.md)) | Covered in INDEX? | Gap |
|----------------------------------------|-------------------|-----|
| O1 Paid ticket | F44 placeholder only | **No EVT-* port task** |
| O2 Roberto publish | F33–F38 ✅ | F33 path wrong (`packages/types`) |
| O3 Camila pins + lead | F41 placeholder, F17 Path A | **No MAP-001, no lead API task** |
| O4 `/chat` + MAP-001–003 | F43 placeholder | **No MAP-001/002/003 tasks** |
| Floor green | F09 ✅ | — |

---

## Order problems (P0)

**Current:** F13 → F14–F20 Path A (agent ports) → F22–F30 UI → F33 Roberto → F41–F45 placeholders.

**Required ([`plan/prd/10`](../../plan/prd/10-delivery-roadmap.md) PR track):**

```text
F11 (Stripe audit)
→ MAP-001 (contracts + MapContext + tool→pins + /chat shell)
→ MAP-002 (grounding + attribution)
→ F33–F38 (Roberto) — after MAP-001 green
→ EVT-01 (ticketing port)
→ F46 (rental-search workflow thin) + F41 + lead
→ F43 polish /chat
```

**Defer for MVP:** F13b, F14, F15, F17 (full port), F19 (full port), F20, F29, F31, F42 ECL.

---

## Missing tasks (added in INDEX 2026-05-21)

| ID | Title | MVP |
|----|-------|-----|
| [MAP-001](../maps/MAP-001-platform-map-pipeline.md) | Platform contracts + `/chat` shell | O3, O4 |
| [MAP-002](../maps/MAP-002-grounding-attribution.md) | Grounding tool + attribution + quota log | O4 |
| MAP-003 | Places proxy + field masks (can follow MAP-002) | O4 cost |
| EVT-01 | Port ticket-checkout + webhook to mdeapp | O1 |
| F46 | `rental-search` workflow (thin, not F17 army) | O3 |
| F47 | Lead capture API + chat CTA | O3 |
| F43 | `/chat` three-panel (spec file) | O4 |
| F41 | `/rentals` + map + lead path (spec file) | O3 |

---

## Repo / CopilotKit verification

| Task | Correct foundation? | Issues |
|------|---------------------|--------|
| F01 | ✅ `integrations/mastra` | Matches [`index.md`](../../index.md) §3.1 |
| F02–F05 | ✅ | — |
| F33 | ⚠️ canvas/mastra refs OK | Target path should be **`platform/contracts`** not `packages/types` |
| F36 | ✅ `v1/form-filling`, `canvas/mastra-pm` | Matches index PR-3 |
| F37 | ✅ `showcases/banking` | Add explicit ref in INDEX |
| [F16](../maps/F16-maps-clients-port.md) | ⚠️ | Cite [`index.md`](../../index.md) §4; prefer merge into MAP-002/004 |
| F17 | ❌ for MVP | Full `rentalAgent` port — use **F46 workflow** instead |
| F18 | ⚠️ | OK pattern but **deps too late**; needs MAP-001 + F46 not F17 |
| F41–F45 | ❌ | No spec files; patterns in INDEX only |
| MAP-* | ❌ were missing | Added |

---

## INDEX changes applied

See [`tasks/INDEX.md`](../INDEX.md) § MVP execution track.

---

## Task author rules (lifecycle)

1. Cite **`plan/prd/NN-*.md`** section + [`index.md`](../../index.md) PR row.  
2. Frontmatter `verified_against:` must list **local paths** under `CopilotKit/examples/` or `github/`.  
3. **Do not** start F33–F38 before MAP-001 pin proof.  
4. Anti-fake-done: localhost + evidence per task.
