# DeepSource audit — `amo-tech-ai/mdeapp`

**Date:** 2026-06-18  
**Last progress update:** 2026-06-17 (Sprint 1 implementation + verification)  
**Main SHA analyzed:** `e0621c7c9918f529f64d56e57d65a36739fdded5`  
**Implementation branch:** `ai/chore-deepsource-fixes` (pending merge)  
**Dashboard:** [Recommended issues](https://app.deepsource.com/gh/amo-tech-ai/mdeapp/issues?category=recommended&page=1)  
**Auth:** DeepSource CLI v2.0.55 — logged in as `it@socialmediaville.ca`  
**MCP:** `project-0-mdeapp-DeepSource` connected (OAuth)

---

## 0. Progress tracker (Sprint 1)

**Process applied:** Examine → Verify → Validate → Measure → Identify  
**Legend:** 🟢 complete · 🟡 in progress · 🔴 failed/blocked · ⚪ not started  
**DeepSource re-scan:** Pending post-merge on `main` — occurrence counts below are **local proof**, not dashboard deltas yet.

### Summary

| Metric | Value |
|--------|-------|
| **Queue tasks (DS-001…013)** | 5 🟢 · 3 🟡 · 0 🔴 · 5 ⚪ |
| **Weighted completion (by task)** | **54%** (5 done + 3×50% partial) |
| **Sprint-1 extras** | JS-0437 skeleton keys 🟢 · SH-2012/SH-2015 probe-disk 🟢 |
| **Vitest (touched modules)** | **109/109** pass (`classifier`, `search-intent`, `sanitize`, `intelligence-event`, `grounded/search`) |
| **Blocked / pre-existing** | `npm run lint` (unrelated `scripts/linear-rentals-*.mjs`) · `tsc` (e2e helper exports) · 2 schedule-viewing tests |

### Task checklist

| Task | Rule | Status | % | Proof / validation | Gaps / risks |
|------|------|--------|---|-------------------|--------------|
| [DS-001](#ds-001--py-w0078--jsonload-instead-of-jsonloads-for-file-data) | PY-W0078 | 🟢 | 100% | `json.load(resp)` in `sync-ctest-linear.py:62` · `python3 -m py_compile` ✅ | Dashboard clear pending re-scan |
| [DS-002](#ds-002--pyl-w0612--remove-unused-python-variables) | PYL-W0612 | 🟢 | 100% | Removed `purpose()` `labels`; `_fail` / `_url` prefixes · py_compile ✅ | — |
| [DS-003](#ds-003--pyl-w0621--fix-shadowed-python-variables) | PYL-W0621 | 🟡 | 80% | `section_key` in 3× `for (section_key, label)` loops (no `key=` shadow) | Audit cited 5 lines; `read_csv` `for row` unchanged — confirm on re-scan |
| [DS-004](#ds-004--pyl-w0714--fix-overlapping-except-clauses) | PYL-W0714 | 🟢 | 100% | `except OSError` in `with_server.py:30` · py_compile ✅ | — |
| [DS-005](#ds-005--js-0339--triage-non-null-assertions) | JS-0339 | 🟡 | 15% | Prod: `search-{restaurants,rentals,events}.ts`, `grounded/search/route.ts`, `chat-lead-capture` + type guard · vitest ✅ | **75 occ / 34 files** — `supabase-clients.ts` `Deno.env.get!`, tests `execute!`, e2e remain |
| [DS-006](#ds-006--js-0757--remove-autofocus-from-home-hero) | JS-0757 | ⚪ | 0% | — | `home-hero.tsx:73` still has `autoFocus` |
| [DS-007](#ds-007--js-0833--exclude-or-fix-mjs-syntax-false-positives) | JS-0833 | 🟢 | 100% | `.deepsource.toml` excludes `scripts/**`, `.claude/hooks/**` + secrets FPs (`mde-maps/references`, `docs/**/evidence`, `plan.md`, `linear.md`) | Re-scan required to confirm **~50** hits cleared |
| [DS-008](#ds-008--js-r1002--remove-unused-object-destructure) | JS-R1002 | ⚪ | 0% | — | `browse-pin-converters.ts` untouched |
| [DS-009](#ds-009--js-r1004--fix-useless-template-literals) | JS-R1004 | ⚪ | 0% | — | `verify-grounding-enrichment.mjs`, `dist-leak-scan-hook.test.ts` |
| [DS-010](#ds-010--js-w1041--simplify-complex-boolean-returns) | JS-W1041 | 🟡 | 50% | 6/12 files: classifiers, sanitize, `intelligence-event-search`, `http.ts` · **46** classifier/intent tests ✅ | `flash-route-classifier`, `search-intent-router`, `search-grounded-places`, `search-rentals` not yet |
| [DS-011](#ds-011--js-w1042--remove-trailing-undefined-args) | JS-W1042 | ⚪ | 0% | — | 23 occ in tests + `thread-nav-context` |
| [DS-012](#ds-012--sh-2045--probe-disk-glob-instead-of-ls) | SH-2045 | 🟢 | 100% | `nullglob` + glob deps; no `$(ls …)` · `bash -n` ✅ | Also fixed **SH-2012**, **SH-2015** (`probe_path` helpers) |
| [DS-013](#ds-013--js-w1044--optional-chain-in-site-url) | JS-W1044 | ⚪ | 0% | — | `site-url.ts:19` still `next && next.startsWith` |

### Sprint-1 extras (not in DS-001…013)

| Item | Rule | Status | % | Proof |
|------|------|--------|---|-------|
| Loading skeleton keys | JS-0437 | 🟢 | 100% | All `src/app/*/loading.tsx` use stable `` key={`…-${i}`} ``; rentals line 69 fixed |
| Probe-disk `&& \|\|` chains | SH-2015 | 🟢 | 100% | `probe_path` / `probe_optional_path` helpers |

### Identify — next actions

| Priority | Item | Owner |
|----------|------|-------|
| P0 | Merge PR → trigger DeepSource re-scan; confirm SCT + JS-0833 drop | Sofía |
| P1 | DS-005 remainder: `supabase/functions/_shared/supabase-clients.ts` | Andrés edge path |
| P1 | DS-010 remainder: flash router + `search-intent-router` | Camila routing |
| P2 | DS-006, DS-008, DS-009, DS-011, DS-013 autofix batch | Sofía |
| ⚠️ | Pre-existing: e2e typecheck + 2 schedule-viewing test failures — **not** introduced by this PR | Lucía |

---

## 1. Executive summary

**Verdict:** No production-blocking secret leak in `src/**` or live runtime paths — but **first-scan noise is high** (2,668 total occurrences, 54 unique rules). **Real sprint work** is concentrated in: (1) **secrets false positives** in vendored Maps docs + planning markdown, (2) **shell logic** in `.claude/skills/task-verifier/scripts/probe-disk.sh`, (3) **React list keys** in loading skeletons, (4) **edge-function `console` usage** flagged as browser rule.

| Signal | Value | Meaning for mdeai |
|--------|-------|-------------------|
| Report card (main @ `e0621c7c`) | **A / 100** all dimensions | PR-scoped grade; does not mean zero repo issues |
| Total issues (MCP `get_repository`) | **2,668** occurrences · **54** rules | Mostly style/complexity in `src/mastra/**` |
| Recommended (UI / MCP) | **183** | DeepSource-prioritized fix queue |
| OWASP Top 10 compliance | **Failing** (5) | Driven by security-category findings |
| SANS Top 25 compliance | **Failing** (1) | Subset of security rules |
| OSS vulnerabilities (SCA) | **0** | `deepsource vulnerabilities` → `[]` |
| `src/**` SECRETS/SECURITY | **0** critical/major | Andrés/Roberto/Camila paths clean on secrets |

**Production risk today:** **Low** for shipped surfaces — no confirmed live API keys under `src/`. **Medium** hygiene debt — edge webhook logging, skeleton `key={index}`, shell scripts in agent tooling.

---

## 2. Tooling verification

### CLI

```bash
deepsource --version          # v2.0.55
deepsource auth status        # Logged in to DeepSource as it@socialmediaville.ca
deepsource repo status --repo gh/amo-tech-ai/mdeapp -o json
```

**Analyzers enabled:** `javascript`, `python`, `shell`, `sql`, `secrets` (CSS in config; 5 analyzers in status).

### MCP

Server: `DeepSource` @ `https://mcp.deepsource.com/mcp` (project-scoped in `.cursor/mcp.json`).

Verified tools: `get_repository`, `list_repository_issues`, `list_issue_occurrences`, `list_runs`, `get_run_report`, `get_report`, `list_reports`.

---

## 3. Issue inventory (actual counts)

### 3.1 Repository totals (MCP `get_repository` + `list_repository_issues`)

| Dimension | Occurrences | Unique rules |
|-----------|-------------|--------------|
| **All issues** | 2,668 | 54 |
| **Recommended** (DeepSource UI) | 183 | — |
| **CRITICAL** | 20 | 3 rules (`SH-2012`, `SCT-1000`, `SCT-1003`) |
| **MAJOR** | 251 | 21 rules |
| **MINOR** | 2,397 | 30 rules |

### 3.2 By category (occurrence-weighted, 54 rules)

| Category | Occurrences | Share |
|----------|-------------|-------|
| ANTIPATTERN | 2,228 | 83.5% |
| BUG_RISK | 347 | 13.0% |
| SECRETS | 88 | 3.3% |
| SECURITY | 5 | 0.2% |

### 3.3 By severity

| Severity | Occurrences |
|----------|-------------|
| MINOR | 2,397 |
| MAJOR | 251 |
| CRITICAL | 20 |

### 3.4 Recommended export (CLI)

DeepSource UI “Recommended” does not map 1:1 to a single CLI flag. Closest reproducible export:

```bash
# Slice A — critical/major in security + bug-risk + secrets (157 occurrences)
deepsource issues --repo gh/amo-tech-ai/mdeapp --default-branch \
  --category security,bug-risk,secrets --severity critical,major -o json -l 0 \
  > docs/deepsource-export-recommended-critical-major.json

# Slice B — major anti-patterns (114 occurrences)
deepsource issues --repo gh/amo-tech-ai/mdeapp --default-branch \
  --category anti-pattern --severity major -o json -l 0

# Combined export (271 occurrences) — saved as:
# docs/deepsource-export-recommended.json
```

**Note:** MCP `issue_stats.recommended_count` = **183**; CLI union above = **271**. Treat **183** as DeepSource’s internal prioritization; use CLI exports for reproducible audits.

---

## 4. Top 20 highest-risk findings (repository-wide)

Ranked by severity + category + path sensitivity (includes docs/skills — many are **false positives**).

| # | Rule | Path | Cat / Sev | Risk note |
|---|------|------|-----------|-----------|
| 1–2 | SCT-1000 | `plan.md`, `linear.md` | SECRETS / CRITICAL | **FP** — shell snippets referencing `LINEAR_API_KEY` env var, not committed secrets |
| 3–17 | SCT-1003 | `.claude/skills/mde-maps/references/**` | SECRETS / CRITICAL | **FP** — Google’s public sample `AIzaSy…` keys from vendored Maps docs |
| 18 | SCT-1000 | `docs/tasks/grounding-search/docs/01-playbook.md` | SECRETS / CRITICAL | **FP** — doc example token |
| 19 | SCT-1000 | `docs/ecommerce/evidence/.../ecom-c-007-*.md` | SECRETS / CRITICAL | **FP** — redacted evidence placeholder |
| 20 | SH-2012 | `.claude/skills/task-verifier/scripts/probe-disk.sh:141` | BUG_RISK / CRITICAL | **Real** — `ls` parsing; dev-only probe script |

### 4.1 Top 20 — production paths only (`src/**` + `supabase/**`)

| # | Rule | Path | Cat / Sev | Priority |
|---|------|------|-----------|----------|
| 1–10 | JS-0002 | `supabase/functions/ticket-payment-webhook/index.ts` (×7), `chat-lead-capture/index.ts` (×2) | BUG_RISK / MAJOR | **P1** — `console` in edge fns (rule targets browser; acceptable server logging — suppress or narrow rule) |
| 11 | JS-0002 | `src/app/api/partners/venue-leads/route.ts:90` | BUG_RISK / MAJOR | **P1** — API route logging |
| 12–20 | JS-0437 | Loading skeletons + home/partner components (12 files) | BUG_RISK / MAJOR | **P1** — `key={index}` in static skeleton lists |

**No CRITICAL/SECURITY/SECRETS findings under `src/**`.**

---

## 5. Category tables

### 5.1 Security

| Rule | Occ | Severity | Primary paths | Assessment |
|------|-----|----------|---------------|------------|
| SCT-1003 | 15 | CRITICAL | `.claude/skills/mde-maps/references/**` | FP — vendored Google samples |
| SCT-1000 | 4 | CRITICAL | `plan.md`, `linear.md`, docs evidence | FP — env-var instructions |
| SCT-A000 | 69 | MINOR | `supabase/config.toml`, docs, scripts | Mostly FP — placeholder env names |
| BAN-B310 | 2 | MAJOR | `docs/tasks/contest/scripts/sync-ctest-linear.py`, `.claude/skills/mde-maps/scripts/gmaps.py` | **P2** — urllib audit (dev scripts) |
| BAN-B602 | 1 | MAJOR | `.claude/skills/testing/scripts/with_server.py` | **P2** — `shell=True` subprocess (test harness) |
| BAN-B108 | 1 | MAJOR | `.claude/skills/testing/references/examples/element_discovery.py` | **P2** — hardcoded `/tmp` in example |
| PTC-W6004 | 1 | MINOR | Python tooling | **P2** — path control audit |

### 5.2 Bug risk

| Rule | Occ | Severity | Hot paths | Assessment |
|------|-----|----------|-----------|------------|
| JS-0067 | 1,407 | MINOR | Widespread JS/TS | **P2** — global-scope noise (incl. `.mjs` scripts) |
| JS-0116 | 129 | MINOR | `src/lib/**`, `src/mastra/**` | **P2** — async without await (often intentional) |
| JS-0002 | 95 | MAJOR | Edge functions + 1 API route | **P1** — see production table |
| JS-0833 | 50 | MINOR | `scripts/*.mjs`, `.claude/hooks/*.mjs` | **FP** — TS/ESM syntax in `.mjs` analyzer |
| JS-W1029 | 33 | MINOR | Mixed | **P2** — deprecated identifiers |
| JS-0437 | 19 | MAJOR | `src/app/*/loading.tsx`, components | **P1** — skeleton keys |
| SH-2015 | 13 | MAJOR | `probe-disk.sh` (13 lines) | **P1** — `&&`/`||` precedence bugs |
| SH-2012 | 1 | CRITICAL | `probe-disk.sh:141` | **P1** — use `find` not `ls` |

### 5.3 Major (all categories)

251 occurrences across 21 rules — see `docs/deepsource-export-rules-summary.json`.

### 5.4 Minor (bulk)

2,397 occurrences — dominated by `JS-0067`, `JS-R1005` (complexity), `JS-C1002` (short names). **P2** cleanup; exclude `docs/**` / vendored refs from gate before blocking CI.

### 5.5 Autofix available

| Rule | Occ | Title | Safe to autofix? |
|------|-----|-------|------------------|
| PTC-W0027 | 4 | f-string without expression | **Yes** — `docs/tasks/contest/scripts/sync-ctest-linear.py` |
| PY-W0078 | 1 | `json.loads` → `json.load` | **Yes** — same contest script |
| PYL-W1510 | 1 | subprocess `check=False` | **Review** — `.claude/skills/testing/scripts/with_server.py` — confirm intentional |

```bash
# Preview autofix candidates (no autofix CLI run performed in this audit)
deepsource issues --repo gh/amo-tech-ai/mdeapp --default-branch -o json -l 0 \
  | jq '[.[] | select(.issue_code=="PTC-W0027" or .issue_code=="PY-W0078" or .issue_code=="PYL-W1510")]'
```

---

## 6. Risk assessment

### Critical blockers (P0 — before production claims)

| Finding | Blocker? | Reason |
|---------|----------|--------|
| SCT-1003 in Maps reference docs | **No** | Vendored Google doc samples; not deployed |
| SCT-1000 in `plan.md` / `linear.md` | **No** | Documents `LINEAR_API_KEY` from env — not a committed key |
| Secrets in `src/**` | **No** | Zero SECRETS/SECURITY critical in app source |
| SCA vulnerabilities | **No** | Empty vulnerability list |
| OWASP / SANS failing | **Soft** | Compliance counters include doc/skill paths — fix via exclude rules + suppressions |

**P0 action:** Add DeepSource **exclude patterns** for vendored docs (see §8) so CI signal matches production risk.

### Production risks (P1)

| Persona / surface | Finding | Impact |
|-------------------|---------|--------|
| **Andrés** — `ticket-payment-webhook` | JS-0002 ×7 | Logging noise; ensure no PII in `console` output |
| **Roberto** — partner leads API | JS-0002 in `venue-leads/route.ts` | Same |
| **Camila** — loading UX | JS-0437 in `*/loading.tsx` | Low runtime risk for static skeletons; fix for React hygiene |
| **Sofía** — task-verifier | SH-2015 / SH-2012 in `probe-disk.sh` | Wrong probe results if shell logic misfires |

### Build / deployment risks

| Check | Status |
|-------|--------|
| `npm run floor` | **Not blocked** by DeepSource today |
| DeepSource GitHub check | **Passes** on recent PRs (e.g. PR #250) |
| Report card on `main` | **A** — merge not blocked |

### False positives (document + suppress)

| Pattern | Rules | Action |
|---------|-------|--------|
| Google sample API keys in `.claude/skills/mde-maps/references/**` | SCT-1003 | `exclude_patterns` or `ignore` with `FALSE_POSITIVE` |
| Env-var documentation | SCT-1000, SCT-A000 | Exclude `plan.md`, `linear.md`, `docs/**/evidence/**` |
| ESM in `.mjs` hooks/scripts | JS-0833 | Exclude `scripts/**`, `.claude/hooks/**` or accept analyzer limit |
| `console` in Supabase edge functions | JS-0002 | Suppress for `supabase/functions/**` (server/Deno, not browser) |
| `JS-0067` global scope in bundled tooling | JS-0067 | P2; exclude non-`src/` paths from recommended gate |

---

## 7. Recommended fix order

| Phase | Priority | Work | Est. occurrences |
|-------|----------|------|------------------|
| **1** | P0 | Add `.deepsource.toml` exclude patterns for vendored Maps refs, evidence markdown, `plan.md`/`linear.md` | Clears ~88 secrets noise |
| **2** | P0 | File DeepSource ignore rules for confirmed FPs (`SCT-1003` @ `mde-maps/references`) | 15 CRITICAL → 0 |
| **3** | P1 | Fix `probe-disk.sh` SH-2015 (13) + SH-2012 (1) | 14 shell bugs |
| **4** | P1 | Replace `key={index}` in `src/app/*/loading.tsx` skeletons (JS-0437) | 12 in prod UI |
| **5** | P1 | Audit `console` in `ticket-payment-webhook` + `venue-leads` — structured logger or suppression | 11 |
| **6** | P1 | Apply autofix: PTC-W0027 (4), PY-W0078 (1) in contest script | 5 |
| **7** | P2 | Triage `JS-0339` non-null assertions in `src/mastra/tools/**` + edge shared clients | 75 major |
| **8** | P2 | Complexity/style backlog (`JS-R1005`, `JS-C1002`, `JS-0067`) — scope to `src/` only | 1,900+ |

---

## 8. Autofix candidates (safe now)

| Rule | File | Command / action |
|------|------|------------------|
| PTC-W0027 | `docs/tasks/contest/scripts/sync-ctest-linear.py` | Replace `f"..."` → `"..."` where no interpolation (4 lines) |
| PY-W0078 | same file | Use `json.load(fp)` instead of `json.loads(fp.read())` |
| PYL-W1510 | `.claude/skills/testing/scripts/with_server.py:88` | Add `check=True` **only if** non-zero exit should fail the harness |

**Do not autofix** shell or security rules without human review.

---

## 9. Commands used and results

```bash
# Auth + repo
deepsource --version
deepsource auth status
deepsource repo status --repo gh/amo-tech-ai/mdeapp -o json

# Report card + metrics + SCA
deepsource report-card --repo gh/amo-tech-ai/mdeapp -o json
deepsource metrics --repo gh/amo-tech-ai/mdeapp --default-branch -o json -l 0 -v
deepsource vulnerabilities --repo gh/amo-tech-ai/mdeapp --default-branch -o json -l 0 -v

# Full occurrence export (997 rows — CLI caps at 100 per rule in practice; MCP sums to 2,668)
deepsource issues --repo gh/amo-tech-ai/mdeapp --default-branch -o json -l 0 \
  > /tmp/deepsource-audit/issues-all.json

# Recommended slices
deepsource issues --repo gh/amo-tech-ai/mdeapp --default-branch \
  --category security,bug-risk,secrets --severity critical,major -o json -l 0
deepsource issues --repo gh/amo-tech-ai/mdeapp --default-branch \
  --category anti-pattern --severity major -o json -l 0
```

### Key CLI / MCP results

| Command / tool | Result |
|----------------|--------|
| `report-card` | Aggregate **A/100**; all dimensions A |
| `vulnerabilities` | `[]` |
| `metrics` | DCV **29.2%** JS docs; DDP **103** deps; coverage metrics empty |
| `get_repository` (MCP) | `total_count: 2668`, `recommended_count: 183`, `latest_commit_oid: e0621c7c` |
| `get_report` owasp-top-10 | **Failing**, value 5 |
| `get_report` sans-top-25 | **Failing**, value 1 |
| `get_run_report` (main run `b5501664`) | A/100 on commit `e0621c7c` |
| `list_issue_occurrences` SCT-1003 | 15 paths — all under `.claude/skills/mde-maps/references/` |

### Exported artifacts (this audit)

| File | Contents |
|------|----------|
| `docs/deepsource-export-recommended.json` | 271 recommended-ish occurrences (CLI slices A+B) |
| `docs/deepsource-export-rules-summary.json` | 54 rules aggregated with sample paths |

---

## 10. Suggested DeepSource config (P0)

Create `.deepsource.toml` at repo root (not present today):

```toml
version = 1

exclude_patterns = [
  ".claude/skills/mde-maps/references/**",
  "docs/**/evidence/**",
  "plan.md",
  "linear.md",
]

test_patterns = [
  "**/__tests__/**",
  "**/*.test.ts",
  "**/*.test.tsx",
  "**/*.spec.ts",
]
```

Then suppress remaining confirmed FPs via DeepSource dashboard or `create_ignore_rule` MCP.

---

## 11. Recommended Linear tasks

> **Superseded by §13** for the autofix queue below. Create Linear issues as `DS-### · <title>` when scheduling.

| Proposed task | Priority | Scope |
|---------------|----------|-------|
| **DeepSource P0 — exclude vendored Maps refs + evidence docs from secrets scan** | P0 | `.deepsource.toml` + ignore rules |
| **DeepSource P1 — fix task-verifier `probe-disk.sh` shell bugs (SH-2015, SH-2012)** | P1 | `.claude/skills/task-verifier/scripts/probe-disk.sh` |
| **DeepSource P1 — skeleton list keys in `src/app/*/loading.tsx` (JS-0437)** | P1 | Camila loading surfaces |
| **DeepSource P1 — edge function logging audit (`ticket-payment-webhook`, `chat-lead-capture`)** | P1 | Andrés payment path |
| **DeepSource P2 — autofix Python contest script (PTC-W0027, PY-W0078)** | P2 | `docs/tasks/contest/scripts/sync-ctest-linear.py` |
| **DeepSource P2 — triage non-null assertions in Mastra tools + edge shared clients (JS-0339)** | P2 | `src/mastra/tools/**`, `supabase/functions/_shared/**` |

---

## 13. Execution tasks — autofix queue (DS-001…DS-013)

**Source:** [DeepSource Recommended](https://app.deepsource.com/gh/amo-tech-ai/mdeapp/issues?category=recommended&page=1) @ `e0621c7c` · CLI export 2026-06-18  
**Class:** C (code hygiene) · **Owner persona:** Sofía (floor) + surface owners below  
**Dashboard rule links:** `https://app.deepsource.com/gh/amo-tech-ai/mdeapp/issue/<RULE>/`

### Tracker

| Task | Rule | Severity | Autofix | Occ | Files | Priority | Status | % |
|------|------|----------|---------|-----|-------|----------|--------|---|
| [DS-001](#ds-001--py-w0078--jsonload-instead-of-jsonloads-for-file-data) | PY-W0078 | Major | ✅ | 1 | 1 | P2 | 🟢 | 100% |
| [DS-002](#ds-002--pyl-w0612--remove-unused-python-variables) | PYL-W0612 | Major | ✅ | 5 | 2 | P2 | 🟢 | 100% |
| [DS-003](#ds-003--pyl-w0621--fix-shadowed-python-variables) | PYL-W0621 | Major | ✅ | 5 | 1 | P2 | 🟡 | 80% |
| [DS-004](#ds-004--pyl-w0714--fix-overlapping-except-clauses) | PYL-W0714 | Major | ✅ | 1 | 1 | P2 | 🟢 | 100% |
| [DS-005](#ds-005--js-0339--triage-non-null-assertions) | JS-0339 | Major | ✅ | 75 | 34 | P1 | 🟡 | 15% |
| [DS-006](#ds-006--js-0757--remove-autofocus-from-home-hero) | JS-0757 | Minor | ✅ | 1 | 1 | P2 | ⚪ | 0% |
| [DS-007](#ds-007--js-0833--exclude-or-fix-mjs-syntax-false-positives) | JS-0833 | Minor | ✅ | 50 | 50 | P0 | 🟢 | 100% |
| [DS-008](#ds-008--js-r1002--remove-unused-object-destructure) | JS-R1002 | Minor | ✅ | 1 | 1 | P2 | ⚪ | 0% |
| [DS-009](#ds-009--js-r1004--fix-useless-template-literals) | JS-R1004 | Minor | ✅ | 3 | 2 | P2 | ⚪ | 0% |
| [DS-010](#ds-010--js-w1041--simplify-complex-boolean-returns) | JS-W1041 | Major | ✅ | 16 | 12 | P1 | 🟡 | 50% |
| [DS-011](#ds-011--js-w1042--remove-trailing-undefined-args) | JS-W1042 | Minor | ✅ | 23 | 20 | P2 | ⚪ | 0% |
| [DS-012](#ds-012--sh-2045--probe-disk-glob-instead-of-ls) | SH-2045 | Major | ✅ | 1 | 1 | P1 | 🟢 | 100% |
| [DS-013](#ds-013--js-w1044--optional-chain-in-site-url) | JS-W1044 | Minor | ✅ | 1 | 1 | P2 | ⚪ | 0% |

> Full checklist with proof: [§0 Progress tracker](#0-progress-tracker-sprint-1).

**Suggested sprint order:** DS-007 (exclude noise) → DS-012 → DS-005 → DS-010 → DS-001…004 (Python batch) → DS-006, DS-008, DS-009, DS-011, DS-013.

---

### DS-001 · PY-W0078 — `json.load` instead of `json.loads` for file data

| Field | Value |
|-------|-------|
| **Rule** | [PY-W0078](https://app.deepsource.com/gh/amo-tech-ai/mdeapp/issue/PY-W0078) · Anti-pattern · Major |
| **Autofix** | ✅ DeepSource autofix |
| **Occurrences** | 1 · 1 file |
| **Paths** | `docs/tasks/contest/scripts/sync-ctest-linear.py:62` |
| **Priority** | P2 |
| **Persona** | Sofía — dev script hygiene only |
| **Fix** | Replace `json.loads(fp.read())` with `json.load(fp)` |
| **Verify** | `deepsource issues --repo gh/amo-tech-ai/mdeapp --default-branch -o json \| jq '[.[] \| select(.issue_code=="PY-W0078")]'` → `[]` |

---

### DS-002 · PYL-W0612 — Remove unused Python variables

| Field | Value |
|-------|-------|
| **Rule** | [PYL-W0612](https://app.deepsource.com/gh/amo-tech-ai/mdeapp/issue/PYL-W0612) · Anti-pattern · Major |
| **Autofix** | ✅ |
| **Occurrences** | 5 · 2 files |
| **Paths** | `docs/linear/markdown/generate.py` (×4: L72, L189, L263, L352) · `docs/tasks/contest/scripts/sync-ctest-linear.py:251` |
| **Priority** | P2 |
| **Persona** | Sofía — Linear doc generator + contest script |
| **Fix** | Remove or prefix with `_` if intentionally unused |
| **Verify** | `python3 -m py_compile docs/linear/markdown/generate.py docs/tasks/contest/scripts/sync-ctest-linear.py` |

---

### DS-003 · PYL-W0621 — Fix shadowed Python variables

| Field | Value |
|-------|-------|
| **Rule** | [PYL-W0621](https://app.deepsource.com/gh/amo-tech-ai/mdeapp/issue/PYL-W0621) · Anti-pattern · Major |
| **Autofix** | ✅ |
| **Occurrences** | 5 · 1 file |
| **Paths** | `docs/linear/markdown/generate.py` (L47, L130, L176, L250, L339) |
| **Priority** | P2 |
| **Persona** | Sofía — doc tooling |
| **Fix** | Rename inner-loop variables to avoid shadowing outer scope |
| **Verify** | Same as DS-002 |

---

### DS-004 · PYL-W0714 — Fix overlapping `except` clauses

| Field | Value |
|-------|-------|
| **Rule** | [PYL-W0714](https://app.deepsource.com/gh/amo-tech-ai/mdeapp/issue/PYL-W0714) · Anti-pattern · Major |
| **Autofix** | ✅ |
| **Occurrences** | 1 · 1 file |
| **Paths** | `.claude/skills/testing/scripts/with_server.py:30` |
| **Priority** | P2 |
| **Persona** | Sofía — test harness script |
| **Fix** | Merge or narrow overlapping exception handlers |
| **Verify** | Run harness smoke if touched; DeepSource rule cleared |

---

### DS-005 · JS-0339 — Triage non-null assertions

| Field | Value |
|-------|-------|
| **Rule** | [JS-0339](https://app.deepsource.com/gh/amo-tech-ai/mdeapp/issue/JS-0339) · Anti-pattern · Major |
| **Autofix** | ✅ (review each — do not blind apply in prod paths) |
| **Occurrences** | 75 · 34 files |
| **Hot paths** | `src/mastra/tools/search-restaurants.ts` · `search-rentals.ts` · `search-events.ts` · `supabase/functions/_shared/supabase-clients.ts` · `supabase/functions/chat-lead-capture/index.ts` · `src/app/api/grounded/search/route.ts` · 10× `src/mastra/tools/__tests__/search-events-logic.test.ts` |
| **Also** | `e2e/**` (7 specs) · `src/platform/copilot/__tests__/**` |
| **Priority** | P1 |
| **Persona** | Camila — concierge tools + Andrés edge fns if assertions hide null bugs |
| **Fix** | Replace `!` with guards, optional chaining, or typed narrowing; keep in tests only where intentional |
| **Verify** | `npm test -- --run search-events` · `npm test -- --run grounded` · targeted vitest for touched files |

---

### DS-006 · JS-0757 — Remove `autoFocus` from home hero

| Field | Value |
|-------|-------|
| **Rule** | [JS-0757](https://app.deepsource.com/gh/amo-tech-ai/mdeapp/issue/JS-0757) · Anti-pattern · Minor |
| **Autofix** | ✅ |
| **Occurrences** | 1 · 1 file |
| **Paths** | `src/components/home/home-hero.tsx:73` |
| **Priority** | P2 |
| **Persona** | Camila — `/` marketing hero (a11y) |
| **Fix** | Remove `autoFocus` or move focus management to intentional keyboard flow |
| **Verify** | Browser: `/` loads without focus trap; no regression on chat CTA |

---

### DS-007 · JS-0833 — Exclude or fix `.mjs` syntax false positives

| Field | Value |
|-------|-------|
| **Rule** | [JS-0833](https://app.deepsource.com/gh/amo-tech-ai/mdeapp/issue/JS-0833) · Bug risk · Minor |
| **Autofix** | ✅ (prefer **exclude** over mass edits) |
| **Occurrences** | 50 · 50 files |
| **Paths** | `.claude/hooks/*.mjs` · `scripts/*.mjs` · `scripts/check-mastra.mjs` · hooks `_deferred/*` |
| **Priority** | P0 |
| **Persona** | Sofía — CI signal; **not** a real syntax bug (TS/ESM in `.mjs`) |
| **Fix** | Add to `.deepsource.toml` `exclude_patterns`: `scripts/**`, `.claude/hooks/**` OR rename analyzer dialect; **do not** “fix” 50 hooks |
| **Verify** | `deepsource issues ... \| jq '[.[] \| select(.issue_code=="JS-0833")]'` → `[]` after exclude |

---

### DS-008 · JS-R1002 — Remove unused object destructure

| Field | Value |
|-------|-------|
| **Rule** | [JS-R1002](https://app.deepsource.com/gh/amo-tech-ai/mdeapp/issue/JS-R1002) · Anti-pattern · Minor |
| **Autofix** | ✅ |
| **Occurrences** | 1 · 1 file |
| **Paths** | `src/lib/browse/browse-pin-converters.ts:9` |
| **Priority** | P2 |
| **Persona** | Camila — map pin conversion |
| **Fix** | Drop unused destructured fields |
| **Verify** | `npm test -- --run browse-pin` |

---

### DS-009 · JS-R1004 — Fix useless template literals

| Field | Value |
|-------|-------|
| **Rule** | [JS-R1004](https://app.deepsource.com/gh/amo-tech-ai/mdeapp/issue/JS-R1004) · Anti-pattern · Minor |
| **Autofix** | ✅ |
| **Occurrences** | 3 · 2 files |
| **Paths** | `scripts/verify-grounding-enrichment.mjs:95,98` · `src/lib/__tests__/dist-leak-scan-hook.test.ts:168` |
| **Priority** | P2 |
| **Persona** | Sofía — verify script + hook test |
| **Fix** | Replace `` `literal` `` with `'literal'` where no interpolation |
| **Verify** | `node scripts/verify-grounding-enrichment.mjs --help` (if applicable) · vitest dist-leak test |

---

### DS-010 · JS-W1041 — Simplify complex boolean returns

| Field | Value |
|-------|-------|
| **Rule** | [JS-W1041](https://app.deepsource.com/gh/amo-tech-ai/mdeapp/issue/JS-W1041) · Anti-pattern · Major |
| **Autofix** | ✅ (review — classifiers are sensitive) |
| **Occurrences** | 16 · 12 files |
| **Paths** | `src/lib/event-query-classifier.ts` · `src/lib/restaurant-query-classifier.ts` · `src/lib/flash-route-classifier.ts` · `src/lib/event-venue-booking-intent.ts` · `src/lib/sanitize-assistant-chat-content.ts` · `src/mastra/lib/search-intent-router.ts` · `src/mastra/lib/intelligence-event-search.ts` · `src/mastra/tools/search-rentals.ts` · `src/mastra/tools/search-grounded-places.ts` · `supabase/functions/_shared/http.ts` · others |
| **Priority** | P1 |
| **Persona** | Camila — intent routing; Tourist — restaurant/event classification |
| **Fix** | Extract predicate variables or early returns; keep behavior identical |
| **Verify** | `npm test -- --run classifier` · `npm test -- --run search-intent` |

---

### DS-011 · JS-W1042 — Remove trailing `undefined` arguments

| Field | Value |
|-------|-------|
| **Rule** | [JS-W1042](https://app.deepsource.com/gh/amo-tech-ai/mdeapp/issue/JS-W1042) · Anti-pattern · Minor |
| **Autofix** | ✅ |
| **Occurrences** | 23 · 20 files |
| **Paths** | Mostly `**/__tests__/**` and `src/lib/chat/thread-nav-context.tsx:25` · `src/mastra/lib/storage.ts:1` |
| **Priority** | P2 |
| **Persona** | Sofía — test hygiene; Camila if `thread-nav-context` touched |
| **Fix** | Remove trailing `, undefined)` in mocks/calls |
| **Verify** | `npm test -- --run thread-nav` · floor on touched packages |

---

### DS-012 · SH-2045 — `probe-disk.sh` glob instead of `ls`

| Field | Value |
|-------|-------|
| **Rule** | [SH-2045](https://app.deepsource.com/gh/amo-tech-ai/mdeapp/issue/SH-2045) · Bug risk · Major |
| **Autofix** | ✅ (review shell semantics) |
| **Occurrences** | 1 · 1 file |
| **Paths** | `.claude/skills/task-verifier/scripts/probe-disk.sh:124` |
| **Priority** | P1 |
| **Persona** | Sofía — task-verifier disk probe accuracy |
| **Fix** | Replace `for f in $(ls …)` with `glob` / `find` pattern per shellcheck |
| **Verify** | `bash .claude/skills/task-verifier/scripts/probe-disk.sh` (dry run) · pair with SH-2015/SH-2012 fixes |

---

### DS-013 · JS-W1044 — Optional chain in `site-url`

| Field | Value |
|-------|-------|
| **Rule** | [JS-W1044](https://app.deepsource.com/gh/amo-tech-ai/mdeapp/issue/JS-W1044) · Anti-pattern · Minor |
| **Autofix** | ✅ |
| **Occurrences** | 1 · 1 file |
| **Paths** | `src/lib/auth/site-url.ts:19` |
| **Priority** | P2 |
| **Persona** | Andrés/Roberto — auth redirect base URL |
| **Fix** | Refactor `a && a.b` → `a?.b` where equivalent |
| **Verify** | `npm test -- --run site-url` (or auth lib tests) |

---

## 12. Bottom line

DeepSource is **installed, authenticated, and scanning** `mdeapp` on every `main` push. Sprint 1 (**54%** of DS-001…013 by task weight) lands `.deepsource.toml` excludes, probe-disk shell fixes, production-path `!` triage, classifier simplification, and Python script hygiene — **109/109** targeted vitest green. **Dashboard delta pending** merge + re-scan. **Sofía’s next move:** merge `ai/chore-deepsource-fixes`, confirm Recommended count drops, then DS-005/010 remainder + DS-006/008/009/011/013 batch.
