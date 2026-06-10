---
name: lead-qualifier-agent
description: Qualify and score inbound real estate leads using the BANT-R framework with automated priority routing
metadata:
  version: "1.0"
  author: NextAutomation
---

# Lead Qualifier Agent

Systematically evaluate inbound real estate leads against a multi-factor qualification framework, assign a weighted score, and produce an actionable routing recommendation with tailored outreach strategy.

## When to Use
- A new lead arrives from any source (web form, ad click, open house sign-in, referral, cold inquiry)
- Reviewing a pipeline of unqualified leads during weekly triage
- Re-qualifying dormant leads after a market shift or rate change
- Handing off leads between team members and needing a standardized assessment
- Evaluating whether to invest ad spend in retargeting a specific lead segment

## Input Required

| Field | Required | Description |
|-------|----------|-------------|
| `lead_name` | Yes | Full name of the prospect |
| `source` | Yes | Where the lead originated (Facebook ad, Zillow, referral, open house, website form, cold call, etc.) |
| `raw_notes` | Yes | Any information available: form responses, call notes, CRM data, email content |
| `property_interest` | No | Buying, selling, or both |
| `location` | No | Target area, neighborhood, or current property address |
| `price_range` | No | Stated budget or estimated property value |
| `timeline_stated` | No | Any mention of when they want to transact |
| `previous_interactions` | No | History of past touchpoints, if any |

## Process

### Step 1: Source Quality Assessment
Evaluate the lead source against historical conversion benchmarks. Each source carries an inherent quality weight that adjusts the overall score.

| Source Type | Base Quality Weight | Rationale |
|-------------|-------------------|-----------|
| Personal referral | 1.3x | Highest trust, pre-sold on agent |
| Past client re-engagement | 1.25x | Existing relationship, known entity |
| Direct website inquiry (specific listing) | 1.2x | High intent -- searched and acted |
| Open house sign-in | 1.1x | Physical presence shows effort |
| Zillow/Realtor.com inquiry | 1.0x | Standard intent, comparison shopping |
| Google/Meta ad click with form fill | 0.9x | Lower barrier, impulse-driven |
| Social media DM (unprompted) | 0.85x | Casual interest, low commitment |
| Purchased lead list | 0.7x | No organic intent signal |

### Step 2: BANT-R Framework Scoring
Score each of the five BANT-R dimensions on a 1-5 scale using the criteria below. When information is missing, default to 2 (not 1) to avoid over-penalizing incomplete data.

**Budget (1-5)**
| Score | Criteria |
|-------|----------|
| 5 | Pre-approved with lender letter or verified equity/cash position |
| 4 | States a realistic budget aligned with market; has spoken with lender |
| 3 | Mentions a budget range but no lender contact yet |
| 2 | No budget discussed; income/assets unknown |
| 1 | Budget stated is unrealistic for the market or has known financial barriers |

**Authority (1-5)**
| Score | Criteria |
|-------|----------|
| 5 | Sole decision-maker, confirmed |
| 4 | Decision-maker with supportive partner who defers |
| 3 | Co-decision with partner/spouse; both engaged |
| 2 | Unknown decision structure |
| 1 | Needs approval from uninvolved party (parents, trust committee, business partner) |

**Need (1-5)**
| Score | Criteria |
|-------|----------|
| 5 | Life event forcing move: job relocation, divorce, estate settlement, new baby with no space |
| 4 | Strong desire with clear motivation: upgrading, downsizing, school district change |
| 3 | Moderate interest: exploring options, "thinking about it" |
| 2 | Vague or curiosity-driven: "just seeing what's out there" |
| 1 | No identifiable need; appears to be browsing or researching for someone else |

**Timeline (1-5)**
| Score | Criteria |
|-------|----------|
| 5 | Must transact within 30 days (lease ending, closing deadline, relocation date) |
| 4 | Actively looking; wants to transact within 1-3 months |
| 3 | Planning within 3-6 months |
| 2 | Vague timeline: "sometime this year" or "eventually" |
| 1 | No timeline; explicitly states 12+ months out or "just curious" |

