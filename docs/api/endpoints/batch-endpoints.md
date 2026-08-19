# Batching & Neighborhood Endpoints

Base path: `/api/v1/batches`

---

## How Neighborhood Batching Works

When a customer schedules a pickup, the platform checks for open batches within 500 m. If one exists, nearby neighbors receive a push notification:

> *"A neighbor on Elm St booked a pickup for Tuesday 2 PM! Add your items to join the run and save 25%!"*

Batching reduces cost for customers, increases earnings per route for haulers, and cuts carbon emissions per job.

---

## `GET /batches/nearby`

Find open neighborhood batches near a location.

**Authentication:** Required

**Query parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `lat` | number | ✅ | Latitude |
| `lng` | number | ✅ | Longitude |
| `radiusM` | integer | ❌ | Search radius in meters (default 500) |

**Response `200`:**
```json
[
  {
    "batchId": "batch_001",
    "scheduledAt": "2025-01-16T14:00:00Z",
    "discountPct": 25,
    "participantCount": 2,
    "maxParticipants": 10,
    "pickupWindowEnd": "2025-01-16T14:30:00Z",
    "distanceM": 320
  }
]
```

**PostGIS query used:**
```sql
SELECT * FROM batches
WHERE ST_DWithin(
  location::geography,
  ST_SetSRID(ST_MakePoint($lng, $lat), 4326)::geography,
  $radiusM
)
AND status = 'open'
ORDER BY scheduled_at ASC;
```

---

## `POST /batches/:batchId/join`

Join an existing batch by creating a job linked to that batch. The customer receives the batch discount automatically.

**Roles:** `customer`

**Request body:** Same as `POST /jobs` (see [Job Endpoints](job-endpoints.md)).

**Response `201`:** `Job` object with `batchId` field set and `estimatedPrice` reflecting the discount.

**Error responses:**

| Status | Code | Description |
|---|---|---|
| 404 | `BATCH_NOT_FOUND` | Batch does not exist |
| 409 | `BATCH_FULL` | Batch has reached max participants |
| 409 | `BATCH_CLOSED` | Batch window has passed |
| 409 | `ALREADY_IN_BATCH` | Customer already in this batch |

---

## Rate Limits

- `GET /batches/nearby`: 60/minute
- `POST /batches/:id/join`: 10/hour
