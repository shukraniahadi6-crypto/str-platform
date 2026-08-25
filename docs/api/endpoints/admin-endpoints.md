# Admin Operations Endpoints

Base path: `/api/v1/admin`

All endpoints require `Authorization: ******` with `role: admin`.

---

## `GET /admin/users`

Paginated list of all platform users.

**Query parameters:**

| Param | Type | Description |
|---|---|---|
| `role` | string | Filter: `customer`, `courier`, `admin` |
| `status` | string | Filter: `active`, `suspended`, `pending_verification` |
| `limit` | integer | Default 50 |
| `cursor` | string | Pagination cursor |

**Response `200`:** Paginated list of `UserProfile` objects.

---

## `POST /admin/users/:userId/suspend`

Suspend a user account.

**Request body:**
```json
{ "reason": "Terms of service violation" }
```

**Response `200`:** Updated user profile.

---

## `POST /admin/users/:userId/verify`

Manually approve courier verification.

**Response `200`:** Updated user profile with `isVerified: true`.

---

## `GET /admin/jobs`

List all jobs with filtering.

**Query parameters:**

| Param | Type | Description |
|---|---|---|
| `status` | string | Job status filter |
| `from` | date-time | Created after |
| `to` | date-time | Created before |
| `courierId` | uuid | Filter by courier |
| `customerId` | uuid | Filter by customer |

---

## `GET /admin/analytics/overview`

Platform KPI summary.

**Response `200`:**
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

---

## `GET /admin/fleet/live`

Real-time view of all active couriers with location data.

**Response `200`:**
```json
[
  {
    "courierId": "courier_456",
    "name": "Mike R.",
    "location": { "lat": 30.2660, "lng": -97.7425 },
    "status": "en_route",
    "activeJobId": "job_abc123",
    "vehicleType": "pickup_truck"
  }
]
```

---

## `GET /admin/disputes`

List unresolved disputes.

**Response `200`:** Array of dispute objects with photos, chat logs, and GPS timelines.

---

## `POST /admin/disputes/:disputeId/resolve`

Resolve a dispute with a refund decision.

**Request body:**
```json
{
  "resolution": "refund_partial",
  "refundAmount": 50.00,
  "notes": "Customer reported incomplete cleanup; partial refund approved."
}
```

| `resolution` | Action |
|---|---|
| `refund_full` | Full customer refund; platform absorbs cost |
| `refund_partial` | Partial refund from escrow |
| `no_refund` | No refund; funds released to courier |

**Response `200`:** Resolved dispute with updated ledger entries.

---

## `GET /admin/batching/config`

Get current neighborhood batching configuration.

**Response `200`:**
```json
{
  "radiusM": 500,
  "maxParticipants": 10,
  "discountPct": 25,
  "windowMinutes": 30,
  "enabledRegions": ["austin-tx", "dallas-tx"]
}
```

---

## `PUT /admin/batching/config`

Update batching parameters.

**Request body:**
```json
{
  "radiusM": 600,
  "discountPct": 30
}
```

**Response `200`:** Updated configuration.

---

## `GET /admin/sds/cases`

See [SDS Endpoints](sds-endpoints.md) for the full SDS case management reference.
