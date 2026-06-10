# Best Setup: Chatwoot + Claude Code

Use **3 layers**:

| Layer | Tool                | Purpose                                                           |
| ----- | ------------------- | ----------------------------------------------------------------- |
| 1     | **Chatwoot CLI**    | Claude Code can inspect/reply/manage Chatwoot from terminal       |
| 2     | **Chatwoot MCP**    | Gives Claude structured tools for contacts/conversations/messages |
| 3     | **chatwoot-skills** | Teaches Claude Code how to use the Chatwoot MCP tools correctly   |

# What Each Link Does

| Link                          | What It Is                                | Use It?              |
| ----------------------------- | ----------------------------------------- | -------------------- |
| `developers.chatwoot.com/cli` | Official Chatwoot terminal client         | **Yes**              |
| `hugoblanc/chatwoot-mcp`      | MCP server for Chatwoot API               | **Yes**              |
| `fazer-ai/chatwoot-skills`    | Claude Code skills for Chatwoot MCP tools | **Yes**              |
| `chatwoot/chatwoot`           | Main self-hosted app                      | Yes, if self-hosting |
| `chatwoot-sdk-python`         | Python API SDK                            | Optional             |
| `fazer-ai/n8n-nodes-chatwoot` | n8n Chatwoot trigger node                 | Optional automation  |

Chatwoot’s CLI lets terminal agents like Claude Code read conversations, reply, assign, resolve, and search help-center content from the terminal. ([developers.chatwoot.com][1]) The `chatwoot-mcp` repo exposes Chatwoot conversations, messages, and contacts to AI assistants through MCP. ([GitHub][2]) The `chatwoot-skills` repo is designed to teach Claude Code how to use the Chatwoot MCP tools effectively. ([GitHub][3])

# Recommended Architecture

```text
Claude Code
├─ Chatwoot CLI        → quick terminal commands
├─ Chatwoot MCP        → structured tool access
└─ chatwoot-skills     → better Claude behavior

Chatwoot
├─ WhatsApp inbox
├─ web chat inbox
├─ contacts
├─ conversations
└─ human agents

Mastra
└─ AI workflows for rentals/restaurants/nightlife
```

# Best Practical Use Cases

| Use Case               | Example                                           |
| ---------------------- | ------------------------------------------------- |
| Inspect leads          | “Show new WhatsApp rental leads today”            |
| Reply to customers     | “Reply asking for budget and move date”           |
| Assign broker          | “Assign Laureles leads to Broker A”               |
| Summarize conversation | “Summarize this lead for Patricia”                |
| Label conversations    | “Tag high-budget expat leads”                     |
| Escalate to human      | “Mark this as human review needed”                |
| Sync with Supabase     | “Create lead row from this Chatwoot conversation” |

# Best Setup Order

## 1. Install Chatwoot CLI

```bash
curl -fsSL https://chwt.app/install-cli | sh
chatwoot --help
```

## 2. Add Chatwoot credentials

You need:

* Chatwoot URL
* account ID
* API access token

## 3. Add Chatwoot MCP to Claude Code

Use the MCP server from:

```text
https://github.com/hugoblanc/chatwoot-mcp
```

## 4. Add fazer Chatwoot skills

Use:

```text
https://github.com/fazer-ai/chatwoot-skills
```

This helps Claude Code understand Chatwoot workflows better.

# Best Final Setup for mdeai

```text
Chatwoot = communication + inbox
Claude Code = operator/dev assistant
Mastra = AI customer workflow brain
Supabase = marketplace truth
WhatsApp = customer channel
```

# Simple Verdict

Yes — this is a strong setup.

For mdeai, the best combo is:

```text
Chatwoot MCP
+ Chatwoot CLI
+ chatwoot-skills
+ Mastra
+ Supabase
```

Use it to manage rental leads, restaurant bookings, nightlife requests, and human handoff from Claude Code.

[1]: https://developers.chatwoot.com/cli?utm_source=chatgpt.com "Chatwoot CLI"
[2]: https://github.com/hugoblanc/chatwoot-mcp?utm_source=chatgpt.com "hugoblanc/chatwoot-mcp: MCP server for ..."
[3]: https://github.com/fazer-ai/chatwoot-skills?utm_source=chatgpt.com "fazer-ai/chatwoot-skills"
