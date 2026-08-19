# Pagination Guide

## Strategy: Cursor-Based Pagination

STR Platform uses **cursor-based pagination** for all list endpoints. Cursors are opaque base64-encoded strings representing the position of the last item in the current page.

### Why cursor-based?

- Stable results even when items are added or removed between pages
- Efficient database queries using indexed cursor columns
- No "page drift" (items appearing twice or being skipped on insert)

---

## Request Parameters

| Param | Type | Default | Max | Description |
|---|---|---|---|---|
| `limit` | integer | 20 | 100 | Number of items per page |
| `cursor` | string | — | — | Opaque cursor from previous response |

---

## Response Shape

```json
{
  "data": [ ...items ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "hasNext": true,
    "cursor": "eyJpZCI6ImFiYzEyMyJ9"
  }
}
```

| Field | Description |
|---|---|
| `total` | Total matching items (approximate for large datasets) |
| `limit` | Items per page as requested |
| `hasNext` | `true` if more pages exist |
| `cursor` | Pass this as `cursor` on the next request; `null` on last page |

---

## React Infinite Scroll Example

```typescript
function InfiniteJobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || !hasNext) return;
    setLoading(true);
    const res = await strClient.jobs.list({ limit: 20, cursor: cursor ?? undefined });
    setJobs((prev) => [...prev, ...res.data]);
    setCursor(res.pagination.cursor ?? null);
    setHasNext(res.pagination.hasNext);
    setLoading(false);
  };

  useEffect(() => { loadMore(); }, []); // Initial load

  return (
    <div>
      {jobs.map((job) => <JobCard key={job.id} job={job} />)}
      {hasNext && <button onClick={loadMore} disabled={loading}>Load more</button>}
    </div>
  );
}
```

---

## Database Implementation

```sql
-- Cursor encodes the last item's (created_at, id) tuple
SELECT * FROM jobs
WHERE (created_at, id) < ($cursor_created_at, $cursor_id)
ORDER BY created_at DESC, id DESC
LIMIT $limit + 1;  -- fetch one extra to determine hasNext
```

The extra item is used to determine `hasNext` and is not returned in the response.
