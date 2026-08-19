# Job Endpoints

Base path: `/api/v1/jobs`

All endpoints require `Authorization: ******`.

---

## `POST /jobs/estimate`

Submit 1–3 waste photos and receive an AI-generated itemized estimate using Google Vision API.

**Roles:** `customer`

**Request body:**
```json
{
  "imageUrls": [
    "https://s3.strplatform.com/uploads/pile-front.jpg",
    "https://s3.strplatform.com/uploads/pile-side.jpg"
  ],
  "address": "123 Elm St, Austin TX 78701",
  "notes": "Old furniture and yard waste near the driveway"
}
```

**Response `200`:**
```json
{
  "estimateId": "est_9f3a1b2c",
  "items": [
    { "name": "Sofa (2-seater)", "quantity": 1, "weightClass": "heavy" },
    { "name": "Bagged yard waste", "quantity": 4, "weightClass": "medium" }
  ],
  "volumeYd3": 3.5,
  "estimatedPrice": 175.00,
  "breakdown": {
    "baseFee": 50.00,
    "weightFee": 60.00,
    "distanceFee": 35.00,
    "disposalFee": 30.00
  },
  "expiresAt": "2025-01-15T11:00:00Z"
}
```

> Estimates expire after 1 hour. A new estimate is required to create a job after expiry.

**Error responses:**

| Status | Code | Description |
|---|---|---|
| 422 | `IMAGE_ANALYSIS_FAILED` | Vision API could not process the images |
| 429 | `RATE_LIMIT_EXCEEDED` | Estimate requests limited to 20/hour |

**WebSocket event triggered:** None (estimate only)

---

## `POST /jobs`

Create a new job from a valid estimate.

**Roles:** `customer`

**Request body:**
```json
{
  "estimateId": "est_9f3a1b2c",
  "addressId": "addr_44aabb",
  "scheduledAt": "2025-01-16T14:00:00Z",
  "notes": "Please ring the doorbell on arrival",
  "upcyclableItemIds": ["item_sofa_01"],
  "allowBatching": true
}
```

**Response `201`:**
```json
{
  "id": "job_abc123def",
  "customerId": "550e8400-...",
  "courierId": null,
  "status": "pending",
  "estimatedPrice": 175.00,
  "finalPrice": null,
  "scheduledAt": "2025-01-16T14:00:00Z",
  "address": {
    "street": "123 Elm St",
    "city": "Austin TX",
    "lat": 30.2672,
    "lng": -97.7431
  },
  "items": [...],
  "greenImpact": null,
  "createdAt": "2025-01-15T10:10:00Z",
  "updatedAt": "2025-01-15T10:10:00Z"
}
```

**After creation:**
1. Dispatch engine queues job for offer ping distribution.
2. Nearby batches are checked — a neighborhood alert is sent if batching is eligible.
3. Socket.io event `job:status_changed` emitted to the customer room.

**Error responses:**

| Status | Code | Description |
|---|---|---|
| 400 | `ESTIMATE_EXPIRED` | The estimate has expired |
| 400 | `ESTIMATE_NOT_FOUND` | Invalid estimate ID |
| 402 | `PAYMENT_REQUIRED` | No valid payment method on file |

---

## `GET /jobs`

List jobs for the current user.

**Roles:** `customer` (own jobs), `courier` (assigned jobs), `admin` (all)

**Query parameters:**

| Param | Type | Description |
|---|---|---|
| `status` | string | Filter by job status |
| `limit` | integer | Items per page (default 20, max 100) |
| `cursor` | string | Pagination cursor |

**Response `200`:**
```json
{
  "data": [ { ...Job }, { ...Job } ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "hasNext": true,
    "cursor": "eyJpZCI6ImFiYzEyMyJ9"
  }
}
```

---

## `GET /jobs/:jobId`

Get full details of a single job.

**Response `200`:** Full `Job` object.

**Error responses:**

| Status | Code | Description |
|---|---|---|
| 404 | `JOB_NOT_FOUND` | No job found with given ID |
| 403 | `FORBIDDEN` | Job belongs to another user |

---

## `POST /jobs/:jobId/cancel`

Cancel a job. Customers may cancel before `en_route` status. Admins may cancel at any stage.

**Roles:** `customer` (own, before `en_route`), `admin`

**Request body** (optional):
```json
{ "reason": "Change of plans" }
```

**Response `200`:** Updated `Job` object with `status: "cancelled"`.

**Error responses:**

| Status | Code | Description |
|---|---|---|
| 404 | `JOB_NOT_FOUND` | Job not found |
| 409 | `CANCELLATION_NOT_ALLOWED` | Job is in progress and cannot be cancelled |

**Cancellation policy:**
- Full refund if cancelled before hauler assigned.
- 50% refund if cancelled after hauler accepted but before arrival.
- No refund once hauler is `arrived`.

---

## Job Status Lifecycle

```
pending
  → dispatching         (dispatch engine queued offers)
    → offer_sent        (at least one hauler pinged)
      → accepted        (hauler accepted)
        → en_route      (hauler navigating to pickup)
          → arrived     (hauler at location)
            → loading   (items being loaded)
              → in_transit (driving to disposal site)
                → completed (disposal verified)
  → cancelled           (at any stage by customer/admin)
```

---

## Rate Limits

- `POST /jobs/estimate`: 20/hour per user
- `POST /jobs`: 10/hour per user
- `GET /jobs`: 120/minute per user
