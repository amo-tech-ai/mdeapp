# PR #14 — Forensic split audit (report only)

**Date:** 2026-05-30  
**Auditor role:** Staff engineer / release manager  
**Scope:** Classify, blockers, split plan — **no code changes in this pass**  
**PR:** https://github.com/amo-tech-ai/mdeapp/pull/14  
**Head:** `feat/c012-cafe-places-detail` (remote @ `8fa5f10`)  
**Base:** `main` (@ `9956277` — includes `fix(copilotkit): force same-origin runtime` #13)

---

## Executive verdict

| Metric | Score | Notes |
|--------|------:|-------|
| **Feature correctness (café slice)** | **82%** | B1 attribution fix present in `76abde1`; Places detail + cards wired; booking is honest stub |
| **Runtime fix correctness** | **90%** | Commit `8fa5f10` is focused (8 files); proven idle POST delta 0 locally |
| **PR hygiene / reviewability** | **48%** | 12 commits, 33 files, two domains in one PR |
| **Merge readiness** | **38%** | GitHub `mergeable: CONFLICTING`; no GH Actions on head; preview smoke blocked (401) |
| **Overall “do not merge as-is”** | **Correct call** | Split before merge |

**Recommendation:** Break up. **PR A (runtime) → merge first.** **PR B (café) → rebase on main after A.**

---

## 1. File classification matrix

Strict categories. **PR A** = runtime only. **PR B** = café only. **Mixed** = needs manual split or two-step commit.

| File | Category | PR A | PR B | Notes |
|------|----------|:----:|:----:|-------|
| `scripts/check-mastra.mjs` | runtime infrastructure | ✅ | ❌ | Catch-all route path for Mastra smoke |
| `src/app/api/copilotkit/[[...path]]/route.ts` | CopilotKit stabilization | ✅ | ❌ | Replaces `route.ts`; GET+POST |
| `src/app/layout.tsx` | CopilotKit stabilization | ✅ | ❌ | Maps `Script` → `<head>` only (9 lines) |
| `src/lib/copilotkit-client-props.ts` | CopilotKit stabilization | ✅ | ❌ | `useSingleEndpoint: true` (conflicts with `main`) |
| `src/lib/__tests__/copilotkit-client-props.test.ts` | tests (runtime) | ✅ | ❌ | Expect `useSingleEndpoint` |
| `src/components/copilot/event-web-citation-sync.tsx` | CopilotKit stabilization | ✅ | ❌ | Stable `DefaultToolCitationBridge` |
| `src/components/copilot/focus-map-pin-action.tsx` | CopilotKit stabilization | ✅ | ❌ | Ref-stable `useCopilotAction` |
| `src/components/copilot/search-tool-renders.tsx` | **risky mixed** | ⚠️ | ⚠️ | **8fa5f10** = stable tool renders for *all* tools; branch file also adds `GroundedCafeResults` + `CafeResultCard` (café). Cherry-pick onto `main` applies stability only — **verify** grounded path still compiles |
| `src/app/api/places/detail/route.ts` | places API | ❌ | ✅ | C-012 |
| `src/lib/place-details.ts` | places API | ❌ | ✅ | Field masks, DTO |
| `src/lib/place-details.test.ts` | tests (café) | ❌ | ✅ | |
| `src/hooks/use-place-details.ts` | café UI | ❌ | ✅ | AbortController (S1) |
| `src/lib/cafe-ask-prompts.ts` | café UI | ❌ | ✅ | |
| `src/components/copilot/cafe-result-card.tsx` | café UI | ❌ | ✅ | |
| `src/components/copilot/__tests__/cafe-result-card.test.tsx` | tests (café) | ❌ | ✅ | |
| `src/components/cafe/cafe-detail-panel.tsx` | café UI | ❌ | ✅ | |
| `src/components/sheets/cafe-booking-sheet.tsx` | café UI | ❌ | ✅ | Stub copy must stay explicit |
| `src/components/chat/cafe-detail-mobile-sheet.tsx` | café UI | ❌ | ✅ | |
| `src/components/chat/rental-ui-context.tsx` | café UI | ❌ | ✅ | `CafeVenueDetail`, open/close detail |
| `src/components/chat/geo-chat-shell.tsx` | café wiring | ❌ | ✅ | Sheets + providers |
| `src/components/chat/chat-map-panel.tsx` | café wiring | ❌ | ✅ | Right column café mode |
| `src/components/chat/chat-canvas.tsx` | café wiring | ❌ | ✅ | Mobile sheet mount |
| `src/components/chat/concierge-assistant-message.tsx` | café / chat | ❌ | ✅ | Shared sanitizer path |
| `src/components/chat/concierge-chat-messages.tsx` | chat (low) | ❌ | ✅ | 3-line change; hydration adjacent |
| `src/mastra/tools/search-grounded-places.ts` | café / Mastra | ❌ | ✅ | Filter + `alignGroundedAttribution` (B1) |
| `src/mastra/tools/__tests__/search-grounded-places-quality.test.ts` | tests (café) | ❌ | ✅ | B1 regression |
| `src/lib/__tests__/sanitize-assistant-chat-content.test.ts` | tests (café) | ❌ | ✅ | Maps grounding echo strip |
| `e2e/screens/SCREEN-021-cafe-listings.spec.ts` | tests (café) | ❌ | ✅ | |
| `e2e/maps-grounding.spec.ts` | tests (café) | ❌ | ✅ | In-card attribution asserts |
| `e2e/helpers/maps-layout.ts` | tests (shared) | ❌ | ✅ | `waitForCafeGroundedCards` |
| `package.json` | scripts | ❌ | ✅ | `commit:staged-guard:c012/c013` only |
| `scripts/commit-staged-guard.mjs` | scripts (café) | ❌ | ✅ | |
| `scripts/restore-wip-c012.sh` | scripts / dev-only | ❌ | ⚠️ | **Exclude from merge:** copies from untracked `drafts/wip-pr4-off-src` (not on CI/teammate machines). Paths are relative, not `/home/...` hardcoded — see [audit-1.md](./audit-1.md) C1 |
| `tasks/ux/audit/01-copilotkit-audit.md` | runtime audit docs | ✅ | ❌ | Outside `mdeapp/` git root — copy to planning repo separately |

### Commits on #14 (cherry-pick map)

| Commit | PR A | PR B | Note |
|--------|:----:|:----:|------|
| `8fa5f10` fix(copilotkit): stabilize… | ✅ | ❌ | **Atomic runtime slice** (8 files) |
| `76abde1` fix(cafe): B1/B2 + S1–S5 | ❌ | ✅ | Attribution + audit fixes |
| `72363c6` fix(chat): sanitizer | ❌ | ✅ | |
| `895f459` fix(chat): mobile sheet + e2e | ❌ | ✅ | |
| `b8d9f92` fix(copilotkit): same-origin | ⚠️ | ❌ | **Likely duplicate of `main` #13** — skip on rebase |
| `991db97` chore: test:prod-gate scripts | ❌ | ⚠️ | Superseded by B2 removal in `76abde1` — **omit** |
| `72df10c` … SCREEN-021 + grounding filter | ❌ | ✅ | |
| `b1817d0` … wire café map column | ❌ | ✅ | |
| `8b312e6` … detail panel + booking | ❌ | ✅ | |
| `33daaa9` … CafeResultCard + hook | ❌ | ✅ | |
| `d4dc9c3` … Places detail API | ❌ | ✅ | |
| `aec4801` chore: restore + staged guard | ❌ | ✅ | Drop `restore-wip` from merge or keep as optional chore |

---

## 2. Blockers before any merge

| ID | Severity | Blocker | Status on disk | Fix owner |
|----|----------|---------|----------------|-----------|
| B-01 | **P0** | GitHub `mergeable: CONFLICTING` | `copilotkit-client-props` (+ test): `main` lacks `useSingleEndpoint`; branch has it | PR A merge + rebase B |
| B-02 | **P0** | No GitHub Actions CI | `.github/workflows/` absent — Vercel/CodeRabbit only | Add floor workflow **with or before PR A**; split alone does not fix ([audit-1](./audit-1.md) C3) |
| B-03 | **P1** | Preview access 401 | Vercel deploy **green**; 401 = deployment protection on URL | Bypass secret or localhost smoke ([audit-1](./audit-1.md) C5) |
| ~~B-04~~ | ~~P1~~ ✅ | E2E **now proven** | SCREEN-021 + maps-grounding **5/5 chromium PASS** on fresh `:3001` (2026-05-30); prior "5/5 fail" = stale-server false negative | Resolved — keep fresh-server step 0 in PR-B runbook ([audit-1](./audit-1.md) C6/C9) |
| B-05 | **P1** | PR scope mixed | 33 files, two products | **This split** |
| B-06 | **P2** | `restore-wip-c012.sh` | Dev-only WIP helper — paths are **dynamic** (`ROOT`-relative), *not* hardcoded; reaches `../drafts/wip-pr4-off-src` outside repo | Remove from PR B or never merge to `main` (C1) |
| B-07 | **P2** | CodeRabbit stale vs fixed | B1/S1–S5 addressed in `76abde1` | Re-run CodeRabbit on PR B after split |

### Attribution bug (CodeRabbit B1)

**Verdict:** **Fixed in branch** (`76abde1` + `alignGroundedAttribution` by `placeUri` ↔ `mapsUrl`). Not a reason to block split — **include in PR B** with unit test in `search-grounded-places-quality.test.ts`.

Local unpushed merge `8c99ded` (if present) adds B1 test export — **push with PR B**, not required for PR A.

---

## 3. Shared files — split feasibility

| File | Split cleanly? | Strategy |
|------|----------------|----------|
| `search-tool-renders.tsx` | **Partial** | PR A: cherry-pick `8fa5f10` onto `main` (stable module-level `*ToolRender` + `useDisabledToolRender`). PR B: re-apply café commits that add `GroundedCafeResults` / `CafeResultCard` on top of merged A |
| `copilotkit-client-props.ts` | **Yes** | PR A only; conflict resolution keeps `useSingleEndpoint: true` |
| `layout.tsx` | **Yes** | PR A only (Script in head) |
| `geo-chat-shell.tsx` | **Yes** | PR B only |
| `maps-grounding.spec.ts` | **Yes** | PR B only (depends on café cards) |
| `focus-map-pin-action.tsx` | **Yes** | PR A only |
| `event-web-citation-sync.tsx` | **Yes** | PR A only |

**Safest order:** Merge **PR A** → rebase **PR B** onto `main` (conflicts shrink to café-only files).

---

## 4. Release strategy

### Merge order

1. **PR A** `fix/copilotkit-runtime-stability` → `main` (hotfix-class)
2. **PR B** `feat/cafe-detail-flow` → `main` (feature, rebased on post-A `main`)
3. **Close #14** without merge (or retarget as tracking issue)

### Rollback

| PR | Rollback | Blast radius |
|----|----------|--------------|
| A | Revert single commit `8fa5f10` equivalent | All CopilotKit chat surfaces (Camila + Roberto) |
| B | Revert café commits | Café cards/panel only; grounding filter reverts |

Keep A and B as **separate revert commits** — do not squash into one.

### Verification

| Gate | PR A | PR B |
|------|------|------|
| `npm run floor` | Required | Required |
| `GET /` 200 | Required | Required |
| `POST /api/copilotkit` 200 | Required | Required |
| 60s idle POST delta = 0 | **Required** | Re-verify after rebase |
| Rental prompt cards + pins | **Required** | Regression |
| Café SCREEN-021 | N/A | **Required** (chromium) |
| `test:e2e:grounding` | N/A | **Required** |
| Vercel preview smoke | Runtime only | Full café flow |
| `GET /api/copilotkit/info` | 405 OK if `useSingleEndpoint: true` | Same |

### Deployment

- **PR A:** Promote to production first — fixes resource exhaustion class bug.
- **PR B:** Preview → prod after A is live; no Supabase migration in either slice.

### Preview testing

- URL pattern: `mdeapp-git-feat-c012-cafe-places-detail-amo100.vercel.app` (from PR bot).
- **401** = Vercel Deployment Protection — not a product bug; configure bypass for Lucía/QA or test on localhost with production build.

---

## 5. Red flags & critical fixes

| Flag | Severity | Action |
|------|----------|--------|
| Nested `<CopilotKit>` on host | High | **Not in #14** — follow-up PR per `tasks/ux/audit/02-copilotkit-next-steps.md` |
| `useSingleEndpoint` removed on merge conflict | **Critical** | Must keep in PR A |
| Unstable tool renders reintroduced | **Critical** | PR A must land before café refactors touch `search-tool-renders.tsx` |
| Booking stub implies real booking | Medium | PR B copy: keep “No request is sent yet” |
| `restore-wip-c012.sh` in repo | Medium | Do not merge to `main` |
| Duplicate same-origin commit `b8d9f92` vs `main` #13 | Low | Skip when cherry-picking B |
| Events weekend empty vs agent copy | Low | Out of scope for #14 split |

---

## 6. Improvements & best practices

1. **One concern per PR** — runtime platform vs persona feature (Roberto/Camila café).
2. **Cherry-pick `8fa5f10` as-is for PR A** — already atomic; do not re-cherry-pick whole #14 branch.
3. **Ledger rows:** `C-CK-RUNTIME-001` (A), `C-012` (B) in `tasks/commit/COMMIT-LEDGER.md`.
4. **Close #14** with link to A + B PRs to avoid duplicate review threads.
5. **CI:** Add minimal `npm run floor` workflow on `mdeapp` push (Sofía) — PR A should not rely on “local proof only” twice.
6. **`search-tool-renders.tsx`:** After A, require PR B diff to show only café additions (grep `CafeResultCard`, `GroundedCafeResults`).
7. **MCP/skills:** PR A verify with `copilotkit-debug` idle checklist; PR B with `mde-maps` + `google-maps-code-assist` field masks on Places detail.

---

## 7. Estimated effort

| Work | Hours | Risk |
|------|------:|------|
| PR A branch + cherry-pick + conflict | 1–2 | Medium (`search-tool-renders`) |
| PR A verify + PR open | 0.5 | Low |
| PR B rebase 10 commits − skip dupes | 2–4 | Medium |
| PR B e2e + preview smoke | 2–3 | Medium (401, Playwright install) |
| Close #14 + docs | 0.5 | Low |
| **Total** | **6–10 h** | |

---

## 8. Architecture impact

| After PR A | After PR B |
|------------|------------|
| Single-endpoint CopilotKit transport; catch-all runtime route; stable AG-UI tool registration (no POST storm) | Café grounded results use `CafeResultCard`; detail panel + mobile sheet; Places New API detail enrichment |
| Roberto/Camila chat stability ↑ | Tourist café discovery UX ↑ |
| No schema change | No schema change |

**Final architecture debt unchanged:** nested host/concierge providers, hydration gate, events DB weekend window — tracked in UX audit 02.

---

## 9. Percent correct (strict)

| Area | % | Rationale |
|------|---|-----------|
| Runtime fix (`8fa5f10`) | **90%** | Correct root cause; proven idle; must not lose `useSingleEndpoint` on merge |
| Café feature implementation | **85%** | Solid UI; B1 fixed; stub honest; **e2e 5/5 green locally** (fresh `:3001`) — only CI automation still absent |
| PR #14 packaging | **45%** | Mixed scope + conflict + weak remote gates |
| Audit recommendations (split first) | **95%** | Matches production risk profile |

**Weighted overall for “merge #14 as-is”:** **38% merge-ready** — aligns with user audit **78/100** quality but **conditional** ship.

---

## 10. Final recommendation

```text
Break it up.
Runtime fix first (PR A = cherry-pick 8fa5f10).
Café feature second (PR B = cafe commits only, rebased on main after A).
Do not merge PR #14.
Close #14 after A+B are open.
```

See runbooks: [PR-A-RUNBOOK.md](./PR-A-RUNBOOK.md), [PR-B-RUNBOOK.md](./PR-B-RUNBOOK.md).
