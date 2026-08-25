# Backward Compatibility Guidelines

## Compatibility Promise

Within a major API version (v1), STR Platform guarantees that existing integrations will continue to work without modification.

## What Is Backward Compatible

- ✅ Adding new optional fields to response objects
- ✅ Adding new optional request body parameters
- ✅ Adding new query parameters with default values
- ✅ Adding new endpoints
- ✅ Adding new enum values
- ✅ Adding new error codes

## What Is NOT Backward Compatible (Breaking Changes)

- ❌ Removing or renaming response fields
- ❌ Changing field data types
- ❌ Making optional fields required
- ❌ Changing HTTP status codes for existing scenarios
- ❌ Removing endpoints
- ❌ Changing authentication requirements
- ❌ Renaming or removing error codes

## Client Best Practices

To ensure your integration remains compatible:

1. **Ignore unknown fields** — always use permissive JSON parsing that does not error on unknown properties.
2. **Handle unknown enum values** — treat unknown enum values as a default/fallback state.
3. **Specify `Content-Type: application/json`** — do not rely on default content type inference.
4. **Check `hasNext` not array length** — use the pagination `hasNext` flag, not `data.length < limit`, to detect the last page.
5. **Subscribe to the changelog** — monitor [changelog.md](changelog.md) for new features and deprecation notices.

## Deprecation Process

1. Deprecated field/endpoint announced in changelog.
2. `Deprecation: true` header added to affected responses.
3. 6-month grace period before removal.
4. Migration guide published in [migration-guides.md](migration-guides.md).
5. Removed in next major version.
