# Data Dictionary (condensed)

## Core
- `users`: auth + role (`VENDOR`, `COURIER`, `ADMIN`)
- `jobs`: vendor requests, lifecycle status, scheduling, payload (`items_json`)
- `offer_pings`: dispatch offers, expiry and acceptance status
- `ledger_entries`: immutable double-entry rows (`debit_amount`, `credit_amount`)

## Spatial
- `job_locations`, `courier_locations`, `transfer_stations`, `donation_partners`, `neighborhood_groups`
- all geospatial columns use SRID 4326 for map interoperability

## Finance
- `vendor_accounts`, `courier_accounts`, `payments`, `payouts`, `stripe_customers`, `stripe_connect_accounts`

## Trust and safety
- `driver_verifications`, `sds_cases`, `disputes`, `reviews`

## Sustainability
- `upcyclable_items`, `green_impact_metrics`, `green_impact_receipts`

## Training
- `courses`, `courier_completions`, `badges`, `courier_badges`

## Enum types
- `auth_provider_enum`: `LOCAL`, `GOOGLE`, `APPLE`
- `user_role_enum`: `VENDOR`, `COURIER`, `ADMIN`
- `job_status_enum`: `DRAFT`, `PENDING`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- `offer_ping_status_enum`: `PENDING`, `ACCEPTED`, `DECLINED`, `EXPIRED`
- `payment_status_enum` / `payout_status_enum`: `PENDING`, `COMPLETED`, `FAILED`
- `hazard_flag_enum`: `HAZMAT`, `HEAVY_ITEM`, `ELECTRONICS`, `CHEMICALS`, `UNKNOWN`
- `difficulty_enum`: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`
- `badge_requirement_type_enum`: `COURSE_ID`, `RATING_THRESHOLD`
- `dispute_decision_enum`: `REFUND`, `PARTIAL_REFUND`, `NO_ACTION`

## Custom functions
- `calculate_distance_between_coordinates(lat1, lon1, lat2, lon2)` → kilometers
- `find_nearby_couriers(job_location, radius_km, limit)` → eligible courier candidates
- `find_nearby_jobs(courier_location, radius_km)` → in-range jobs
- `verify_ledger_integrity()` → debit/credit balance check
- `calculate_green_impact(job_id)` → writes + returns impact metrics
- `process_batch_discount(batch_id)` → applies batch discount metadata
