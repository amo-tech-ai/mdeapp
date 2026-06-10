---
doc_type: skill_reference_index
parent_skill: mde-maps
topic: places-official-exports
description: >-
  Vendor Markdown exports (Places API New + Places UI Kit + Contextual View) moved from
  skill root `*.md.md` into this folder. Each export file includes YAML frontmatter
  (`doc_type: places_official_mirror`, `topic`, `description`). Tertiary to live
  developers.google.com — verify billing and schemas before ship.
---

# `places-official/` — Places doc exports (offline)

**SoT priority:** live `developers.google.com` → [`places-api-web-service.md`](../places-api-web-service.md) / [`places-api-new.md`](../places-api-new.md) → **this folder**.

## Index — Places API (New) Web Service

| File (local) | Topic | Typical tasks |
|--------------|--------|-----------------|
| [`places-op-overview.md`](places-op-overview.md) | Places API (New) overview, API list | 073, 048, 081 |
| [`places-get-started.md`](places-get-started.md) | Get started / setup pointers | 048 |
| [`places-text-search.md`](places-text-search.md) | Text Search (New); nearby-related sections | 048, 073, 075 |
| [`places-place-autocomplete.md`](places-place-autocomplete.md) | Place Autocomplete (New), sessions | 078, 073 |
| [`places-session-pricing.md`](places-session-pricing.md) | Autocomplete session billing | 078, 073, 074 |
| [`places-place-details.md`](places-place-details.md) | Place Details (New) | 076, 073 |
| [`places-place-photos.md`](places-place-photos.md) | Place Photos (New) | 077, 073 |
| [`places-place-types.md`](places-place-types.md) | Place types tables | 075, 073 |
| [`places-place-id.md`](places-place-id.md) | Place IDs | 048, 067, 076 |
| [`places-data-fields.md`](places-data-fields.md) | Field paths, SKUs (long) | **073**, 067, 080 |
| [`places-choose-fields.md`](places-choose-fields.md) | Choosing / shaping field lists | 073 |
| [`places-place-class-data-fields.md`](places-place-class-data-fields.md) | Place class field reference | 073 |

## Index — Places UI Kit (JavaScript; not server `@googlemaps/places`)

Use when implementing **browser** Place UI components — still **no** server Places key in client.

| File | Topic | Notes |
|------|--------|--------|
| [`places-ui-kit-overview.md`](places-ui-kit-overview.md) | UI Kit intro | MASTRA-070 / future UI only |
| [`places-ui-kit-ai-powered-summaries.md`](places-ui-kit-ai-powered-summaries.md) | AI summaries in UI Kit | US-heavy features — align with PRD Colombia rules |
| [`places-ui-kit-basic-autocomplete.md`](places-ui-kit-basic-autocomplete.md) | Basic autocomplete element | vs server Place Autocomplete (New) **078** |
| [`places-ui-kit-custom-styling.md`](places-ui-kit-custom-styling.md) | Custom styling | |
| [`places-ui-kit-customization-tool.md`](places-ui-kit-customization-tool.md) | Customization tool | |
| [`places-ui-kit-place-icons.md`](places-ui-kit-place-icons.md) | Place icons | |
| [`places-ui-kit-place-list.md`](places-ui-kit-place-list.md) | Place list / search UI | |
| [`places-ui-kit-layers.md`](places-ui-kit-layers.md) | Layers | |

## Index — Maps JavaScript (Contextual View)

| File | Topic | Tasks |
|------|--------|--------|
| [`places-maps-contextual-view.md`](places-maps-contextual-view.md) | Contextual View (pre-GA) | **070** — do not ship widget until GA |

## Changelog

| Date | Change |
|------|--------|
| 2026-05-13 | Moved from `.claude/skills/mde-maps/*.md.md` skill root; removed duplicate `place-details (1)` / `place-types (1)`; added this index. |
| 2026-05-13 | Added YAML frontmatter (`doc_type: places_official_mirror`) to every export `.md` (not counting this README). |
