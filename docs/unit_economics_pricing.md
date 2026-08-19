# STR Platform — Unit Economics & Pricing Strategy

## 1. Key Unit Economic Definitions

| Metric | Formula | Target (Year 2) |
|--------|---------|----------------|
| **CAC** (Customer Acquisition Cost) | Total Sales & Marketing spend ÷ New customers acquired | ≤ $25 |
| **LTV** (Customer Lifetime Value) | Avg. monthly revenue per customer × Gross Margin % × Avg. customer lifespan (months) | ≥ $180 |
| **LTV:CAC Ratio** | LTV ÷ CAC | ≥ 3:1 |
| **Payback Period** | CAC ÷ Monthly contribution margin per customer | ≤ 4 months |
| **Take Rate** | Platform commission ÷ Gross job value | 27.5% blended |

---

## 2. Customer Acquisition Cost (CAC) Breakdown

### Acquisition Channels & Blended CAC

| Channel | Est. CAC | % of Acquisition Mix |
|---------|---------|---------------------|
| Organic SEO / Content | $8 | 15% |
| Referral program | $12 | 25% |
| Social media (Instagram/TikTok) | $22 | 20% |
| Paid search (Google) | $35 | 25% |
| B2B / Property management partnerships | $18 | 10% |
| App store / viral | $5 | 5% |
| **Blended CAC** | **~$22** | 100% |

---

## 3. Lifetime Value (LTV) Model

### Residential Customer

| Input | Value |
|-------|-------|
| Average jobs per month | 1.4 |
| Average job value (customer pays) | $38 |
| Monthly gross revenue per customer | $53.20 |
| Platform take rate | 27.5% |
| Monthly net revenue per customer | $14.63 |
| Gross margin on revenue | 65% |
| Monthly contribution per customer | $9.51 |
| Average customer lifespan | 22 months |
| **LTV** | **$209** |

### LTV:CAC Ratio
- LTV = $209 / CAC = $22 → **Ratio = 9.5:1** (healthy)
- Payback period = $22 / $9.51 = **~2.3 months** (excellent)

---

## 4. Subscription Tiers

### Tier Structure

| Tier | Monthly Price | Inclusions | Target Segment |
|------|-------------|------------|---------------|
| **Basic** | $9.99/mo | 2 standard pickups/mo, standard scheduling, eco-impact badge | Occasional residential user |
| **Pro** | $24.99/mo | 6 pickups/mo, priority scheduling, 10% discount on add-ons, monthly eco-report | Regular residential / small landlord |
| **Premium** | $79.99/mo | Unlimited standard pickups, same-day availability, dedicated courier team, quarterly sustainability certificate, B2B invoice | Short-term rental hosts, small businesses |
| **Enterprise** | Custom | Volume pricing, API integration, SLA guarantee, account manager | Property mgmt, municipalities |

### Subscription Economics

| Tier | Monthly Price | Estimated Gross Margin | MRR Contribution per Sub |
|------|-------------|----------------------|------------------------|
| Basic | $9.99 | 70% | $7.00 |
| Pro | $24.99 | 68% | $17.00 |
| Premium | $79.99 | 65% | $52.00 |

---

## 5. Dynamic Pricing Model

### Base Pricing Formula

```
Job Price = Base Rate + Distance Surcharge + Weight Tier + Demand Multiplier + Eco Handling Fee
```

### Base Rate by Item Type

| Category | Base Rate |
|----------|----------|
| Standard bags (≤ 30 lbs, ≤ 4 bags) | $22 |
| Small furniture (chair, small table) | $45 |
| Large furniture (sofa, mattress) | $85 |
| Appliances (fridge, washer) | $110 |
| Electronics (TV, computer) | $55 |
| Construction debris (per load) | $95 |
| Organic/compost (per bin) | $18 |

### Surcharges & Multipliers

| Factor | Calculation |
|--------|------------|
| Distance surcharge | $0.75/mile beyond 5-mile base radius |
| Peak demand multiplier | 1.0x–2.2x (based on real-time supply/demand ratio) |
| Same-day booking premium | +$8 flat |
| Heavy item surcharge | +$15 per item > 75 lbs |
| Hazardous material handling | +$25 (e-waste, paint, chemicals) |
| Eco-certified disposal | +$5 (routed to certified recycling center) |
| Subscription discount | −10% (Pro) / −20% (Premium) applied post-calculation |

### Demand Multiplier Logic

```
if supply_ratio > 1.5:      multiplier = 1.0  (normal)
elif supply_ratio > 1.0:    multiplier = 1.2  (moderate demand)
elif supply_ratio > 0.7:    multiplier = 1.5  (high demand)
elif supply_ratio > 0.4:    multiplier = 1.8  (very high demand)
else:                       multiplier = 2.2  (surge — notified to user)
```
*supply_ratio = available couriers within 10 miles ÷ pending jobs in zone*

---

## 6. Courier Payout Structure

### Standard Payout Breakdown

For a $38 standard job:

| Party | Amount | % of Job |
|-------|--------|---------|
| Courier payout | $26.60 | 70% |
| STR platform fee | $10.45 | 27.5% |
| Payment processing (Stripe) | $0.95 | 2.5% |

### Courier Earnings Boosters

| Incentive | Trigger | Bonus |
|-----------|---------|-------|
| Surge zone bonus | Working in high-demand zone | +$3–$8 per job |
| Eco-sort bonus | 90%+ recycling accuracy on job | +$2 per job |
| Completion streak | 10 consecutive jobs, no cancellation | +$25 |
| New market launch bonus | First 60 days in new city | +$5/job up to 50 jobs |
| 5-star rating bonus | Maintain ≥ 4.8 rating | +$1.50/job |

### Courier Weekly Earnings Potential

| Scenario | Jobs/Week | Avg Job Value | Weekly Gross | After Platform Cut |
|----------|----------|--------------|-------------|-------------------|
| Part-time (15 hrs) | 12 | $38 | $456 | $319 |
| Full-time (40 hrs) | 30 | $41 | $1,230 | $861 |
| Full-time + bonuses | 30 | $41 + $8 bonuses | $1,470 | $1,029 |
