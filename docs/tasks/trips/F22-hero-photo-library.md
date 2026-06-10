---
id: F22
title: Port Medellín hero photo library from legacy
status: Not Started
priority: P2
phase: W2 — Day 5 (post-F07 quick win)
effort: 30 min (asset copy + .gitignore guard + license note)
owner: claude
depends_on: [F07]
skill: [mde-task-lifecycle]
parent_plan: /home/sk/mdeai/plan/07-legacy-design-port-plan.md
verified_against:
  - legacy: /home/sk/mde/src/assets/hero/ (8 JPGs, 608KB)
  - legacy: /home/sk/mde/src/assets/inspired/ (7 JPGs, 960KB)
  - mdeapp/public/ currently has only Next.js default SVGs
---

# F22 — Port Medellín hero photo library

## 1. Purpose

Legacy `/home/sk/mde/` ships 15 photographs of Medellín neighborhoods, landmarks, and Colombian regions — `beach-palms`, `coffee-farm`, `colonial-street`, `guatape-colors`, `medellin-skyline`, `street-food`, `waterfall`, `caribbean-coast`, `mountain-adventures`, `nightlife`, `urban-exploration`, etc. These are real photography of the product's actual market. Without them, Camila's `/rentals` and Tourist's `/chat` and Roberto's `/host/events` all render with placeholder hero cards. F22 ships the assets so every subsequent UI task (F24-F27) has real Medellín imagery instead of stock SVGs.

## 2. Goals

- Copy `legacy/src/assets/hero/` (8 files) → `mdeapp/public/hero/`
- Copy `legacy/src/assets/inspired/` (7 files) → `mdeapp/public/inspired/`
- Copy `legacy/public/ilovemde.png` → `mdeapp/public/ilovemde.png` (logo)
- Total bytes added: ~1.6 MB (acceptable for Vercel build budget)
- Add `mdeapp/public/hero/README.md` documenting source + license note
- `npm run floor` still exits 0 (assets are static; no runtime impact)
- Gate 9 N/A — pure asset copy, no source/config change

## 3. Features (persona value)

| Persona | What they get |
|---|---|
| **Camila** | Landing surface + `/rentals` hero shows real Medellín apartments / neighborhoods instead of generic placeholders |
| **Roberto** | `/host/event/new` cover image picker has real Medellín venue photos to choose from (W3+) |
| **Tourist** | Concierge `/chat` restaurant + attraction cards (W6) can render hero crops of the actual neighborhood |
| **Sofía** | Stops looking for stock photos; uses the existing library |

## 4. Workflows

1. Pre-flight — confirm read access on legacy (hook blocks writes, not reads):
   ```bash
   ls /home/sk/mde/src/assets/hero/ | wc -l   # expect 8
   ls /home/sk/mde/src/assets/inspired/ | wc -l   # expect 7
   ```
2. Create target directories:
   ```bash
   mkdir -p /home/sk/mdeai/mdeapp/public/hero /home/sk/mdeai/mdeapp/public/inspired
   ```
3. Copy assets (read from legacy, write to mdeapp — only the mdeapp side is mutated):
   ```bash
   cp /home/sk/mde/src/assets/hero/*.jpg /home/sk/mdeai/mdeapp/public/hero/
   cp /home/sk/mde/src/assets/inspired/*.jpg /home/sk/mdeai/mdeapp/public/inspired/
   cp /home/sk/mde/public/ilovemde.png /home/sk/mdeai/mdeapp/public/
   ```
4. Write `mdeapp/public/hero/README.md` (≤ 20 lines): list of files, dimensions, "Originally licensed for the mdeai project; reuse confirmed for mdeapp under same license."
5. Re-run `npm run floor` to confirm no regression. Re-run `git status -s mdeapp/public/` and confirm ≤ 17 new files staged.

## 5. User journeys

- Sofía in W3: needs a hero for `EventCard` → imports `/hero/colonial-street.jpg`. Done in 5 seconds.
- Camila on `/rentals` (W5): scrolls past a hero strip of 8 Medellín neighborhoods.
- Roberto on `/host/event/new` (W3): picks a venue cover from the inspired library — no upload needed for testing.

## 6. Agents

None — pure asset copy.

## 7. Integrations

| Integration | Purpose |
|---|---|
| Next.js `<Image>` | Will render these from `/hero/...` and `/inspired/...` paths (no `next.config.ts` change needed for local files in `public/`) |
| Vercel build | Static-asset shipping; ~1.6 MB increase fits comfortably in build budget |

## 8. Summary

Read 15 photographs from legacy `src/assets/`, write to `mdeapp/public/{hero,inspired}/`, add one short README, run floor. ~30 min, zero risk, unblocks every UI task. We'll know it worked when `ls mdeapp/public/hero` returns 8 + 1 README, `ls mdeapp/public/inspired` returns 7, and `npm run floor` is still exit 0.

## 9. Definition of Done

- [ ] `mdeapp/public/hero/` exists with 8 `.jpg` files
- [ ] `mdeapp/public/inspired/` exists with 7 `.jpg` files
- [ ] `mdeapp/public/ilovemde.png` exists
- [ ] `mdeapp/public/hero/README.md` exists with license note
- [ ] `npm run floor` exits 0
- [ ] No source files modified (assets only)
- [ ] Evidence at `tasks/notes/F22-evidence.md` with file list + byte count

## 10. Tests

| # | Test | Expected |
|---|---|---|
| T1 | hero dir count | `ls mdeapp/public/hero/*.jpg \| wc -l` → 8 |
| T2 | inspired dir count | `ls mdeapp/public/inspired/*.jpg \| wc -l` → 7 |
| T3 | ilovemde present | `test -f mdeapp/public/ilovemde.png && echo OK` |
| T4 | README exists | `test -f mdeapp/public/hero/README.md && echo OK` |
| T5 | floor green | `npm run floor` exit 0 |
| T6 | byte size | `du -sh mdeapp/public/hero mdeapp/public/inspired` → < 2 MB combined |

### Negative test

| Tn1 | Inject a stray `.exe` into `mdeapp/public/hero/` | Expected: it would be served by Next; review must catch in PR — F22 contract is "JPGs only". |

## 11. Rollback

```bash
rm -rf mdeapp/public/hero mdeapp/public/inspired mdeapp/public/ilovemde.png
```

No code change to revert.

## Notes

- **License confirmation:** legacy was licensed for the mdeai project; mdeapp continues the same license. If you ever want to publish these outside mdeai, re-check.
- **Image dimensions:** legacy files are typically ~1920×1080 JPGs around 100-200KB each. Next.js `<Image>` will optimise on demand.
- **No Vercel env change needed.** Static assets in `public/` are served as-is.
