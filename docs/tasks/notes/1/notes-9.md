## Audit summary

### 1. Files changed

**Slice A — process/tooling (committed `d006503` in `mdeapp`)**

| File | Role |
|------|------|
| `mdeapp/scripts/verify-task.mjs` | Task-scoped floor + vitest/e2e/smoke runner |
| `mdeapp/scripts/verify-task.md` | Usage docs |
| `mdeapp/.github/pull_request_template.md` | PR checklist |
| `mdeapp/package.json` | `verify:task`, `test:e2e:prod-venues-journey` |
| `mdeapp/e2e/prod-venues-journey.spec.ts` | J05–J08 prod Playwright (OPS-JOURNEY registry) |

**Slice A — playbook (committed `d9beb1a` in parent repo)**

| File | Role |
|------|------|
| `tasks/notes/improve.md` | Operator playbook (new file) |

**Slice B — planning queue (committed `e49b93a` in parent repo)**

| File | Role |
|------|------|
| `tasks.md` | Full launch queue with use-case column (new file, 295 lines) |

**Left unstaged (correctly excluded)**

| File | Why excluded |
|------|----------------|
| `mdeapp/scripts/prove-ven-020-status-fetch.mjs` | VEN-020 proof script — product/venue slice, not process |
| `tasks/notes/audit-linear.md` | Separate audit artifact, not in scope |

**No `mdeapp/src/**` changes** — runtime code untouched.

---

### 2. Validation results

| Command | Result |
|---------|--------|
| `npm run lint` | ✅ pass |
| `npm run typecheck` | ✅ pass |
| `npm run verify:task -- VEN-020 --skip-floor` | ✅ PASS (3 vitest) |
| `npm run verify:task -- OPS-JOURNEY --skip-floor` | ✅ PASS (prod e2e **skipped** with warning; chat-smoke green) |
| `npm run floor` | ✅ pass (488 vitest, build green) |

---

### 3. Risks

| Risk | Severity | Detail |
|------|----------|--------|
| **OPS-JOURNEY prod tests skip locally** | Low | Expected — warning prints `PROD_SMOKE_BASE_URL=…` hint |
| **`tasks.md` is net-new to git** | Medium | Not a diff of old queue — full add; harder to review in PR |
| **SCREEN-018 row 42** | Medium | Still 🟡 55% + links SAN-521; Linear SAN-489 is **Done** (#51) — doc drift, not fixed in this commit |
| **MOB-CK-001 vs SCREEN-018** | Low | Rows 42–43 both point at SAN-521; row 42 should likely be SAN-489 |
| **Parent repo branch** | Info | Commits landed on `docs/venues-index-canonical-order`, not `main` |
| **`prove-ven-020` left uncommitted** | Info | Fine for now; belongs in a future VEN-020 evidence commit if kept |

**Done statuses in `tasks.md` — spot-checked with proof:**

| Task | Claim | Proof |
|------|-------|-------|
| DATA-041 🟢 | ✅ | SAN-379 Done, merged work |
| SEARCH-003 🟢 | ✅ | In Done section + evidence |
| VEN-012/021/020 🟢 | ✅ | PRs #48, #53, #55 on `main` |
| Commerce D1–D5 ⏸ | ✅ | Deferred, not marked Done |

---

### 4. Recommended PR split

| PR | Repo | Branch | Files | Title |
|----|------|--------|-------|-------|
| **PR-A** | `mdeapp` | `main` (or `ai/san-process-verify-task`) | 5 tooling files | `chore(process): improve verify-task workflow and PR checklist` |
| **PR-B** | `mdeai` | `docs/venues-index-canonical-order` | `improve.md` + `tasks.md` | Split optional: playbook first, then queue — or **one docs PR** since both are planning-only |

**Do not** include `prove-ven-020-status-fetch.mjs` in either PR.

---

### 5. Commits made

**`mdeapp`** — `d006503`
```
chore(process): improve verify-task workflow and PR checklist
```

**Parent `/home/sk/mdeai`** — two commits on `docs/venues-index-canonical-order`:
- `d9beb1a` — `chore(process): improve verify-task workflow and PR checklist` (`improve.md`)
- `e49b93a` — `docs(tasks): add real-world use cases to launch queue` (`tasks.md`)

**Why clean enough to commit:** no runtime diffs, verify-task is additive orchestration only, queue hints script untouched (read-only), PR template is 37 lines, `tasks.md` tables render correctly, use cases are persona + Medellín concrete.

**Follow-up (not done):** fix row 42 SCREEN-018 → SAN-489 / Done % in a separate docs patch after you confirm; commit or drop `prove-ven-020-status-fetch.mjs`.