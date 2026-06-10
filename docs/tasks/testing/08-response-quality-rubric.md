# 08 — Response quality rubric (/100)

Score each localhost prompt after browser test.

| Criterion | Points |
|-----------|--------|
| Uses real inventory (API/DB) | 20 |
| Correct fields on cards | 15 |
| No hallucinated venues/coords | 15 |
| Helpful short assistant text (not essay duplicate) | 10 |
| Clear CTA (schedule, buy, details) | 10 |
| Map pins present | 10 |
| Source/attribution when required | 10 |
| Response time &lt;3s (5 if &lt;6s) | 5 |
| Mobile readable | 5 |

## Prompts

1. `Show rentals in Laureles under $80 per night.`
2. `Show 10 events in Medellín.`
3. `Quiet cafés near Laureles.`
4. `What can I do tonight near Provenza?`
5. `Find a rental near coworking and cafés.`

Record scores in `response-quality-RESULTS.md`
