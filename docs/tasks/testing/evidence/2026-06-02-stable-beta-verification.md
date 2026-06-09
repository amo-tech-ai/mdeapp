# Stable Beta verification — 2026-06-02

**Verifier:** agent · **Skills:** `task-verifier`, `mdeai-testing`  
**Prod SHA:** `4de18f1` (matches Vercel Production deploy 2026-06-02T13:26:17Z)

## Summary

| Gate | Result |
|------|--------|
| `npm run floor` | ✅ exit 0 — 101 files, 436 tests |
| Vercel prod `GET /` | ✅ 200 |
| Prod `POST /api/copilotkit` | ✅ 400 (runtime alive) |
| Prod `chat-smoke.mjs` | ✅ exit 0 |
| Local dev `chat-smoke.mjs` | ✅ exit 0 (3 slow WARN >2.5s) |
| Floor CI (`floor.yml`) | ✅ success on main |
| Branch protection | 🔴 not configured (GH API 404) |
| Soak SAN-462 | 🟡 **1/3** scheduled — run [26820069434](https://github.com/amo-tech-ai/mdeapp/actions/runs/26820069434) |

**Stable Beta signed off:** ❌ — need 2 more **scheduled** synthetics + branch protection admin.

---

## Commands run

```bash
cd /home/sk/mdeai/mdeapp && npm run floor
node /home/sk/mdeai/tasks/testing/scripts/chat-smoke.mjs --base https://www.mdeai.co
# dev restart:
cd /home/sk/mdeai/mdeapp && npm run dev
node /home/sk/mdeai/tasks/testing/scripts/chat-smoke.mjs --base http://localhost:3001
npm test -- card-interaction-props cafe-result-card
```

---

## Floor (local)

- lint, typecheck, build, test, audit — **all passed**
- audit: 18 transitive advisories (moderate/low); `--audit-level=high` passes per project config

---

## Production smoke

```
PASS  GET / — 200
PASS  POST /api/copilotkit (empty) — 400
PASS  POST /api/rentals/search — 5 results
PASS  POST /api/events/search — 10 results
PASS  GET /api/places/detail invalid/missing — 400
All checks passed
```

---

## Local smoke (fresh dev :3001)

- UI Ready + Mastra Studio :4111
- `chat-smoke.mjs` — all PASS (cold-start slowness WARN on `/` and rentals)

---

## UX-020 unit

```
npm test -- card-interaction-props cafe-result-card
2 files, 3 tests passed
```

---

## Blockers (human / wait)

1. **SAN-458** — enable `Floor / floor` on `main` ([`tasks/PR/docs/16-branch-protection.md`](../../PR/docs/16-branch-protection.md))
2. **SAN-462** — 2 more scheduled prod synthetic greens (~09:00 UTC)
3. **UX-023+** — do not start until soak 3/3

---

## Tracker

[`tasks/PR/PROGRESS-TRACKER.md`](../../PR/PROGRESS-TRACKER.md) · [`tasks/PR/NOTES/notes-9.md`](../../PR/NOTES/notes-9.md)
