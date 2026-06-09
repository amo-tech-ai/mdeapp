---
title: Forensic PR breakup — bucket audit + test results
date: 2026-05-27
git_root: mdeapp/ @ main f37291d
status: report-only — no commit, push, or PR
skills: task-verifier, mde-worktree-pr-flow, copilotkit-integrations, mastra, mde-maps, testing
prompts: tasks/testing/prompts/bucket-verification-may27.md
---

# Forensic PR breakup — 2026-05-27

---

## 1. Working tree audit table

**Git root:** `mdeapp/` · **Branch:** `main` @ `f37291d` · **Staged:** 0 · **Deleted:** 0

| # | Path | State | Bucket |
|---|------|-------|--------|
| 1 | `src/lib/copilotkit-client-props.ts` | M | **C-008** |
| 2 | `src/platform/copilot/rich-card-results.ts` | ?? | **C-009** |
| 3 | `src/platform/copilot/__tests__/rich-card-results.test.ts` | ?? | **C-009** |
| 4 | `src/components/chat/rich-card-results-context.tsx` | ?? | **C-009** |
| 5 | `src/components/chat/center-panel-map-results-slot.tsx` | M | **C-009** |
| 6 | `src/components/chat/__tests__/center-panel-map-results-slot.test.tsx` | M | **C-009** |
| 7 | `src/components/chat/chat-map-panel.tsx` | M | **C-009** |
| 8 | `src/components/chat/map-mobile-sheet.tsx` | M | **C-009** |
| 9 | `src/components/chat/event-results-panel.tsx` | M | **C-009** |
| 10 | `src/components/chat/concierge-chat-messages.tsx` | M | **C-009** |
| 11 | `src/components/chat/concierge-assistant-message.tsx` | ?? | **C-009** |
| 12 | `src/components/chat/event-local-chat-context.tsx` | M | **C-009** ⚠️ also C-010/C-013 |
| 13 | `src/components/copilot/search-tool-renders.tsx` | M | **C-009** ⚠️ also C-010 |
| 14 | `e2e/helpers/maps-layout.ts` | M | **C-009** ⚠️ shared e2e |
| 15 | `e2e/rich-card-dedup.spec.ts` | ?? | **C-009** ⚠️ events row → C-013 |
| 16 | `src/app/api/rentals/search/route.ts` | ?? | **C-010** |
| 17 | `src/hooks/use-rental-search-fast-path.ts` | ?? | **C-010** |
| 18 | `src/lib/rental-clarify-copy.ts` | ?? | **C-010** |
| 19 | `src/lib/rental-display.ts` | ?? | **C-010** |
| 20 | `src/lib/rental-query-parser.ts` | ?? | **C-010** |
| 21 | `src/lib/rental-search-fast-path.ts` | ?? | **C-010** |
| 22 | `src/lib/sanitize-assistant-chat-content.ts` | ?? | **C-010** |
| 23 | `src/lib/__tests__/rental-display.test.ts` | ?? | **C-011** |
| 24 | `src/lib/__tests__/rental-search-fast-path.test.ts` | ?? | **C-011** |
| 25 | `src/lib/__tests__/sanitize-assistant-chat-content.test.ts` | ?? | **C-011** |
| 26 | `src/components/chat/rental-fast-path-context.tsx` | ?? | **C-010** |
| 27 | `src/components/chat/rental-fast-path-panel.tsx` | ?? | **C-010** |
| 28 | `src/components/chat/rental-ui-context.tsx` | M | **C-010** |
| 29 | `src/components/copilot/rental-card.tsx` | M | **C-010** |
| 30 | `src/components/chat/chat-canvas.tsx` | M | **C-010** |
| 31 | `src/components/chat/chat-center-panel.tsx` | M | **C-010** |
| 32 | `src/components/chat/concierge-chat-input.tsx` | M | **C-010** ⚠️ also C-013 |
| 33 | `src/components/chat/geo-chat-shell.tsx` | M | **C-010** ⚠️ **MIXED** — see §2 |
| 34 | `src/lib/types.ts` | M | **C-010** |
| 35 | `e2e/screens/SCREEN-005-rental-card.spec.ts` | M | **C-011** |
| 36 | `src/app/api/places/detail/route.ts` | ?? | **C-012** |
| 37 | `src/components/cafe/cafe-detail-panel.tsx` | ?? | **C-012** |
| 38 | `src/components/copilot/cafe-result-card.tsx` | ?? | **C-012** |
| 39 | `src/components/copilot/__tests__/cafe-result-card.test.tsx` | ?? | **C-012** |
| 40 | `src/components/sheets/cafe-booking-sheet.tsx` | ?? | **C-012** |
| 41 | `src/hooks/use-place-details.ts` | ?? | **C-012** |
| 42 | `src/lib/cafe-ask-prompts.ts` | ?? | **C-012** |
| 43 | `src/lib/place-details.ts` | ?? | **C-012** |
| 44 | `src/lib/place-details.test.ts` | ?? | **C-012** |
| 45 | `src/mastra/tools/search-grounded-places.ts` | M | **C-012** |
| 46 | `src/mastra/lib/google-places-client.ts` | M | **C-012** |
| 47 | `src/mastra/agents/concierge.ts` | M | **C-012** |
| 48 | `src/mastra/tools/__tests__/search-grounded-places-quality.test.ts` | ?? | **C-012** |
| 49 | `src/components/chat/chat-filter-copilot-instructions.tsx` | M | **C-012** |
| 50 | `src/components/maps/GroundingAttribution.tsx` | M | **C-012** |
| 51 | `src/components/sheets/venue-detail-sheet.tsx` | M | **C-012** |
| 52 | `e2e/screens/SCREEN-021-cafe-listings.spec.ts` | ?? | **C-012** |
| 53 | `e2e/maps-grounding.spec.ts` | M | **C-012** |
| 54 | `src/hooks/use-event-search-fast-path.ts` | M | **C-013** |
| 55 | `e2e/screens/SCREEN-006-event-card.spec.ts` | M | **C-013** |

