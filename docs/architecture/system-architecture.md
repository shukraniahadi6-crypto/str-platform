# System Architecture

## Overview

STR Platform is a DoorDash-style on-demand junk removal platform built as a Node.js monorepo.

```
┌─────────────────────────────────────────────────────┐
│                    Client Layer                      │
│  Next.js Web App (Vendor, Courier, Admin, Landing)   │
└──────────────────────────┬──────────────────────────┘
                           │ HTTPS / WSS
┌──────────────────────────▼──────────────────────────┐
│                  Express API Server                  │
│  REST /api/v1  │  Socket.io (WS)  │  Swagger UI     │
├──────────────────────────────────────────────────────┤
│              Middleware Stack                        │
│  Rate Limiter │ Auth (JWT) │ RBAC │ Validation      │
└──────┬───────────────┬──────────────────┬───────────┘
       │               │                  │
┌──────▼──────┐  ┌─────▼──────┐  ┌───────▼──────────┐
│  PostgreSQL │  │   Redis     │  │  External APIs   │
│  + PostGIS  │  │  (Cache +   │  │  Google Vision   │
│  (Primary   │  │   Bull      │  │  Google Maps     │
│   Store)    │  │   Queues)   │  │  Stripe Connect  │
└─────────────┘  └────────────┘  └──────────────────┘
                                 ┌──────────────────┐
                                 │    AWS S3 /      │
                                 │    MinIO         │
                                 │  (File Storage)  │
                                 └──────────────────┘
```

## Component Responsibilities

### Express API Server

- **REST API** (`/api/v1/*`): All business logic endpoints
- **Socket.io Server**: Real-time offer pings, GPS tracking, notifications
- **Bull Workers**: Background jobs (offer expiry, batch alerts, payout processing, email)

### PostgreSQL + PostGIS

- Primary persistent data store for all domain objects
- PostGIS extension for spatial queries (neighborhood batching, distance calculations)
- Alembic-style migrations via `node-pg-migrate`

### Redis

- **Session store**: Refresh token tracking
- **Cache**: ETA computations, Vision API results, nearby batches
- **Bull Queues**: Offer countdown timers, webhook delivery, payout retries

### External Services

| Service | Purpose |
|---|---|
| Google Vision API | Waste image analysis for estimates & hazard detection |
| Google Maps API | ETA calculation, geocoding, turn-by-turn navigation |
| Stripe Connect | Customer charges, escrow, instant courier payouts |
| AWS S3 / MinIO | Before/after photos, ID documents, receipts |
| SendGrid | Transactional emails (confirmations, password reset) |
| Firebase / APNs | Mobile push notifications |

## Monorepo Structure

```
str-platform/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express backend
├── packages/
│   ├── sdk/          # Auto-generated TypeScript SDK
│   ├── ui/           # Shared UI components
│   └── config/       # Shared config (ESLint, TypeScript)
├── infrastructure/   # Docker, K8s, nginx
└── docs/             # This documentation
```

## Key Design Decisions

1. **Socket.io over raw WebSockets**: Easier room management, auto-reconnect, and namespace support for the dispatch, tracking, and admin channels.
2. **PostGIS over application-side distance math**: Spatial queries for neighborhood batching and courier proximity are orders of magnitude faster in the database.
3. **Bull over raw Redis pub/sub**: Reliable job scheduling with retry, delay, and priority support is essential for the 30-second offer countdown.
4. **Cursor pagination over offset**: Stable results under concurrent writes; required for real-time job feeds.
5. **Stripe Connect Express**: Fastest time-to-live for courier payouts without building a custom escrow.
