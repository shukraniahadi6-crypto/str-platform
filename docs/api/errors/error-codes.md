# Error Code Reference

All error responses follow this format:

```json
{
  "code": "JOB_NOT_FOUND",
  "message": "No job found with the given ID.",
  "status": 404,
  "details": {}
}
```

---

## Auth Errors

| Code | HTTP | Description | Resolution |
|---|---|---|---|
| `INVALID_CREDENTIALS` | 401 | Wrong email or password | Check credentials and retry |
| `TOKEN_EXPIRED` | 401 | Access or refresh token expired | Call `POST /auth/refresh` |
| `TOKEN_INVALID` | 401 | Token malformed, revoked, or not found | Re-authenticate |
| `TOKEN_MISSING` | 401 | No Authorization header provided | Include `Authorization: ******` |
| `EMAIL_ALREADY_EXISTS` | 409 | Email is already registered | Log in or use password reset |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many auth requests | Wait and retry with backoff |

---

## User Errors

| Code | HTTP | Description | Resolution |
|---|---|---|---|
| `USER_NOT_FOUND` | 404 | User does not exist | Verify user ID |
| `VERIFICATION_ALREADY_SUBMITTED` | 409 | Documents already under review | Wait for admin review |
| `ACCOUNT_SUSPENDED` | 403 | Account has been suspended | Contact support |

---

## Job Errors

| Code | HTTP | Description | Resolution |
|---|---|---|---|
| `JOB_NOT_FOUND` | 404 | Job does not exist | Verify job ID |
| `ESTIMATE_EXPIRED` | 400 | Estimate older than 1 hour | Request a new estimate |
| `ESTIMATE_NOT_FOUND` | 400 | Invalid estimate ID | Request a new estimate |
| `IMAGE_ANALYSIS_FAILED` | 422 | Vision API could not analyze images | Use clearer photos with better lighting |
| `CANCELLATION_NOT_ALLOWED` | 409 | Job is in progress | Contact support for manual cancellation |
| `PAYMENT_REQUIRED` | 402 | No valid payment method | Add a payment method |

---

## Offer Errors

| Code | HTTP | Description | Resolution |
|---|---|---|---|
| `OFFER_NOT_FOUND` | 404 | Offer does not exist | Refresh active offers list |
| `OFFER_EXPIRED` | 409 | 30-second accept window passed | Wait for next offer |
| `OFFER_ALREADY_ACCEPTED` | 409 | Another courier claimed the job | Wait for next offer |
| `BADGE_REQUIRED` | 403 | Courier lacks required capability badge | Complete relevant Academy course |

---

## Batch Errors

| Code | HTTP | Description | Resolution |
|---|---|---|---|
| `BATCH_NOT_FOUND` | 404 | Batch does not exist | Search for nearby batches again |
| `BATCH_FULL` | 409 | Batch has reached max participants | Create a standalone job |
| `BATCH_CLOSED` | 409 | Batch window has passed | Create a standalone job |
| `ALREADY_IN_BATCH` | 409 | Already participating in this batch | View existing batch job |

---

## Ledger Errors

| Code | HTTP | Description | Resolution |
|---|---|---|---|
| `INSUFFICIENT_BALANCE` | 400 | Payout amount exceeds available balance | Reduce payout amount |
| `PAYOUT_AMOUNT_TOO_LOW` | 400 | Minimum payout is $1.00 | Increase payout amount |
| `STRIPE_ACCOUNT_NOT_CONNECTED` | 402 | No Stripe Connect account linked | Connect Stripe in account settings |

---

## SDS Errors

| Code | HTTP | Description | Resolution |
|---|---|---|---|
| `SDS_CASE_NOT_FOUND` | 404 | SDS case does not exist | Verify case ID |
| `JOB_BLOCKED_HAZARD` | 403 | Job blocked pending admin hazard review | Await admin decision |

---

## Academy Errors

| Code | HTTP | Description | Resolution |
|---|---|---|---|
| `COURSE_NOT_FOUND` | 404 | Course does not exist | Verify course ID |
| `COURSE_ALREADY_COMPLETED` | 409 | Badge already earned | No action needed |
| `INVALID_ANSWER_COUNT` | 422 | Wrong number of quiz answers | Submit one answer per question |

---

## General Errors

| Code | HTTP | Description | Resolution |
|---|---|---|---|
| `FORBIDDEN` | 403 | Insufficient permissions | Check role requirements |
| `NOT_FOUND` | 404 | Resource not found | Verify endpoint and ID |
| `VALIDATION_ERROR` | 422 | Request body failed validation | Review field requirements |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error | Retry; contact support if persistent |
| `SERVICE_UNAVAILABLE` | 503 | Downstream service temporarily down | Retry with exponential backoff |

---

## Error Response Example

```bash
curl -X GET https://api.strplatform.com/api/v1/jobs/nonexistent-id \
  -H "Authorization: ******"

# Response 404:
{
  "code": "JOB_NOT_FOUND",
  "message": "No job found with the given ID.",
  "status": 404,
  "details": {
    "jobId": "nonexistent-id"
  }
}
```
