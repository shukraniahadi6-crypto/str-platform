'use client';

import { useQuery } from '@tanstack/react-query';
import { mockJobs } from '@/lib/mock-data';

export function useJobs() {
  return useQuery({ queryKey: ['useJobs'], queryFn: async () => mockJobs });
}
