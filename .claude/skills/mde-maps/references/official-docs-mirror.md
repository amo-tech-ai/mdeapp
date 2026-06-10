# Offline vendor mirrors (`references/google-offline/`, `references/places-official/`)

Vendor HTML→Markdown exports used for **local grep**, **offline** work, and diffing wording. They are **not** the curated product guides (`places-api-web-service.md`, `places-api-new.md`, `maps-js-api.md`, etc.). **Places** full-text exports live under **`places-official/`**; **MCP / Map ID / security** mirrors stay under **`google-offline/`**.

## Source-of-truth priority

1. **Live vendor URLs** — `https://developers.google.com/maps/...`
2. **Curated skill references** — `references/places-api-web-service.md` (Places New **doc index + rules**), `references/places-api-new.md` (Node examples), `references/maps-js-api.md`, `references/maps-grounding.md`, …
3. **Vendor exports** — `references/google-offline/*.md` and `references/places-official/*.md` — if (1) or (2) disagrees with a mirror, **trust (1) then (2)**.

## Index (`google-offline/`)

Files in **`google-offline/`** include YAML `frontmatter` (`doc_type: google_offline_mirror`, `topic`, `parent_skill: mde-maps`) where noted per file.

| File | Use for |
|------|---------|
| [`google-offline/grounding-lite.md`](google-offline/grounding-lite.md) | Grounding Lite overview, billing concepts |
| [`google-offline/mcp.md`](google-offline/mcp.md) | MCP overview for Maps Grounding Lite |
| [`google-offline/mcp-overview-alt-export.md`](google-offline/mcp-overview-alt-export.md) | Alternate MCP export — diff against `mcp.md` |
| [`google-offline/search_places.md`](google-offline/search_places.md) | MCP `search_places` reference |
| [`google-offline/compute_routes.md`](google-offline/compute_routes.md) | MCP `compute_routes` reference |
| [`google-offline/attribution.md`](google-offline/attribution.md) | Grounding Lite attribution (MASTRA-066) |
| [`google-offline/mapid-over.md`](google-offline/mapid-over.md) | Map ID / Advanced Markers (MASTRA-068) |
| [`google-offline/maps-grounding.md`](google-offline/maps-grounding.md) | Gemini / Maps grounding widget + JS cross-links |
| [`google-offline/api-security-best-practices.md`](google-offline/api-security-best-practices.md) | Key restriction patterns |
| [`google-offline/optimization-guide.md`](google-offline/optimization-guide.md) | Performance / loading |
| [`google-offline/url-encoding.md`](google-offline/url-encoding.md) | URL encoding for Maps requests |
| [`google-offline/digital-signature.md`](google-offline/digital-signature.md) | Signed requests / Static Maps |
| [`google-offline/demo-key.md`](google-offline/demo-key.md) | Demo Map ID / dev keys |
| [`google-offline/overview.md`](google-offline/overview.md) | Maps Platform overview |
| [`google-offline/supported-products.md`](google-offline/supported-products.md) | MCP product list (Code Assist vs Grounding Lite endpoints) |
| [`google-offline/code-assist.md`](google-offline/code-assist.md) | Maps Platform Code Assist (dev MCP) |
| [`google-offline/configure-mcp-ai-application.md`](google-offline/configure-mcp-ai-application.md) | Generic MCP + OAuth scope patterns |
| [`google-offline/gemini-cli.md`](google-offline/gemini-cli.md) | Gemini CLI notes |

### Places API (New) + UI Kit — full-text exports (`places-official/`)

| Index | Contents |
|-------|----------|
| [`places-official/README.md`](places-official/README.md) | Places Web Service exports, UI Kit, Contextual View — **moved from skill root `*.md.md`** |

Do not commit new scraped pages to `mde-maps/` root — add them under **`references/places-official/`** with a single `.md` suffix and index row.

---

### Places API (New) Web Service — curated hub (not a vendor mirror)

| File | Use for |
|------|---------|
| [`places-api-web-service.md`](places-api-web-service.md) | Official URL index, field-mask / Colombia rules, task crosswalk (**073–081**) |

Optional future work: add more exports under **`places-official/`** only; keep **`google-offline/`** for MCP / platform topics.

---

## Maintenance

- **Refresh:** Re-export from Google when shipping **PLACES-005-010 / 049 / 066–069 / 073–081** if API text changed; then reconcile curated `references/*.md`.
- **Do not** commit scraped pages to the **skill root** or outside **`google-offline/`** and **`places-official/`** — keeps `SKILL.md` uncluttered (progressive disclosure).
