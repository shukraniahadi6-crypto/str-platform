# SDS Safety & Hazard Endpoints

Base path: `/api/v1/sds`

---

## `POST /sds/analyze`

Analyze waste images for hazardous materials using Google Vision API + proprietary hazard classifier.

**Roles:** `customer`, `admin`

**Request body:**
```json
{
  "imageUrls": [
    "https://s3.strplatform.com/uploads/waste-pile.jpg"
  ]
}
```

**Response `200`:**
```json
{
  "hazardLevel": "low",
  "detectedHazards": [
    {
      "name": "Lead-acid battery",
      "sdsUrl": "https://sds.strplatform.com/lead-acid-battery.pdf",
      "handlingGuidance": "Wear acid-resistant gloves. Do not puncture. Dispose at certified e-waste facility."
    }
  ],
  "requiresAdminReview": false
}
```

| `hazardLevel` | Action |
|---|---|
| `none` | Standard job proceeds normally |
| `low` | Courier notified; appropriate PPE suggested |
| `medium` | Courier must have `hazmat-level-1` badge |
| `high` | Courier must have `hazmat-level-2` badge |
| `critical` | Job flagged; admin review required before dispatch |

---

## `GET /sds/cases`

List SDS flagged cases requiring review.

**Roles:** `admin`

**Query parameters:**

| Param | Type | Description |
|---|---|---|
| `status` | string | `pending`, `reviewed`, `resolved` |

**Response `200`:**
```json
[
  {
    "id": "sds_case_001",
    "jobId": "job_abc123def",
    "hazardLevel": "critical",
    "detectedHazards": [...],
    "status": "pending",
    "flaggedAt": "2025-01-15T10:15:00Z",
    "reviewedBy": null
  }
]
```

---

## `POST /sds/cases/:caseId/review`

Approve or reject a flagged SDS case.

**Roles:** `admin`

**Request body:**
```json
{
  "decision": "approve",
  "notes": "Verified safe for dispatch with hazmat-level-1 courier",
  "requiredBadge": "hazmat-level-1"
}
```

**Response `200`:** Updated case object.

---

## Rate Limits

- `POST /sds/analyze`: 30/hour per user
