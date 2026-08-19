# Socket.io Namespace Documentation

## Default Namespace (`/`)

All authenticated users connect to the default namespace.

**Events received:**
- `job:status_changed`
- `notification:general`
- `batch:neighbor_alert`

**Rooms:**
- `user:{userId}` — auto-joined on connection
- `job:{jobId}` — joined via `join:job` emit

---

## Tracking Namespace (`/tracking`)

Used for high-frequency GPS telemetry (every 5–10 seconds).

**Who connects:** Customers + couriers with active jobs.

**Events emitted by client:**
- `courier:location_update`
- `courier:status_update`

**Events received:**
- `tracking:location_update`

**Rooms:**
- `tracking:job:{jobId}`

---

## Dispatch Namespace (`/dispatch`)

Used exclusively for offer ping delivery to couriers.

**Who connects:** Couriers in `online` state.

**Events received:**
- `offer:ping`
- `offer:expired`
- `offer:accepted`

**Rooms:**
- `dispatch:courier:{courierId}`

---

## Admin Namespace (`/admin`)

Real-time fleet and platform monitoring for admin users.

**Who connects:** Admin role only.

**Events received:**
- `fleet:location_update` — all active couriers
- `job:created` — new job posted
- `sds:case_flagged` — new SDS case requiring review
- `dispute:opened` — new customer dispute

---

## Connection Lifecycle

```
Client                      Server
  │                            │
  ├─── connect ──────────────► │  (with auth.token)
  │                            │  Validate JWT → attach user
  │◄── connect_confirm ────────┤
  │                            │
  ├─── join:job ─────────────► │  Room: job:{jobId}
  │                            │
  │◄── job:status_changed ─────┤  (when status changes)
  │◄── tracking:location ──────┤  (every ~5s while en route)
  │                            │
  ├─── leave:job ────────────► │
  │                            │
  ├─── disconnect ───────────► │  (cleanup rooms, update courier status)
```
