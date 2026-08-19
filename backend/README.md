# STR Platform — Backend API

A complete, production-ready Node.js + Express + TypeScript backend for the STR (Stuff That's Removed) marketplace platform. Implements DoorDash-style dispatch mechanics, live telemetry, snap-to-estimate, green impact scoring, upcycling hub, academy & badging, and immutable financial ledger.

## 🏗 Architecture

- **Runtime:** Node.js 20 + Express 5 + TypeScript 5
- **Database:** PostgreSQL 15+ with PostGIS
- **Cache/Queues:** Redis 7 + Bull
- **Real-time:** Socket.io 4 (WebSockets)
- **Payments:** Stripe Connect
- **AI/Vision:** Google Vision API (snap-to-estimate)
- **Maps:** Google Maps Routes API (route optimization)
- **Storage:** AWS S3 (Before/After photos)

## 📁 Structure

```
src/
├── api/v1/          # Route handlers & controllers
│   ├── auth/        # JWT authentication
│   ├── users/       # User profiles & verification
│   ├── jobs/        # Job CRUD + dispatch
│   ├── offers/      # Offer ping accept/decline
│   ├── tracking/    # Live courier location
│   ├── batching/    # Neighborhood batch deals
│   ├── upcycling/   # Green impact & donation routing
│   ├── ledger/      # Financial ledger & payouts
│   ├── sds/         # Safety Data Sheet (hazmat review)
│   ├── academy/     # Courier training & badges
│   └── admin/       # Fleet map, analytics, disputes
├── core/            # Database, Redis, Stripe, Socket.io, Google APIs
├── models/          # TypeORM entities
├── schemas/         # Joi validation schemas
├── services/        # Business logic
├── workers/         # Bull background jobs
├── middleware/      # Auth, validation, error handler, rate limiting
├── socket/          # Socket.io namespaces & handlers
├── utils/           # Logger, errors, spatial utils
└── tests/           # Jest unit tests
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+

### Development

```bash
# Clone and install
cd backend
npm install

# Copy environment config
cp .env.example .env
# Edit .env with your API keys

# Start services (Postgres + Redis)
docker-compose up db redis -d

# Run development server
npm run dev
```

### Docker (Full Stack)

```bash
docker-compose up --build
```

## 🧪 Testing

```bash
npm test
npm run test:watch
```

## 📡 API Endpoints

### Authentication
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/auth/register | Register vendor/courier |
| POST | /api/v1/auth/login | JWT login |
| POST | /api/v1/auth/refresh | Refresh token |
| POST | /api/v1/auth/logout | Invalidate session |

### Jobs
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/jobs/estimate | Snap-to-estimate (image upload) |
| POST | /api/v1/jobs | Create job |
| GET | /api/v1/jobs | List jobs |
| GET | /api/v1/jobs/:id | Job details |
| PUT | /api/v1/jobs/:id/cancel | Cancel job |
| POST | /api/v1/jobs/:id/photos | Upload before/after photos |

### Offers & Dispatch
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/offers/active | Active offer pings (courier) |
| POST | /api/v1/offers/:id/accept | Accept offer |
| POST | /api/v1/offers/:id/decline | Decline offer (cascade) |

### Financial
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/ledger/balance | Account balance |
| GET | /api/v1/ledger/history | Transaction history |
| GET | /api/v1/ledger/verify | Ledger integrity check (admin) |
| POST | /api/v1/payouts/request-cashout | Instant cashout (courier) |

### Academy
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/academy/courses | List courses |
| POST | /api/v1/academy/courses/:id/complete | Submit quiz |
| GET | /api/v1/academy/badges | Earned badges |

## 🔌 WebSocket Events

Connect with JWT ****** Available namespaces:

### `/offers` — Offer Pings
```
Server → Client: offer:ping { offerId, jobId, upfrontPay, expiresAt }
Client → Server: offer:accept { offerId }
Client → Server: offer:decline { offerId }
Server → Client: offer:expired { offerId }
```

### `/tracking` — Live Location
```
Client → Server: location:update { lat, lng, heading, speed }
Client → Server: tracking:watch { jobId }
Server → Client: courier:location { courierId, lat, lng, timestamp }
```

### `/batch-alerts` — Batch Notifications
```
Server → Client: batch:created { batchId, jobIds, discountPct, message }
```

### `/chat` — In-App Messaging
```
Client → Server: chat:join { jobId }
Client → Server: chat:message { jobId, message }
Server → Client: chat:message { senderId, message, timestamp }
```

## 🛡 Security

- JWT with 15-minute access tokens + 7-day refresh tokens
- Role-based access control (VENDOR, COURIER, ADMIN)
- Global rate limiting (100 req/min per IP)
- Auth rate limiting (5 attempts per 10 min)
- Helmet.js security headers
- Input validation via Joi schemas
- WebSocket auth token validation

## 🌿 Green Impact

- Landfill diversion percentage calculation
- CO₂ savings using EPA equivalency factors
- Tree equivalent metrics
- Shareable impact receipt cards
- Donation partner routing (nearest upcycle partner)

## 💰 Financial Ledger

Immutable double-entry bookkeeping:
- Every transaction creates paired debit + credit entries
- Ledger verification endpoint ensures sum(debits) = sum(credits)
- Stripe Connect for instant courier payouts
- Tip and upcycle bonus tracking
