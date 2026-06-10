# Forensic audit v2 — remaining commits

Your **87/100** review was mostly right. Corrections are applied across task specs, trackers, testing prompts, and the full audit doc. Revised score: **94/100**.

Full write-up: [`tasks/commit/may-27/AUDIT-2026-05-28-remaining-commits.md`](tasks/commit/may-27/AUDIT-2026-05-28-remaining-commits.md)

---

## Executive verdict

| Lens | Score | Dot |
|------|------:|:---:|
| Shipped PR #1–#12 on prod `e8d2a60` | **100%** | 🟢 |
| Remaining slice specs (C-010d, C-012, C-013) | **94%** | 🟢 |
| Open code on `main` (44/55 forensic paths) | **80%** | 🟡 |
| Weighted open commit work | **~45%** | 🟡 |

**Proceed** with strict order — **do not parallelize C-012 and C-013**.

```text
(optional) C-010d → C-012 → C-013 → Andrés G1 → MVP ledger
```

---

## Your audit — validated + fixed

| Your finding | Verdict | v2 fix |
|--------------|---------|--------|
| Split C-010d / C-012 / C-013 | ✅ Correct | Unchanged |
| C-010d lint breaks floor | ✅ Correct | Fixed — unused `pinsBefore` removed; **floor PASS (298 tests)** |
| PR #13 vs #14 confusion | ✅ Correct | **PR slots** — no hard GitHub numbers |
| C-013 parallel with C-012 | ✅ Correct | **`depends_on: C-012`** — rebase after merge |
| C-010d marked MVP | ✅ Correct | **`phase: TEST`**, `optional: true`, `mvp_blocker: false` |
| Field mask hard gate missing | ✅ Correct | grep gate + MCP citation in C-012 |
| SCREEN-006 block gate | ✅ Correct | blocking gate in C-013 |
| Prod e2e in CI without env | ✅ Correct | `test.skip` unless `SMOKE_BASE_URL=https://www.mdeai.co` |

---

## Task scores (v2)

| Task | Score | Go / no-go |
|------|------:|------------|
| **C-010d** — prod pin-clear e2e | **95/100** | Go when you approve commit — optional TEST hardening |
| **C-012** — café Places detail | **90/100** | Go — **next product PR** |
| **C-013** — event fast-path panel | **92/100** | Go only **after C-012 on `main` + rebase** |

---

## Red flags (remaining)

| Sev | Issue | Mitigation |
|:---:|-------|------------|
| 🔴 P0 | C-012 not on `main` (11 café paths missing) | Restore from `drafts/wip-pr4-off-src/` |
| 🟠 P1 | WIP drift vs `e8d2a60` | Rebase before copy |
| 🟠 P1 | SCREEN-021 LLM flake | Mastra up; 2× retry; no fake Done |
| 🟡 P1 | Mixed-file staging | `git add -p` + staged-path grep |
| 🟡 P2 | Stale `proof/andres-stripe-paid` | Rebase or delete |
| 🟡 ops | Andrés G1 live Stripe | Ops — not C-### |

**Resolved:** C-010d lint 🔴 → 🟢

---

## Failure points (watch list)

