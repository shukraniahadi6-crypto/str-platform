'use client';

import { useQuery } from '@tanstack/react-query';
import { mockJobs } from '@/lib/mock-data';

export function useTracking() {
  return useQuery({ queryKey: ['useTracking'], queryFn: async () => mockJobs });
}
