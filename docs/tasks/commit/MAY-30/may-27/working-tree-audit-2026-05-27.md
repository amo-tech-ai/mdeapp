---
title: Working tree audit — commit/PR breakup
date: 2026-05-27
git_root: mdeapp/
base: main @ f37291d
status: report-only — no commit, push, or PR
linear: SAN-242 (SCREEN-005), SAN-243 (WIRE-002)
---

# Working tree audit — 2026-05-27

## 1. Executive summary

| Item | Value |
|------|--------|
| **Git root** | `/home/sk/mdeai/mdeapp/` (planning repo `/home/sk/mdeai` is **not** a git repo) |
| **Current branch** | `main` @ `f37291d` (`Merge pull request #7 … search-classifier-hijack`) |
| **Modified (tracked)** | **27** files |
| **Untracked (new)** | **28** files |
| **Total touched in `mdeapp`** | **55** paths |
| **Staged** | **0** (nothing in index) |
| **Deleted** | **0** tracked deletions |
| **Diff size** | **+891 / −391** lines (unstaged only) |
| **Unit tests (now)** | `npm test -- --run` → **305/305 PASS** |
| **Typecheck (now)** | **PASS** |

### Staged vs unstaged

- **Staged:** none  
- **Unstaged:** all 27 modifications + 28 untracked files  

### Risky / do-not-commit (mdeapp)

| Path | Reason |
|------|--------|
| `.env.local` | Ignored; never stage |
| `test-results/**` | Ignored; Playwright artifacts (exists, ~8K) |
| `tmp/**`, `supabase/.temp/**` | Ignored per ledger |

### Generated / test artifacts

| Location | In git? | Action |
|----------|---------|--------|
| `mdeapp/test-results/` | ignored | Do not commit |
| `mdeapp/tmp/screenshots/` | ignored | Evidence only |
| Parent `tasks/testing/evidence/2026-05-27/*.md` | **outside mdeapp git** | Link in PR body; optional docs commit in planning repo later |

### Parent repo WIP (outside `mdeapp` git — ship via PR description or separate docs PR)

| Area | Examples | Notes |
|------|----------|-------|
| Testing mandate | `tasks/testing/00-agent-testing-mandate.md`, `INDEX.md`, `01–03` packs | Agent process |
| Evidence | `tasks/testing/evidence/2026-05-27/*` | M01 PASS localhost; prod rentals **404** |
| Task specs | `tasks/real-estate/wireframes/009-scr-rental-card-polish.md`, `009-wire-rental-search.md` → **Partial** | Do **not** mark Done |
| Linear tooling | `scripts/linear-enrich-descriptions.mjs`, `scripts/lib/linear-issue-description.mjs` | SAN-242/243 enriched in Linear |
| Linear docs | `tasks/linear/05-issue-description-standard.md` | |
| Cursor rules | `.cursor/rules/mdeai-testing.mdc` | |

### Linear (SAN-242 / SAN-243)

- **SAN-242** — SCREEN-005 rental card polish → `tasks/linear/import-log.json`; disk spec `status: Partial` (prod/deploy gap).  
- **SAN-243** — WIRE-002 rental search in-thread → `build_status: Partial`.  
- Evidence: `tasks/testing/evidence/2026-05-27/rental-search-M01-RESULTS.md` — localhost **PASS**, prod **`POST /api/rentals/search` → 404**.

---

## 2. Change classification

### A — Rentals fast-path (Camila / SAN-242, SAN-243)

