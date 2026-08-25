# API Changelog

## v1.0.0 — 2025-01-15

**Initial release of the STR Platform REST API v1.**

### New Endpoints

**Auth**
- `POST /auth/register` — New user registration
- `POST /auth/login` — Authentication
- `POST /auth/refresh` — Token refresh
- `POST /auth/logout` — Token revocation
- `POST /auth/password/reset-request` — Password reset flow
- `POST /auth/password/reset` — Password reset confirmation

**Users**
- `GET /users/me` — Get profile
- `PATCH /users/me` — Update profile
- `PUT /users/me/preferences` — Update preferences
- `POST /users/me/verify` — Submit verification documents

**Jobs**
- `POST /jobs/estimate` — AI snap-to-estimate
- `POST /jobs` — Create job
- `GET /jobs` — List jobs
- `GET /jobs/:jobId` — Get job
- `POST /jobs/:jobId/cancel` — Cancel job

**Offers**
- `GET /offers/active` — Active offer pings
- `POST /offers/:offerId/accept` — Accept offer
- `POST /offers/:offerId/decline` — Decline offer

**Tracking**
- `GET /tracking/:jobId` — Tracking snapshot
- `POST /tracking/:jobId/location` — Courier location update

**Batches**
- `GET /batches/nearby` — Nearby open batches
- `POST /batches/:batchId/join` — Join batch

**Upcycle**
- `GET /upcycle/partners` — Donation partner locations
- `GET /jobs/:jobId/green-impact` — Green impact card

**Ledger**
- `GET /ledger/balance` — Wallet balance
- `GET /ledger/entries` — Transaction history
- `POST /ledger/payout` — Request payout

**SDS**
- `POST /sds/analyze` — Hazard analysis
- `GET /sds/cases` — SDS cases list
- `POST /sds/cases/:caseId/review` — Review SDS case

**Academy**
- `GET /academy/courses` — Course list
- `GET /academy/courses/:courseId` — Course details
- `POST /academy/courses/:courseId/complete` — Submit quiz
- `GET /academy/badges` — Earned badges

**Admin**
- `GET /admin/users` — User list
- `POST /admin/users/:userId/suspend` — Suspend user
- `POST /admin/users/:userId/verify` — Approve verification
- `GET /admin/jobs` — All jobs
- `GET /admin/analytics/overview` — Platform KPIs
- `GET /admin/fleet/live` — Live fleet map
- `GET /admin/disputes` — Open disputes
- `POST /admin/disputes/:id/resolve` — Resolve dispute
- `GET /admin/batching/config` — Batching config
- `PUT /admin/batching/config` — Update batching config

### WebSocket Namespaces
- Default `/` — General notifications
- `/tracking` — GPS telemetry
- `/dispatch` — Offer pings
- `/admin` — Fleet monitoring

### Infrastructure
- Rate limiting: 60 req/min (Free), 300 (Pro), 1200 (Enterprise)
- Cursor-based pagination on all list endpoints
- Swagger UI at `/api-docs`
- OpenAPI 3.0 spec at `/api-docs/openapi.yaml`
