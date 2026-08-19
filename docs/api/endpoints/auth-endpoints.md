# Auth Endpoints

Base path: `/api/v1/auth`

---

## `POST /auth/register`

Register a new user account.

**Authentication:** None required

**Request body:**
```json
{
  "email": "jane@example.com",
  "password": "Str0ng!Pass",
  "name": "Jane Smith",
  "role": "customer",
  "phone": "+15551234567"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | ✅ | Unique email address |
| `password` | string | ✅ | Min 8 chars |
| `name` | string | ✅ | Display name |
| `role` | enum | ✅ | `customer` or `courier` |
| `phone` | string | ❌ | E.164 format |

**Response `201`:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "abc123...",
  "expiresIn": 900,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "jane@example.com",
    "name": "Jane Smith",
    "role": "customer",
    "isVerified": false,
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

**Error responses:**

| Status | Code | Description |
|---|---|---|
| 409 | `EMAIL_ALREADY_EXISTS` | Email already registered |
| 422 | `VALIDATION_ERROR` | Invalid input fields |

---

## `POST /auth/login`

Authenticate and obtain tokens.

**Authentication:** None required

**Request body:**
```json
{ "email": "jane@example.com", "password": "Str0ng!Pass" }
```

**Response `200`:** Same schema as register.

**Error responses:**

| Status | Code | Description |
|---|---|---|
| 401 | `INVALID_CREDENTIALS` | Wrong email or password |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many attempts |

---

## `POST /auth/refresh`

Exchange a refresh token for a new access token.

**Authentication:** None required

**Request body:**
```json
{ "refreshToken": "abc123..." }
```

**Response `200`:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "def456...",
  "expiresIn": 900
}
```

> Refresh tokens are rotated on each use. The old token is immediately invalidated.

**Error responses:**

| Status | Code | Description |
|---|---|---|
| 401 | `TOKEN_INVALID` | Token not found or revoked |
| 401 | `TOKEN_EXPIRED` | Refresh token expired (7-day TTL) |

---

## `POST /auth/logout`

Revoke the current refresh token.

**Authentication:** ****** required

**Request body:**
```json
{ "refreshToken": "def456..." }
```

**Response `204`:** No content.

---

## `POST /auth/password/reset-request`

Send a password reset email.

**Authentication:** None required

**Request body:**
```json
{ "email": "jane@example.com" }
```

**Response `204`:** Always returns 204 (prevents email enumeration).

> Reset link expires in 15 minutes.

---

## `POST /auth/password/reset`

Reset password using the token from the email link.

**Authentication:** None required

**Request body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewStr0ng!Pass"
}
```

**Response `200`:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "ghi789...",
  "expiresIn": 900
}
```

**Error responses:**

| Status | Code | Description |
|---|---|---|
| 400 | `TOKEN_INVALID` | Invalid reset token |
| 400 | `TOKEN_EXPIRED` | Reset token expired |

---

## Rate Limits

All auth endpoints share a rate limit of **10 requests/minute per IP address**.
