# STR Platform — Operations & Logistics Blueprint

## 1. Courier Onboarding & Verification

### Step-by-Step Onboarding Process

#### Step 1: Application (10 minutes)
- Courier downloads the STR app and selects "Become a Courier"
- Submits: full name, email, phone, address, date of birth
- Selects vehicle type: cargo van, pickup truck, SUV, bicycle (small loads only)
- Agrees to Courier Terms of Service and Independent Contractor Agreement

#### Step 2: Background Check (24–72 hours)
- STR uses a third-party background check provider (e.g., Checkr)
- Checks: criminal history, driving record (MVR), sex offender registry
- Disqualifying factors: felony convictions within 7 years, DUI within 3 years, active warrants
- Couriers notified via email with result; disputes handled per FCRA guidelines

#### Step 3: Vehicle Inspection
- Courier submits photos of: all 4 sides of vehicle, interior cargo area, odometer, insurance card
- STR ops team reviews within 48 hours
- Requirements: vehicle < 15 years old, roadworthy, no visible structural damage, cargo area cleanable
- Cargo van / pickup preferred; minimum 40 cubic feet cargo capacity required for standard jobs

#### Step 4: Document Verification
- Valid driver's license (scan via app)
- Proof of personal auto insurance (minimum state liability requirements)
- STR recommends (and subsidizes post-200 jobs): commercial cargo liability insurance add-on
- If operating as a business entity: EIN required for 1099 tax purposes

#### Step 5: Eco-Certification Training
- Mandatory: 45-minute online training module (self-paced)
- Topics: waste sorting (recyclables, compostables, e-waste, hazardous), safe handling, local recycling guidelines
- Mandatory quiz: minimum 80% pass rate
- Re-certification required annually

#### Step 6: Orientation & First Job
- Courier receives welcome kit: STR branded gear (optional purchase), sorting guide laminate card
- First 3 jobs completed with "Guided Mode" — turn-by-turn app instructions with extra prompts
- STR support team available via in-app chat during first 3 jobs

### Courier Requirements Summary

| Requirement | Standard | Notes |
|-------------|---------|-------|
| Age | 21+ | Insurance requirement |
| Driver's license | Valid, state-issued | No commercial license required |
| Vehicle | Cargo van, pickup, or SUV | Min. 40 cu ft cargo |
| Insurance | Personal auto (minimum state requirements) | |
| Background check | Clear (no felony within 7 years) | |
| Eco-certification | Passed | Annual renewal |
| Smartphone | iOS 14+ or Android 10+ | For courier app |

---

## 2. Service Workflow

### Standard Pickup Flow

```
Customer Request
      ↓
Job Posted to Courier Pool (geofenced radius)
      ↓
Courier Accepts (within 5 min or re-broadcast)
      ↓
Courier En Route (customer receives ETA + live tracking)
      ↓
Courier Arrives → Confirms arrival in app
      ↓
Courier Loads Waste → Photos taken (before/after)
      ↓
Waste Sorted → Courier marks categories in app
      ↓
Courier Departs → Routes to correct facility
      ↓
Drop-off Confirmed → Facility QR code scanned
      ↓
Job Marked Complete → Customer notified
      ↓
Payment Released → Courier paid within 2 hours (instant pay option)
      ↓
Ratings & Eco-Impact Card Sent to Customer
```

### Job Status States

| Status | Description |
|--------|-------------|
| `pending` | Job created, awaiting courier acceptance |
| `accepted` | Courier accepted; en route to customer |
| `arrived` | Courier confirmed arrival at pickup location |
| `in_progress` | Loading in progress |
| `in_transit` | Waste loaded; courier en route to disposal facility |
| `completed` | Drop-off confirmed; job closed |
| `cancelled` | Job cancelled (by customer or courier); reason logged |
| `disputed` | Post-completion dispute raised |

### Cancellation Policy

| Cancellation Timing | Customer Fee | Courier Compensation |
|--------------------|-------------|---------------------|
| > 30 min before pickup | Free | None |
| 10–30 min before pickup | $3 fee | $3 penalty compensation to courier |
| < 10 min before pickup | $5 fee | $5 penalty compensation to courier |
| Courier no-show | No fee | 3 strikes → courier suspension |

---

## 3. Quality & Safety Standards

### Waste Handling Standards

| Waste Type | Handling Protocol |
|------------|-----------------|
| Standard household bags | Load in cargo; transport to nearest partner facility |
| Recyclables (cardboard, plastic, glass, metal) | Sort on-site; deliver to certified recycling center |
| Organic / compostable waste | Separate bin required; deliver to composting partner |
| E-waste (electronics) | Cannot be mixed; deliver to certified e-waste facility |
| Hazardous materials (paint, chemicals, batteries) | Requires hazmat flag in app; STR dispatches certified hazmat courier |
| Medical/biohazard waste | Not accepted on standard platform |
| Construction debris | Separate job category; requires cargo van minimum |

### Safety Requirements for Couriers

