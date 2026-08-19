# User Management Endpoints

Base path: `/api/v1/users`

All endpoints require `Authorization: ******`.

---

## `GET /users/me`

Get the profile of the currently authenticated user.

**Response `200`:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "jane@example.com",
  "name": "Jane Smith",
  "role": "customer",
  "phone": "+15551234567",
  "avatarUrl": "https://s3.strplatform.com/avatars/jane.jpg",
  "isVerified": true,
  "createdAt": "2025-01-15T10:00:00Z",
  "preferences": {
    "notifications": { "email": true, "sms": true, "push": false },
    "defaultPaymentMethodId": "pm_abc123",
    "language": "en"
  }
}
```

---

## `PATCH /users/me`

Update profile fields.

**Request body** (all fields optional):
```json
{
  "name": "Jane M. Smith",
  "phone": "+15559876543",
  "avatarUrl": "https://s3.strplatform.com/avatars/jane-new.jpg"
}
```

**Response `200`:** Updated `UserProfile` object.

---

## `PUT /users/me/preferences`

Replace notification and payment preferences.

**Request body:**
```json
{
  "notifications": {
    "email": true,
    "sms": false,
    "push": true
  },
  "defaultPaymentMethodId": "pm_xyz789",
  "language": "es"
}
```

**Response `200`:** Updated preferences object.

---

## `POST /users/me/verify`

Submit identity documents for courier verification.

**Roles:** `courier` only

**Request body:**
```json
{
  "documentType": "drivers_license",
  "documentUrl": "https://s3.strplatform.com/docs/license.jpg",
  "vehicleRegistrationUrl": "https://s3.strplatform.com/docs/reg.jpg"
}
```

**Response `202`:**
```json
{
  "message": "Verification documents submitted. Review typically takes 1-2 business days.",
  "submittedAt": "2025-01-15T10:05:00Z"
}
```

**Error responses:**

| Status | Code | Description |
|---|---|---|
| 403 | `FORBIDDEN` | Only couriers can submit verification |
| 409 | `VERIFICATION_ALREADY_SUBMITTED` | Documents already under review or approved |

---

## Rate Limits

- `GET /users/me`: 120 requests/minute
- `PATCH /users/me`: 20 requests/minute
- `POST /users/me/verify`: 5 requests/hour
