# Financial Ledger & Payout Endpoints

Base path: `/api/v1/ledger`

---

## Double-Entry Ledger Model

Every financial transaction creates two ledger entries — a debit and a credit — ensuring `Σ debits = Σ credits` at all times.

**Example — Customer pays for job:**
```
DEBIT  customer_550e...  $175.00  "Job job_abc123 payment"
CREDIT platform_escrow   $175.00  "Job job_abc123 escrow hold"
```

**Example — Hauler paid after completion:**
```
DEBIT  platform_escrow   $131.25  "Hauler payout for job_abc123"
CREDIT courier_456...    $131.25  "Earnings for job_abc123"

DEBIT  platform_escrow   $43.75   "Platform fee for job_abc123"
CREDIT platform_revenue  $43.75   "Platform 25% fee"
```

---

## `GET /ledger/balance`

Get the current wallet balance for the authenticated user.

**Response `200`:**
```json
{
  "available": 243.50,
  "pending": 62.50,
  "currency": "USD"
}
```

| Field | Description |
|---|---|
| `available` | Funds available for instant payout |
| `pending` | Funds held in escrow (in-progress jobs) |

---

## `GET /ledger/entries`

Paginated transaction history.

**Query parameters:**

| Param | Type | Description |
|---|---|---|
| `limit` | integer | Items per page (default 20) |
| `cursor` | string | Pagination cursor |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "entry_001",
      "type": "credit",
      "amount": 62.50,
      "currency": "USD",
      "description": "Earnings for job_abc123",
      "relatedJobId": "job_abc123",
      "createdAt": "2025-01-15T15:30:00Z"
    }
  ],
  "pagination": {
    "total": 87,
    "limit": 20,
    "hasNext": true,
    "cursor": "eyJpZCI6ImVudHJ5XzA2MCJ9"
  }
}
```

---

## `POST /ledger/payout`

Request an instant payout to a connected Stripe account.

**Roles:** `courier`

**Request body:**
```json
{
  "amount": 100.00,
  "destinationAccountId": "acct_stripe_abc123"
}
```

**Response `202`:**
```json
{
  "payoutId": "po_stripe_xyz",
  "amount": 100.00,
  "estimatedArrival": "2025-01-15T15:45:00Z"
}
```

> Instant payouts via Stripe Connect arrive within minutes for eligible debit cards; standard bank transfers arrive in 1-2 business days.

**Error responses:**

| Status | Code | Description |
|---|---|---|
| 400 | `INSUFFICIENT_BALANCE` | Requested amount exceeds available balance |
| 400 | `PAYOUT_AMOUNT_TOO_LOW` | Minimum payout is $1.00 |
| 402 | `STRIPE_ACCOUNT_NOT_CONNECTED` | No Stripe Connect account linked |

---

## Rate Limits

- `GET /ledger/balance`: 120/minute
- `GET /ledger/entries`: 60/minute
- `POST /ledger/payout`: 5/hour
