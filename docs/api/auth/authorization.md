# Authorization & RBAC Guide

## Roles

| Role | Description |
|---|---|
| `customer` | Posts jobs, tracks pickups, views green impact |
| `courier` | Receives offer pings, completes jobs, manages earnings |
| `admin` | Full platform access including fleet management and dispute resolution |

## Role-Based Access Matrix

| Endpoint | customer | courier | admin |
|---|---|---|---|
| `POST /auth/*` | ✅ | ✅ | ✅ |
| `GET /users/me` | ✅ | ✅ | ✅ |
| `POST /jobs/estimate` | ✅ | ❌ | ✅ |
| `POST /jobs` | ✅ | ❌ | ✅ |
| `GET /jobs` | ✅ (own) | ✅ (assigned) | ✅ (all) |
| `POST /jobs/:id/cancel` | ✅ (own) | ❌ | ✅ |
| `GET /offers/active` | ❌ | ✅ | ✅ |
| `POST /offers/:id/accept` | ❌ | ✅ | ❌ |
| `POST /tracking/:id/location` | ❌ | ✅ | ❌ |
| `GET /ledger/balance` | ✅ | ✅ | ✅ |
| `POST /ledger/payout` | ❌ | ✅ | ✅ |
| `GET /sds/cases` | ❌ | ❌ | ✅ |
| `GET /admin/*` | ❌ | ❌ | ✅ |

## Authorization Middleware

Authorization is enforced in the Express middleware stack:

```typescript
// Verify JWT and attach user to request
app.use(authenticate);

// Enforce role
router.get("/admin/users", authorize("admin"), listUsers);

// Resource ownership check
router.post("/jobs/:id/cancel", authorize("customer", "admin"), ownsJob, cancelJob);
```

### `authenticate` Middleware

Validates the `Authorization: ******` header, decodes the JWT, and attaches `req.user` to the request context.

Returns `401 UNAUTHORIZED` if the token is missing, malformed, or expired.

### `authorize(...roles)` Middleware

Checks `req.user.role` against the allowed roles list.

Returns `403 FORBIDDEN` if the user's role is not permitted.

### Resource Ownership Checks

For endpoints operating on user-owned resources (jobs, ledger entries), the middleware verifies that `req.user.id === resource.ownerId` before proceeding, unless the requester is an `admin`.

## Permission Escalation

Couriers unlock additional job categories by completing Academy courses and earning badges:

| Badge | Unlocks |
|---|---|
| `heavy-loads` | Heavy & bulky item jobs |
| `hazmat-level-1` | Low-hazard waste jobs |
| `hazmat-level-2` | Medium-hazard waste jobs |
| `e-waste-certified` | Electronics & e-waste jobs |

Badge requirements are checked during offer dispatch: only couriers with the required badge receive pings for restricted job categories.

## API Key Scopes

API keys issued to integrations carry explicit scopes (see [authentication.md](authentication.md)). The `authorize` middleware validates key scopes in addition to JWT roles.