| Path | State |
|------|--------|
| `src/app/api/rentals/search/route.ts` | untracked |
| `src/hooks/use-rental-search-fast-path.ts` | untracked |
| `src/lib/rental-clarify-copy.ts` | untracked |
| `src/lib/rental-display.ts` | untracked |
| `src/lib/rental-query-parser.ts` | untracked |
| `src/lib/rental-search-fast-path.ts` | untracked |
| `src/lib/__tests__/rental-display.test.ts` | untracked |
| `src/lib/__tests__/rental-search-fast-path.test.ts` | untracked |
| `src/lib/__tests__/sanitize-assistant-chat-content.test.ts` | untracked |
| `src/lib/sanitize-assistant-chat-content.ts` | untracked |
| `src/components/chat/rental-fast-path-context.tsx` | untracked |
| `src/components/chat/rental-fast-path-panel.tsx` | untracked |
| `src/components/chat/rental-ui-context.tsx` | modified |
| `src/components/copilot/rental-card.tsx` | modified |
| `src/components/chat/chat-canvas.tsx` | modified (7fr/5fr) |
| `src/components/chat/chat-center-panel.tsx` | modified (panel mount) |
| `e2e/screens/SCREEN-005-rental-card.spec.ts` | modified |

### B — Café UI (SCREEN-021 / Phase A.5)

| Path | State |
|------|--------|
| `src/app/api/places/detail/route.ts` | untracked |
| `src/components/cafe/cafe-detail-panel.tsx` | untracked |
| `src/components/copilot/cafe-result-card.tsx` | untracked |
| `src/components/copilot/__tests__/cafe-result-card.test.ts` | untracked |
| `src/components/sheets/cafe-booking-sheet.tsx` | untracked |
| `src/hooks/use-place-details.ts` | untracked |
| `src/lib/cafe-ask-prompts.ts` | untracked |
| `src/lib/place-details.ts` | untracked |
| `src/lib/place-details.test.ts` | untracked |
| `src/mastra/tools/search-grounded-places.ts` | modified (+135 lines, café filtering) |
| `src/mastra/lib/google-places-client.ts` | modified |
| `src/mastra/agents/concierge.ts` | modified |
| `src/mastra/tools/__tests__/search-grounded-places-quality.test.ts` | untracked |
| `src/components/chat/chat-filter-copilot-instructions.tsx` | modified |
| `e2e/screens/SCREEN-021-cafe-listings.spec.ts` | untracked |
| `e2e/maps-grounding.spec.ts` | modified |

### C — Rich-card dedup (shared: rentals + events + cafés)

| Path | State |
|------|--------|
| `src/platform/copilot/rich-card-results.ts` | untracked |
| `src/platform/copilot/__tests__/rich-card-results.test.ts` | untracked |
| `src/components/chat/rich-card-results-context.tsx` | untracked |
| `src/components/chat/center-panel-map-results-slot.tsx` | modified |
| `src/components/chat/__tests__/center-panel-map-results-slot.test.tsx` | modified |
| `src/components/chat/chat-map-panel.tsx` | modified |
| `src/components/chat/map-mobile-sheet.tsx` | modified |
| `src/components/chat/event-results-panel.tsx` | modified (panel → citations only) |
| `src/components/copilot/search-tool-renders.tsx` | modified (rental + event renders) |
| `e2e/rich-card-dedup.spec.ts` | untracked |
| `e2e/helpers/maps-layout.ts` | modified (dedup helpers) |

### D — Events fast-path (touch-only / still failing e2e)

| Path | State |
|------|--------|
| `src/hooks/use-event-search-fast-path.ts` | modified (minor) |
| `src/components/chat/event-local-chat-context.tsx` | modified (shared w/ rentals) |
| `e2e/screens/SCREEN-006-event-card.spec.ts` | modified |
| **Gap:** no `EventFastPathPanel` — Show-all chip shows map list, **0** `event-card` in chat |

### E — CopilotKit / chat plumbing (shared)

| Path | State |
|------|--------|
| `src/lib/copilotkit-client-props.ts` | modified (`showDevConsole: false`) |
| `src/components/chat/concierge-chat-input.tsx` | modified (fast-path hooks) |
| `src/components/chat/concierge-chat-messages.tsx` | modified |
| `src/components/chat/concierge-assistant-message.tsx` | untracked |
| `src/components/chat/geo-chat-shell.tsx` | modified (providers + **CafeBookingSheet**) |
| `src/lib/types.ts` | modified |
| `src/components/maps/GroundingAttribution.tsx` | modified (trivial) |
| `src/components/sheets/venue-detail-sheet.tsx` | modified (trivial) |

