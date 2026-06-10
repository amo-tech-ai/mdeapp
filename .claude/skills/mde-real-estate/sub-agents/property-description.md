---
name: property-description-generator
description: Generate MLS-ready, social media, and luxury listing descriptions using benefit-driven real estate copywriting
metadata:
  version: "1.0"
  author: NextAutomation
---

# Property Description Generator

Transform raw property specifications into emotionally compelling listing descriptions across multiple formats, using benefit-driven copywriting principles adapted for real estate.

## When to Use
- Writing a new MLS listing description from property specs and showing notes
- Creating social media content for a new or featured listing
- Producing luxury or high-end marketing copy for premium properties
- Adapting an existing listing description for a different platform or audience
- Refreshing a stale listing that has been on market 30+ days with new copy
- Generating listing descriptions in bulk for a team or brokerage

## Input Required

| Field | Required | Description |
|-------|----------|-------------|
| `bedrooms` | Yes | Number of bedrooms |
| `bathrooms` | Yes | Number of bathrooms (include half-baths as .5) |
| `square_footage` | Yes | Total living area in square feet |
| `price` | Yes | Listing price |
| `property_type` | Yes | Single-family, condo, townhome, multi-family, land, commercial |
| `location` | Yes | Neighborhood, city, and state |
| `year_built` | No | Year of construction |
| `lot_size` | No | Lot size in acres or square feet |
| `key_features` | No | Notable features: kitchen upgrades, pool, garage, views, smart home, etc. |
| `recent_updates` | No | Renovations or improvements with dates |
| `neighborhood_highlights` | No | Schools, walkability, dining, parks, commute info |
| `target_buyer` | No | Who is the ideal buyer: first-time, family, investor, downsizer, luxury |
| `showing_notes` | No | Agent's personal observations from visiting the property |
| `listing_history` | No | Days on market, price changes, previous listing language to avoid repeating |

## Process

### Step 1: Feature Inventory and Hierarchy
Catalog all provided features and rank them by emotional impact using the Feature-to-Benefit Conversion Matrix.

**Feature-to-Benefit Conversion Matrix:**
Raw features are never compelling on their own. Every feature must be translated into a benefit that the buyer can feel.

| Feature Category | Example Feature | Benefit Translation |
|-----------------|----------------|-------------------|
| Kitchen | Granite countertops | Prep dinner on elegant stone while the kids finish homework at the island |
| Kitchen | Double oven | Host Thanksgiving without playing oven Tetris |
| Kitchen | Walk-in pantry | Storage that means your counters stay clutter-free |
| Outdoor | Fenced backyard | Let the dog out without a leash; let the kids play without worry |
| Outdoor | Covered patio | Your morning coffee routine, rain or shine |
| Outdoor | Pool | Skip the community pool crowds -- summer is 30 steps from your back door |
| Primary Suite | Walk-in closet | Space for everything without the "whose side is whose" negotiation |
| Primary Suite | En-suite spa bath | Your personal decompression chamber after every workday |
| Layout | Open floor plan | Cook, supervise homework, and catch the game without missing a beat |
| Layout | Home office | A real workspace with a door that closes -- no more kitchen-table conference calls |
| Location | Walking distance to schools | Mornings without the carpool scramble |
| Location | Near downtown | Dinner reservations that don't start with a 30-minute drive |
| Systems | New HVAC | Utility bills that don't spike every summer and winter |
| Systems | Smart home wiring | Control lights, locks, and thermostat from the couch or from the airport |

### Step 2: Emotional Hook Identification
Identify the single strongest emotional angle for the property. This becomes the opening line. The hook should never be the address, the price, or a generic superlative.

**Hook Archetypes:**
| Archetype | When to Use | Example |
|-----------|------------|---------|
| Lifestyle Promise | Property enables a specific way of living | "Saturday mornings were made for this backyard." |
| Problem Solved | Property eliminates a common pain point | "Finally, a home where everyone gets their own space." |
| Scarcity Signal | Rare feature or location | "One of only four lake-view lots left in Cedar Ridge." |
| Sensory Moment | Vivid scene the buyer can picture | "Morning light floods the kitchen by 7 AM and stays until the oak trees catch it at dusk." |
| Identity Affirmation | The home reflects who the buyer wants to be | "For the family that values quality time over quantity of stuff." |

### Step 3: Multi-Format Generation
Generate all requested description formats, applying platform-specific constraints and conventions.

### Step 4: Compliance Check
Scan every generated description against Fair Housing and MLS compliance rules before output.

## Output Format

