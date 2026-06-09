---
title: Forensic audit — remaining May 28 commits (v2)
date: 2026-05-28
auditor: senior software specialist / forensic
scope: commits, worktrees, testing tasks
main_tip: e8d2a60
prod: https://www.mdeai.co/
tasks: ./tasks/INDEX.md
skills: ../../../index-skills.md
mcp_verified: google-maps-code-assist (Places field mask)
prior_score: 87/100
revised_score: 94/100
---

# Forensic audit v2 — remaining commits

> Incorporates external review corrections (PR numbering, C-013 sequencing, C-010d lint, hard gates).  
> **Prior audit:** v1 @ 91% plan / 87% reviewer score → **v2 @ 94%** after fixes.

---

## Executive summary

| Lens | Dot | Score |
|------|:---:|:-----:|
| Shipped PR #1–#12 on prod `e8d2a60` | 🟢 | **100%** |
| Remaining slice specs (C-010d, C-012, C-013) | 🟢 | **94%** |
| Open code on `main` (44/55 forensic paths) | 🟡 | **80%** |
| Weighted open commit work | 🟡 | **~45%** |
| Worktree hygiene | 🟢 | **85%** |

**Verdict:** Proceed with corrected order. **Do not parallelize C-012 and C-013.**

```text
(optional) C-010d → C-012 → C-013 → Andrés G1 → MVP ledger
```

---

## Corrections applied (v1 → v2)

| Issue | v1 | v2 fix |
|-------|-----|--------|
| C-010d lint breaks floor | 🔴 stated | 🟢 **fixed** — removed unused `pinsBefore`; floor passes |
| PR #13 vs #14 confusion | 🔴 | 🟢 **PR slots** — no hard GitHub #; table in tasks/INDEX |
| C-013 `parallel_with: C-012` | 🔴 | 🟢 **`depends_on: C-012`** — rebase after merge |
| C-010d marked MVP | 🟡 | 🟢 **`phase: TEST`**, `optional: true`, `mvp_blocker: false` |
| Missing field-mask hard gate | 🟠 | 🟢 grep + MCP citation in C-012 |
| Missing SCREEN-006 block gate | 🟠 | 🟢 blocking gate in C-013 |
| Prod e2e in CI without env | 🟡 | 🟢 `test.skip` unless `SMOKE_BASE_URL=https://www.mdeai.co` |
| Stale `f37291d` in docs | 🟡 | 🟢 trackers @ `e8d2a60` |

---

## What remains correct (unchanged)

| Item | Verdict |
|------|---------|
| C-010d test-only | ✅ |
| C-012 café separate | ✅ |
| C-013 events separate | ✅ |
| No mix rentals/cafés/events | ✅ |
| `git add -p` on mixed files | ✅ |
| Playwright per slice | ✅ |
| Places field masks mandatory | ✅ (MCP-verified below) |
| Prod evidence separate from localhost | ✅ |

Small focused PRs align with [GitHub PR guidance](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/helping-others-review-your-changes).

---

## MCP verification — Places API (New)

