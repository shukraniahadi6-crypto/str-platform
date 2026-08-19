# WebSocket Event Reference

STR Platform uses **Socket.io** for real-time communication. The server runs at `wss://api.strplatform.com`.

## Connection

```typescript
import { io } from "socket.io-client";

const socket = io("wss://api.strplatform.com", {
  auth: { token: accessToken },
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
```

The `token` in `auth` is the standard ****** obtained from `/auth/login`.

## Namespaces

| Namespace | Description | Who connects |
|---|---|---|
| `/` (default) | General events & notifications | All authenticated users |
| `/tracking` | Live job GPS events | Customers + couriers on active jobs |
| `/dispatch` | Offer pings | Couriers only |
| `/admin` | Fleet & platform events | Admins only |

See [namespaces.md](namespaces.md) for full namespace documentation.

---

## Client → Server Events

### `join:job`
Join a job room to receive real-time updates.

```typescript
socket.emit("join:job", { jobId: "job_abc123def" });
```

### `leave:job`
Leave a job room.

```typescript
socket.emit("leave:job", { jobId: "job_abc123def" });
```

### `courier:location_update`
Courier broadcasts current GPS coordinates.

```typescript
// Emit every 5-10 seconds while on active job
socket.emit("courier:location_update", {
  jobId: "job_abc123def",
  lat: 30.2652,
  lng: -97.7415,
  heading: 90.0,
  speed: 40.0,
});
```

### `courier:status_update`
Courier updates job status (arrived, loading complete, etc.).

```typescript
socket.emit("courier:status_update", {
  jobId: "job_abc123def",
  status: "arrived",
});
```

---

## Server → Client Events

### `job:status_changed`
Fired whenever a job's status changes.

**Payload:**
```typescript
{
  jobId: string;
  status: "pending" | "dispatching" | "offer_sent" | "accepted" | "en_route"
         | "arrived" | "loading" | "in_transit" | "completed" | "cancelled";
  updatedAt: string; // ISO 8601
}
```

**Example:**
```typescript
socket.on("job:status_changed", ({ jobId, status }) => {
  console.log(`Job ${jobId} is now: ${status}`);
});
```

---

### `tracking:location_update`
Real-time courier GPS update for a customer's job.

**Payload:**
```typescript
{
  jobId: string;
  lat: number;
  lng: number;
  heading: number;
  speed: number;      // km/h
  etaMinutes: number | null;
  timestamp: string;  // ISO 8601
}
```

---

### `offer:ping`
Sent to a courier when a new job offer is available. The courier has 30 seconds to respond.

**Namespace:** `/dispatch`

**Payload:**
```typescript
{
  offerId: string;
  jobId: string;
  guaranteedPay: number;
  distanceKm: number;
  wasteCategory: string;
  hazardBadge: string | null;
  routePreview: {
    pickupAddress: string;
    dropoffAddress: string;
    estimatedDurationMin: number;
  };
  expiresAt: string; // ISO 8601 — exactly 30 seconds from now
}
```

---

### `offer:accepted`
Confirmation that the courier successfully accepted an offer.

**Payload:**
```typescript
{
  offerId: string;
  jobId: string;
  job: Job; // Full job object
}
```

---

### `offer:expired`
The 30-second window passed without a response.

**Payload:**
```typescript
{ offerId: string; jobId: string; }
```

---

### `batch:neighbor_alert`
Sent to nearby customers when a neighborhood batch opens.

**Payload:**
```typescript
{
  batchId: string;
  scheduledAt: string;
  discountPct: number;
  neighborCount: number;
  distanceM: number;
}
```

---

### `notification:general`
General platform notification.

**Payload:**
```typescript
{
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  body: string;
  actionUrl?: string;
  createdAt: string;
}
```

---

### `error`
Socket-level error from the server.

**Payload:**
```typescript
{
  code: string;      // e.g. "AUTH_FAILED", "ROOM_NOT_FOUND"
  message: string;
}
```

---

## Error Handling

```typescript
socket.on("connect_error", (err) => {
  if (err.message === "AUTH_FAILED") {
    // Refresh token and reconnect
    refreshAccessToken().then((token) => {
      socket.auth.token = token;
      socket.connect();
    });
  }
});

socket.on("error", ({ code, message }) => {
  console.error(`Socket error [${code}]: ${message}`);
});
```

---

## Reconnection Strategy

Socket.io's built-in reconnection is configured with:
- Max 5 attempts
- Exponential backoff: 1s, 2s, 4s, 8s, 16s
- After 5 failures → show "Connection lost" UI and prompt user to refresh