```
============================================
LISTING DESCRIPTIONS
============================================
Property: [Address or identifier]
Generated: [Date]

--- MLS VERSION (150-250 words) ---
[Professional, feature-rich, MLS-compliant description]

Character count: [X]
Compliance check: [PASS / FLAGS NOTED]

--- SOCIAL MEDIA VERSION (50-100 words) ---
[Casual, scroll-stopping, platform-optimized]

Platform: [Instagram / Facebook / TikTok caption]
Character count: [X]

--- LUXURY / ELEVATED VERSION (100-175 words) ---
[Aspirational language, sensory details, prestige positioning]

Character count: [X]

--- AGENT NOTES ---
Emotional hook used: [Archetype]
Top 3 features emphasized: [List]
Target buyer persona: [Description]
Suggested photo priority: [Which rooms/features to photograph first based on copy]
============================================
```

## Methodology

### NAR Profile of Home Buyers Research
According to the National Association of Realtors, 97% of buyers use online search during their home buying process, and the listing description is the second most important factor (after photos) in determining whether a buyer requests a showing. Descriptions that lead with benefits rather than features generate 18-24% more click-throughs on major portals.

### The AIDA Framework (Real Estate Adaptation)
Each description follows the AIDA copywriting model adapted for property listings:

- **Attention**: Opening hook that stops the scroll. Never start with the number of bedrooms. Lead with emotion, scene, or outcome.
- **Interest**: Build on the hook with the 3-4 most compelling benefits. Layer lifestyle language with specific details.
- **Desire**: Create urgency or scarcity. Reference neighborhood desirability, recent comparable sales, or unique features.
- **Action**: Close with a specific, low-friction call to action. "Schedule your private showing" outperforms "Call for more info."

### Fair Housing Compliance Rules
All generated descriptions are checked against HUD Fair Housing Act guidelines. The following language patterns are prohibited and will never appear in output:

| Prohibited Category | Examples to Avoid |
|---------------------|-------------------|
| Race/National Origin | "diverse neighborhood," "ethnic," "integrated" |
| Religion | "near churches," "Christian community," "walking distance to temple" |
| Familial Status | "perfect for couples," "no children," "adult community" (unless legally designated 55+) |
| Disability | "able-bodied," "walk-up only" (describe as "third-floor unit" instead) |
| Gender/Sexual Orientation | "bachelor pad," "man cave," "mother-in-law suite" (use "guest suite") |

Additionally, these overused and potentially misleading phrases are excluded:
- "Motivated seller" (signals desperation, invites lowball offers)
- "Priced to sell" (implies overpriced previously)
- "Won't last" (unverifiable claim)
- "A must see" (filler with zero information content)
- "Cozy" (code for small)
- "Charming" (code for outdated, unless paired with specific detail)

### Word Economy Principles
Real estate descriptions compete in attention-scarce environments. Every word must earn its place.

- **Cut adjective stacking**: "Beautiful, stunning, gorgeous kitchen" becomes "A kitchen that stops you in your tracks"
- **Replace vague with vivid**: "Nice views" becomes "Unobstructed views of the Blue Ridge from the primary bedroom"
- **Active voice only**: "Entertaining is made easy" becomes "Host 20 without rearranging furniture"

## Advanced Configuration

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| `mls_word_limit` | `250` | `150-1000` | Maximum word count for MLS version |
| `social_platform` | `instagram` | `instagram`, `facebook`, `tiktok`, `twitter`, `linkedin` | Target social platform (affects tone and length) |
| `emoji_usage` | `social_only` | `none`, `social_only`, `all` | Where to include emojis |
| `luxury_threshold` | `750000` | Any price | Price above which the luxury version auto-generates |
| `include_price` | `mls_only` | `all`, `mls_only`, `none` | Which versions include the listing price |
| `language` | `en` | `en`, `es`, `fr` | Output language |
| `brand_voice` | `neutral` | `neutral`, `warm`, `bold`, `sophisticated` | Tone of voice for all versions |
| `cta_style` | `showing` | `showing`, `open_house`, `call`, `dm`, `website` | Call-to-action type |

## Example

### Input
```
bedrooms: 4
bathrooms: 3
square_footage: 2,850
price: $525,000
property_type: Single-family
location: Kirkwood, Atlanta GA
year_built: 1938
lot_size: 0.3 acres
key_features: Original hardwood floors, renovated kitchen with quartz counters, screened porch, detached garage converted to studio, mature pecan trees
recent_updates: Kitchen fully renovated 2024, new roof 2023, HVAC replaced 2025
neighborhood_highlights: Walkable to Kirkwood restaurants and Oakhurst Village, strong public schools (K-5 rated 8/10), 10-min drive to downtown, active neighborhood association
target_buyer: Young family or creative professional couple
```