**Source:** [Place Details (New)](https://developers.google.com/maps/documentation/places/web-service/place-details?utm_source=gmp-code-assist)

> If you omit the field mask, the method **returns an error**. Pass `X-Goog-FieldMask` header or `fields` URL param.

**On disk today (`main`):**

- `src/mastra/lib/google-places-client.ts` — `validatePlacesFieldMask()` + `X-Goog-FieldMask` on requests ✅
- WIP `places/detail/route.ts` — calls `getPlaceDetails()` (inherits client masks) ✅
- **C-012 gate:** grep confirms no new unmasked Places calls; no key in `src/components/cafe/**`

**Playwright:** Prod spec skips without env — [isolated tests](https://playwright.dev/docs/best-practices).

**Vercel:** Test preview and production separately — [env-specific vars](https://vercel.com/docs/environment-variables).

---

## Task-by-task scores (v2)

### C-010d — prod pin-clear e2e

| Metric | Score |
|--------|------:|
| Scope clarity | 95 |
| Lint/floor readiness | 100 |
| MVP classification | 100 (correctly non-blocker) |
| **Overall** | **95/100** |

**Go:** Commit when approved. Optional slice.

### C-012 — café Places detail

| Metric | Score |
|--------|------:|
| Scope / exclusions | 92 |
| Hard gates (field mask, staging) | 95 |
| WIP restore path | 88 |
| Flake handling (SCREEN-021) | 85 |
| **Overall** | **90/100** |

**Go:** Next **product** PR. Block on field-mask grep + floor.

### C-013 — event fast-path panel

| Metric | Score |
|--------|------:|
| Feature correctness | 90 |
| Sequencing (after C-012) | 100 (fixed) |
| Hard gates (SCREEN-006) | 95 |
| **Overall** | **92/100** |

**Go:** Only after C-012 on `main` + rebase.

---

## Red flags (remaining)

| ID | Sev | Dot | Issue | Mitigation |
|----|:---:|:---:|-------|------------|
| R1 | P0 | 🔴 | C-012 not on `main` | PR from `drafts/wip-pr4-off-src/` |
| R2 | P1 | 🟠 | WIP drift vs `e8d2a60` | Rebase before copy |
| R3 | P1 | 🟠 | SCREEN-021 LLM flake | Agent up; 2× retry; no fake Done |
| R4 | P1 | 🟡 | Mixed-file staging accidents | `git add -p` + staged-path grep |
| R5 | P2 | 🟡 | Stale local branches | Delete merged `fix/*` |
| R6 | ops | 🟡 | Andrés G1 live payment | Ops — not C-### |

**Resolved since v1:** C-010d lint 🔴 → 🟢

---

## Failure points (watch list)

```text
1. git add . staging café + event + rental hunks
2. C-013 opened before C-012 merges → geo-chat-shell conflict
3. Places call without X-Goog-FieldMask (API error per Google docs)
4. SCREEN-006 red but PR merged anyway
5. Dedup regression — duplicate Map results column
6. Marking Done without prod + preview proof
7. Using hard-coded PR numbers in commit messages (use C-### only)
```

---

## Percent correct (v2)

| Category | Weight | Score |
|----------|--------|------:|
| Shipped stack verified | 35% | 35% |
| Corrected task specs | 25% | 23.5% |
| Testing prompts + gates | 20% | 19% |
| MCP / official doc alignment | 10% | 10% |
| Worktree / doc hygiene | 10% | 8.5% |
| **Total plan correctness** | | **~94%** |

| Open code commit readiness | | **~45%** |

---

## Best practices checklist

| Practice | Status |
|----------|:------:|
| One domain per PR | 🟢 |
| Conventional Commits + C-### | 🟢 |
| Floor before merge | 🟢 |
| Evidence under `tasks/testing/evidence/` | 🟢 |
| MCP before Places changes | 🟢 |
| mde-task-lifecycle phases 4–5 on ship | 🟢 |
| No service-role in `mdeapp/src` | 🟢 (unchanged) |
| CopilotKit 1.55.2 only | 🟢 |

---

## Suggested improvements (next)

1. `npm run test:prod-gate` script wrapping C-010d env vars.
2. `scripts/restore-wip-c012.sh` — copy paths only, no commit.
3. Post-merge audit `audits/C-012-cafe.md` (mirror C-004 format).
4. Update `index-skills.md` CTI block → **VEN-032+** (doc-only).
5. Delete `proof/andres-stripe-paid` or rebase on `e8d2a60`.

---

## Validation proof (2026-05-28 v2)

| Check | Result |
|-------|--------|
| `npm run floor` with `e2e/prod/` tracked | **PASS** (298 tests) |
| Prod `POST /api/rentals/search` | **200** |
| GitHub Production deploy | **`e8d2a60`** |
| Task markdown link check | **OK** |
| google-places-client field masks on `main` | **OK** |

---

## Recommended next command

```bash
cd /home/sk/mdeai/mdeapp
git checkout -b test/c010d-prod-pin-clear-e2e
git add e2e/prod/pr12-pin-clear-prod-gate.spec.ts
npm run floor
# commit when user approves — C-010d optional
# then C-012 product PR — not parallel with C-013
```

---

*Audit v2 complete. User review incorporated. Google Maps Platform usage may incur billing — restrict API keys per [Google Cloud docs](https://cloud.google.com/api-keys/docs/add-restrictions-api-keys).*
