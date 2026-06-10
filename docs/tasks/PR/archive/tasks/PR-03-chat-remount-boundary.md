---
task_id: PR-03
title: Fix key={sessionKey} remount boundary in chat-center-panel
phase: MEDIUM
priority: P2
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
area: frontend
skill: react-best-practices
source: docs/02-pr-audit.md (#36 follow-up)
depends_on: []
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
follows: UX-032 (SAN-321 Done, PR #36)
description: Bring EventResultsPanel + map slot inside the new-chat remount boundary, or document why not.
---

## Summary

| Field | Value |
|-------|-------|
| Finding | `EventResultsPanel` + `CenterPanelMapResultsSlot` (`chat-center-panel.tsx` **L59–60**) sit **outside** the `key={sessionKey}` wrapper (**L35–58**) on `main` |
| Impact | On "new chat", the rest of the panel hard-remounts but these two do not — stale event/map results can survive a session reset |
| Fix | Move the `key` up to wrap them, **or** document the intentional exclusion |

## Problem

#36 made new-chat reset thread/map/fast-path (clears 3 pin primitives correctly). But these two panels are rendered outside the keyed subtree, so they keep their internal state across a reset. Verified still present on `main` at lines 54–55.

## Change (wiring)

| Layer | File | Action |
|-------|------|--------|
| Component | `src/components/chat/chat-center-panel.tsx` | Modify — raise `key={sessionKey}` to wrap `EventResultsPanel` + `CenterPanelMapResultsSlot`, or add a `// intentional: …` note |

## Skill to use

- **`react-best-practices`** — `key`-based remount semantics; confirm raising the key doesn't drop wanted state elsewhere.

## Gates / Acceptance

- [ ] After "new chat", event results + map slot reset along with the rest of the panel (verify in preview: search → new chat → panels empty).
- [ ] No unintended remount of sibling state that should persist.
- [ ] `/verify-floor` green; targeted e2e (the #36 new-chat-reset spec) still passes.

## Testing & proof

### Persona / journey

**Camila** searches rentals → clicks **New chat** → rental cards and map pins must clear (no stale session from prior turn).

### Pre-ship / regression

```bash
cd mdeapp
PROD_SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 npm run test:e2e:new-chat
PROD_SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 npm run test:e2e:visual-cards
npm run floor
```

**Pass criteria:** `rental-card` count 0 after new chat; `map-pin` count ≤ 1; event panel empty if events were shown.

### Implementation proof (Done · PR **#41** @ `a9eb176`)

| Check | Evidence | Result |
|-------|----------|--------|
| sessionKey remount widened | `chat-center-panel.tsx` — `key={sessionKey}` boundary includes map/event slots | merged #41 |
| Prod new-chat e2e | `npm run test:e2e:new-chat` vs `https://www.mdeai.co` | ✅ PASS 15.9s (2026-06-01) |
| Visual cards reset path | Same session as UX-032 spec | no stale rental cards |

**Evidence:** `/tmp/qa-new-chat.log` · `tasks/testing/evidence/visual-cards/04-rentals.png`

## Risks / Notes

- Lowest-risk of Wave 1; ship as a tiny PR off fresh `main`. Persona: **Camila** starting a fresh chat shouldn't see last session's event cards.
