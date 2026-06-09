# Legacy wireframe → D-task map

Use this when grepping old `SCR-*` / `WIRE-*` / `SCREEN-*` paths. **Do not execute legacy specs directly** if a D-task row exists.

| Legacy path / issue | Superseded by | Action |
|---------------------|---------------|--------|
| `wireframes/02-discovery.md`, SAN-261 Explore Unified | **D-05** SAN-571 | Reference only |
| `wireframes/trips/016-wire-explore-unified.md` | **D-05** | Canceled |
| `wireframes/real-estate/009-*`, SAN-244 Rentals Browse | **D-05** / **D-09** | Canceled → re-skin existing `/rentals` |
| `wireframes/screens/001-scr-home-chat-chrome`, SAN-232 | **D-13** SAN-579 | Reuse shipped chrome |
| `wireframes/screens/002-scr-chat-nav-rail`, `002-wire-chat-chrome` | **D-13** / shell | Reuse — do not rebuild nav |
| `wireframes/screens/019-scr-loading-error-empty`, SAN-265 | **D-14** SAN-580 | Extend to re-skinned surfaces |
| `wireframes/screens/020-scr-accessibility-pass`, SAN-268 | **D-14** | Extend |
| `wireframes/real-estate/009-scr-rental-card-polish`, SAN-360/437 | **D-08** SAN-574 | Fold into VenueCard |
| `wireframes/ux/UX-024-hover-pin-parity` | **D-11** SAN-577 | Extend |
| `wireframes/mobile/*` | **D-14** responsive slice | Fold into polish, not separate track |
| `wireframes/00-foundations.md` … `06-user-operator-dashboards.md` | **D-02** + **D-05/06** | ASCII pre-build; HTML wireframes supersede for Phase 1 |

Platform shell INDEX (`wireframes/screens/INDEX.md`) remains useful for **route-build** (`scr` in `tasks/screens/`) — design track consumes it via D-task links, not as a second queue.