### F — E2E / tests (split per PR)

See buckets A–C; `e2e/helpers/maps-layout.ts` shared.

### G — Task specs / docs (parent repo only)

| Path | Change |
|------|--------|
| `tasks/real-estate/wireframes/009-scr-rental-card-polish.md` | `status: Partial` |
| `tasks/real-estate/wireframes/009-wire-rental-search.md` | `build_status: Partial` |
| `tasks/testing/**` | mandate + evidence |
| `tasks/linear/05-issue-description-standard.md` | Linear description standard |
| `scripts/linear-*.mjs` | enrichment tooling |

### H — Unrelated / noise

| Item | Verdict |
|------|---------|
| `tasks/venues/**` bulk docs | Separate venue initiative — **exclude** from rental/café PRs |
| `CopilotKit/`, `github/**` | Separate git repos — unrelated |
| Hydration overlay in dev | Known; not a file change |

---

## 3. Risk audit

### Must NOT commit

- `.env.local`, any `*.pem`, service-role keys  
- `test-results/`, `tmp/**`, screenshots binaries in `mdeapp`  
- Accidental `git add .` on `main` (55 files mixed domains)

### Secrets / env

- **No** `.env` or `.env.local` diffs in working tree (ignored).  
- Rental API uses existing Supabase client patterns — verify RLS in route before prod (touch **Supabase**).

### Large / high-risk surfaces

| Surface | Files | Risk |
|---------|-------|------|
| **Supabase** | `src/app/api/rentals/search/route.ts` | **Med** — server route, inventory query |
| **Maps** | `search-tool-renders`, map panels, pin sync | **Med** — mergePinsByCategory |
| **AI / Mastra** | `search-grounded-places.ts`, `concierge.ts` | **High** if mixed into rental PR — café-only |
| **CopilotKit** | `copilotkit-client-props`, chat input | **Low**–**Med** |
| **Payments / auth** | none in this WIP | — |

### Mixed changes (split required)

1. **`geo-chat-shell.tsx`** — rental provider + café booking sheet → split via PR order or two commits on same branch.  
2. **`search-tool-renders.tsx`** — rental EventResults + RentalResults + dedup → commit with dedup PR or rentals PR only if event diff is minimal.  
3. **`event-local-chat-context.tsx`** — rental empty `showExchange` + event clarify → shared; include in foundation PR.  
4. **`concierge-chat-input.tsx`** — wires **both** fast paths → foundation or rentals+café stack.

### Test status (2026-05-27)

| Suite | Result |
|-------|--------|
| `npm test -- --run` | **305 PASS** |
| `npm run typecheck` | **PASS** |
| Playwright `SCREEN-005` | **3/3 PASS** |
| Playwright `SCREEN-006` event cards | **FAIL** (no `event-card` in 120s) |
| Playwright `rich-card-dedup` events case | **FAIL** |
| Playwright `SCREEN-021` | not run in this audit |
| Prod `POST /api/rentals/search` | **404** — deploy blocker for Done |

### Done gate

- **Do not** flip SCREEN-005 / WIRE-002 or Linear SAN-242/243 to **Done** until prod deploy + evidence.  
- Disk specs correctly at **Partial**.

---

## 4. Recommended commit plan (mdeapp only)

Use ledger IDs **C-008** … **C-012** (next free after shipped C-000–C-006).

### Commit 1 — `fix(copilot): disable dev web inspector (C-008)`

**Files (1):**

```
src/lib/copilotkit-client-props.ts
```

### Commit 2 — `feat(chat): rich card dedup registrar (C-009)`

```
src/platform/copilot/rich-card-results.ts
src/platform/copilot/__tests__/rich-card-results.test.ts
src/components/chat/rich-card-results-context.tsx
src/components/chat/center-panel-map-results-slot.tsx
src/components/chat/__tests__/center-panel-map-results-slot.test.tsx
src/components/chat/chat-map-panel.tsx
src/components/chat/map-mobile-sheet.tsx
src/components/chat/event-results-panel.tsx
src/components/chat/event-local-chat-context.tsx
src/components/chat/concierge-chat-messages.tsx
src/components/chat/concierge-assistant-message.tsx
e2e/helpers/maps-layout.ts
e2e/rich-card-dedup.spec.ts
```

