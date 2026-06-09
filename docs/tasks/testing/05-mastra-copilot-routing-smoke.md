# 05 — Mastra + CopilotKit routing smoke

## Automated

```bash
node tasks/testing/scripts/mastra-routing-smoke.mjs --base http://localhost:3001
```

Covers: `canFastPathRentalSearch`, `canFastPathEventSearch`, café grounding filters, CopilotKit POST, rental/events APIs.

## Browser (Chrome DevTools / Cursor Browser)

Per prompt, verify network + UI:

| Prompt | Expected route |
|--------|----------------|
| `1BR in Laureles under $80/night` | rental fast-path → `/api/rentals/search` |
| Events chip → Show all | event fast-path → `/api/events/search` |
| `Quiet cafés near Laureles` | grounded places / ADK |
| `list events medellin` (no category) | clarify, no cards |
| Rental with Events chip active | **must not** return "No events matched" |

Record: `/api/copilotkit` status, fetch errors, console errors, response time.
