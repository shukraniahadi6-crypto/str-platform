'use client';

import { useQuery } from '@tanstack/react-query';
import { mockJobs } from '@/lib/mock-data';

export function useOffers() {
  return useQuery({ queryKey: ['useOffers'], queryFn: async () => mockJobs });
}