*Exclude `search-tool-renders.tsx` until commit 3 or 4 if diff is too coupled.*

### Commit 3 — `feat(rentals): fast-path API and inline cards (C-010)`

```
src/app/api/rentals/search/route.ts
src/hooks/use-rental-search-fast-path.ts
src/lib/rental-clarify-copy.ts
src/lib/rental-display.ts
src/lib/rental-query-parser.ts
src/lib/rental-search-fast-path.ts
src/lib/sanitize-assistant-chat-content.ts
src/lib/__tests__/rental-display.test.ts
src/lib/__tests__/rental-search-fast-path.test.ts
src/lib/__tests__/sanitize-assistant-chat-content.test.ts
src/components/chat/rental-fast-path-context.tsx
src/components/chat/rental-fast-path-panel.tsx
src/components/chat/rental-ui-context.tsx
src/components/copilot/rental-card.tsx
src/components/chat/chat-canvas.tsx
src/components/chat/chat-center-panel.tsx
src/components/chat/concierge-chat-input.tsx
src/components/chat/geo-chat-shell.tsx
src/lib/types.ts
src/components/copilot/search-tool-renders.tsx
```

*Note: `geo-chat-shell` also imports café sheet — see commit 4 or accept minimal café import stub in same PR.*

### Commit 4 — `test(rentals): SCREEN-005 e2e and smoke (C-011)`

```
e2e/screens/SCREEN-005-rental-card.spec.ts
```

### Commit 5 — `feat(cafes): grounded café cards and detail API (C-012)`

All remaining café + places + mastra files (bucket B + `venue-detail-sheet`, `GroundingAttribution`, `use-event-search-fast-path` if only café-related).

### Commit 6 — `docs: testing evidence and Partial task status` (parent repo / PR body)

Not in `mdeapp` git — paste links in PR description or separate planning commit elsewhere.

---

## 5. Recommended PR plan

### PR-F (merge first) — `fix/chat: rich-card dedup + CopilotKit dev inspector`

| Field | Value |
|-------|--------|
| **Commits** | C-008 + C-009 (+ part of `search-tool-renders` if needed) |
| **Scope** | Hide generic Map results when generative cards active |
| **Exclude** | Rental API, café Mastra filters |
| **Tests** | `npm test -- --run src/platform/copilot/__tests__/rich-card-results.test.ts src/components/chat/__tests__/center-panel-map-results-slot.test.ts` · `PW_SKIP_WEBSERVER=1 npx playwright test e2e/rich-card-dedup.spec.ts -g rentals` |
| **Risk** | **Low**–**Med** |
| **Rollback** | Revert registrar; map list reappears (cosmetic dup) |
| **Linear** | None (platform) |

### PR-A — `feat(rentals): fast-path search and Mindtrip rental cards`

| Field | Value |
|-------|--------|
| **Branch** | `feat/rentals-fast-path-may27` |
| **Commits** | C-010 + C-011 |
| **Depends** | PR-F merged (or stack on same branch) |
| **Files** | Bucket A + shared plumbing listed in commit 3 |
| **Exclude** | `search-grounded-places.ts`, café components, SCREEN-021 |
| **Tests** | `npm run floor` · `SCREEN-005` · `curl POST /api/rentals/search` · browser M01 prompt · **prod** after deploy |
| **Risk** | **Med** (API + UI + map pins) |
| **Rollback** | Remove route; revert fast-path hook |
| **Linear** | **SAN-242**, **SAN-243** — keep **In Review** until prod 200 |

### PR-B — `feat(cafes): SCREEN-021 café listings, detail, booking sheet`

