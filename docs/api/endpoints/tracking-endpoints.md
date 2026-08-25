# Live Tracking Endpoints

Base path: `/api/v1/tracking`

All endpoints require `Authorization: ******`.

> **Note:** For real-time updates, use the Socket.io WebSocket connection instead of polling these REST endpoints. See [WebSocket Events](../websocket/events.md).

---

## `GET /tracking/:jobId`

Get the current tracking snapshot for a job (REST fallback).

**Roles:** `customer` (own job), `courier` (assigned), `admin`

**Response `200`:**
```json
{
  "jobId": "job_abc123def",
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

| Field | Description |
|---|---|
| `courierLocation` | Null if courier not yet assigned or location not yet broadcast |
| `etaMinutes` | Google Maps ETA; null if not en route |
| `lastUpdated` | ISO timestamp of last location broadcast |

**Error responses:**

| Status | Code | Description |
|---|---|---|
| 404 | `JOB_NOT_FOUND` | Job not found |
| 403 | `FORBIDDEN` | Not authorized to track this job |

---

## `POST /tracking/:jobId/location`

Broadcast the courier's current GPS coordinates. Called by the courier app every 5–10 seconds while on an active job.

**Roles:** `courier` (must be assigned courier for this job)

**Request body:**
```json
{
  "lat": 30.2652,
  "lng": -97.7415,
  "heading": 90.0,
  "speed": 40.0
}
```

**Response `204`:** No content.

**Side effects:**
- Location stored in Redis (ephemeral, TTL 30 seconds).
- Socket.io `tracking:location_update` event emitted to the customer's job room.
- ETA recalculated via Google Maps Distance Matrix API.

**Error responses:**

| Status | Code | Description |
|---|---|---|
| 403 | `FORBIDDEN` | Courier is not assigned to this job |
| 409 | `JOB_NOT_ACTIVE` | Job is not in a trackable state |

---

## Tracking Status States

| Status | Visible to Customer | ETA Shown |
|---|---|---|
| `pending` / `dispatching` | "Finding your hauler…" | No |
| `accepted` | "Hauler assigned" | No |
| `en_route` | Live map + ETA | Yes |
| `arrived` | "Hauler has arrived" | No |
| `loading` | "Items being loaded" | No |
| `in_transit` | "En route to disposal" | No |
| `completed` | "Job complete! 🎉" | No |

---

## Rate Limits

- `GET /tracking/:jobId`: 60/minute per user
- `POST /tracking/:jobId/location`: 120/minute per courier (≈ every 0.5 seconds)
