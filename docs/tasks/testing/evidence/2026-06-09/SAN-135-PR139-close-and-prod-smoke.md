# SAN-135 — PR #139 close + prod smoke + approval-commit redeploy

**Date:** 2026-06-09  
**Linear:** SAN-135 · AIE-024 · EVP-032  
**PR #139:** closed as superseded by [#138](https://github.com/amo-tech-ai/mdeapp/pull/138)

---

## Summary

PR #139 had **zero content delta** vs `main` (identical git trees). Closed safely. `approval-commit` edge function redeployed. Prod smoke on canonical event page **PASS**.

---

## Task 1 — Verify + close PR #139

| Check | Result |
|-------|--------|
| `git diff origin/main origin/ai/san-135-…` (two-dot) | **0 lines** |
| Tree hash `origin/main` vs PR head | **identical** `8ebeaace…` |
| PR state | **CLOSED** with supersede comment |

**Close comment posted:**

> Closing as superseded by PR #138. SAN-135 already landed on main. No code delta remains.

**Note:** 11 unresolved CodeRabbit/cubic threads left as-is (not required for close; ruleset blocked merge only while PR was open).

---

## Task 2 — Redeploy `approval-commit`

```bash
cd mdeapp && infisical run --silent --env=dev --path=/ -- \
  supabase functions deploy approval-commit --project-ref zkwcbyxiwklihegjhuql
```

| Result | Detail |
|--------|--------|
| **PASS** | Bundled 63.62kB · deployed to `zkwcbyxiwklihegjhuql` |
| Effect | New host-wizard publishes now snapshot `details.host_display` from `profiles` |

---

## Task 3 — Production smoke

**URL:** https://www.mdeai.co/events/reina-de-antioquia-2026-finals

### Tier 1 (curl)

| Check | Result |
|-------|--------|
| GET `/` | **200** |
| GET event detail | **200** |
| `chat-smoke.mjs --base https://www.mdeai.co` | **All checks passed** |

### Tier 2 (Browser MCP)

| Assert | Result |
|--------|--------|
| Page title | Reina de Antioquia 2026 Finals · mdeai |
| `[data-testid="event-host-block"]` in HTML | **present** |
| `[data-testid="event-venue-section"]` in HTML | **present** |
| A11y "Hosted by" region | **Ana Martinez** |
| A11y "Venue" region | **Hotel Intercontinental — Salón Real** |
| Ticket tiers (GA/VIP/Backstage/Frontrow) | **visible** |
| Checkout CTA | **Buy tickets** present |

### Screenshots

- `prod-san135-reina-finals.png` — hero + tickets column
- `prod-san135-reina-finals-host-venue.png` — About + Venue + tier buy buttons

---

## Task 4 — Optional polish PR (not created)

Deferred small normalization fixes on `main` (separate PR if desired):

- `build-event-insert.ts`: `avatar_url` → `trim() || null`
- Backfill migration: `trim(p.full_name)`, `nullif(trim(p.avatar_url),'')`
- `get-public-event.ts`: remove unused `venue_id` from `EventRow` type

---

## Task 5 — SAN-492

**Not touched** per instructions. Data model revision continues in planning; no migration SQL in this session.

---

## Verdict

| Item | Status |
|------|--------|
| PR #139 | ✅ Closed (superseded) |
| SAN-135 on `main` | ✅ Shipped (#138) |
| `approval-commit` prod | ✅ Redeployed |
| Prod event detail smoke | ✅ PASS |
| Normalization polish | ⏳ Optional follow-up PR |

**SAN-135 operational gate: closed.**