1. `git add .` staging café + event + rental hunks together  
2. C-013 opened before C-012 merges → `geo-chat-shell` conflict  
3. Places call without `X-Goog-FieldMask` → API error  
4. SCREEN-006 red but PR merged anyway  
5. Dedup regression — duplicate Map results column  
6. Done without prod + preview proof  
7. Hard-coded PR numbers in commit messages (use **C-###** only)

---

## MCP verification — Places API (New)

Google Maps Code Assist confirms ([Place Details (New)](https://developers.google.com/maps/documentation/places/web-service/place-details?utm_source=gmp-code-assist)):

> **If you omit the field mask, the method returns an error.**

**On disk today (`main`):**

```120:204:mdeapp/src/mastra/lib/google-places-client.ts
export function validatePlacesFieldMask(mask: readonly string[]): string {
  // ...
          { otherArgs: { headers: { "X-Goog-FieldMask": fieldMask } } },
```

C-012 WIP route calls `getPlaceDetails()` — inherits client masks. **Hard gate:** `rg 'X-Goog-FieldMask|validatePlacesFieldMask' src/mastra/lib/google-places-client.ts` before merge.

---

## Best practices alignment

| Practice | Status |
|----------|:------:|
| Small focused PRs ([GitHub](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/helping-others-review-your-changes)) | 🟢 |
| Playwright isolation — prod spec skips without env ([Playwright](https://playwright.dev/docs/best-practices)) | 🟢 |
| Places field mask mandatory ([Google](https://developers.google.com/maps/documentation/places/web-service/place-details)) | 🟢 |
| Vercel env-specific proof ([Vercel](https://vercel.com/docs/environment-variables)) | 🟢 |
| One domain per commit / no `git add .` | 🟢 |

---

## Percent correct

| Category | Weight | Score |
|----------|--------|------:|
| Shipped stack verified | 35% | 35% |
| Corrected task specs | 25% | 23.5% |
| Testing prompts + gates | 20% | 19% |
| MCP / official doc alignment | 10% | 10% |
| Worktree / doc hygiene | 10% | 8.5% |
| **Total plan correctness** | | **~94%** |

Open code commit readiness: **~45%** (WIP off-tree).

---

## Docs updated (this session)

- [`tasks/commit/may-27/AUDIT-2026-05-28-remaining-commits.md`](tasks/commit/may-27/AUDIT-2026-05-28-remaining-commits.md) — v2 @ 94/100  
- [`tasks/commit/may-27/tasks/INDEX.md`](tasks/commit/may-27/tasks/INDEX.md) — PR slots + strict order  
- [`tasks/commit/PROGRESS-TASK-TRACKER.md`](tasks/commit/PROGRESS-TASK-TRACKER.md) — floor green, sequential C-013  
- [`tasks/commit/COMMIT-LEDGER.md`](tasks/commit/COMMIT-LEDGER.md) — open rows  
- Testing prompts C-010d / C-012 / C-013 — hard gates added  

---

## Recommended next command

```bash
cd /home/sk/mdeai/mdeapp
git checkout -b test/c010d-prod-pin-clear-e2e
git add e2e/prod/pr12-pin-clear-prod-gate.spec.ts
npm run floor
# commit when you say so — C-010d is optional
# then C-012 product PR — never parallel with C-013
```

Say the word if you want C-010d committed or C-012 branched from WIP.---
title: May 28 commit task notes
updated: 2026-05-28
main_tip: e8d2a60
---

# Commit task notes

> **Authoritative specs:** [`INDEX.md`](./INDEX.md) · **Audit v2:** [`../AUDIT-2026-05-28-remaining-commits.md`](../AUDIT-2026-05-28-remaining-commits.md) (**94/100**)

## Shipped (verified)

PR [#6](https://github.com/amo-tech-ai/mdeapp/pull/6) · [#7](https://github.com/amo-tech-ai/mdeapp/pull/7) · [#11](https://github.com/amo-tech-ai/mdeapp/pull/11) · [#12](https://github.com/amo-tech-ai/mdeapp/pull/12) — all on prod @ **`e8d2a60`**.

## Open commit order

```text
(optional) C-010d → C-012 → C-013
```

| ID | Persona | Real-world goal | Spec |
|----|---------|-----------------|------|
| **C-010d** | Camila + Lucía | Prod robot proves PR #12 pin-clear | [C-010d](./C-010d-prod-pin-clear-e2e.md) |
| **C-012** | Tourist | Café cards + map detail panel | [C-012](./C-012-cafe-places-detail.md) |
| **C-013** | Andrés | Event cards in chat, not map-only | [C-013](./C-013-event-fast-path-panel.md) |

- **C-010d:** optional; branch `test/c010d-prod-pin-clear-e2e`
- **C-012:** 7 commits on `feat/c012-cafe-places-detail` — **SCREEN-021 required before merge**
- **C-013:** **no-go** until C-012 on `main`

## Stale sections below

Older tracker excerpts (pre-v2) may mention lint failures or PR #13/#14 swaps — superseded by audit v2.

---

## Archive — PR verification snapshot (2026-05-28)

See [`notes-2.md`](../notes-2.md) and [`pr3-forensic-audit-2026-05-28.md`](../pr3-forensic-audit-2026-05-28.md) for rental fast-path history.
