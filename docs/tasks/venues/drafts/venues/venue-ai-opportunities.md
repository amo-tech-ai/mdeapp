# Venue AI opportunities

**Policy:** All items below are **propose-only** unless marked “deterministic.” See [venue-management-prd-v1.md](./venue-management-prd-v1.md) §7.

---

## 1. Scheduling & availability

| Opportunity | AI role | Authority |
|-------------|---------|-----------|
| Suggest alternate dates when conflict | Mastra narrative + options | Edge 041 decides |
| Parse natural language hold (“next Saturday 6pm”) | Mastra slot proposal | User confirms |
| iCal import anomaly detection | Flag overlapping blocks | Human fix |

**Not MVP.** Needs 038/041.

---

## 2. Staffing optimization

| Opportunity | AI role | Authority |
|-------------|---------|-----------|
| AV/security headcount for 200-cap gala | 043 optimizer `resource_allocation` | Organizer Apply |
| Shift reminder texts | OpenClaw after approval | Templates |

Industry (Rookoo, Momentus AI reports): 10–20% ops time savings — **only with human sign-off**.

---

## 3. Lead scoring (B2B venue sales)

| Signal | Hermes feature |
|--------|----------------|
| Repeat organizer | High intent |
| Large capacity events | High value |
| Sponsor co-event | Upsell |

Mastra drafts proposal email — **no auto-send**.

---

## 4. Venue recommendations (attendee)

| Query | Tool |
|-------|------|
| “After-party near venue” | Nearby Search + concierge |
| “Safe taxi area” | Static copy + maps route |

---

## 5. Pricing optimization

| Input | Output proposal |
|-------|-----------------|
| Weekend + pageant season | +15% surcharge suggestion |
| Low utilization Tuesday | Discount suggestion |

**Edge** sets `event_tickets.price_cents` — not Gemini.

---

## 6. Attendee personalization

| Feature | Phase |
|---------|-------|
| Dietary from attendee profiles (032) | Core |
| “You attended X at this venue before” | Enterprise |
| VIP entrance hint on QR email | MVP template only |

---

## 7. AI-generated layouts

| Output | Schema |
|--------|--------|
| Zones: stage, runway, tables, VIP | JSON validated by Zod |
| Capacity check vs fire code max | Deterministic validator |

Archive task **044** — layout generator edge.

---

## 8. Operational assistants

| Assistant | Channel |
|-----------|---------|
| Venue Ops Analyst | Host dashboard chat |
| Concierge | Public event page |
| Sponsor narrative | ROI email |

---

## 9. No-show prediction

Combine:

- `attendance_intent` ([070](../070-openclaw-no-show-recovery.md))  
- Historical show rate per venue (Hermes)  
- Weather (optional)

→ Mastra risk band → OpenClaw reminder — **not** ticket refund auto.

---

## 10. Campaign automation

- Post-event “thanks for coming” WA — OpenClaw + approved template.  
- Sponsor “foot traffic” story — Mastra caption + Hermes stats.

---

## 11. Sponsor matching (venue-aware)

| Feature | System |
|---------|--------|
| Venue tier (capacity, neighborhood) | Hermes |
| Brand fit embedding | pgvector |
| Outreach draft | Mastra → OpenClaw |

---

## 12. Analytics & forecasting

| Report | Compute | Explain |
|--------|---------|---------|
| Utilization forecast | SQL regression or simple avg | Mastra narrative |
| Revenue per sqm | SQL | Dashboard |

**Do not** promise ML forecasting in MVP marketing.

---

## 13. Eval gates (MASTRA-094+)

| Scorer | Gate |
|--------|------|
| Layout JSON schema valid | 100% CI |
| No booking mutation tool | static analysis |
| Caption URLs in allowlist | 100% |
| Colombia summary not empty | spot check 20 venues |

---

## 14. Anti-patterns (never)

- Auto-publish layout to production without preview  
- AI confirms double-book  
- Scraping competitor venue sites for pricing  
- Sending WA to venue owners without opt-in  