### Output
```
============================================
LISTING DESCRIPTIONS
============================================
Property: Kirkwood, Atlanta GA -- 4BR/3BA Craftsman
Generated: 2026-01-25

--- MLS VERSION (218 words) ---
Morning light through original 1938 windows. A screen porch that turns every evening into a front-row seat to one of Atlanta's most walkable neighborhoods. This 4-bedroom Kirkwood Craftsman pairs the bones that don't exist in new construction -- hardwood floors, true plaster walls, and the proportions of a home built when space wasn't an afterthought -- with updates that make daily life effortless. The kitchen was taken to the studs in 2024: quartz countertops, soft-close cabinetry, and a layout designed around how families actually cook. A 2023 roof and 2025 HVAC mean you're inheriting solutions, not projects. The detached garage has been converted into a finished studio -- ideal for remote work, art, music, or rental income. Step outside to a third of an acre anchored by mature pecan trees that deliver shade in July and pies in October. Walk to Kirkwood restaurants, bike to Oakhurst Village, or drive downtown in 10 minutes. Zoned for public schools rated 8/10 at the elementary level. This is the rare listing where you get the character of a historic home without the maintenance backlog. Schedule your private showing before the weekend.

Character count: 1,087
Compliance check: PASS

--- SOCIAL MEDIA VERSION (72 words) ---
1938 Craftsman in Kirkwood. The floors are original. The kitchen is brand new. The screened porch is where you'll spend every evening this spring. 4 bed, 3 bath, a converted studio out back, and mature pecan trees on a third of an acre. Walk to everything. 10 minutes to downtown. $525K.

This one is going to move. DM for a private showing.

Platform: Instagram
Character count: 382

--- LUXURY / ELEVATED VERSION (148 words) ---
Some homes are built. Others are inherited -- passed from one family to the next with the quiet understanding that certain things cannot be replicated. This 1938 Kirkwood Craftsman is that home. Original hardwood floors carry nearly a century of warmth underfoot. The kitchen, reimagined in 2024, balances period sensibility with modern precision: quartz surfaces, considered lighting, and a workflow built for both Tuesday dinners and Saturday gatherings. The converted studio offers a sanctuary apart from the main home -- a place where focus comes easily. Outside, pecan trees frame a generous lot in one of Atlanta's most culturally rich intown neighborhoods. Walkable streets. Restaurants that know your name. Schools that earn their reputation. New roof. New HVAC. Old soul. A home that rewards the buyer who understands that provenance is the one feature money cannot add. Private showings by appointment.

Character count: 846

--- AGENT NOTES ---
Emotional hook used: Sensory Moment (morning light + screen porch)
Top 3 features emphasized: 1) Renovated kitchen (2024), 2) Converted studio, 3) Walkable Kirkwood location
Target buyer persona: Dual-income couple, 30-42, values walkability and character, remote or hybrid work arrangement, likely has or is planning for children
Suggested photo priority: 1) Screened porch with natural light, 2) Kitchen wide-angle, 3) Hardwood floor detail shot, 4) Studio exterior and interior, 5) Pecan trees and backyard
============================================
```

## Edge Cases and Best Practices

**Stale Listings (30+ DOM)**: When refreshing a listing that has sat, do not reuse any language from the original description. Reframe the property with a different hook archetype. If the original led with features, pivot to lifestyle. If it led with lifestyle, pivot to scarcity or problem-solved.

**Minimal Information**: When only basic specs are provided (beds, baths, sqft, price), generate descriptions that emphasize layout potential and location. Flag the output with: "Enhanced with showing notes and photos, this description can be significantly strengthened."

**Condos and Townhomes**: De-emphasize lot and outdoor language. Elevate community amenities, low-maintenance lifestyle, and lock-and-leave convenience. Always mention HOA fee context: "The $X/month HOA covers [specific items], which means [benefit]."

**Investment Properties**: When the target buyer is an investor rather than an owner-occupant, shift language from emotional benefits to financial metrics: rental income potential, cap rate neighborhood comps, value-add opportunities, and tenant demand indicators.

**Luxury Properties ($1M+)**: Never mention "affordable" or "great value." Remove all urgency language. Luxury buyers are repelled by pressure. Replace calls-to-action with invitations: "Private viewings available by appointment" rather than "Schedule your showing today."

**Multi-Offer Environment**: When the market context suggests competing offers, add scarcity signals to the MLS version without making unverifiable claims. Use phrases like "Offers reviewed Wednesday at 5 PM" rather than "This won't last."

## Integration

This skill pairs with:
- **Neighborhood Guide Creator** -- Append a neighborhood summary to the MLS description or social media post for added context
- **Market Analysis Reporter** -- Reference recent comparable sales data to justify pricing language in the description
- **Lead Qualifier Agent** -- Send tailored listing descriptions to IMMEDIATE-tier buyer leads who inquired on similar properties
