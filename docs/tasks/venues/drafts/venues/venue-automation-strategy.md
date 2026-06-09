# Venue automation strategy (OpenClaw + WhatsApp)

**OpenClaw contest patterns:** [openclaw-contests.md](../contests/openclaw-contests.md) · **PRD:** [venue-management-prd-v1.md](./venue-management-prd-v1.md)

OpenClaw is the **execution layer** after Mastra proposes and humans approve. Venues do **not** change authoritative booking state.

---

## 1. What to automate (high ROI)

| Workflow | Trigger | Channel | Approval |
|----------|---------|---------|----------|
| Ticket buyer “venue directions” | Post-purchase | WA template | Pre-approved template |
| T-24h “how to get there” | Cron per event | WA | Organizer opt-in |
| Booking confirmed internal | 041 success | WA organizer | Auto internal |
| Utilization weekly digest | Mon 9am COT | Email/WA | Organizer settings |
| Finals backstage sequence | Event timeline | WA groups | Required |
| Sponsor venue ROI screenshot | Daily | Email | Sponsor contract |

---

## 2. What NOT to automate

- Creating `event_venues` without user action  
- Confirming B2B bookings from email parsing  
- Cold outreach to venue owners (list scraping)  
- Auto-posting to venue Instagram without OAuth + approve  

---

## 3. OpenClaw skills (proposed)

| Skill | Cron | Inputs |
|-------|------|--------|
| `venue-directions-broadcast` | On webhook from ticket purchase | event_id, attendee phone |
| `venue-ops-digest` | Weekly | organizer_id |
| `event-venue-reminder` | T-24h, T-2h | events with venue_id |
| `venue-sponsor-report-capture` | Daily | sponsor campaign_id, public ROI URL |

Deploy via git to VPS — not ClawHub prod pull.

---

## 4. Browser automation (venue-specific)

| Job | Action |
|-----|--------|
| Capture event detail map + venue card | `openclaw browser snapshot` mdeai.co |
| Capture utilization dashboard | When `/host/venues/:id` exists |
| Sponsor PDF appendix | Screenshot stack → Storage |

**Allowlist:** `mdeai.co` only for SSRF policy.

---

## 5. Integration chain

```text
Hermes: low utilization on Venue A
  → Mastra: "Suggest Tuesday discount event"
  → Organizer approves
  → Edge creates event draft (NOT OpenClaw)
  → OpenClaw: WA blast to past buyers at that venue
  → delivery_logs
```

---

## 6. LATAM WhatsApp practices

- Spanish-first templates (es-CO)  
- Include Maps `placeUri` link  
- Quiet hours 21:00–08:00  
- STOP opt-out  
- Rate limit: 1 transactional / attendee / hour  

---

## 7. Dependencies

| Dependency | Task |
|------------|------|
| Marketing schema | 059 |
| Delivery webhook | 067 |
| VPS provision | 021 |
| Events ticket webhook | 005 |

Venue-specific automation is **Phase 2+** after EVT-039 proves geo quality.

---

## 8. Success metrics

| Metric | Target |
|--------|--------|
| Directional WA delivery rate | ≥ 98% |
| Opt-out rate | &lt; 0.1% |
| Organizer-reported “wrong venue” incidents | 0 |
| OpenClaw jobs without audit row | 0 |
