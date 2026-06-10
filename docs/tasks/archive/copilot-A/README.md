---
title: CopilotKit — archived (Done)
updated: 2026-05-26
active_backlog: ../../copilotkit/INDEX.md
---

# CopilotKit product archive

**4 F-specs** — map canvas + generative UI + shared map state. All **`status: Done`**; implementation in `mdeapp/src/components/chat/` and `mdeapp/src/components/copilot/`.

**Open gap backlog:** [`../../copilotkit/BACKLOG-ck-gaps.md`](../../copilotkit/BACKLOG-ck-gaps.md) — CK-001–008 (not Done).

**Example references:** inline in bound specs (`verified_against` on F01, F49, F50, EVP-008–011, F41, F46). Gap backlog: [`../../copilotkit/BACKLOG-ck-gaps.md`](../../copilotkit/BACKLOG-ck-gaps.md).

---

## Completion verdict

| Scope | Complete? | Notes |
|-------|:---------:|-------|
| **F48–F50b (this folder)** | **Yes** | 3-panel shell, cards→pins, MapUiState, viewport sync |
| **Runtime foundation** | **Yes** | F01–F03 + F19 in [`../core/`](../core/README.md) — `CopilotKit` mount, `/api/copilotkit`, `conciergeAgent` |
| **`tasks/copilotkit/` folder** | **No** | CK-001–008 gaps open |
| **Runtime smoke proof** | **Partial** | `smoke:f50-pin-sync` **failed** 2026-05-26 (concierge text timeout) — code on disk, smoke needs fix |

Do not re-execute archived specs unless regression reopens them.

---

## Archived files

| ID | File | Surface |
|----|------|---------|
| F48 | [F48-copilotkit-map-canvas-layout.md](./F48-copilotkit-map-canvas-layout.md) | 3-panel `ChatCanvas` on `/` |
| F49 | [F49-copilotkit-generative-search-ui.md](./F49-copilotkit-generative-search-ui.md) | `useCopilotAction` card renders → pins |
| F50 | [F50-copilotkit-map-ui-state.md](./F50-copilotkit-map-ui-state.md) | `MapUiState` + `focusPin` |
| F50b | [F50b-map-viewport-sync.md](./F50b-map-viewport-sync.md) | Viewport → agent `locationBias` |

**Partial gap shipped (no separate spec file):** CK-FE-001 `focusMapPin` — `mdeapp/src/components/copilot/focus-map-pin-action.tsx`

Evidence: `tasks/notes/F48-evidence.md` (if filed) · Vitest + manual `/` proofs per spec §8.
