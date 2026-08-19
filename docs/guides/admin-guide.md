# Admin Operations Guide

## Accessing the Admin Dashboard

Admin accounts are created by the platform engineering team. Log in at `https://app.strplatform.com/admin` using your admin credentials.

## Live Fleet Map

The **Fleet Map** shows real-time positions of all active couriers:

- Green dot: Online, waiting for jobs
- Blue dot: En route to pickup
- Orange dot: Loading or in transit
- Red dot: Flagged (SDS review pending)

Click any dot to see courier details and active job status.

## SDS Safety Queue

Hazardous material detections appear in **Safety → SDS Cases**:

1. Review the flagged job and detected hazards
2. View the uploaded waste photos
3. Choose:
   - **Approve** — Dispatch job (specify required courier badge)
   - **Reject** — Block job and notify customer
4. Add admin notes for audit trail

Critical hazards (propane tanks, mercury, asbestos) require immediate review and should be escalated to the safety team.

## Dispute Resolution

Open disputes appear in **Operations → Disputes**:

1. Review the evidence:
   - Customer complaint description
   - Before/After photos from courier
   - GPS timeline (arrival, loading, departure)
   - In-app chat transcript
2. Select resolution:
   - **Full Refund** — Customer charged nothing; platform absorbs cost
   - **Partial Refund** — Split from escrow
   - **No Refund** — Release funds to courier
3. Add internal notes
4. Click **Resolve** — ledger entries are created automatically

## User Management

In **Users → All Users**:

- Search and filter by role, status, join date
- View profile, verification status, job history
- **Suspend** an account with reason (account blocked immediately)
- **Verify** a courier manually if automated review fails
- **View Ledger** — see full transaction history for any user

## Neighborhood Batching Configuration

In **Settings → Batching**:

| Setting | Default | Description |
|---|---|---|
| Radius | 500 m | Distance within which neighbors are alerted |
| Max Participants | 10 | Maximum jobs per batch |
| Discount | 25% | Discount applied to each job in batch |
| Window | 30 min | Time window after batch creation for neighbors to join |
| Enabled Regions | All | Toggle batching by region |

Changes take effect for new batches immediately.

## Platform Analytics

In **Analytics → Overview**:

- **Daily/Weekly/Monthly** job volume
- **Revenue** breakdown (platform fees, gross job value)
- **Courier Performance** (avg rating, jobs completed, earnings)
- **Eco Metrics** (total CO2 saved, landfill diversion rate, upcycled items)
- **Funnel** (estimate → job creation → dispatch → completion rates)

## API Key Management

In **Settings → API Keys**:

- Create scoped API keys for third-party integrations
- Set expiry dates and IP allowlists
- Revoke keys immediately if compromised
- View usage logs per key

## Bulk Operations

Admins can trigger bulk operations from the CLI or admin API:

```bash
# Re-dispatch all stuck jobs (pending > 30 min)
curl -X POST "$BASE/admin/jobs/redispatch-stuck" \
  -H "X-API-Key: str_admin_xxxx"

# Recalculate green impact for a date range
curl -X POST "$BASE/admin/green-impact/recalculate" \
  -H "X-API-Key: str_admin_xxxx" \
  -d '{"from": "2025-01-01", "to": "2025-01-31"}'
```
