# DESIGN teardown: mindtrip.ai (deep review)

## Source

- URLs: `/business` · `/business/hotels` · `/business/packages` · `/ios` · `/flights` · `/creator-program`
- Capture date: 2026-06-10 · Evidence: Firecrawl `branding`+`images` scrape per page (measured tokens) + full-page screenshots in `docs/screenshots/mindtrip/marketing/` (visual)
- Method: `firecrawl-website-design-clone` skill workflow (`.agents/skills/`), screenshots reused from the 2026-06-06 capture
- Raw artifacts: `/tmp/firecrawl-mindtrip/*-branding.json` (regenerate with `firecrawl scrape <url> --format branding,images`)

## Design summary

One ruthlessly consistent system across all six pages: **Inter only, pure black on white, oversized display type (72–128 px H1), every interactive element a full pill, color reserved for decorative gradients and content imagery.** The premium feel comes from scale + whitespace + consistency, not from effects. Per-audience pages change *content blocks*, never tokens.

## Measured tokens (Firecrawl, all 6 pages)

### Colors

| Role | Value | Notes |
|---|---|---|
| Text | `#000000` | pure black everywhere — no gray-700 body text |
| Backgrounds | `#FFFFFF` / `#F9F9F9` | white + one near-white section alternate |
| Link/accent | `#1A73E8` · `#4285F4` · `#0588F0` | Google-blue family, links only — never buttons |
| Secondary tint | `#D2E3FC` | pale blue, sparse |
| Dark bands | black sections (screenshots) | trust/stats/demo bands — not in branding block, observed |
| Hero gradients | pink/peach/lavender duotones | decorative CSS, not brand tokens (inferred from screenshots) |

### Typography (the headline finding)

| Element | Measured | Notes |
|---|---|---|
| Font | **Inter** — heading AND body, all pages | fallback `ui-sans-serif, sans-serif` |
| H1 | **72 px** (business/hotels/ios) · **96 px** (flights) · **128 px** (packages/creator) | display scale is the brand |
| H2 | 36–60 px | |
| Body | 15–18 px | huge H1:body ratio (4–7×) creates the hierarchy |

### Components (identical on every page)

| Component | Measured |
|---|---|
| Primary button | solid `#000000` bg, white text, **full pill radius**, no shadow |
| Secondary button | transparent bg, black text/border, full pill, no shadow |
| Inputs | white bg, `#D9D9D9` 1px border, full pill, no shadow |
| Cards/sections | small radius (3–8 px) — pills are for interactive elements only |
| Spacing | 4 px base unit; rhythm via huge section padding (observed) |
| Shadows | **none, anywhere** — flat design, depth via bands |

## Page patterns (per-page deltas, screenshots + markdown)

| Page | Pattern worth noting |
|---|---|
| `/business` | The master template: gradient hero → claim → feature cards → "why" 6-grid → dark logo band → gradient stat cards (3–10%, 2–3×, 100k+) → quote card → black demo-form band |
| `/business/hotels` | Same shell, vertical-specific copy ("Be the Hero of Every Stay") + 8-tile feature grid — proves the configure-don't-rebuild model we copied for `PartnerLandingShell` |
| `/business/packages` | 128 px "Packages" H1 · 3 tier cards (middle black "Premium") · zero prices ("Contact us for pricing") · checkmark comparison table · demo band |
| `/ios` | Product page = device screenshots as the only imagery; H1 72 px; App Store badge as primary CTA |
| `/flights` | Functional page, H1 96 px; secondary buttons go square (0 radius) here — the one inconsistency found |
| `/creator-program` | 128 px hero ("Create. Inspire. Earn."), rev-share pitch, creator-content imagery — their version of our creator landing (SAN-696 · MKT — Creator program landing, P3) |

## What mdeai should adopt vs keep (decision table)

| Mindtrip practice | Verdict for mdeai partner pages |
|---|---|
| One font, heading+body (Inter) | ✅ Adopt the *principle* with our DESIGN.MD font stack — no second display font |
| Display-scale H1 (72 px desktop min on marketing pages) | ✅ Adopt — our wireframes under-size heroes; set `clamp(2.5rem, 8vw, 4.5rem)`+ |
| Pure black text, no shadows, flat bands | ✅ Adopt for partner marketing pages (consumer app keeps its existing token depth) |
| Pill buttons (primary solid black/dark, secondary outline pill) | ✅ Adopt via shadcn `button` radius-full variant, colors from our oklch tokens — NOT hex black |
| Color only in gradients/imagery, blue links only | ✅ Adopt — accent tokens for links + gradient heroes; never colored buttons |
| Per-page token drift: zero | ✅ This is the real lesson — enforce via `PartnerLandingShell`, not discipline |
| Google-blue accent family | ❌ Keep our oklch palette — copying their hue would look like a clone |
| 128 px H1 | ⚠️ Cap ours at ~96 px desktop; 128 px needs their ultra-short headlines |

## Agent build instructions (delta to D-PTR specs)

1. Buttons in `PartnerLandingShell`: pill radius, primary = solid dark token, secondary = outline pill. No shadows anywhere on partner pages.
2. Hero H1 at display scale (≥72 px desktop, clamp down for mobile); body stays 16–18 px — the size *gap* is the design.
3. Section alternation: white → near-white → dark band — flat, no borders between sections.
4. Inputs (DemoBand): pill, 1 px neutral border, no shadow.
5. Everything else already captured in `docs/partners/tasks/design/INDEX.md` (high-end bar + verified 21st.dev picks).

## Rerun inputs

workflow: firecrawl-website-design-clone · source_urls: 6 above · target_stack: Next.js 16 + Tailwind v4 + shadcn/21st.dev · output: this file
