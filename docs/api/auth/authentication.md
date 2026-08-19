# Authentication Guide

## Overview

STR Platform uses **JWT (JSON Web Tokens)** for stateless authentication with short-lived access tokens and longer-lived refresh tokens.

## Token Structure

### Access Token (JWT)

```
Header.Payload.Signature
```

**Header:**
```json
{ "alg": "HS256", "typ": "JWT" }
```

**Payload:**
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "role": "courier",
  "iat": 1721234567,
  "exp": 1721235467
}
```

| Claim | Description |
|---|---|
| `sub` | User UUID |
| `role` | `customer`, `courier`, or `admin` |
| `iat` | Issued-at timestamp |
| `exp` | Expiry timestamp (15 min from issue) |

### Refresh Token

A random 64-byte hex string stored securely (HTTP-only cookie or secure local storage). TTL is **7 days**.

## Authentication Flow

```
1. POST /auth/login  → { accessToken, refreshToken, expiresIn }
2. Include accessToken in Authorization header for all requests
3. When 401 received → POST /auth/refresh with refreshToken
4. New accessToken returned (refreshToken rotated)
5. POST /auth/logout to revoke all tokens
```

## Using the Access Token

```http
GET /api/v1/users/me
Authorization: ******
```

## Token Refresh Example

```typescript
// TypeScript example with axios interceptor
import axios from "axios";

const api = axios.create({ baseURL: "https://api.strplatform.com/api/v1" });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const { data } = await axios.post("/auth/refresh", {
        refreshToken: localStorage.getItem("refreshToken"),
      });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      error.config.headers["Authorization"] = `******;
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```

## Password Reset Flow

```
1. POST /auth/password/reset-request  { email }
   → Email sent with short-lived reset link (15 min TTL)

2. User clicks link → UI extracts token from URL query param

3. POST /auth/password/reset  { token, newPassword }
   → Returns new AuthTokens
```

## API Key Authentication (Integrations)

Third-party integrations and server-to-server calls can use API keys instead of JWTs:

```http
GET /api/v1/admin/analytics/overview
X-API-Key: str_live_xxxxxxxxxxxxxxxxxxxxxxxx
```

API keys are scoped to a role and managed in the admin console under **Settings → API Keys**.

## Security Best Practices

- Store `accessToken` in memory (not localStorage) to prevent XSS attacks.
- Store `refreshToken` in an `HttpOnly` cookie with `SameSite=Strict`.
- Always use HTTPS; the API rejects plain HTTP.
- Rotate refresh tokens on each use (token rotation is enabled).
- Revoke all tokens on logout or suspected compromise.
- Rate limiting applies to auth endpoints (10 requests/min per IP).

## OAuth2 Flow (Third-Party Integrations)

For applications acting on behalf of users, STR supports the **Authorization Code + PKCE** flow:

```
1. Redirect user to:
   https://auth.strplatform.com/oauth/authorize
     ?response_type=code
     &client_id=YOUR_CLIENT_ID
     &redirect_uri=https://yourapp.com/callback
     &scope=jobs:read ledger:read
     &code_challenge=BASE64URL(SHA256(code_verifier))
     &code_challenge_method=S256
     &state=RANDOM_STATE

2. User authorizes → redirect to redirect_uri?code=AUTH_CODE

3. Exchange code for tokens:
   POST https://auth.strplatform.com/oauth/token
   { grant_type: "authorization_code", code, redirect_uri, code_verifier, client_id }

4. Use access_token in Authorization header as normal
```

### Available Scopes

| Scope | Description |
|---|---|
| `profile:read` | Read user profile |
| `jobs:read` | Read jobs |
| `jobs:write` | Create & update jobs |
| `ledger:read` | View ledger entries |
| `ledger:write` | Initiate payouts |
| `admin:read` | Admin read access |
| `admin:write` | Admin write access |
