# SAN-586 — public events list API evidence (2026-06-06)

| Check | Result |
|-------|--------|
| PR #84 Floor CI | PASS |
| Vitest `list-published-events.test.ts` | PASS (3/3) |
| `GET /api/events/public` | See curl below |

## Curl (after merge @ `f1da6f3`)

```bash
# Local (dev server on :3001)
curl -s "http://localhost:3001/api/events/public?dateWindow=any&limit=5" | jq '{total, count: (.results|length), first: .results[0].title}'

# Prod (post-deploy)
curl -s "https://www.mdeai.co/api/events/public?dateWindow=any&limit=5" | jq '{total, count: (.results|length)}'
```

PR: https://github.com/amo-tech-ai/mdeapp/pull/84  
Merge: `f1da6f3`