### Parent repo (not in `mdeapp` git) — **docs / planning**

| Path | Bucket |
|------|--------|
| `tasks/testing/00-agent-testing-mandate.md`, `INDEX.md`, `01–03` packs | **docs** |
| `tasks/testing/prompts/bucket-verification-may27.md` | **docs** |
| `tasks/testing/evidence/2026-05-27/*` | **docs** |
| `tasks/real-estate/wireframes/009-scr-rental-card-polish.md` (`Partial`) | **docs** |
| `tasks/real-estate/wireframes/009-wire-rental-search.md` (`Partial`) | **docs** |
| `tasks/linear/05-issue-description-standard.md` | **docs** |
| `scripts/linear-enrich-descriptions.mjs`, `scripts/lib/linear-issue-description.mjs` | **docs** |
| `.cursor/rules/mdeai-testing.mdc` | **docs** |
| `tasks/commit/may-27/*` | **docs** |
| `tasks/venues/**` (bulk) | **accidental** — exclude from all PRs |

### Do not commit

`.env.local` · `test-results/**` · `tmp/**` · `supabase/.temp/**` · `tasks/venues/**` bulk · screenshot binaries unless explicitly requested

---

## 2. Bucket-by-bucket forensic report

### C-008 — CopilotKit inspector fix

| | |
|--|--|
| **Depends on** | nothing |
| **Depended on by** | all UI PRs (dev stability) |
| **Shared / mixed** | none |
| **Split further?** | No — 1 file |

**Docs verified:** `.agents/skills/copilotkit-debug` (ChunkLoadError / dev console); local `CopilotKit/examples/integrations/mastra/`; project rule: CopilotKit **1.55.2** only (`CLAUDE.md`). `showDevConsole: false` aligns with avoiding optional web-inspector chunk on localhost.

---

### C-009 — rich-card dedup

| | |
|--|--|
| **Depends on** | C-008 recommended first (dev boot) |
| **Depended on by** | C-010, C-012 (hide `results-column` when cards render) |
| **Shared files** | `search-tool-renders.tsx` (registrar), `event-local-chat-context.tsx`, `geo-chat-shell.tsx` (RichCardResultsProvider), `e2e/helpers/maps-layout.ts` |
| **Split further?** | **Yes** — `rich-card-dedup.spec.ts` events test belongs with C-013; use `git add -p` on `geo-chat-shell` for provider-only hunks |

**Docs verified:** `.cursor/rules/mdeai-rich-card-dedup.mdc`; `copilotkit-integrations` (tool render + AG-UI); `mde-maps` (pin merge, no duplicate lists).

---

### C-010 — rentals fast-path

| | |
|--|--|
| **Depends on** | **C-009 merged** (panel + dedup registrar) |
| **Depended on by** | C-011 tests; Camila prod after deploy |
| **Shared files** | `geo-chat-shell.tsx` (RentalFastPathProvider), `concierge-chat-input.tsx`, `search-tool-renders.tsx` (RentalResults), `event-local-chat-context.tsx` (empty assistant on fast path) |
| **Split further?** | **geo-chat-shell** must not include `CafeBookingSheet` in PR3 — stage with `git add -p` or temporary stub |

