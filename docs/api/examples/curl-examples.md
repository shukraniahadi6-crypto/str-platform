# cURL Examples

All examples use the production base URL. Replace `$TOKEN` with your access token.

```bash
export BASE="https://api.strplatform.com/api/v1"
export TOKEN="your_access_token_here"
```

---

## Auth

### Register
```bash
curl -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "Str0ng!Pass",
    "name": "Jane Smith",
    "role": "customer"
  }'
```

### Login
```bash
curl -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "jane@example.com", "password": "Str0ng!Pass"}'
```

### Refresh Token
```bash
curl -X POST "$BASE/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "your_refresh_token"}'
```

---

## Users

### Get Profile
```bash
curl "$BASE/users/me" \
  -H "Authorization: ******"
```

### Update Profile
```bash
curl -X PATCH "$BASE/users/me" \
  -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane M. Smith", "phone": "+15559876543"}'
```

---

## Jobs

### Create Estimate
```bash
curl -X POST "$BASE/jobs/estimate" \
  -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrls": ["https://s3.strplatform.com/uploads/pile.jpg"],
    "address": "123 Elm St, Austin TX 78701"
  }'
```

### Create Job
```bash
curl -X POST "$BASE/jobs" \
  -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{
    "estimateId": "est_9f3a1b2c",
    "addressId": "addr_44aabb",
    "scheduledAt": "2025-01-16T14:00:00Z",
    "allowBatching": true
  }'
```

### List Jobs
```bash
curl "$BASE/jobs?status=completed&limit=10" \
  -H "Authorization: ******"
```

### Get Job
```bash
curl "$BASE/jobs/job_abc123def" \
  -H "Authorization: ******"
```

### Cancel Job
```bash
curl -X POST "$BASE/jobs/job_abc123def/cancel" \
  -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Change of plans"}'
```

---

## Offers (Courier)

### List Active Offers
```bash
curl "$BASE/offers/active" \
  -H "Authorization: ******"
```

### Accept Offer
```bash
curl -X POST "$BASE/offers/offer_xyz789/accept" \
  -H "Authorization: ******"
```

### Decline Offer
```bash
curl -X POST "$BASE/offers/offer_xyz789/decline" \
  -H "Authorization: ******"
```

---

## Tracking

### Get Tracking Snapshot
```bash
curl "$BASE/tracking/job_abc123def" \
  -H "Authorization: ******"
```

### Update Courier Location
```bash
curl -X POST "$BASE/tracking/job_abc123def/location" \
  -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{"lat": 30.2652, "lng": -97.7415, "heading": 90, "speed": 40}'
```

---

## Ledger

### Get Balance
```bash
curl "$BASE/ledger/balance" \
  -H "Authorization: ******"
```

### List Transactions
```bash
curl "$BASE/ledger/entries?limit=20" \
  -H "Authorization: ******"
```

### Request Payout
```bash
curl -X POST "$BASE/ledger/payout" \
  -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100.00, "destinationAccountId": "acct_stripe_abc123"}'
```

---

## Academy

### List Courses
```bash
curl "$BASE/academy/courses" \
  -H "Authorization: ******"
```

### Submit Quiz
```bash
curl -X POST "$BASE/academy/courses/course_hazmat1/complete" \
  -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"questionId": "q_01", "selectedOption": 1},
      {"questionId": "q_02", "selectedOption": 3}
    ]
  }'
```

---

## Admin

### Platform Analytics
```bash
curl "$BASE/admin/analytics/overview" \
  -H "Authorization: ******"
```

### List All Users
```bash
curl "$BASE/admin/users?role=courier&limit=50" \
  -H "Authorization: ******"
```

### Resolve Dispute
```bash
curl -X POST "$BASE/admin/disputes/dispute_001/resolve" \
  -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{
    "resolution": "refund_partial",
    "refundAmount": 50.00,
    "notes": "Partial cleanup confirmed in photos"
  }'
```
