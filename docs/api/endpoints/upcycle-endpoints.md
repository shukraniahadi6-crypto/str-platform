# Upcycling & Green Impact Endpoints

---

## `GET /upcycle/partners`

List donation and upcycling partner locations. Results are sorted by distance if coordinates are provided.

**Authentication:** Required

**Query parameters:**

| Param | Type | Description |
|---|---|---|
| `lat` | number | Latitude for distance sorting |
| `lng` | number | Longitude for distance sorting |

**Response `200`:**
```json
[
  {
    "id": "partner_001",
    "name": "Austin ReStore",
    "address": "900 E. Cesar Chavez St, Austin TX",
    "acceptedCategories": ["furniture", "appliances", "building_materials"],
    "distanceKm": 1.4,
    "hours": "Mon-Sat 9am-5pm",
    "website": "https://habitat.org/restore"
  }
]
```

---

## `GET /jobs/:jobId/green-impact`

Retrieve the green impact card for a completed job.

**Roles:** `customer` (own job), `admin`

**Response `200`:**
```json
{
  "landfillDiversionPct": 85,
  "co2SavedKg": 140,
  "treesEquivalent": 6,
  "upcycledItems": 2,
  "shareCard": "https://share.strplatform.com/impact/job_abc123def"
}
```

| Field | Description |
|---|---|
| `landfillDiversionPct` | Percentage of waste diverted from landfill |
| `co2SavedKg` | Kilograms of CO2 equivalent saved |
| `treesEquivalent` | Equivalent number of trees planted |
| `upcycledItems` | Number of items donated or upcycled |
| `shareCard` | URL to shareable social receipt image |

**Error responses:**

| Status | Code | Description |
|---|---|---|
| 404 | `JOB_NOT_FOUND` | Job not found |
| 409 | `JOB_NOT_COMPLETED` | Green impact only available after completion |

---

## CO2 Calculation Algorithm

```
co2SavedKg = (disposedWeightKg × landfillEmissionFactor)
             - (disposedWeightKg × recycleEmissionFactor)
             + (upcycledWeightKg × upcycleEmissionFactor)

landfillEmissionFactor  = 0.5 kg CO2e / kg waste
recycleEmissionFactor   = 0.1 kg CO2e / kg waste
upcycleEmissionFactor   = 0.05 kg CO2e / kg waste
treesEquivalent         = floor(co2SavedKg / 21)  # 1 tree ≈ 21 kg CO2/year
```

---

## Upcycle Toggle (Job Creation)

When creating a job, customers mark specific items as upcyclable:

```json
{
  "upcyclableItemIds": ["item_sofa_01", "item_microwave_02"]
}
```

The dispatch engine assigns the job to a hauler who has a nearby upcycle partner drop-off route. The hauler earns a **Karma Bonus** ($5–$15 per upcycled item) credited to their ledger.