**Docs verified:** `mde-real-estate` / `mde-supabase` patterns; route uses `searchRentals` + Zod (`src/app/api/rentals/search/route.ts`); no service-role in route (good). `copilotkit-integrations` — `useCoAgent` + local fast path mirrors C-005 events pattern.

**Supabase:** Route delegates to `searchRentals` — verify RLS on rentals table before prod (MCP `user-supabase` at ship time).

---

### C-011 — rentals tests / evidence

| | |
|--|--|
| **Depends on** | C-010 |
| **Depended on by** | SAN-242 Done gate (with prod) |
| **Shared** | `e2e/helpers/maps-layout.ts` — commit with C-009 or C-011 once rental helpers stable |

**Evidence (parent repo):** `tasks/testing/evidence/2026-05-27/rental-search-M01-RESULTS.md`, `SCREEN-005-rental-ui-localhost-RESULTS.md`

---

### C-012 — café UI / Places / Mastra

| | |
|--|--|
| **Depends on** | C-009 (dedup) |
| **Depended on by** | SCREEN-021 Done (future) |
| **Shared** | `geo-chat-shell.tsx` (`CafeBookingSheet`), `venue-detail-sheet.tsx` |
| **Split further?** | Keep all Mastra grounding changes together; do not mix into rentals PR |

**Docs verified:** `mde-maps` + `.cursor/rules/mdeai-google-maps.mdc` (Places field masks); `mastra` skill; `search-grounded-places.ts` café filters (`isCafeGroundingQuery`, etc.). Gemini-only in `concierge.ts` (no Anthropic).

---

### C-013 — events fast-path fix

| | |
|--|--|
| **Depends on** | C-009 |
| **Independent of** | C-010, C-012 |
| **Gap** | No `EventFastPathPanel` — chip path fills map list, **0** `event-card` in chat |
| **Split further?** | New files only in this PR |

**Fix plan:** Add `event-fast-path-panel.tsx` mirroring `rental-fast-path-panel.tsx`; render `EventCard` from `lastEventResults` / fast-path rows; register `RichCardResultsRegistrar`.

---

### docs — planning / Linear

No `mdeapp` code. Link evidence in PR bodies. **Do not** mark SAN-242/243 **Done** until prod `POST /api/rentals/search` → **200**.

---

## 3. Official docs / skills verification summary

| Bucket | Skills / docs checked |
|--------|------------------------|
| C-008 | `copilotkit-debug`, `copilotkit-integrations`, local CopilotKit Mastra example |
| C-009 | `mdeai-rich-card-dedup.mdc`, `copilotkit-integrations`, `mde-maps` |
| C-010 | `mde-real-estate`, `mde-supabase`, `copilotkit` 1.55.2, `mastra` tool pattern |
| C-011 | `testing`, `webapp-testing`, `SCREEN-TESTING-STANDARD.md`, `task-verifier` |
| C-012 | `mde-maps`, Google Maps field-mask rule, `mastra`, `gemini` |
| C-013 | `copilotkit-develop` (adapt v2→1.55.2), events fast-path parity with C-005 |

**Mismatch noted:** `copilotkit-develop` skill text says v2 — project pins **1.55.2**; implementation correctly uses `@copilotkit/react-core` 1.x patterns.

---

## 4. Test results per bucket (executed 2026-05-27)

| Bucket | Result | Command | Notes |
|--------|--------|---------|-------|
| **C-008** | **PASS** | `npm run typecheck` | No dedicated unit file |
| **C-009** unit | **PASS** | `npm test -- --run` rich-card + center-panel tests | 5/5 |
| **C-009** PW rentals | **PASS** | `playwright … rich-card-dedup -g rentals` | 2.2s |
| **C-009** PW cafés | **PASS** | `playwright … rich-card-dedup -g cafés` | 13.1s |
| **C-009** PW events | **FAIL** | `playwright … rich-card-dedup -g events` | timeout — no `event-card` |
| **C-010** unit | **PASS** | rental + sanitize tests | 14/14 |
| **C-010** API | **PASS** | `curl POST /api/rentals/search` | 5 results |
| **C-011** PW | **PASS** | `SCREEN-005-rental-card.spec.ts` | 3/3 |
| **C-012** unit | **PASS** | café + place-details + grounding quality | 10/10 |
| **C-012** PW | **PASS** | `SCREEN-021` (4/4), `maps-grounding` (1/1) | |
| **C-013** PW | **FAIL** | `SCREEN-006` desktop cards test | 1 failed, 1 did not run |
| **Prod rentals** | **FAIL** | `POST https://www.mdeai.co/api/rentals/search` | **404** |

