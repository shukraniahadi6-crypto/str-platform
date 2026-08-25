# Offer & Bidding Endpoints

Base path: `/api/v1/offers`

All endpoints require `Authorization: ******`.

---

## How the Offer Ping System Works

When a job enters the `dispatching` state:

1. The dispatch engine finds eligible couriers within the configured radius, sorted by proximity.
2. The top courier receives a **30-second countdown offer ping** via Socket.io (`offer:ping` event).
3. If the courier accepts → job transitions to `accepted`.
4. If the courier declines or the timer expires → next courier in queue is pinged (cascading).
5. If no couriers accept after the cascade → job returns to `pending` for re-dispatch.

---

## `GET /offers/active`

Get all active (unexpired) offer pings for the authenticated courier.

**Roles:** `courier`

**Response `200`:**
```json
[
  {
    "id": "offer_xyz789",
    "jobId": "job_abc123def",
    "courierId": "courier_456",
    "guaranteedPay": 62.50,
    "distanceKm": 3.2,
    "wasteCategory": "household",
    "hazardBadge": null,
    "routePreview": {
      "pickupAddress": "123 Elm St, Austin TX",
      "dropoffAddress": "Austin Transfer Station, 500 Recycling Blvd",
      "estimatedDurationMin": 28
    },
    "expiresAt": "2025-01-15T10:10:30Z",
    "status": "pending"
  }
]
```

| Field | Description |
|---|---|
| `guaranteedPay` | Locked-in earnings for completing the job |
| `distanceKm` | Distance from courier's current location to pickup |
| `hazardBadge` | Required badge (null = no restriction) |
| `expiresAt` | 30-second countdown deadline |

---

## `POST /offers/:offerId/accept`

Accept an offer ping and claim the job.

**Roles:** `courier`

**Response `200`:** Full `Job` object (with status `accepted`).

Socket.io events emitted after acceptance:
- `job:status_changed` → customer room
- `offer:accepted` → courier room

**Error responses:**

| Status | Code | Description |
|---|---|---|
| 404 | `OFFER_NOT_FOUND` | Offer does not exist |
| 409 | `OFFER_EXPIRED` | 30-second window has passed |
| 409 | `OFFER_ALREADY_ACCEPTED` | Another courier claimed the job first |
| 403 | `BADGE_REQUIRED` | Courier lacks required capability badge |

---

## `POST /offers/:offerId/decline`

Decline an offer ping. The dispatch engine will cascade to the next courier.

**Roles:** `courier`

**Response `204`:** No content.

---

## Offer Pay Breakdown

The `guaranteedPay` is calculated upfront:

```
guaranteedPay = basePay + distanceBonus + weightBonus + estimatedTip
```

| Component | Description |
|---|---|
| `basePay` | Flat fee per pickup (configured per region) |
| `distanceBonus` | $0.50/km from courier to pickup + pickup to disposal |
| `weightBonus` | Additional fee for heavy/bulky items |
| `estimatedTip` | Historical average tip for similar jobs (informational) |

---

## Rate Limits

- `GET /offers/active`: 60/minute
- `POST /offers/:id/accept`: 30/minute
