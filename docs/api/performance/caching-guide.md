# Caching Guide

## Response Caching Headers

STR Platform sets appropriate cache headers on all responses:

| Endpoint Type | Cache-Control |
|---|---|
| User profile (`GET /users/me`) | `private, max-age=60` |
| Job details (`GET /jobs/:id`) | `private, max-age=10` |
| Course list (`GET /academy/courses`) | `public, max-age=3600` |
| Analytics (`GET /admin/analytics/overview`) | `private, max-age=60` |
| Real-time data (tracking, offers) | `no-store` |
| Auth endpoints | `no-store, no-cache` |

## Client-Side Caching (React Query)

```typescript
import { useQuery } from "@tanstack/react-query";

// Cache job details for 10 seconds
function useJob(jobId: string) {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => strClient.jobs.get(jobId),
    staleTime: 10_000,      // 10 seconds
    gcTime: 60_000,         // Keep in cache 60 seconds after unused
    refetchOnWindowFocus: true,
  });
}

// Cache academy courses for 1 hour (rarely changes)
function useCourses() {
  return useQuery({
    queryKey: ["academy", "courses"],
    queryFn: () => strClient.academy.listCourses(),
    staleTime: 3_600_000,   // 1 hour
  });
}
```

## Server-Side Caching (Redis)

The API caches expensive computations in Redis:

| Data | TTL | Key Pattern |
|---|---|---|
| Courier location | 30 seconds | `tracking:location:{jobId}` |
| ETA calculation | 30 seconds | `eta:{jobId}` |
| Nearby batches | 60 seconds | `batches:nearby:{lat}:{lng}` |
| Green impact calculation | 24 hours | `green_impact:{jobId}` |
| Vision API estimate | 1 hour | `estimate:{hash(imageUrls)}` |

## CDN Caching

Static assets (badge icons, course content) are served via CDN with:
```
Cache-Control: public, max-age=86400, s-maxage=604800
```

Public API documentation (`/api-docs`) is cached at the CDN edge for 5 minutes.