**Safe to commit?**

| Bucket | Commit? |
|--------|---------|
| C-008 | **Yes** |
| C-009 | **Yes** (exclude events e2e row or document known fail) |
| C-010 | **Yes** after C-009 merged |
| C-011 | **Yes** with C-010 |
| C-012 | **Yes** after C-009; independent of C-010 |
| C-013 | **No** — implement fix first |
| docs | **Yes** (parent paths / PR body) |

---

## 5. Failure points and blockers

| Blocker | Impact | Mitigation |
|---------|--------|------------|
| `geo-chat-shell.tsx` mixes 3 providers + café sheet | Blocks clean PR3/PR4 isolation | `git add -p` or split commits on stacked branch |
| Events lack inline `EventCard` | C-009 events e2e + C-013 SCREEN-006 fail | PR5 only after `EventFastPathPanel` |
| Prod rentals 404 | SAN-242/243 cannot be Done | Deploy PR3 before Linear Done |
| `concierge-chat-input` wires rental + event hooks | PR3/PR5 share file | PR5 adds event-only hunks after PR3 merged |
| Parent repo not git | docs/scripts not in GitHub PR | PR body links or separate docs repo |

---

## 6. Safe PR order

```text
PR1 (C-008) → PR2 (C-009) → PR3 (C-010+C-011) → deploy → prod rental curl
                              ↘ PR4 (C-012)     (parallel after PR2)
PR5 (C-013) after PR2
PR6 (docs) anytime
```

**Do not merge PR3 before PR2** — rentals need dedup registrar.

---

## 7. PR1 — exact commands (C-008)

```bash
cd /home/sk/mdeai/mdeapp
git checkout main && git pull
git checkout -b fix/c008-copilotkit-inspector-off

# pre-commit
npm run typecheck

git add src/lib/copilotkit-client-props.ts
git commit -m "$(cat <<'EOF'
fix(copilot): disable dev web inspector to avoid ChunkLoadError (C-008)

CopilotKit loads web-inspector on localhost by default; stale .next chunks
404 after dev restart. showDevConsole=false for all client prop variants.
EOF
)"

npm run lint && npm run typecheck
# push + PR when ready — not run in this audit
```

| Field | Value |
|-------|--------|
| **Title** | fix(copilot): disable dev web inspector (C-008) |
| **Risk** | Low |
| **Rollback** | Revert single file |
| **Linear** | none |

---

## 8. PR2 — exact commands (C-009)

```bash
git checkout main && git pull
git checkout -b fix/rich-card-dedup-may27

npm test -- --run src/platform/copilot/__tests__/rich-card-results.test.ts \
  src/components/chat/__tests__/center-panel-map-results-slot.test.tsx
PW_SKIP_WEBSERVER=1 npx playwright test e2e/rich-card-dedup.spec.ts -g "cafés|rentals" --project=chromium

git add \
  src/platform/copilot/rich-card-results.ts \
  src/platform/copilot/__tests__/rich-card-results.test.ts \
  src/components/chat/rich-card-results-context.tsx \
  src/components/chat/center-panel-map-results-slot.tsx \
  src/components/chat/__tests__/center-panel-map-results-slot.test.tsx \
  src/components/chat/chat-map-panel.tsx \
  src/components/chat/map-mobile-sheet.tsx \
  src/components/chat/event-results-panel.tsx \
  src/components/chat/concierge-chat-messages.tsx \
  src/components/chat/concierge-assistant-message.tsx \
  src/components/chat/event-local-chat-context.tsx \
  src/components/copilot/search-tool-renders.tsx \
  e2e/helpers/maps-layout.ts \
  e2e/rich-card-dedup.spec.ts

# geo-chat-shell: ONLY RichCardResultsProvider hunks — use git add -p src/components/chat/geo-chat-shell.tsx
# Do NOT stage RentalFastPathProvider or CafeBookingSheet in PR2

git commit -m "$(cat <<'EOF'
feat(chat): rich card dedup hides generic Map results (C-009)

Registrar suppresses results-column when generative cards own the listing surface.
Applies to café, rental, and event tool renders.
EOF
)"

npm run floor
```

