# API Versioning Strategy

## URL Path Versioning

The STR API uses URL path versioning:

```
https://api.strplatform.com/api/v1/jobs
https://api.strplatform.com/api/v2/jobs  (future)
```

## Current Version

**v1** — Stable. All endpoints described in this documentation are part of v1.

## Version Lifecycle

| Stage | Duration | Description |
|---|---|---|
| **Current** | — | Active, fully supported |
| **Deprecated** | 6 months | Supported with deprecation notice header |
| **Sunset** | — | Version removed; returns `410 Gone` |

When a version is deprecated, all responses include:
```
Deprecation: true
Sunset: Sat, 1 Jan 2027 00:00:00 GMT
Link: <https://docs.strplatform.com/migration/v2>; rel="successor-version"
```

## Backward Compatibility Policy

Within a major version (e.g., v1), STR guarantees:

- ✅ New optional fields may be added to response objects
- ✅ New optional query parameters may be added
- ✅ New endpoints may be added
- ✅ New enum values may be added (clients must handle unknown values gracefully)
- ❌ Existing required fields will not be removed
- ❌ Field types will not change
- ❌ Endpoint paths will not change
- ❌ Error codes will not be renamed

## Breaking Changes

Breaking changes require a new major version (e.g., v2). Examples of breaking changes:

- Removing a response field
- Changing a field type (string → integer)
- Renaming an error code
- Changing authentication requirements
- Removing an endpoint

## Version Negotiation

Clients may also specify the version via header (alternative to URL path):

```
API-Version: 2025-01-01
```

The `API-Version` header accepts calendar dates, allowing non-breaking additions to be opt-in before they become default.
