# Data Flow Diagrams

## Job Lifecycle Data Flow

```
Customer App                API Server              Dispatch Engine
     │                          │                         │
     ├── POST /jobs/estimate ──►│                         │
     │                          ├── Google Vision API ───►│
     │◄── Estimate response ────┤                         │
     │                          │                         │
     ├── POST /jobs ───────────►│                         │
     │                          ├── Save to PostgreSQL    │
     │                          ├── Charge payment hold   │
     │◄── Job created (pending)─┤                         │
     │                          ├── Queue offer pings ───►│
     │                          │                         ├── Find couriers
     │                          │                         ├── Send offer:ping (Socket.io)
     │                          │                         │
     ▼                    Courier App                      │
                               │                          │
                               │◄── offer:ping ──────────┤
                               ├── POST /offers/:id/accept►│
                               │                          ├── Job → accepted
                               │                          ├── Notify customer (Socket.io)
                               │                          │
                               ├── POST /tracking/.../location ──►│
                               │                          ├── Redis cache (30s TTL)
                               │                          ├── Emit tracking:location_update
                               │                          │
                        Customer App                       │
                               │◄── tracking:location_update (Socket.io)
                               │    (live map updates)
```

## Payment & Ledger Flow

```
Customer pays $175             Platform escrow
     │                              │
     ├── paymentIntent (hold) ──────►│
     │                              │
     │         Job completes        │
     │                              │
     │◄── capture payment ──────────┤
     │                              │
     │                         Split:
     │                         $131.25 → Courier ledger (75%)
     │                         $43.75  → Platform revenue (25%)
     │                              │
     │                         Courier requests payout
     │                              │
     │                         Stripe instant payout → Courier bank
```

## Neighborhood Batching Flow

```
Customer A books pickup (Tue 2PM)
     │
     ├── PostGIS radius query (500m)
     │   → No open batch found
     ├── Create new batch
     ├── Notify neighbors within 500m
     │   via batch:neighbor_alert (Socket.io)
     │
Customer B receives notification
     │
     ├── POST /batches/:id/join
     │   → Job created with 25% discount
     │
Batch fills or window closes
     │
     └── Dispatch treats batch as single job route
         Hauler earns combined route pay
```