| Field | Value |
|-------|--------|
| **Branch** | `feat/cafe-listings-may27` |
| **Files** | Bucket B |
| **Exclude** | Rental API, rental-fast-path |
| **Tests** | `SCREEN-021-cafe-listings.spec.ts` · `maps-grounding.spec.ts` · pack `03-cafe-detail-smoke.md` |
| **Risk** | **Med**–**High** (Mastra + Places) |
| **Linear** | SCREEN-021 / café tasks |

### PR-C — `fix(events): EventFastPathPanel inline cards` (follow-up)

| Field | Value |
|-------|--------|
| **Scope** | New panel mirroring `RentalFastPathPanel`; fix SCREEN-006 + rich-card-dedup events |
| **Tests** | `SCREEN-006` · pack `01` point #7 |
| **Risk** | **Med** |
| **Linear** | Event discovery / SCREEN-006 |

### PR-D — `docs: testing mandate, evidence, Linear tooling` (optional)

| Field | Value |
|-------|--------|
| **Repo** | Parent `/home/sk/mdeai` (no git today) or PR body only |
| **Files** | `tasks/testing/**`, `tasks/commit/may-27/**`, `scripts/linear-*`, `.cursor/rules/mdeai-testing.mdc` |
| **Risk** | **None** |

---

## 6. Recommended first PR

**Ship PR-F first** (2 commits, ~12 files), then **PR-A rentals**.

If you need **one** PR for product demo: use branch `feat/rentals-fast-path-may27` with commits 1→4 **only** (omit café Mastra changes); accept that `geo-chat-shell` may need café sheet reverted temporarily or included as dead code behind no UI path.

---

## 7. Exact first commit (smallest safe slice)

**Message:**

```text
fix(copilot): disable dev web inspector to avoid ChunkLoadError (C-008)

CopilotKit loads web-inspector on localhost by default; stale .next chunks
404 after dev restart. showDevConsole=false for all client prop variants.
```

**Files (only):**

```
src/lib/copilotkit-client-props.ts
```

**Commands:**

```bash
cd /home/sk/mdeai/mdeapp
git status --short
git diff --stat src/lib/copilotkit-client-props.ts
git checkout -b chore/c008-copilotkit-inspector-off
git add src/lib/copilotkit-client-props.ts
git commit -m "$(cat <<'EOF'
fix(copilot): disable dev web inspector to avoid ChunkLoadError (C-008)

CopilotKit loads web-inspector on localhost by default; stale .next chunks
404 after dev restart. showDevConsole=false for all client prop variants.
EOF
)"
npm run typecheck
```

---

## 8. Commands reference (full prep)

```bash
cd /home/sk/mdeai/mdeapp
git branch --show-current
git status --short
git diff --stat
git diff --name-only
git diff --cached --stat

# After each slice:
npm run lint
npm run typecheck
npm test -- --run
npm run floor   # before push

# Rental proof:
curl -s -X POST http://localhost:3001/api/rentals/search \
  -H 'Content-Type: application/json' \
  -d '{"neighborhood":"Laureles","minBedrooms":1,"maxPricePerNight":80}' | jq '.results|length'
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-005-rental-card.spec.ts --project=chromium

# Prod (post-deploy):
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://www.mdeai.co/api/rentals/search \
  -H 'Content-Type: application/json' -d '{"neighborhood":"Laureles"}'
```

**Branch names:**

| PR | Branch |
|----|--------|
| F | `fix/rich-card-dedup-may27` |
| A | `feat/rentals-fast-path-may27` |
| B | `feat/cafe-listings-may27` |
| C | `fix/event-fast-path-panel-may27` |

---

## 9. Index link

Add row to [`tasks/commit/COMMIT-LEDGER.md`](../COMMIT-LEDGER.md) when first commit lands:

| ID | Status | Branch | Scope |
|----|--------|--------|-------|
| C-008 | planned | `chore/c008-copilotkit-inspector-off` | copilotkit-client-props |
| C-009 | planned | `fix/rich-card-dedup-may27` | dedup registrar |
| C-010 | planned | `feat/rentals-fast-path-may27` | SAN-242/243 |
| C-011 | planned | same | SCREEN-005 e2e |
| C-012 | planned | `feat/cafe-listings-may27` | SCREEN-021 |