**Readiness (1-5)**
| Score | Criteria |
|-------|----------|
| 5 | Has toured properties, interviewed agents, engaged with lender -- ready to move |
| 4 | Has started searching online; attended open houses or spoken to one agent |
| 3 | Has done online research but no real-world action yet |
| 2 | First inquiry; no prior search activity evident |
| 1 | Does not seem to understand the process; needs significant education |

### Step 3: Weighted Score Calculation
Apply the source quality weight to the raw BANT-R total:

```
Raw Score = B + A + N + T + R  (max 25)
Adjusted Score = Raw Score x Source Quality Weight
```

### Step 4: Priority Classification

| Adjusted Score | Priority Level | Response SLA | Cadence |
|----------------|---------------|--------------|---------|
| 20-32 | IMMEDIATE | Respond within 5 minutes | Daily contact until appointment set |
| 15-19.9 | THIS WEEK | Respond within 2 hours | 2-3 touches per week |
| 10-14.9 | NURTURE | Respond within 24 hours | Weekly value-add touchpoints |
| Below 10 | ARCHIVE | Acknowledge within 48 hours | Monthly drip sequence |

### Step 5: Outreach Strategy Generation
Based on the score breakdown, generate a tailored first-contact strategy including the optimal channel, time of day, opening message, and the single highest-leverage question to ask.

## Output Format

```
============================================
LEAD QUALIFICATION REPORT
============================================

Lead: [Name]
Source: [Origin] (Quality Weight: [X]x)
Date Qualified: [Date]

--- BANT-R SCORECARD ---
Budget:    [X]/5  |  [Brief justification]
Authority: [X]/5  |  [Brief justification]
Need:      [X]/5  |  [Brief justification]
Timeline:  [X]/5  |  [Brief justification]
Readiness: [X]/5  |  [Brief justification]

Raw Score:      [X]/25
Adjusted Score: [X] (with [X]x source weight)
Priority:       [LEVEL]
Response SLA:   [Timeframe]

--- LEAD SUMMARY ---
[Two-sentence assessment of the lead's potential and primary risk]

--- FIRST CONTACT STRATEGY ---
Channel:        [Call / Text / Email / DM]
Best Time:      [Day and time recommendation with reasoning]
Opening:        [Exact script or message draft, 2-3 sentences]
Key Question:   [The single most important question to ask]
Value Offer:    [What to provide that earns the next conversation]

--- UPGRADE PATH ---
Current Tier:   [Priority Level]
Next Tier:      [Priority Level]
Trigger:        [Specific information or action that would upgrade this lead]
Nurture Focus:  [What content/touchpoints to deliver while waiting for the trigger]

--- RISK FACTORS ---
- [Any red flags or concerns, with mitigation suggestions]
============================================
```

## Methodology

### BANT-R Framework (Real Estate Adaptation)
The traditional BANT framework (Budget, Authority, Need, Timeline) originates from IBM's sales qualification methodology developed in the 1960s. The "R" (Readiness) extension addresses a gap specific to real estate: many leads have budget, authority, need, and timeline but have not taken any preparatory action, making them significantly less likely to convert in the stated timeframe.

### Source-Weighted Scoring
Not all leads are equal at the point of entry. A referral from a past client who closed carries fundamentally different intent than a Facebook ad click. The source quality weight adjusts the raw score to reflect this reality, preventing high-scoring but low-source-quality leads from displacing genuinely urgent prospects in the pipeline.

### NAR Conversion Benchmarks
According to the National Association of Realtors Member Profile, the average agent converts approximately 12-15% of their total leads. Agents who implement structured qualification and tiered follow-up cadences report conversion rates of 20-28%. The primary driver of this improvement is not better leads but faster and more appropriate response to high-quality leads, which this framework directly enables.

## Advanced Configuration

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| `scoring_model` | `weighted` | `weighted`, `raw`, `custom` | Whether to apply source quality weights |
| `default_missing_score` | `2` | `1-3` | Score assigned when a BANT-R dimension has no data |
| `sla_timezone` | `lead_local` | `lead_local`, `agent_local`, `UTC` | Timezone for SLA calculations |
| `team_routing` | `off` | `off`, `round_robin`, `score_based`, `specialty` | How to assign leads across a team |
| `re_qualification_trigger` | `30_days` | `14_days`, `30_days`, `60_days`, `manual` | When to re-score nurture leads |
| `output_format` | `detailed` | `detailed`, `summary`, `crm_import` | Level of detail in the output |