- Non-slip gloves provided or purchased (STR sells in courier store at cost)
- Closed-toe shoes required for all pickups
- Heavy items (>50 lbs): mechanical lifting aid recommended; STR app warns courier
- Do not enter customer's home — all pickups from doorstep, lobby, or designated outdoor area
- If unsafe situation encountered: courier may cancel job via app with "Safety Concern" flag; no penalty applied

### Vehicle Cleanliness Standards

- Cargo area must be clean before each job (no previous waste residue)
- Monthly self-inspection photos submitted via app
- Random audits by STR ops team (5% of couriers per month)
- Failed inspection: 7-day suspension; re-inspection required

---

## 4. Dispute Resolution

### Dispute Categories

| Category | Common Causes | Resolution Path |
|----------|--------------|----------------|
| **Item not collected** | Courier didn't take all listed items | 24-hour resolution; partial refund if confirmed |
| **Damage to property** | Courier caused damage during pickup | Customer files claim; STR reviews photos; insurance claim if needed |
| **Overcharge** | Customer disputes pricing | Ops team reviews job details; refund if pricing error confirmed |
| **Eco-routing complaint** | Customer concerned waste wasn't recycled | Ops reviews drop-off confirmation; re-education or refund if valid |
| **Courier conduct** | Rudeness, no-show, unsafe behavior | Ops investigation; written warning or permanent deactivation |
| **Payment dispute** | Charge not recognized | Standard Stripe chargeback process; STR cooperates with bank |

### Dispute SLA

| Priority | Definition | Response Time | Resolution Target |
|----------|-----------|--------------|-----------------|
| P1 — Safety incident | Property damage, injury, threat | 1 hour | 24 hours |
| P2 — Financial dispute | Overcharge, missing payment | 4 hours | 48 hours |
| P3 — Service quality | Item not collected, conduct | 8 hours | 72 hours |
| P4 — General feedback | App issue, suggestion | 24 hours | 5 business days |

### Resolution Decision Tree

```
Dispute Filed
    ↓
Automated acknowledgment sent within 1 hour
    ↓
Ops agent reviews job photos, GPS data, and ratings
    ↓
Is evidence conclusive?
  Yes → Apply standard resolution (refund / compensation)
  No → Contact both parties for statements (24-hour window)
    ↓
Resolution applied → Both parties notified
    ↓
Party appeals? → Escalated to senior ops; decision final
```

---

## 5. Support System & SLAs

### Support Channels

| Channel | Hours | Response Target |
|---------|-------|----------------|
| In-app chat (AI + human) | 24/7 | < 2 min (AI), < 10 min (human) |
| Email support | 24/7 | < 4 hours |
| Phone support (Premium/Enterprise only) | 8am–8pm local | < 3 min hold |
| B2B dedicated account manager | Business hours | < 1 hour |

### Support Tier Definitions

| Tier | Included In | Support Level |
|------|------------|--------------|
| Standard | Free & Basic users | In-app chat + email |
| Priority | Pro subscribers | Priority queue in chat; < 5 min response |
| Dedicated | Premium & Enterprise | Named account manager; phone support |

### Escalation Matrix

| Issue Level | L1 (Bot) | L2 (Support Agent) | L3 (Ops Manager) | L4 (VP Ops) |
|-------------|---------|-------------------|-----------------|------------|
| FAQ / tracking | ✅ | | | |
| Booking changes | ✅ | ✅ | | |
| Refund requests | | ✅ | ✅ | |
| Safety incidents | | | ✅ | ✅ |
| Legal / PR risk | | | | ✅ |

### Key Support SLAs

| Metric | Target |
|--------|--------|
| First response time (in-app chat) | < 2 minutes |
| Resolution time (P3 disputes) | < 72 hours |
| CSAT score | > 4.5 / 5.0 |
| Escalation rate (issues requiring L3+) | < 5% of tickets |
| Ticket volume per 100 jobs | < 3 tickets |

---

## 6. Compliance & Regulatory Framework

### Waste Transport Regulations

- STR couriers must comply with all local, state, and federal waste transport regulations
- Hazardous materials transport requires DOT certification (handled by specialist couriers only)
- E-waste: couriers must deliver to EPA-certified e-Stewards or R2-certified facilities only
- STR maintains a database of approved drop-off partners per market; couriers cannot use unapproved facilities

### Insurance Requirements

| Coverage Type | Minimum | STR Recommendation |
|--------------|---------|-------------------|
| Personal auto liability | State minimum | $100K/$300K |
| Cargo liability | Not required initially | $25K after 200 jobs (STR subsidized) |
| General liability (business use) | Not required initially | $1M (Enterprise couriers) |

### Independent Contractor Classification

- All couriers operate as independent contractors (1099-NEC)
- STR does not control work hours, methods, or routes
- Couriers may work for competing platforms simultaneously
- Annual 1099 forms issued for earnings > $600
- STR complies with applicable state AB5/gig economy reclassification rules; legal counsel reviews per state

### Data Privacy

- Customer and courier PII handled per GDPR / CCPA standards
- Location data collected only during active job sessions
- Data retention: job data retained 36 months; PII deleted on account closure per request
- Annual security audit and penetration test required
