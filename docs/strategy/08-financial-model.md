# Chunk 08 — Financial Model

> Goal: a defensible 3-year model with formulas, assumptions, scenarios, and unit economics. Copy the tables into a spreadsheet and replace estimates with actuals as they land.

## 8.1 Formula glossary

```
MRR            = Σ (subscribers × monthly price)
ARR            = MRR × 12
Take-rate rev  = GMV × take_rate
Gross profit   = Revenue − COGS (payments, model/API, hosting, content labor)
Gross margin % = Gross profit ÷ Revenue
CAC            = Sales & marketing spend ÷ new customers acquired
ARPA           = Average revenue per account (period)
LTV            = (ARPA × Gross margin %) ÷ monthly churn      [subscription]
LTV:CAC        = LTV ÷ CAC            (healthy ≥ 3:1)
CAC payback    = CAC ÷ (ARPA_monthly × Gross margin %)   (months)
NRR            = (start MRR + expansion − contraction − churn) ÷ start MRR
EBITDA         = Gross profit − Operating expenses (excl. D&A, interest, tax)
Rule of 40     = Revenue growth % + EBITDA margin %   (target ≥ 40)
```

## 8.2 Assumptions

| Assumption | Value |
|---|---|
| Blended subscription ARPA | ~$300/mo (Pro/Business mix) |
| Blended gross margin | ~78% |
| Monthly logo churn (Yr1→Yr3) | 6% → 5% → 4% |
| Blended CAC (business client) | $250 → $200 → $180 |
| Take-rate on GMV (blended) | ~12% |
| FX planning rate | 4,000 COP / USD |
| COGS share of revenue | ~22% |

## 8.3 Three-year P&L scenarios (USD)

| Metric | **Yr1 Conservative** | **Yr2 Expected** | **Yr3 Aggressive** |
|---|---|---|---|
| Paying business clients (EoY) | 60 | 280 | 750 |
| Blended ARPA/mo | $300 | $340 | $380 |
| **Subscription/services rev** | $150,000 | $760,000 | $2,400,000 |
| GMV (tickets/tours/bookings) | $250,000 | $1,800,000 | $7,500,000 |
| Take-rate rev (~12%) | $30,000 | $216,000 | $900,000 |
| Ads/sponsorship rev | $10,000 | $90,000 | $400,000 |
| **Total revenue** | **$190,000** | **$1,066,000** | **$3,700,000** |
| COGS (~22%) | $42,000 | $234,000 | $814,000 |
| **Gross profit** | **$148,000** | **$832,000** | **$2,886,000** |
| Gross margin | 78% | 78% | 78% |
| Operating costs | $180,000 | $620,000 | $1,700,000 |
| **EBITDA** | **−$32,000** | **+$212,000** | **+$1,186,000** |
| EBITDA margin | −17% | 20% | 32% |
| Exit MRR | ~$18,000 | ~$95,000 | ~$320,000 |
| Exit ARR | ~$216,000 | ~$1,140,000 | ~$3,840,000 |

## 8.4 Revenue mix by year

| Line | Yr1 | Yr2 | Yr3 |
|---|---|---|---|
| Subscription/services | 79% | 71% | 65% |
| Take-rate | 16% | 20% | 24% |
| Ads/sponsorship | 5% | 9% | 11% |

> Services dominate early (revenue without liquidity); take-rate and ads grow their share as GMV and audience scale — exactly the hybrid sequencing from Chunk 04.

## 8.5 Unit economics

| Metric | Yr1 | Yr2 | Yr3 |
|---|---|---|---|
| ARPA (annual) | $3,600 | $4,080 | $4,560 |
| Gross margin | 78% | 78% | 78% |
| Monthly churn | 6% | 5% | 4% |
| **LTV** = (ARPA×GM%)/(12×churn) | ≈ **$3,900** | ≈ **$5,304** | ≈ **$7,410** |
| CAC | $250 | $200 | $180 |
| **LTV:CAC** | **~15:1** | **~27:1** | **~41:1** |
| CAC payback | ~1.1 mo | ~0.9 mo | ~0.7 mo |

> Economics are dominated by high-margin AI-services MRR. **The standout risk is churn, not CAC** — retention (monthly ROI proof) is the #1 operating metric.

## 8.6 Operating cost shape (Yr1 conservative)

| Line | Annual |
|---|---|
| Founders/core team (lean) | $90,000 |
| Contractors (content QA, BD) | $36,000 |
| Model/API + infra (Gemini/OpenAI/Claude/Supabase) | $18,000 |
| WhatsApp/Twilio/messaging | $9,000 |
| Tools/SaaS | $12,000 |
| Paid marketing | $15,000 |
| **Total** | **~$180,000** |

## 8.7 Cash & runway sensitivity

| Scenario | Yr1 EBITDA | Implication |
|---|---|---|
| Conservative | −$32k | ~3–4 months of buffer needed; near-breakeven |
| Add platform credits (Stripe/Google/OpenAI) | ~−$15k | Credits ≈ COGS offset extend runway |
| Faster retainer ramp (+10 clients) | ~breakeven | Services-led path can self-fund |

> Because revenue is services-led, **MDE can approach default-alive in Yr1** — the marketplace build is funded by agency cash, not the other way around.

## 8.8 Health checks

| Check | Target | Yr2 model |
|---|---|---|
| LTV:CAC | ≥ 3:1 | ~27:1 ✅ |
| CAC payback | < 12 mo | <1 mo ✅ |
| Gross margin | > 70% | 78% ✅ |
| NRR | > 110% | drive via expansion (Chunk 05) |
| Rule of 40 | ≥ 40 | growth 461% + margin 20% ✅ |

> The eye-popping ratios are a feature of services-led economics — but they hold **only if churn stays low**. Stress-test the model at 8–10% churn before relying on them externally.
