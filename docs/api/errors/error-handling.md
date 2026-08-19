# Error Handling Guide

## Standard Error Shape

Every error response from the STR API uses this shape:

```typescript
interface APIError {
  code: string;       // Machine-readable error code
  message: string;    // Human-readable description
  status: number;     // HTTP status code
  details?: Record<string, unknown>; // Optional extra context
}
```

## Handling Errors in TypeScript

```typescript
import axios, { AxiosError } from "axios";

async function getJob(jobId: string) {
  try {
    const { data } = await api.get(`/jobs/${jobId}`);
    return data;
  } catch (err) {
    const error = err as AxiosError<APIError>;
    if (error.response) {
      const { code, message, status } = error.response.data;
      switch (code) {
        case "JOB_NOT_FOUND":
          // Show "Job not found" UI state
          break;
        case "TOKEN_EXPIRED":
          // Trigger token refresh flow
          break;
        default:
          console.error(`[${status}] ${code}: ${message}`);
      }
    }
    throw err;
  }
}
```

## Retry Strategy

For `500` and `503` errors and network failures, use exponential backoff:

```typescript
async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const status = (err as AxiosError).response?.status;
      const isRetryable = !status || status >= 500;
      if (!isRetryable || attempt === maxAttempts) throw err;
      await new Promise((r) => setTimeout(r, 2 ** attempt * 500));
    }
  }
  throw new Error("Max retries exceeded");
}
```

## Rate Limit Handling

When a `429 RATE_LIMIT_EXCEEDED` response is received, read the `Retry-After` header:

```typescript
if (error.response?.status === 429) {
  const retryAfter = parseInt(error.response.headers["retry-after"] ?? "60", 10);
  await new Promise((r) => setTimeout(r, retryAfter * 1000));
  return api.request(error.config); // Retry
}
```

## Validation Errors

`422 VALIDATION_ERROR` responses include a `details.fields` array:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed.",
  "status": 422,
  "details": {
    "fields": [
      { "field": "email", "message": "Must be a valid email address" },
      { "field": "password", "message": "Must be at least 8 characters" }
    ]
  }
}
```

Use this to highlight specific form fields in the UI.
