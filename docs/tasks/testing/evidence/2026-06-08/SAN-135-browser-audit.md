# SAN-135 · AIE-024 — Forensic audit (browser + disk)

**Date:** 2026-06-08  
**Linear:** [SAN-135](https://linear.app/sanjiovani/issue/SAN-135/aie-024-mvp-luma-event-detail-layout-evp-032)  
**Spec:** `tasks/events/specs/pages/PAGE-003b-event-detail-luma.md` · `tasks/events/design/luma/screens/03-event-detail.md`  
**Verdict:** **Class D — Planning only** (Linear In Review is stale; no git/PR work exists)

---

## Phase 1 — Linear

| Field | Value |
|-------|-------|
| Status | In Review (since **2026-05-27** — ~12 days) |
| Parent | SAN-757 · AIE-000 |
| State history | Todo → **In Review** in ~1 min (2026-05-27) |
| Comments | **0** |
| Attachments | **0** |
| Expected deliverables | Luma layout: hero → vibe tags → AI summary → sticky CTA → Ask Host |
| Who moved to In Review | Created by S K; no audit trail beyond stateHistory timestamp |

**Related:** SAN-731 (merged #137), SAN-732, blocks SAN-136–149 (vibe/Ask Host follow-ons)

---

## Phase 2 — GitHub

| Search | Result |
|--------|--------|
| Branch `ai/san-135-aie-024-mvp-luma-event-detail-layout-evp-032` | ❌ not on remote |
| PR for SAN-135 / AIE-024 / EVP-032 | ❌ none (PR #135 is **SAN-730** host nav — already merged) |
| Commits grep SAN-135 / Luma / AIE-024 | ❌ **0** across all branches |
| Stashes | No SAN-135-related stash |

---

## Phase 3 — Disk audit

| Feature (Luma / PAGE-003b) | Spec | Code on `main` |
|----------------------------|------|----------------|
| Hero (16:10 + badge/scrim) | ✅ | 🟡 **Partial** — placeholder or `<img>` in `event-detail-view.tsx`; no category badge/scrim |
| Host block | ✅ | ❌ No `EventHostBlock` component |
| Vibe tags | ✅ | ❌ No `EventVibeTags` (deferred EVP → SAN-136) |
| AI summary | ✅ | ❌ No `EventAiSummary` |
| Attendee / social proof | ✅ | ❌ No `EventAttendeeStrip` |
| About + tiers | ✅ | ✅ `event-detail-view.tsx` + `event-ticket-tiers.tsx` |
| Ask Host CTA | ✅ | ❌ No `EventAskHost` |
| Map + nearby | P2 | ❌ No `EventDetailMap` on detail page |
| Sticky mobile buy bar | ✅ | ✅ `event-detail-mobile-buy-bar` |
| Loading skeleton | SAN-731 | ✅ merged PR #137 (`loading.tsx`) — **not Luma scope** |

**Local task spec:** `AIE-024-mvp-luma-event-detail.md` → **status: Not Started · 10%**

---

## Phase 4 — Browser audit

**Slug:** `reina-de-antioquia-2026-finals`  
**Environments:** localhost:3001 + prod `mdeai.co`

| Journey | Result |
|---------|--------|
| Andrés — detail → ticket → checkout (mobile) | ✅ checkout modal opens |
| Camila — home → chat → card → detail | ⚪ not run this session (detail-only audit) |
| Mobile buy bar visible | ✅ both envs |

### DOM probes (localhost + prod — identical)

| Probe | localhost | prod |
|-------|-----------|------|
| `event-detail-page` | ✅ | ✅ |
| Hero image | ❌ placeholder | ❌ placeholder |
| Host block text | ❌ | ❌ |
| Vibe tags | ❌ | ❌ |
| AI summary | ❌ | ❌ |
| Attendees / going | ❌ | ❌ |
| Ask Host | ❌ | ❌ |
| Map panel | ❌ | ❌ |
| Ticket tiers | ✅ (4 rows) | ✅ |
| Mobile buy bar | ✅ | ✅ |

**Screenshots**

| File | Description |
|------|-------------|
| `SAN-135-desktop.png` | localhost desktop full page |
| `SAN-135-mobile.png` | localhost mobile full page |
| `SAN-135-prod-desktop.png` | prod desktop |
| `SAN-135-prod-mobile.png` | prod mobile |

---

## Phase 5 — Feature matrix

| Feature | Spec | Code | Browser |
|---------|:----:|:----:|:-------:|
| Hero | ✅ | 🟡 | 🟡 placeholder only |
| Host block | ✅ | ❌ | ❌ |
| AI summary | ✅ | ❌ | ❌ |
| Vibe tags | ✅ | ❌ | ❌ |
| Social proof | ✅ | ❌ | ❌ |
| Ask Host | ✅ | ❌ | ❌ |
| Ticket tiers + checkout | ✅ | ✅ | ✅ |
| Sticky buy bar | ✅ | ✅ | ✅ |

---

## Phase 6 — Verdict

| Metric | Value |
|--------|------:|
| **Classification** | **D — Planning only** |
| **SAN-135 completion** | **~12%** (Linear + specs exist; zero SAN-135 implementation) |
| **PAGE-003 commerce base** | **~70%** (pre-Luma upgrade path) |
| **Readiness to ship SAN-135** | **~18%** (specs on disk; no branch, tests, or UI) |
| **Safe to start SAN-492?** | **No** — Phase A gate open (SAN-135 not merged) |

### Blockers

1. 🔴 **Status drift** — Linear In Review with no PR/commits for 12+ days
2. 🔴 **No implementation branch** — must start fresh from `main` (post SAN-731)
3. 🟡 **Scope split** — vibe/Ask Host also tracked as SAN-136–137; SAN-135 Phase A must define MVP slice vs deferrals
4. 🟡 **Data dependencies** — host profile, attendee counts, AI summary need API/seed paths

### Recovery recommendation

**No branch/PR to recover.** Recommended path:

```text
1. Linear: move SAN-135 → Todo (or In Progress) — correct stale In Review
2. Branch: ai/san-135-aie-024-mvp-luma-event-detail-layout-evp-032 from main (0baeda7+)
3. Implement PAGE-003b Phase A only:
   - EventHostBlock (static from organizer seed)
   - Layout reorder per 03-event-detail.md
   - Placeholder sections for vibe/AI/Ask Host OR ship with graceful hide
4. Do NOT pull EVP-033–036 agent work into this PR
5. SCREEN-014 Luma e2e + evidence before PR
```

### Exact next implementation task

**SAN-135 · Phase A layout shell** — host block + section order in `event-detail-view.tsx` per PAGE-003b, commerce/checkout unchanged.

---

## Related

- SAN-731 merged: PR [#137](https://github.com/amo-tech-ai/mdeapp/pull/137) → `0baeda7`
- Gate audit: **OPEN** until SAN-135 ships