## Example

### Input
```
lead_name: Sarah Martinez
source: Zillow inquiry on 742 Oak Street listing
raw_notes: "I'm interested in this home. I'm currently renting in the same school district and my lease ends in April. My husband and I have been pre-approved up to $550K with First National. This is the third home we've inquired about this month."
property_interest: Buying
location: Westfield school district
price_range: Up to $550K
timeline_stated: Lease ends April
```

### Output
```
============================================
LEAD QUALIFICATION REPORT
============================================

Lead: Sarah Martinez
Source: Zillow inquiry - specific listing (Quality Weight: 1.0x)
Date Qualified: 2026-01-25

--- BANT-R SCORECARD ---
Budget:    5/5  |  Pre-approved to $550K with named lender
Authority: 3/5  |  Co-decision with husband; both appear engaged based on "we"
Need:      4/5  |  Currently renting; wants to stay in school district (likely has children)
Timeline:  4/5  |  Lease ends April -- 3-month window, natural forcing function
Readiness: 4/5  |  Third inquiry this month; pre-approved; actively searching

Raw Score:      20/25
Adjusted Score: 20.0 (with 1.0x source weight)
Priority:       IMMEDIATE
Response SLA:   Within 5 minutes

--- LEAD SUMMARY ---
High-quality buyer lead with verified financing, a hard deadline (lease expiration), and demonstrated search activity. The only gap is confirming her husband's engagement level and ensuring they are aligned on priorities.

--- FIRST CONTACT STRATEGY ---
Channel:        Phone call (if no answer, follow immediately with text)
Best Time:      Today, 5:30-6:30 PM (post-work, pre-dinner; renters are reachable evenings)
Opening:        "Hi Sarah, this is [Agent] -- I saw your interest in the Oak Street home. That's a great eye; it's one of the better layouts in Westfield right now. I'd love to get you and your husband in to see it before the weekend. Would tomorrow evening work?"
Key Question:   "Besides the school district, what are the top two things your next home absolutely has to have?"
Value Offer:    A curated list of 3-5 comparable active listings in Westfield that match her criteria, sent within 1 hour of the call.

--- UPGRADE PATH ---
Current Tier:   IMMEDIATE
Next Tier:      N/A (already highest)
Trigger:        Confirm showing appointment
Nurture Focus:  Not applicable at this priority -- focus on conversion to appointment

--- RISK FACTORS ---
- Husband's engagement level unknown -- could slow decisions. Mitigation: include him in all showings and communications from the start.
- Inquiring on multiple properties suggests comparison shopping across agents. Mitigation: demonstrate speed and competence to lock in the relationship before a competitor does.
============================================
```

## Edge Cases and Best Practices

**Incomplete Data**: When a lead provides minimal information (name and source only), do not assign a score below 8. Instead, flag the lead as "NEEDS DISCOVERY" and generate a first-contact strategy focused entirely on extracting BANT-R data through conversational questions rather than direct interrogation.

**Repeat Leads**: If a lead has been previously qualified and is re-entering the pipeline (e.g., they inquired 8 months ago and are back), compare their current BANT-R scores against the prior assessment. Highlight what changed and adjust the outreach strategy to acknowledge the history: "Welcome back -- last time we spoke you were thinking about spring. Has the timeline shifted?"

**Team Leads**: When a lead inquiry includes multiple decision-makers (e.g., siblings selling an inherited property), score Authority based on the most complex decision structure present, not the individual who made contact.

**Market Shift Re-Qualification**: After significant market events (rate changes exceeding 50 bps, major inventory shifts, local economic news), re-run the qualification on all NURTURE-tier leads. Timeline and Need scores frequently change after these events.

**Ethical Guardrail**: This framework scores lead quality for prioritization purposes. It must never be used to discriminate based on protected classes. Source quality weights reflect conversion probability, not demographic characteristics.

## Integration

This skill pairs with:
- **Client Follow-Up Scheduler** -- Feed qualified leads directly into the follow-up cadence engine based on their priority tier
- **Property Description Generator** -- Send IMMEDIATE-tier buyer leads a personalized property highlight for the listing they inquired about
- **Market Analysis Reporter** -- Attach a neighborhood market snapshot to the first value-add touchpoint for NURTURE leads
