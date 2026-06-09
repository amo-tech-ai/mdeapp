Reading the strategy doc and current task list in parallel.

Comparing: C7 and C14 are in the strategy doc but have no task files. Let me check the scripts folder and Chatwoot plan before touching `.mcp.json`.

Let me check one script to understand the pattern, then look at what Chatwoot MCP options exist.

`chatwoot-mcp` v0.2.9 exists on npm. The missing tasks are **C7** and **C14** (both Chatwoot-blocked). I'll also add CW-1→CW-5 as a proper prerequisite track, update `.mcp.json`, and create the script — all in parallel.

Now add the Chatwoot entry to `.mcp.json` and write the CW-1→CW-5 prerequisite track files in parallel.

Now writing the CW-1→CW-5 prerequisite track. Let me read the rest of the Chatwoot plan for the infrastructure details.

Now writing the CW-1→CW-5 prerequisite track in one batch.

Now update the INDEX.md to add the CW track section and fix the C7/C14 stubs.

Let me do a final check on the complete file list and the `.mcp.json`.

Everything is in place. Here's what was done:

---

**Missing CORE tasks added (from strategy doc):**

- [C7-marketing-agent-whatsapp.md](tasks/revenue/C7-marketing-agent-whatsapp.md) — `marketingAgent` with `gen_content` (Gemini) + `wa_campaign` (24h window enforced) + `schedule_post` tools. Supervisor-activated from `conciergeAgent`. Requires CW-3 to deliver.
- [C14-abandoned-cart-whatsapp-recovery.md](tasks/revenue/C14-abandoned-cart-whatsapp-recovery.md) — Two recovery paths: `checkout.session.expired` Stripe webhook (2h nudge) + daily cron for stale rental leads (48h). Uses Meta-approved templates since 24h window is always closed for expired sessions.

---

**Chatwoot prerequisite track (CW-1→CW-5) — new files:**

| File | What it does |
|------|-------------|
| [CW-1](tasks/revenue/CW-1-deploy-chatwoot.md) | Hetzner CPX31 + Coolify + Postgres/Redis/S3 — Chatwoot live at `chat.mdeai.co` |
| [CW-2](tasks/revenue/CW-2-whatsapp-cloud-api-inbox.md) | WhatsApp Cloud API inbox + WABA verification + 4 pre-approved templates submitted |
| [CW-3](tasks/revenue/CW-3-chatwoot-bridge.md) | `/api/chatwoot-bridge` — HMAC-verified n8n→Mastra pipeline; 24h window check; `needs_human` routing |
| [CW-4](tasks/revenue/CW-4-contact-conversation-mirror.md) | `chatwoot_contacts` + `chatwoot_conversations` Supabase mirror tables for agent context + Patricia analytics |
| [CW-5](tasks/revenue/CW-5-g2-lead-capture-hook.md) | Calls existing G2 `chat-lead-capture` edge fn with `source: 'whatsapp'` — WhatsApp leads billed by C4 same as web |

---

**Chatwoot MCP plugin:**
- [scripts/mcp-chatwoot.sh](scripts/mcp-chatwoot.sh) — runs `chatwoot-mcp@latest` (npm v0.2.9)
- [`.mcp.json`](.mcp.json) — new `"chatwoot"` entry; reads `CHATWOOT_URL` + `CHATWOOT_API_TOKEN` from environment. Add both to `.env.local` once CW-1 ships.