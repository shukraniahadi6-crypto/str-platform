# Mock Responses for Development

Use these mock responses when building frontend features without a running backend.

## Auth

### POST /auth/login
```json
{
  "accessToken": "******",
  "refreshToken": "mock_refresh_token_abc123",
  "expiresIn": 900,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "test@example.com",
    "name": "Test User",
    "role": "customer",
    "isVerified": true,
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

## Jobs

### GET /jobs
```json
{
  "data": [
    {
      "id": "job_mock_001",
      "status": "completed",
      "estimatedPrice": 155.00,
      "finalPrice": 160.00,
      "scheduledAt": "2025-01-14T14:00:00Z",
      "address": {
        "street": "123 Elm St",
        "city": "Austin TX",
        "lat": 30.2672,
        "lng": -97.7431
      },
      "greenImpact": {
        "landfillDiversionPct": 82,
        "co2SavedKg": 95,
        "treesEquivalent": 4,
        "upcycledItems": 1,
        "shareCard": "https://share.strplatform.com/impact/job_mock_001"
      },
      "createdAt": "2025-01-14T10:00:00Z",
      "updatedAt": "2025-01-14T16:00:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 20,
    "hasNext": false,
    "cursor": null
  }
}
```

### POST /jobs/estimate
```json
{
  "estimateId": "est_mock_001",
  "items": [
    { "name": "Sofa (2-seater)", "quantity": 1, "weightClass": "heavy" },
    { "name": "Bagged yard waste", "quantity": 3, "weightClass": "medium" }
  ],
  "volumeYd3": 2.8,
  "estimatedPrice": 155.00,
  "breakdown": {
    "baseFee": 50.00,
    "weightFee": 55.00,
    "distanceFee": 30.00,
    "disposalFee": 20.00
  },
  "expiresAt": "2025-01-15T11:00:00Z"
}
```

## Tracking

### GET /tracking/:jobId
```json
{
  "jobId": "job_mock_001",
  "status": "en_route",
  "courierLocation": {
    "lat": 30.2650,
    "lng": -97.7410,
    "heading": 45.0,
    "speed": 35.0
  },
  "etaMinutes": 8,
  "lastUpdated": "2025-01-15T14:22:05Z"
}
```

## Ledger

### GET /ledger/balance
```json
{
  "available": 243.50,
  "pending": 62.50,
  "currency": "USD"
}
```

## Academy

### GET /academy/badges
```json
[
  {
    "id": "badge_heavy",
    "name": "Heavy Lifting Legend",
    "description": "Completed Heavy Loads Safety course",
    "iconUrl": "https://cdn.strplatform.com/badges/heavy-loads.svg",
    "earnedAt": "2025-01-10T09:30:00Z"
  }
]
```

## Admin Analytics

### GET /admin/analytics/overview
```json
{
  "totalJobs": 1250,
  "completedJobs": 1180,
  "activeHaulers": 42,
  "totalRevenue": 218750.00,
  "platformFeeRevenue": 54687.50,
  "landfillDiversionPct": 82.5,
  "co2SavedKg": 175000,
  "avgJobRating": 4.8,
  "activeJobsNow": 7
}
```
