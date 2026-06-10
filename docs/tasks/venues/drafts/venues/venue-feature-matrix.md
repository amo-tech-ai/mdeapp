# Venue feature matrix

**PRD:** [venue-management-prd-v1.md](./venue-management-prd-v1.md) · **Roadmap:** [venue-roadmap.md](./venue-roadmap.md)

Legend: ✅ shipped · 🟡 partial · ⚪ planned · 🔒 enterprise · 🤖 AI propose-only · 📱 mobile-first · 💬 WA-first

## Core domains

| Feature | MVP | Core | Enterprise | AI-native | Automation | Maps | Mobile | WA | Revenue |
|---------|:---:|:----:|:----------:|:---------:|:----------:|:----:|:------:|:--:|:-------:|
| Venue record (name, address, cap) | ✅ DB | ✅ | multi-site | enrich summary 🤖 | — | place_id | 📱 picker | — | — |
| Wizard venue picker | ⚪ EVT-039 | ✅ | — | coach 🤖 | — | Autocomplete | 📱 | — | faster publish |
| Event↔venue link | ✅ FK | ✅ | — | — | — | pin | 📱 detail | — | — |
| Map on event page | ⚪ 043 | ✅ | — | — | — | ✅ | 📱 | share pin | — |
| Nearby POI cards | ⚪ 044 | ✅ | — | concierge 🤖 | — | Nearby | 📱 | — | affiliate later |
| Resource inventory | — | ⚪ 036 | 🔒 | — | — | — | 📱 | — | upsell AV |
| Staff roster | — | ⚪ 037 | 🔒 | — | WA notify 💬 | — | 📱 | 💬 | — |
| Availability blocks | — | ⚪ 038 | 🔒 | — | cron conflict | — | 📱 | — | prevent loss |
| Race-safe booking | — | ⚪ 041 | 🔒 | — | edge only | — | — | — | booking fees |
| Floor plans / zones | — | ⚪ 040 | 🔒 | layout gen 🤖 | — | — | 📱 | — | premium |
| Host `/host/venues` | — | ⚪ 039 | 🔒 | — | — | — | 📱 | — | retention |
| Utilization analytics | — | ⚪ 042 | 🔒 | forecast 🤖 | nightly digest | — | 📱 | 💬 | sponsor data |
| QR check-in at venue | ✅ tickets | ✅ | — | — | OpenClaw T-12h | — | 📱 PWA | 💬 | ticket revenue |
| Sponsor placement at venue | — | bridge 031 | ✅ sponsor.* | match 🤖 | ROI report | geo | — | 💬 | **high** |
| Public booking portal | — | — | 🔒 | — | — | — | 📱 | — | new stream |
| Contracts / invoicing | — | — | 🔒 | — | — | — | — | — | B2B |
| Multi-venue dashboard | — | — | 🔒 | — | — | map overview | 📱 | — | chain ops |
| AI pricing optimizer | — | — | 🔒 | ⚪ 043 edge | — | — | — | — | yield |
| AI staffing mix | — | ⚪ | 🔒 | ⚪ 043 | — | — | 📱 | 💬 | ops savings |

## MVP feature list (ship first)

1. CRUD `event_venues` via edge `venue-upsert` (organizer scoped)  
2. Places Autocomplete in wizard (EVT-039, PLACES-018)  
3. `google_place_id`, `latitude`, `longitude`, `maps_link_uri` columns (migration)  
4. Event detail map + attribution (EVT-043)  
5. Nearby restaurants/attractions (EVT-044)  
6. Vitest: RLS negative tests for venues  

## Anti-features (do not build early)

- Full BEO / catering production sheets  
- Public venue marketplace  
- AI-autonomous booking confirmation  
- Cold WA venue sales outreach  
- Desktop-only floor plan editor without mobile preview  

## Competitive gap → mdeai opportunity

| Competitor strength | mdeai gap today | Opportunity |
|--------------------|-----------------|-------------|
| Momentus/Cvent depth | Shallow venue module | **Win on integrated tickets + contests + WA** |
| iVvy unified calendar | No 041 yet | Ship `EXCLUDE` booking when repeat organizers ask |
| VenuePro layouts | No 040 | AI **proposal** layout faster than drag-drop for small orgs |
| Zoho registration | Have Stripe tickets | Better LATAM WA + COP |
| Sparkit/Rookoo AI ops | No venue agents | Mastra + OpenClaw with **audit** and propose-only |
