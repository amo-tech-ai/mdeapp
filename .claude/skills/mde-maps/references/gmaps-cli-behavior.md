---
title: gmaps.py — operator behavior (from legacy google-maps-api skill)
canonical_skill: mde-maps
---

# `gmaps.py` — critical operator rules

These rules were carried over when **`google-maps-api`** was folded into **`mde-maps`**. Command reference: [`all-apis.md`](all-apis.md). Script path: **`.claude/skills/mde-maps/scripts/gmaps.py`** (moved from legacy `google-maps-api/scripts/` on 2026-05-14).

1. **Communicate blockers immediately.** On API failure (`403`, `REQUEST_DENIED`, API not enabled, etc.), **stop** and explain in plain language. Do not silently substitute web search for a failed Maps call unless the user explicitly asked for a fallback.

2. **Ask before generating HTML.** Do not start a full interactive HTML page without confirming the user wants a visual artifact vs text/JSON.

3. **Ask before choosing output format** when the request is ambiguous (summary vs table vs downloadable artifact).

4. **Enablement:** If an API is disabled in GCP, say which API to enable and link Console paths — see [`all-apis.md`](all-apis.md) API list table.
