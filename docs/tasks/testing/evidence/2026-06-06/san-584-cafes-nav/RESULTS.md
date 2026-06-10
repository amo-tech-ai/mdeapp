# SAN-584 — Cafés nav enable (SCR-002b)

**Merge:** PR #89 → `main` @ `7db2282`  
**Date:** 2026-06-06  
**Linear:** SAN-584 (cafés checklist item)

## Change

| Item | Before | After |
|------|--------|-------|
| `EXPLORE_ITEMS` cafés | `href: null` (Coming soon) | `href: "/cafes"` |
| Rentals | `href: null` | unchanged |
| Events | `href: "/events"` | unchanged (PR #87) |

**File:** `mdeapp/src/components/chat/chat-nav-rail.tsx`

## Tests

| Check | Result |
|-------|--------|
| Floor CI (PR #89) | PASS |
| Playwright SCREEN-028 (incl. nav test) | 4/4 PASS |
| Prod `GET /cafes` | **200** |
| Prod `/` Cafés nav is live link | PASS (no `aria-disabled`; `href="/cafes"`) |

## Prod smoke (2026-06-06 post-merge)

```bash
curl -s -o /dev/null -w "GET /cafes -> %{http_code}\n" https://www.mdeai.co/cafes  # 200
curl -s https://www.mdeai.co/ | grep 'href="/cafes"'  # nav link present
```

Browser: `https://www.mdeai.co/` → Explore **Cafés** → `/cafes` catalog.

## Audit

PR #89 audit score **96/100** — merged, scope clean (no Mastra/CK/data).

## Unblocks

- Tourist persona: sidebar → cafés catalog without chat
- SCREEN-028 nav journey satisfied on prod

## Related

- Events nav: `../san-584/RESULTS.md` (PR #87)
- Next e2e hygiene: VEN-035 cafés placeholder test → live grid (post PR #89)
