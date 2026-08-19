'use client';

import { useQuery } from '@tanstack/react-query';
import { adminStats } from '@/lib/mock-data';

export function useLedger() {
  return useQuery({ queryKey: ['useLedger'], queryFn: async () => adminStats });
}