| Field | Value |
|-------|--------|
| **Title** | feat(chat): rich card dedup (C-009) |
| **Exclude** | rentals API, café Mastra, `geo-chat-shell` café/rental providers |
| **Risk** | Med |
| **Rollback** | Revert registrar; map list reappears |

---

## 9. PR3 — exact commands (C-010 + C-011)

```bash
git checkout fix/rich-card-dedup-may27   # or main after PR2 merge
git checkout -b feat/rentals-fast-path-may27

npm test -- --run src/lib/__tests__/rental-display.test.ts \
  src/lib/__tests__/rental-search-fast-path.test.ts \
  src/lib/__tests__/sanitize-assistant-chat-content.test.ts
curl -s -X POST http://localhost:3001/api/rentals/search \
  -H 'Content-Type: application/json' \
  -d '{"neighborhood":"Laureles","minBedrooms":1,"maxPricePerNight":80}' | jq '.results|length'
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-005-rental-card.spec.ts --project=chromium

git add \
  src/app/api/rentals/search/route.ts \
  src/hooks/use-rental-search-fast-path.ts \
  src/lib/rental-clarify-copy.ts \
  src/lib/rental-display.ts \
  src/lib/rental-query-parser.ts \
  src/lib/rental-search-fast-path.ts \
  src/lib/sanitize-assistant-chat-content.ts \
  src/components/chat/rental-fast-path-context.tsx \
  src/components/chat/rental-fast-path-panel.tsx \
  src/components/chat/rental-ui-context.tsx \
  src/components/copilot/rental-card.tsx \
  src/components/chat/chat-canvas.tsx \
  src/components/chat/chat-center-panel.tsx \
  src/components/chat/concierge-chat-input.tsx \
  src/lib/types.ts \
  e2e/screens/SCREEN-005-rental-card.spec.ts \
  src/lib/__tests__/rental-display.test.ts \
  src/lib/__tests__/rental-search-fast-path.test.ts \
  src/lib/__tests__/sanitize-assistant-chat-content.test.ts

git add -p src/components/chat/geo-chat-shell.tsx    # RentalFastPathProvider + body split only
git add -p src/components/copilot/search-tool-renders.tsx   # rental hunks only if not in PR2

git commit -m "$(cat <<'EOF'
feat(rentals): fast-path search API and inline Mindtrip cards (C-010)

POST /api/rentals/search for Camila without full agent round-trip.
RentalFastPathPanel renders cards in chat; strips duplicate assistant prose.
EOF
)"

npm run floor
```

| Field | Value |
|-------|--------|
| **Title** | feat(rentals): fast-path search + inline cards (SAN-242, SAN-243) |
| **Linear** | SAN-242, SAN-243 — **In Review** until prod 200 |
| **Risk** | Med |
| **Post-deploy** | `curl POST https://www.mdeai.co/api/rentals/search` → 200 |

---

## 10. Files to exclude (all PRs)

```
.env.local
.env*.local
test-results/**
tmp/**
supabase/.temp/**
tasks/venues/**          # bulk planning — not mdeapp
scripts/smoke-laureles-flow*.mjs   # per ledger
mdeapp/test-results/**
```

**PR4 (C-012) file list:** all café/Places/Mastra paths from table rows 36–53 — **no** `src/app/api/rentals/**`.

**PR5 (C-013):** new `event-fast-path-panel.tsx` + `use-event-search-fast-path` + SCREEN-006 + rich-card-dedup events test.

**PR6 (docs):** `tasks/testing/**`, `tasks/commit/may-27/**`, `scripts/linear-*`, `.cursor/rules/mdeai-testing.mdc`, task spec Partial status — PR description only unless monorepo.

---

## Final recommendation

| Priority | Action |
|----------|--------|
| 1 | Ship **PR1** (C-008) — **safe**, 1 file |
| 2 | Ship **PR2** (C-009) — **safe**; use `git add -p` on `geo-chat-shell` |
| 3 | Ship **PR3** (C-010+C-011) — **safe** on localhost; **deploy required** for Linear Done |
| 4 | Ship **PR4** (C-012) in parallel after PR2 — **safe**; do not mix with PR3 |
| 5 | **Do not open PR5** until `EventFastPathPanel` implemented and SCREEN-006 passes |
| 6 | Attach `tasks/testing/evidence/2026-05-27/*` to PR3 body; run prompts in `tasks/testing/prompts/bucket-verification-may27.md` |

**First PR to open:** **PR1** (`fix/c008-copilotkit-inspector-off`).

**First rental PR:** **PR3** after PR2 merges — not before.
